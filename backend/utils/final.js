const cheerio=require('cheerio');
const axios=require('axios');
const puppeteer=require('puppeteer-core');
const moment=require('moment');

const { dataRef }=require('./store');
const AmazonFeatures=require('./../models/amazonFeatures');
const FlipkartFeatures=require('./../models/flipkartFeatures');
const {improvePuppy}=require('./puppy');
const {amazonLinkFeatures}=require('./helper');

const restapi='http://localhost:5000';

// Amazon feature scarper
const amazonProdSpecs = (domContent) => {
    var $ = domContent;
    var features = {};
    var labels = $('.techD .label').toArray().map((label) => $(label).text().trim())
    var values = $('.techD .value').toArray().map((value) => $(value).text().trim())
    var price = $('.a-size-medium.a-color-price.priceBlockBuyingPriceString').text().trim();
    price= price==='' ? 'Price not avaliable' : price;
    
    var image = $('img #landingImage').attr('src');
    console.log('\n Amazon image: \n',image);
    labels.filter((label, i) => {
        features[label] = values[i];
    })
    return { features, price, image };
}

// Flipkart feature scrapper
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

    var image=$('._1Nyybr.Yun65Y.OGBF1g._30XEf0').attr('src'); //image link of flipkart prod
    console.log('\n Flipkart image \n ',image);
    var price=$('._1vC4OE._3qQ9m1').text(); //price
    
    return {features,image,price}
};

// Scraper for scraping amazon product features
const scrapeAmazonAll=async (browser,amazonLink,product) => {

    const amazonBrowser = browser;

    let amazonPromise=new Promise(async function (resolve,reject) {
        let data={};
        var prodPage = await amazonBrowser.newPage();

        improvePuppy(prodPage);

        try{
            await prodPage.goto(amazonLink, { waitUntil: 'domcontentloaded' });

        }
        catch(e){
            if(e instanceof puppeteer.errors.TimeoutError){
                reject(`Cannot open ${amazonLink}. Please try again :(`);
                return new Error(`Cannot open ${amazonLink}. Please try again :(`)
            }
        }
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

        var {prod_name,asin}=amazonLinkFeatures(allReviewsLink);
        var filename=`${prod_name}-${asin}.csv`;

        // FLASK REST API
        /*
        console.log('** calling FLASK API for PREDICTION ** \n')
        let ans=await axios.post(`${restapi}/scrape-amazon`,{prod_name,asin,filename});
  
        data['prediction']=ans.ans;
        */
        await prodPage.close();
        resolve(data);

    })

    return amazonPromise;

}

// Scrapper for scraping flipkart product features
const scrapeFlipkartAll=async (browser,flipkartLink,product) => {
    const flipkartBrowser=browser;

    let flipkartPromise=new Promise( async function (resolve,reject) {
        var data={};

        var prodPage = await flipkartBrowser.newPage();

        improvePuppy(prodPage);

        try{
            await prodPage.goto(flipkartLink, { waitUntil: 'domcontentloaded' });
        }
        catch (e) {
            if(e instanceof  puppeteer.errors.TimeoutError) {
                return new Error('Page could not open');
            }
        }
        
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

        // dataRef.child(`${product}/info/flipkart`).push(data ,function (err) {
        //     if(err) return err;
        // });
        

        // var res = await axios.post(restapi + '/scrape-flipkartAPI', { link: allReviewsLink });
        
        // data['modelOp']=res.data;
        

        await prodPage.close();
        resolve(data);
    });

    return flipkartPromise;
}


async function shraddha(flipkartLinks,browser,product)
{
    let flipkartPromise=[];
    flipkartLinks.forEach( (flipkartLink) => {
        console.log('\n calling scrapeFlipkartAll() for ',flipkartLink.link);
        // setTimeout( () => {
            flipkartPromise.push(scrapeFlipkartAll(browser,flipkartLink.link,product))
        // },2000)

    })
    const m=await Promise.all(flipkartPromise);
    console.log(m);
    //store flipkart data to mongoDb 
    let newShraddha=m.map( (p) => {
        // var data=new FlipkartFeatures({
        //     name:product,
        //     date:moment(),
        //     features:p['features'],
        //     price:p['price']
        // })
        // data.save()
        //     .then( (res) => {
        //         console.log(`${product} saved to FlipkartFeatures.. \n`)
        //     })
        return {
            ...p,
            'features':p['features'],
            'price':p['price']
        }

    })

    return {'flipkart':newShraddha}


}

async function rohit(amazonLinks,browser,product) {

    var x=[];
    amazonLinks.forEach( (amazonLink) => {
        console.log('\n calling scrapeAmazonAll() for ',amazonLink.link);
        // setTimeout( () => {
            x.push(scrapeAmazonAll(browser,amazonLink.link,product))
        // },2000)

    })

    const n=await Promise.all(x);
    console.log(n);


    //store amazon data to mongoDb 
     let newRohit=n.map( (p) => {
        // console.log(p,p['features']);
        // var data=new AmazonFeatures({
        //     name:product,
        //     date:moment(),
        //     features:p['features'],
        //     price:p['price']
        // });
        return {
            ...p,
            'features':p['features'],
            'price':p['price']
        };
        // data.save()
        //     .then( (res) => {
        //         console.log(`${product} saved to AmazonFeatures.. \n`);
        //     })
    })



    return {'amazon':newRohit};
};

module.exports={
    rohit:rohit,
    shraddha:shraddha
};
