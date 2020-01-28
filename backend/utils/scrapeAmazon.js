const restapi = 'http://localhost:5000'
const axios = require('axios');
var cheerio = require('cheerio');

const amazonProdSpecs = (domContent) => {
    var $ = domContent;
    var features = {};
    var labels = $('.techD .label').toArray().map((label) => $(label).text().trim())
    var values = $('.techD .value').toArray().map((value) => $(value).text().trim())
    var price = $('#priceblock_ourprice').text();

    labels.map((label, i) => {
        features[label] = values[i];
    })
    return { features, price };
}

const scrapeAmazonReviews = async (browser, prodLink, product) => {

    let amazonAllReviews = {};
    let output = null;
    let amazonBrowser = browser;
    var prodPage = await amazonBrowser.newPage();
    await prodPage.goto(prodLink, { waitUntil: 'domcontentloaded' });
    prodPage.once('load', () => console.log('Amazon product link opened..!'));

    await prodPage.waitFor('.a-link-emphasis');

    let prodContent = await prodPage.content();
    var $ = cheerio.load(prodContent);

    var allReviewsLink = $('.a-link-emphasis').attr('href');
    var allReviewsText = $('.a-link-emphasis').text();
    var { features, price } = amazonProdSpecs($);

    // console.log(`[features-price] ${prodLink} `, features, price, '\n');

    //get product features 
    /*
    ram weight rom color model-number battery
    */


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

    axios.post(restapi + '/scrape-amazon', { link: allReviewsLink })
        .then((res) => {
            output = {
                model_output: res.data,
                features,
                price
            };
            return output
        })
        .catch((err) => {
            console.log(err);
        })

    return output;

    prodPage.close();

}

module.exports = {
    scrapeAmazon: scrapeAmazonReviews
}