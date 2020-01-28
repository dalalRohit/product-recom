const puppeteer = require("puppeteer-core");
var cheerio = require('cheerio');
// const { dataRef, getAllLinks } = require('./store');

const { scrapeAmazon } = require('./scrapeAmazon');
const { scrapeFlipkart } = require('./scrapeFlipkart');
const Reviews = require('./../models/reviews');

var getImage = async (pBrowser, url) => {
    //TO SCRAPE PHOTO
    var imgPage = await pBrowser.newPage();
    await imgPage.goto(url, { waitUntil: 'domcontentloaded' });
    await imgPage.waitFor(1000);
    let photoContent = await imgPage.content();
    var $ = cheerio.load(photoContent);

    var imgArray = $('.rg_ic.rg_i');
    var staticImg = 'https://lallahoriye.com.tirzee.com/wp-content/uploads/2019/04/Product_Lg_Type.jpg';
    let imgLink = (imgArray.length > 0 && imgArray[7].attribs.src !== undefined) ? imgArray[7].attribs.src : staticImg;
    await imgPage.close();
    return imgLink;
}

var getGoogleLinks = async (gBrowser, url) => {
    //TO SCRAPE GOOGLE LINKS
    var linkPage = await gBrowser.newPage();
    await linkPage.goto(url, { waitUntil: 'domcontentloaded' });
    linkPage.once('load', () => console.log('Product searched on Google..!'));
    let content = await linkPage.content();
    await linkPage.close();
    return content;
}

var processSpecificLinks = (reqLinks) => {
    let linksData = [...reqLinks];
    console.log('[links.js => 48', linksData)
    return linksData;
}

//########################################################
var scrapeLinksFromGoogle = async (prod) => {

    const linkUrl = `https://www.google.com/search?q=${encodeURIComponent(prod)}`
    const photoUrl = `https://www.google.co.in/search?hl=en&tbm=isch&q=${encodeURIComponent(prod)}`;

    let launchOptions = {
        headless: false,
        executablePath: 'C:\\Users\\dalal\\AppData\\Local\\Google\\Chrome SxS\\Application\\chrome.exe', // because we are using puppeteer-core so we must define this option
        args: ['--start-maximized']
    };

    const browser = await puppeteer.launch(launchOptions);

    let googleLinksContent = await getGoogleLinks(browser, linkUrl);
    let photoLink = await getImage(browser, photoUrl);

    let allLinks = [];

    var $ = cheerio.load(googleLinksContent);
    $('.r').each(function (i, el) {
        var title = $(this).find('.LC20lb').text();
        var link = $(this).children('a').attr('href');
        if (title.length > 0 && link.length > 0) {
            allLinks.push({ title, link })
        }
    })
    //filter amazon and flipkart links from 'data' <Array.Object>
    //don't use .map(),use .filter() only!!!!!!
    var specificLinks = allLinks.filter((d) => {
        //d={link:'',title:''}
        var link = String(d.link.trim());
        link = link.slice(12, link.length); //12-> index upto https://www.
        var src = link.slice(0, link.indexOf('/')).toLowerCase(); //get source [amazon.in]
        if (src === 'amazon.in' || src === 'flipkart.com') {
            d['source'] = src.slice(0, src.indexOf('.')); //amazon
            return d;
        }
    })
    var specLinksRes = await processSpecificLinks(specificLinks);


    //get allReviews page of amazon from newData
    /*
    specificLinks.forEach(async (specificLink) => {
        if (specificLink.link.slice(12).startsWith('amazon.in')) {
            specificLink['source'] = 'amazon';
            console.log('Go to all reviews of amazon!')
            let result = await scrapeAmazon(browser, specificLink.link, prod);
            console.log('[links.js => 82]', result)


        }
        else {
            specificLink['source'] = 'flipkart';
            console.log('Go to all reviews of flipkart!')
            scrapeFlipkart()

        }
    })
    */
    await browser.close();

    return {
        data: specificLinks,
        imgLink: photoLink,
    };




};



module.exports = { scrapeLinksFromGoogle }
