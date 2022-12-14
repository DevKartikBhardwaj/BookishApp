const express = require("express");
const app = express();
require('dotenv').config();
const user = require("../src/models/User");

const cookieParser = require("cookie-parser");
var jwt = require('jsonwebtoken');

app.use(cookieParser());
const JWT_SECRET = process.env.JWT_SECRET_STRING;

const fetchuser = async (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    // const token = req.header('auth-token');
    const token = req.cookies.jsonwebtok;

    if (!token) {
        res.status(401).redirect('/login');
    }
    else {
        // res.send("token exist");
        try {
            const token = req.cookies.jsonwebtok;
            const data = jwt.verify(token, JWT_SECRET);
            const userVal = await user.findOne({ _id: data.user.id });
            if (!userVal) {
                res.status(401).redirect('/login');
            } else {
                req.body.user = data.user.id;
                next();
            }
        } catch (error) {
            res.status(401).redirect('/login');
        }
    }
}


module.exports = fetchuser;