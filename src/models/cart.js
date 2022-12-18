const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: String,
    productId: String,
    qty: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

const cart = mongoose.model('cart', cartSchema);

module.exports = cart;