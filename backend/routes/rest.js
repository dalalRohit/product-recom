var express = require('express');
var router = express.Router();
var moment = require('moment');

// Helper functions
const { scrapeLinksFromGoogle } = require('./../utils/links');
const {amazonMethod,flipkartMethod}=require('./../play/new');

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
            allLinks[product].data.map((prod) => {
                prod['timestamp'] = moment().format('MMMM Do YYYY, h:mm:ss a');;
                prod['used'] += 1;
                //update firebase with new timestamp and used count of product
                dataRef.child(product).set(allLinks[product]);
            })
            return res.send(allLinks[product]);
        }

        //if product entered for FIRST TIME
        else{

            //scrapped results from links.js
            scrapeLinksFromGoogle(product)
                .then( async (response) => {
                    var {scrapedLinks,browser}=response;

   
                    let amazonLinks=scrapedLinks['amazon'];
                    let flipkartLinks=scrapedLinks['flipkart'];

                    let amazonData=await amazonMethod(amazonLinks,browser,product);
                    amazonData['amazon'].forEach( (aLink) => {
                        dataRef.child(`${product}/amazon`).push(aLink, function (err) {
                            if (err) {
                                return res.status(400).send('Unable to save data!')
                            }
                        })
                    })
 
                    let flipkartData=await flipkartMethod(flipkartLinks,browser,product);
                    flipkartData['flipkart'].forEach( (fLink) => {
                        dataRef.child(`${product}/flipkart`).push(fLink,function (err) {
                            if(err){
                                return res.status(400).send('Unable to save data!')
                            }
                        })
                    })
                    amazonLinks=amazonLinks.map( (aLink,i) => {
                        return {
                            ...aLink,
                            features:amazonData['amazon'][i]['features'],
                            price:amazonData['amazon'][i]['price'],
                            prediction:amazonData['amazon'][i]['prediction']
                        }
                    })
                    flipkartLinks=flipkartLinks.map( (fLink,i) => {
                        return {
                            ...fLink,
                            features:flipkartData['flipkart'][i]['features'],
                            price:flipkartData['flipkart'][i]['price']
                        }
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


// Helper functions =====================>START
router.get('/delete_links', (req, res, next) => {
    deleteAllLinks().then((ans) => {
        console.log('All links deleted succesfully ;) ', ans);
        res.send({
            msg:'All links deleted succesfully ;) ',
            ans
        }) 
    })
})

router.get('/get_links', (req, res, next) => {
    getAllLinks().then((ans) => {
        res.send(ans);
    })
})

// Helper functions =====================>END


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

router.post('/timepass',(req,res) => {
    let data=req.body.data;
    setTimeout( () => {
        res.send({ans:data**data});
    },2000);
})
module.exports = router;


