var express = require('express');
var router = express.Router();

// Helper functions
const { scrapeLinksFromGoogle } = require('./../utils/links');
const {amazonMethod,flipkartMethod}=require('./../utils/final');

// Firebase config file
const { dataRef, getAllLinks, deleteAllLinks } = require('./../utils/store');


// POST /links
router.post('/links', async function (req, res, next) {

    var product = String(req.body.product.trim()).toLowerCase();
    //--------------------GLOBAL OBJECT----------------------------------
    let allLinks = await getAllLinks() === null ? {} : await getAllLinks();

    if (allLinks !== null) {

        //if product is already there in FIREBASE
        if (product in allLinks) {

            //update timestamp to latest used and update used count
            let dataToSend={'amazon':[],'flipkart':[]};
            Object.keys(allLinks[product].amazon)
                .map( (savedLink) => {
                    dataToSend['amazon'].push(allLinks[product].amazon[savedLink])
                })
            Object.keys(allLinks[product].flipkart)
                .map( (savedLink) => {
                    dataToSend['flipkart'].push(allLinks[product].flipkart[savedLink])
                })
            // dataToSend['amazon']=allLinks[product].amazon;
            // dataToSend['flipkart']=allLinks[product].flipkart;

            console.log('chutya \n',dataToSend);
            return res.status(201).send({
                savedLinks:{
                    'amazon':dataToSend['amazon'],
                    'flipkart':dataToSend['flipkart']
                }
            })
        }

        //if product entered for FIRST TIME
        else{

            //scrapped results from links.js
            scrapeLinksFromGoogle(product)
                .then( async (response) => {
                    var {scrapedLinks,browser}=response;

   
                    let amazonLinks=scrapedLinks['amazon'];
                    let flipkartLinks=scrapedLinks['flipkart'];

                    let {amazonData}=await amazonMethod(amazonLinks,browser,product);
                    console.log('------------------Printing amazonData------------ \n',amazonData);
                    amazonLinks=amazonLinks.map( (aLink,i) => {
                        aLink={
                            ...aLink,
                            'features':amazonData[i].features,
                            'price':amazonData[i].price,
                            'prediction':amazonData[i]['prediction'] ? amazonData[i]['prediction'] : 0 ,
                            'image':amazonData[i]['image']
                        }
                        dataRef.child(`${product}/amazon`).push(aLink, function (err) {
                            if (err) {
                                return res.status(400).send('Unable to save data!')
                            }
                        })
                        return aLink;

                    })

 
                    let {flipkartData}=await flipkartMethod(flipkartLinks,browser,product);
                    console.log('------------------Printing flipkartData------------ \n',flipkartData);
                    flipkartLinks=flipkartLinks.map( (fLink,i) => {
                        fLink={
                            ...fLink,
                            'features':flipkartData[i]['features'],
                            'price':flipkartData[i]['price'],
                            'prediction':flipkartData[i]['prediction'] ? flipkartData[i]['prediction'] : 0,
                            'image':flipkartData[i]['image'] ?  flipkartData[i]['image'] : 'image'

                        }
                        dataRef.child(`${product}/flipkart`).push(fLink, function (err) {
                            if (err) {
                                return res.status(400).send('Unable to save data!')
                            }
                        })
                        return fLink;
                    })

                    // Return everything from here---->
                    res.status(200).send({
                        savedLinks:{
                            'amazon':amazonLinks,
                            'flipkart':flipkartLinks
                        }
                    })

                    await browser.close();

                })
                .catch( (err) => {
                    return console.log(err)
                })
        
        }   
    }
});



router.post('/get_features',(req,res,next) => {
    var prod=req.body.product.trim();
    let amazonFeatures=[];
    let flipkartFeatures=[];

    dataRef.child(`/${prod}/info/amazon`).on('value',function (snapshot) {
        amazonFeatures.push(snapshot.val())
    }, function (err) {
        console.log("The read failed: " + err.code);
    })

    dataRef.child(`/${prod}/info/flipkart`).on('value',function (snapshot) {
        flipkartFeatures.push(snapshot.val())
    }, function (err) {
        console.log("The read failed: " + err.code);
    })

    res.send({
        amazonFeatures,
        flipkartFeatures
    })
})

router.get('/photo',(req,res) => {

})

module.exports = router;


