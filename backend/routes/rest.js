var express = require('express');
var router = express.Router();
var moment = require('moment');

// Helper functions
const { scrapeLinksFromGoogle } = require('./../utils/links');

// Firebase config file
const { dataRef, getAllLinks, deleteAllLinks } = require('./../utils/store');


// POST /links
router.post('/links', async function (req, res, next) {
    var product = String(req.body.product.trim());

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
            var { scrapedLinks  } = await scrapeLinksFromGoogle(product);
            var data = [...new Set(scrapedLinks)];
            data = data.filter((i) => {
                // i['photoUrl'] = imgLink;
                i['timestamp'] = moment().format('MMMM Do YYYY, h:mm:ss a');
                i['used'] = 1;
                return i;
            })

            if (data.length > 0) {
                //add new product to already saved data
                allLinks[product] = {
                    data,
                    // photo: imgLink
                };

                dataRef.child(`${product}/allLinks`).set(allLinks[product], function (err) {
                    if (err) {
                        return res.status(400).send('Unable to save data!')
                    }
                    else{
                        return res.status(201).send({
                            savedLinks:allLinks[product]
                        });
                    }
                    
                });
                
                
               
            }


        }
    }

    


});


// Helper functions =====================>START
router.get('/delete_links', (req, res, next) => {
    deleteAllLinks().then((ans) => {
        console.log('All links deleted succesfully ;) ', ans);
    })
})

router.get('/show_links', (req, res, next) => {
    getAllLinks().then((ans) => {
        res.send(ans);
    })
})

// Helper functions =====================>END


router.post('/get_features',(req,res,next) => {
    var prod=req.body.prod.trim();
    dataRef.child(`/${prod}/info`).on('value',function (snapshot) {
        res.send(snapshot.val());
    })
})
module.exports = router;


