require('dotenv').config();
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const app = express();
const port = process.env.PORT;



app.use(express.static('static'))
app.use(express.urlencoded({ extended: "true" }));
app.use(express.json());

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/static/Templates/views'));
hbs.registerPartials(path.join(__dirname, '/static/Templates/partials'));

require("./src/db/conn")

const product = require("./src/models/product");


app.get("/", (req, res) => {
    res.status(200).render("Home");
})
app.get("/sell", (req, res) => {
    res.status(200).render("Sell");
})

app.post("/sell", (req, res) => {
    // console.log(req.body);
    try {
        var newProduct = new product(req.body);
        newProduct.save((err) => {
            if (err) {
                return console.error(err);
            }
        })
        res.json({ success: true, data: res.body });
    } catch (err) {
        console.log(err);
    }
})

app.listen(port, () => {
    console.log(`app is running at http://localhost:${port}`);
})