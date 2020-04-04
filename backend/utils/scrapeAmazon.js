const restapi = 'http://localhost:5000'
const axios = require('axios');
var cheerio = require('cheerio');

const { dataRef }=require('./store');
const {improvePuppy}=require('./puppy');
const {amazonLinkFeatures}=require('./helper');
const {scrapeFlipkart}=require('./scrapeFlipkart');

// Scrape amazon product specifications
const amazonProdSpecs = (domContent) => {
    var $ = domContent;
    var features = {};
    var labels = $('.techD .label').toArray().map((label) => $(label).text().trim())
    var values = $('.techD .value').toArray().map((value) => $(value).text().trim())
    var price = $('.a-size-medium.a-color-price.priceBlockBuyingPriceString').text().trim();
    var image = $('#landingImage').attr('src')

    labels.filter((label, i) => {
        features[label] = values[i];
    })
    return { features, price, image };
}


// NEW METHOD TO SCRAPE ALL LINKS
const scrapeAmazonAll=async (browser,amazonLinks,product) => {
    let amazonBrowser=browser;

    // Amazon Promise
    let amazonPromise=new Promise(async function (resolve,reject) {
        var features=await amazonLinks.map( async(amazonLink) => {
            let data={};
            var prodPage = await amazonBrowser.newPage();
    
            improvePuppy(prodPage);
    
            await prodPage.goto(amazonLink.link, { waitUntil: 'domcontentloaded' });
            prodPage.once('load', () => console.log('Amazon product link opened..!'));
    
            await prodPage.waitFor('.a-link-emphasis');
    
            let prodContent = await prodPage.content();
            var $ = cheerio.load(prodContent);
    
            var allReviewsLink = $('.a-link-emphasis').attr('href');
            var allReviewsText = $('.a-link-emphasis').text();
           
            var { features, price, image } = await amazonProdSpecs($);
            data['features']=features;
            data['price']=price;
            // data['image']=image;
    
            allReviewsLink = 'https://www.amazon.in' + allReviewsLink + '&pageNumber=';
    
            data['allReviews']={
                text: allReviewsText,
                link: allReviewsLink
            };
    
            dataRef.child(`${product}/info/amazon`).push(data ,function (err) {
                if(err) return err;
            });
            

            /*
            var {prod_name,asin}=amazonLinkFeatures(allReviewsLink);
            var filename=`${prod_name}-${asin}.csv`;
    
            // FLASK REST API
            console.log('** calling FLASK API for PREDICTION ** \n')
            axios.post(`${restapi}/scrape-amazon`,{prod_name,asin,filename})
                .then( (res) => {
                    console.log('** GOT FLASK API PREDICTION HERE ** \n',res);
                    
                    
                }).catch( (err) => {
                    return err;
                })
      
            */
           
            await prodPage.close();

            return data;
        })
        resolve(features);
    })

    //new method
    


    return Promise.all([amazonPromise]);

}


const scrapeAmazonSingle=async (browser,link,product) => {
    let amazonBrowser=browser;

    let newPromise=new Promise( async (resolve,reject) => {
            console.log(`** scraping  ${link} ** \n`);
            var data={};
            var prodPage = await amazonBrowser.newPage();
    
            improvePuppy(prodPage);
    
            await prodPage.goto(link, { waitUntil: 'domcontentloaded' });
            prodPage.once('load', () => console.log('Amazon product link opened..!'));
    
            await prodPage.waitFor('.a-link-emphasis');
    
            let prodContent = await prodPage.content();
            var $ = cheerio.load(prodContent);
    
            var allReviewsLink = $('.a-link-emphasis').attr('href');
            var allReviewsText = $('.a-link-emphasis').text();
           
            var { features, price, image } = await amazonProdSpecs($);
            data['features']=features;
            data['price']=price;
            // data['image']=image;
    
            allReviewsLink = 'https://www.amazon.in' + allReviewsLink + '&pageNumber=';
    
            data['allReviews']={
                text: allReviewsText,
                link: allReviewsLink
            };
    
            dataRef.child(`${product}/info/amazon`).push(data ,function (err) {
                if(err) return err;
            });
            
            resolve(data);

            var {prod_name,asin}=amazonLinkFeatures(allReviewsLink);
            var filename=`${prod_name}-${asin}.csv`;
    
            // FLASK REST API
            console.log('** calling FLASK API for PREDICTION ** \n')
            axios.post(`${restapi}/scrape-amazon`,{prod_name,asin,filename})
                .then( (res) => {
                    console.log('** GOT FLASK API PREDICTION HERE ** \n',res);
                    
                    
                }).catch( (err) => {
                    return err;
                })
      
      
           
           await prodPage.close();
    })

    return newPromise;
}

module.exports = {
    scrapeAmazon:scrapeAmazonAll,
    scrapeAmazonSingle:scrapeAmazonSingle
}