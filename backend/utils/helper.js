const cheerio=require('cheerio');
const { scrapeAmazon } = require('./scrapeAmazon');
const { scrapeFlipkart } = require('./scrapeFlipkart');

const {presets}=require('./presets');
const {improvePuppy}=require('./puppy');


var getImage = async (pBrowser, url) => {
    //TO SCRAPE PHOTO
    var imgPage = await pBrowser.newPage();

    improvePuppy(imgPage);

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

//getGoogleLinks
var getGoogleLinks = async (gBrowser, url) => {
    //TO SCRAPE GOOGLE LINKS
    var linkPage = await gBrowser.newPage();
    improvePuppy(linkPage);
    await linkPage.goto(url, { waitUntil: 'domcontentloaded' });
    linkPage.once('load', () => console.log('Product searched on Google..!'));
    let content = await linkPage.content();
    await linkPage.close();
    return content;
}


module.exports = {
    getGoogleLinks,
    getImage,
}