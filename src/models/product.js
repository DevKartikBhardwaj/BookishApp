const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new Schema({
    productTitle: {
        type: String,
        required: true
    },
    productMRP: {
        type: Number,
        required: true
    },
    productCategory: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const product = mongoose.model("product", productSchema);
module.exports = product;