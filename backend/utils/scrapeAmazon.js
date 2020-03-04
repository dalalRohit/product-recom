const restapi = 'http://localhost:5000'
const axios = require('axios');
var cheerio = require('cheerio');

const { dataRef }=require('./store');
const {improvePuppy}=require('./puppy');

const amazonProdSpecs = (domContent) => {
    var $ = domContent;
    var features = {};
    var labels = $('.techD .label').toArray().map((label) => $(label).text().trim())
    var values = $('.techD .value').toArray().map((value) => $(value).text().trim())
    var price = $('#priceblock_ourprice').text();
    var image = $('#landingImage').attr('src')

    labels.map((label, i) => {
        features[label] = values[i];
    })
    return { features, price, image };
}

const scrapeAmazonReviews = async (browser, prodLink, product) => {

    let amazonAllReviews = {};
    let amazonBrowser = browser;
    var prodPage = await amazonBrowser.newPage();
    await prodPage.goto(prodLink, { waitUntil: 'domcontentloaded' });
    prodPage.once('load', () => console.log('Amazon product link opened..!'));

    await prodPage.waitFor('.a-link-emphasis');

    let prodContent = await prodPage.content();
    var $ = cheerio.load(prodContent);

    var allReviewsLink = $('.a-link-emphasis').attr('href');
    var allReviewsText = $('.a-link-emphasis').text();
    var { features, price, image } = amazonProdSpecs($);


    allReviewsLink = 'https://www.amazon.in' + allReviewsLink + '&pageNumber=';
    if (product in amazonAllReviews) {
        amazonAllReviews[product].push({
            text: allReviewsText,
            link: allReviewsLink
        })
    }
    else {
        amazonAllReviews[product] = [{
            text: allReviewsText,
            link: allReviewsLink
        }]
    }

    var res = await axios.post(restapi + '/scrape-amazonAPI', { link: allReviewsLink });
    await prodPage.close();
    
    return new Promise( (resolve,reject) => {
        resolve({
            features,
            price,
            image,
            modelOutput: res.data
        })
    });




}


// NEW METHOD TO SCRAPE ALL LINKS
const scrapeAmazonAll=async (browser,amazonLinks,product) => {
    let amazonAllReviews = []; 
    
    /*
    [   {
            'mi a3 black':
                {  features:,
                    price:,
                    data:[]
                },
        }
    'mi a3 blue':....
    ]
    */
    let amazonBrowser = browser;

    let data={};
    /*
        {
            'mi a3':
        }
    */
    amazonLinks.filter( async (amazonLink) => {

     
        var prodPage = await amazonBrowser.newPage();

        improvePuppy(prodPage);

        await prodPage.goto(amazonLink.link, { waitUntil: 'domcontentloaded' });
        prodPage.once('load', () => console.log('Amazon product link opened..!'));

        await prodPage.waitFor('.a-link-emphasis');

        let prodContent = await prodPage.content();
        var $ = cheerio.load(prodContent);

        var allReviewsLink = $('.a-link-emphasis').attr('href');
        var allReviewsText = $('.a-link-emphasis').text();
        var { features, price, image } = amazonProdSpecs($);

        data['features']=features;
        data['price']=price;
        data['image']=image;
        data['allReviews']=[];

        allReviewsLink = 'https://www.amazon.in' + allReviewsLink + '&pageNumber=';
        if (product in data) {
            data['allReviews'].push({
                text: allReviewsText,
                link: allReviewsLink
            })
        }
        else {
            data['allReviews'] = [{
                text: allReviewsText,
                link: allReviewsLink
            }]
        }

        // var res = await axios.post(restapi + '/scrape-amazonAPI', { link: allReviewsLink });
        axios.post(restapi + '/scrape-amazonAPI',{link:allReviewsLink})
            .then( async (res) => {
                data['modelOp']=res.data;
               
            })
            .catch( async (err) => {
                if(err) {                        
                    return err;
                }
            })

            amazonAllReviews.push(data);
        
            dataRef.child(`${product}/info/amazon`).set(amazonAllReviews ,function (err) {
                if(err) return err;
            });
            await prodPage.close();

        



    })



}

module.exports = {
    scrapeAmazon:scrapeAmazonAll
}