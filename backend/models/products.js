const mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({

});
var Products = mongoose.model('Products', ProductSchema);

module.exports = Products;