const puppeteer = require("puppeteer");
var cheerio = require('cheerio');

var scrape = async (prod) => {
    const browser = await puppeteer.launch({ headless: false });
    var page = await browser.newPage();

    const linkUrl = `https://www.google.com/search?q=${encodeURIComponent(prod)}`
    const photoUrl = `https://www.google.co.in/search?hl=en&tbm=isch&q=${encodeURIComponent(prod)}`;

    // scrape google links
    await page.goto(linkUrl);
    await page.waitFor(1000);
    let content = await page.content();
    let data = [];
    var $ = cheerio.load(content);
    $('.r').each(function (i, el) {
        var title = $(this).find('.LC20lb').text();
        var link = $(this).children('a').attr('href');
        data.push({ title, link })
    })

    //scrape google images [1]
    var page = await browser.newPage();
    await page.goto(photoUrl);
    await page.waitFor(1000);
    let photoContent = await page.content();
    var $ = cheerio.load(photoContent);

    let imgLink = $('.rg_ic.rg_i')[2].attribs.src;
    browser.close();

    return { data, imgLink };
};

// var photos = async (prod) => {
//     const browser = await puppeteer.launch({ headless: true });
//     var page = await browser.newPage();

//     const photoUrl = `https://www.google.co.in/search?hl=en&tbm=isch&q=${encodeURIComponent(prod)}`;

//     await page.goto(photoUrl);
//     await page.waitFor(1000);
//     let content = await page.content();
//     var $ = cheerio.load(content);
//     // $('.rg_ic.rg_i').each(function (i, el) {
//     //     // var title = $(this).find('.LC20lb').text();
//     //     // var link = $(this).children('a').attr('href');
//     //     console.log($(this).attr('src'));
//     //     // data.push({ title, link })
//     // })
//     // console.log($('.rg_ic.rg_i')[1].attribs.src);
//     let imgLink = $('.rg_ic.rg_i')[1].attribs.src;
//     browser.close();
//     return imgLink;
// };

module.exports = { scrape }


// var info = await page.evaluate(async () => {
//     Array.from(document.querySelectorAll('.r')).map((d) => {
//         var node = d.children;
//         var link = node[0].href;
//         var title = node[0].childNodes[0].innerText;
//         data.push({
//             link,
//             title
//         })
//     })
// });