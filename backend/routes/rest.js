var express = require('express');
var router = express.Router();
const { scrape } = require('./../utils/links');

// ********************************START => FIREBASE*****************************
var firebase = require("firebase-admin");
var serviceAccount = require("./../key.json");
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://product-recom.firebaseio.com"
});
var db = firebase.database();
var ref = db.ref();
var dataRef = ref.child("data");
// ********************************END => FIREBASE*****************************

/* GET home page. */
router.post('/links', async function (req, res, next) {
    var product = req.body.product.trim();
    var info = await scrape(product);
    var imgLink = info.imgLink;

    var data = [...new Set(info.data)];
    data = data.filter((i) => {
        if (typeof i.link == 'undefined' || i.title == '') {
            delete i;
        }
        else {
            // return i;
            if (i.link.length > 0 && (i.link.startsWith('https://www.amazon') || i.link.startsWith('https://www.flipkart'))) {
                if (i.link.slice(12).startsWith('amazon')) {
                    i["source"] = "amazon";
                }
                else {
                    i["source"] = "flipkart";
                }
                i['photoUrl'] = imgLink;
                return i;
            }
        }
    })
    // console.log(imgLink);
    dataRef.set({
        data
    })
    res.send(data);

});

module.exports = router;
