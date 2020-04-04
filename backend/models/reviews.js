const mongoose = require('mongoose');

var ReviewsSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    helpful: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        required: true
    },
    stars: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    verified: {
        type: String,
        required: true
    }
});
var Reviews = mongoose.model('Reviews', ReviewsSchema);

module.exports = Reviews;