const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
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
    productImage: {
        data: Buffer, //Buffer means data is in binary form
        type: Object
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const product = mongoose.model("product", productSchema);
module.exports = product;