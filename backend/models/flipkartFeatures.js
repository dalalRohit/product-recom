const mongoose = require('mongoose');

var FlipkartFeaturesSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    features:{
        type:Object,
    },
    price:{
        type:String
    }
});

var FlipkartFeatures = mongoose.model('FlipkartFeatures', FlipkartFeaturesSchema);

module.exports = FlipkartFeatures;