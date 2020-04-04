const mongoose = require('mongoose');

var AmazonFeaturesSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    date:{
        type:String,
        required:true
    },
    features:{
        type: Object
    },
    price:{
        type:String
    },
});

var AmazonFeatures = mongoose.model('AmazonFeatures', AmazonFeaturesSchema);

module.exports = AmazonFeatures;