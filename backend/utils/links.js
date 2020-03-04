const puppeteer = require("puppeteer-core");
var cheerio = require('cheerio');

const { scrapeAmazon } = require('./scrapeAmazon');
const { scrapeFlipkart } = require('./scrapeFlipkart');
// const Reviews = require('./../models/reviews');

const { getGoogleLinks, getImage } = require('./helper');



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
    
    // let photoLink = await getImage(browser, photoUrl);

    let allLinks = [];

    // Cheerio object with parsed HTML content
    var $ = cheerio.load(googleLinksContent);


    //Get all product links
    $('.r').each(function (i, el) {
        var title = $(this).find('.LC20lb').text();
        var link = $(this).children('a').attr('href');
        if (title.length > 0 && link.length > 0) {
            allLinks.push({ title, link })
        }
    })


    //filter amazon and flipkart links from 'data' <Array.Object>
    //don't use .map(),use .filter() only!!!!!!
    let amazonLinks=[];
    let flipkartLinks=[];

    var specificLinks = allLinks.filter((d) => {
        //d={link:'',title:''}
        var link = String(d.link.trim());

        link = link.slice(12, link.length); //12-> index upto https://www.
        
        var src = link.slice(0, link.indexOf('/')).toLowerCase(); //get source [amazon.in]
        
        if (src === 'amazon.in' || src === 'flipkart.com') {
            let name=src.slice(0, src.indexOf('.'));
            d['source'] = name //amazon
            name==='amazon' ? amazonLinks.push(d) : flipkartLinks.push(d);
            return d;
        }
    })


    scrapeAmazon(browser,amazonLinks,prod)
        .then( (data) => {
            console.log(data);
        })
        .catch( (err) => {
            console.log(err);
        })

    scrapeFlipkart(browser,flipkartLinks,prod)
        .then( (data) => {
            console.log(data);
        })
        .catch( (err) => {
            console.log(err);
        })
    
    return {
        scrapedLinks: specificLinks,
        // imgLink: photoLink,
    }
        

};



module.exports = { scrapeLinksFromGoogle }
