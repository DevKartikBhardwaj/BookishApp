const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new Schema({
    user: {
        type: String
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
        type: String
    }
}, { timestamps: true })

const product = mongoose.model("product", productSchema);
module.exports = product;