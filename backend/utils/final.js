const { improvePuppy } = require("./puppy");
const cheerio = require("cheerio");
const restapi = "http://localhost:5000";
const axios = require("axios");
const puppeteer = require("puppeteer-core");
const { amazonLinkFeatures } = require("./helper");

// Scraper for product features
const amazonProdSpecs = (domContent) => {
  var $ = domContent;
  var features = {};
  var labels = $(".techD .label")
    .toArray()
    .map((label) => $(label).text().trim());
  var values = $(".techD .value")
    .toArray()
    .map((value) => $(value).text().trim());
  var price = $(".a-size-medium.a-color-price.priceBlockBuyingPriceString")
    .text()
    .trim();
  price = price === "" ? "Price not avaliable" : price;

  var image = $("#landingImage").attr("src");
  // console.log('Amazon Image link: \n',image);
  labels.filter((label, i) => {
    features[label] = values[i];
  });
  return { features, price, image };
};

const flipkartProdSpecs = (domContent) => {
  var $ = domContent;

  var features = {};

  //Get all labels from table ['RAM','OS']
  var labels = $("._3-wDH3.col.col-3-12")
    .toArray()
    .map((label) => {
      return $(label).text().trim();
    });

  //Get all values of features from table ['6GB','Blue']
  var values = $("._2k4JXJ.col.col-9-12")
    .toArray()
    .map((value) => {
      return $(value).text().trim();
    });

  labels.map((label, i) => {
    features[label] = values[i];
  });

  var image = $("._3BTv9X._3iN4zu").find("img").attr("src"); //image link of flipkart prod
  var price = $("._1vC4OE._3qQ9m1").text(); //price
  price = price === "" ? "Price not avaliable" : price;

  return { features, image, price };
};

// Scraper for scraping product features
const scrapeAmazonAll = async (browser, amazonLink, product) => {
  const amazonBrowser = browser;

  let amazonPromise = new Promise(async function (resolve, reject) {
    let data = {};
    var prodPage = await amazonBrowser.newPage();

    improvePuppy(prodPage);

    try {
      await prodPage.goto(amazonLink, { waitUntil: "domcontentloaded" });
    } catch (e) {
      if (e instanceof puppeteer.errors.TimeoutError) {
        reject(`Cannot open ${amazonLink}. Please try again later..`);
        return new Error(`Cannot open ${amazonLink}. Please try again :(`);
      }
    }
    prodPage.once("load", () => console.log("Amazon product link opened..!"));

    await prodPage.waitFor(".a-link-emphasis");

    let prodContent = await prodPage.content();
    var $ = cheerio.load(prodContent);

    var allReviewsLink = $(".a-link-emphasis").attr("href");
    var allReviewsText = $(".a-link-emphasis").text();

    var { features, price, image } = await amazonProdSpecs($);
    data["features"] = features;
    data["price"] = price;
    data["image"] = image;

    allReviewsLink = "https://www.amazon.in" + allReviewsLink + "&pageNumber=";

    data["allReviews"] = {
      text: allReviewsText,
      link: allReviewsLink,
    };

    var { prod_name, asin } = amazonLinkFeatures(allReviewsLink);
    var filename = `${prod_name}-${asin}.csv`;

    // FLASK REST API
    axios
      .post(`${restapi}/scrape-amazon`, { prod_name, asin, filename })
      .then(async (response) => {
        data["prediction"] = response.data.ans;
        await prodPage.close();
        resolve(data);
      })
      .catch(async (err) => {
        await prodPage.close();
        reject({
          err: "Could not scrape AMAZON product reviews. Server Error 500!",
          error: err,
        });
      });
  });

  return amazonPromise;
};

const scrapeFlipkartAll = async (browser, flipkartLink, product) => {
  const flipkartBrowser = browser;

  let flipkartPromise = new Promise(async function (resolve, reject) {
    var data = {};

    var prodPage = await flipkartBrowser.newPage();

    improvePuppy(prodPage);

    try {
      await prodPage.goto(flipkartLink, { waitUntil: "domcontentloaded" });
    } catch (e) {
      if (e instanceof puppeteer.errors.TimeoutError) {
        reject(`${flipkartLink} gave up loading! Try again after some time..`);
        return new Error("Page could not open");
      }
    }

    let prodContent = await prodPage.content();
    var $ = cheerio.load(prodContent);

    await prodPage.waitFor("._2aFisS ");
    var allReviewsLink =
      "https://www.flipkart.com" + $("._2aFisS + a").attr("href");
    var allReviewsText = $(".swINJg._3nrCtb").text();

    var { features, image, price } = flipkartProdSpecs($);

    data["features"] = features;
    data["price"] = price;
    data["image"] = image;
    data["allReviews"] = [];

    // FLASK REST API
    console.log("** calling FLASK API for PREDICTION ** \n");
    // let response=await axios.post(`${restapi}/scrape-flipkart`,{prod:'this_is_the_product'});
    axios
      .post(`${restapi}/scrape-flipkart-new`, { prod: `this_is_the_product` })
      .then(async (response) => {
        data["prediction"] = response.data.ans;
        await prodPage.close();
        resolve(data);
      })
      .catch((err) => {
        reject({
          err: new Error(
            "Could not scrape FLIPKART prouct reviews. Server Error 500!"
          ),
          error: err,
        });
      });
  });

  return flipkartPromise;
};

async function flipkartMethod(flipkartLinks, browser, product) {
  let flipkartPromise = [];
  flipkartLinks.forEach((flipkartLink) => {
    flipkartPromise.push(
      scrapeFlipkartAll(browser, flipkartLink.link, product)
    );
  });
  const m = await Promise.all(flipkartPromise);
  // console.log('Printing FLIPKART m \n',m);
  if (m) {
    let newFlipkartData = m.map((p) => {
      return {
        ...p,
        features: p["features"],
        price: p["price"],
        image: p["image"],
      };
    });

    return { flipkartData: newFlipkartData };
  } else {
    console.log("Error occured.. FLIPKART");
  }
}

async function amazonMethod(amazonLinks, browser, product) {
  var x = [];
  amazonLinks.forEach((amazonLink) => {
    x.push(scrapeAmazonAll(browser, amazonLink.link, product));
  });

  const n = await Promise.all(x);
  // console.log('Printing AMAZON n \n',n);
  if (n) {
    //store amazon data to mongoDb
    let newAmazonData = n.map((p) => {
      return {
        ...p,
        features: p["features"],
        price: p["price"],
        image: p["image"],
      };
    });

    return { amazonData: newAmazonData };
  } else {
    console.log("Error occured AMAZON..");
  }
}

module.exports = {
  amazonMethod,
  flipkartMethod,
};
