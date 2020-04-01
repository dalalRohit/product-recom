var express = require('express');
var router = express.Router();
var moment = require('moment');

// Helper functions
const { scrapeLinksFromGoogle } = require('./../utils/links');
const {scrapeAmazonSingle,scrapeAmazon}=require('./../utils/scrapeAmazon');
const {scrapeFlipkartSingle}=require('./../utils/scrapeFlipkart');
const rohit=require('./../play/new');

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
            // var { scrapedLinks,imgLink  } = await scrapeLinksFromGoogle(product);
            scrapeLinksFromGoogle(product)
                .then( async (response) => {
                    // console.log('**inside .then() scrapeLinksFromGOogle** \n');
                    var {scrapedLinks,browser,amazonLinks,flipkartLinks}=response;
                    

                    var data = [...new Set(scrapedLinks)];
                    
                    data = data.filter((i) => {
                        // i['photoUrl'] = imgLink;
                        i['timestamp'] = moment().format('MMMM Do YYYY, h:mm:ss a');
                        i['used'] = 1;
                        return i;
                    })

                    //add new product to already saved data
                    allLinks[product] = {data};
                    
                    /*
                    amazonLinks.forEach( (amazonLink) => {
                        scrapeAmazonSingle(browser,amazonLink.link,product)
                            .then( (response) => {
                                console.log('\n scrapeAmazonSingle .then() => ',response);
                                amazonRes.push(response);
                            })
                            .catch( (err) => {
                                console.log(err);
                            })
                    })
                    amazonRes=[{},{}]
                    flipkartRes=[{},{}]
                    return everything
                    */

                    // scrapeAmazon(browser,amazonLinks,product)
                    //     .then( (amazonRes) => {
                    //         console.log('[rest.js==77] \n',amazonRes);
                    //         return amazonRes[0];
                    //     })
                    //     .then( (h) => {
                    //         console.log('chaining promise \n ',h);
                    //     })
                    
                    rohit({'amazon':amazonLinks,'flipkart':flipkartLinks},browser,product)
                        .then( (data) => {
                            console.log(data);
                            dataRef.child(`${product}/allLinks`).set(allLinks[product], function (err) {
                                if (err) {
                                    return res.status(400).send('Unable to save data!')
                                }
                              
                                // Send everything to react from here
                                return res.status(201).send({
                                    savedLinks:allLinks[product],
                                    info:data
                                })
                        })

            

                      

                    });    

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


