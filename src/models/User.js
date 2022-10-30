const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    userPassword: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const user = mongoose.model("user", userSchema);
module.exports = user;