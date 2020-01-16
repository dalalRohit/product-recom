const puppeteer = require("puppeteer-core");
var cheerio = require('cheerio');
const { dataRef, getAllLinks } = require('./store');
const restapi = 'http://localhost:5000'
const axios = require('axios');

let amazonAllReviews = {};

const scrapeAmazonReviews = async (browser, prodLink, product) => {

    let x = browser;
    var prodPage = await x.newPage();
    await prodPage.goto(prodLink);
    await prodPage.waitFor(1000);

    let prodContent = await prodPage.content();
    var $ = cheerio.load(prodContent);

    var allReviewsLink = $('.a-link-emphasis').attr('href');
    var allReviewsText = $('.a-link-emphasis').text();

    //get product features

    prodPage.close();

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
            console.log('[ScrapeAmazon]', res.data);
        })
        .catch((er) => {
            console.log(er);
        })

}

const scrapeFlipkartReviews = () => {

}

var scrapeLinksFromGoogle = async (prod) => {

    let launchOptions = {
        headless: false,
        executablePath: 'C:\\Users\\dalal\\AppData\\Local\\Google\\Chrome SxS\\Application\\chrome.exe', // because we are using puppeteer-core so we must define this option
        args: ['--start-maximized']
    };
    const browser = await puppeteer.launch(launchOptions);
    var linkPage = await browser.newPage();

    const linkUrl = `https://www.google.com/search?q=${encodeURIComponent(prod)}`
    // const photoUrl = `https://www.google.co.in/search?hl=en&tbm=isch&q=${encodeURIComponent(prod)}`;

    // scrape google links
    await linkPage.goto(linkUrl);
    await linkPage.waitFor(1000);
    let content = await linkPage.content();

    let data = [];

    var $ = cheerio.load(content);
    $('.r').each(function (i, el) {
        var title = $(this).find('.LC20lb').text();
        var link = $(this).children('a').attr('href');
        if (title.length > 0 && link.length > 0) {
            data.push({ title, link })
        }
    })
    //filter amazon and flipkart links from 'data' <Array.Object>
    //don't use .map(),use .filter() only!!!!!!
    var newData = data.filter((d) => {
        if (d.link.length > 0 && (d.link.startsWith('https://www.amazon') || d.link.startsWith('https://www.flipkart'))) {
            return d;
        }
    })
    console.log(newData);
    linkPage.close();

    // scrape google images [1]
    /*
    var imgPage = await browser.newPage();
    await imgPage.goto(photoUrl);
    await imgPage.waitFor(1000);
    let photoContent = await imgPage.content();
    var $ = cheerio.load(photoContent);

    let imgLink = '';
    if ($('.rg_ic.rg_i').length > 0) {
        imgLink = $('.rg_ic.rg_i')[1].attribs.src;
    }
    else {
        imgLink = 'https://lallahoriye.com.tirzee.com/wp-content/uploads/2019/04/Product_Lg_Type.jpg'
    }
    imgPage.close();
    */

    //get allReviews page of amazon from newData
    if (newData.length > 0) {
        newData.forEach((d) => {
            if (d.link.slice(12).startsWith('amazon.in')) {
                d['source'] = 'amazon';
                console.log('Go to all reviews of amazon!')
                scrapeAmazonReviews(browser, d.link, prod);
            }
            else {
                d['source'] = 'flipkart';
                console.log('Go to all reviews of flipkart!')
                //scrapeFlipkartReviews()
            }
        })
    }
    else {
        return {
            err: "No Amazon/Flipkart links found! ;("
        }
    }


    // browser.close();

    return {
        data: newData,
        // imgLink
    };

};



module.exports = { scrape: scrapeLinksFromGoogle }
