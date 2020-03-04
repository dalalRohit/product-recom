const restapi = 'http://localhost:5000'
const axios = require('axios');
var cheerio = require('cheerio');
const {improvePuppy}=require('./puppy');

const { dataRef }=require('./store');

const flipkartProdSpecs=(domContent) => {
    var $=domContent;

    var features={};

    //Get all labels from table ['RAM','OS']
    var labels=$('._3-wDH3.col.col-3-12').toArray()
        .map( (label) => {
            return $(label).text().trim();
        })

    //Get all values of features from table ['6GB','Blue']
    var values=$('._2k4JXJ.col.col-9-12').toArray()
        .map( (value) => {
            return $(value).text().trim();
        })

    labels.map( (label,i) => {
        features[label]=values[i];
    })

    var image=$('._1Nyybr.Yun65Y.OGBF1g._30XEf0').attr('src') //image link of flipkart prod
    console.log('\n\n image=> ',image);
    var price=$('._1vC4OE._3qQ9m1').text(); //price
    
    return {features,image,price}
};


const scrapeFlipkart = async (browser, flipkartLinks, product) => {
    let flipkartBrowser=browser;

    let flipkartAllReviews = []
    let data={};

    flipkartLinks.filter( async (flipkartLink) => {
        var prodPage = await flipkartBrowser.newPage();

        improvePuppy(prodPage);

        await prodPage.goto(flipkartLink.link, { waitUntil: 'domcontentloaded' });
        prodPage.once('load', () => console.log('Flipkart product link opened..!'));
        
        let prodContent = await prodPage.content();
        var $ = cheerio.load(prodContent);

        await prodPage.waitFor('._2aFisS ');
        var allReviewsLink = 'https://www.flipkart.com'+$('._2aFisS + a').attr('href');
        var allReviewsText = $('.swINJg._3nrCtb').text();


        var { features,image,price } = flipkartProdSpecs($);

        data['features']=features;
        data['price']=price;
        // data['image']=image;
        data['allReviews']=[];

        

        // var res = await axios.post(restapi + '/scrape-flipkartAPI', { link: allReviewsLink });
       
        // data['modelOp']=res.data;
       
        flipkartAllReviews.push(data);

        dataRef.child(`${product}/info/flipkart`).set(flipkartAllReviews ,function (err) {
            if(err) return err;
        });


        await prodPage.close();

    })
}


module.exports = {
    scrapeFlipkart
}