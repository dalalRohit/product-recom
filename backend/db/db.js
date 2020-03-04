var mongoose = require('mongoose');
require('dotenv').config();

var cond = process.env.NODE_ENV==='DEV' ? true : false;

var  url  = cond ? process.env.LOCAL_DB_URL : process.env.MLAB_DB_URL

if (cond) {
    mongoose.Promise = global.Promise; //setting Promise
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true   }, function (err) {
        if (!err) {
            console.log("DEV: Connected to MongoDB!");
            console.log(url);

        }
    });
}
else {
    mongoose.Promise = global.Promise; //setting Promise
    mongoose.connect(url, { useNewUrlParser: true }, function (err) {
        if (!err) {
            console.log("PRODUCTION: Connected to mongoDB!");
            console.log(url);

        }
    });
}


module.exports = { mongoose };
