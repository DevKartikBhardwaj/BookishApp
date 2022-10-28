const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    "productTitle": String,
    "productMRP": Number,
    "productCategory": String,
    "productDescription": String
})

const product = mongoose.model("product", productSchema);
module.exports = product;