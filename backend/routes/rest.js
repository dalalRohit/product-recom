var express = require('express');
var router = express.Router();
var moment = require('moment');
const { scrape } = require('./../utils/links');
// Firebase config file
const { dataRef, getAllLinks } = require('./../utils/store');


// POST /links
router.post('/links', async function (req, res, next) {
    var product = String(req.body.product.trim());
    let allLinks = await getAllLinks() === null ? {} : await getAllLinks();
    if (allLinks !== null) {
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
    }

    //scrapped results from links.js
    var info = await scrape(product);
    var imgLink = info.imgLink;


    var data = [...new Set(info.data)];
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
            photo: imgLink
        };

        dataRef.set(allLinks, function (err) {
            if (err) {
                return alert('Unable to save data!');
            }
        });
        return res.send(allLinks[product]);
    }
    else {
        return res.status(400).send({
            msg: `No product found for ${product}`,
            error: true
        });
    }


});

// var t = async () => {
//     var o = await getAllLinks();
//     console.log(o);
// }
// t();
module.exports = router;

/*
{
    'mi a2':{
        data:{
            0:{},1:{}
        },
        photo:''
    }
}
*/
