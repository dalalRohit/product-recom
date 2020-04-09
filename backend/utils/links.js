const puppeteer = require("puppeteer");
var cheerio = require('cheerio');

const { getGoogleLinks, getImage } = require('./helper');



const scrapeLinksFromGoogle = async (prod) => {

    const linkUrl = `https://www.google.com/search?q=${encodeURIComponent(prod)}`

    let launchOptions = {
        headless: false,
        // executablePath: 'C:\\Users\\dalal\\AppData\\Local\\Google\\Chrome SxS\\Application\\chrome.exe', // because we are using puppeteer-core so we must define this option
        ignoreHTTPSErrors: true,
        waitUntil: 'networkidle',
        args: [
          '--start-maximized',
        ]
    };

    let browser = await puppeteer.launch(launchOptions);

    let googleLinksContent = await getGoogleLinks(browser, linkUrl);
    

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

    // Filter amazon and flipkart links from all links
    allLinks.filter( (specificLink) => {
        //specificLink={link:'',title:''}

        var link = String(specificLink.link.trim());

        link = link.slice(12, link.length); //12-> index upto https://www.
        
        var src = link.slice(0, link.indexOf('/')).toLowerCase(); //get source [amazon.in]
        
        switch(src){
            case 'amazon.in':
                var name=src.slice(0, src.indexOf('.')); //get name [amazon]

                if(link.indexOf('dp/') > 0){
                    specificLink['source'] = name //amazon
                    var asin=link.slice( link.indexOf('/dp/')+4 ,link.indexOf('/ref') )
                    specificLink['asin']=asin;
                    amazonLinks.push(specificLink)
                    return specificLink;

                }
                break
            case 'flipkart.com':
                var name2=src.slice(0, src.indexOf('.')); //get name [amazon]

                if(link.indexOf('/p/') > 0){
                    specificLink['source']=name2
                    var pid=link.slice(link.indexOf('itm')+4,link.indexOf())
                    specificLink['pid']=pid;
                    flipkartLinks.push(specificLink)
                    return specificLink;

                }

                break
            default:
                break
        }

    })

    
    return {
        scrapedLinks: {
            'amazon':amazonLinks,
            'flipkart':flipkartLinks
        },
        // imgLink: photoLink,
        browser,
    }


};



module.exports = { scrapeLinksFromGoogle }
