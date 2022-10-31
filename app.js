require('dotenv').config();
const express = require("express");
const multer = require('multer')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
// const upload = multer({ dest: 'uploads/' })
const hbs = require("hbs");
const path = require("path");
const { body, validationResult } = require('express-validator');
const app = express();
const fetchuser = require("./middleware/fetchuser");
const JWT_SECRET = process.env.JWT_SECRET_STRING;

const port = process.env.PORT;



app.use(express.static('static'))
app.use(express.urlencoded({ extended: "true" }));
app.use(express.json());

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/static/Templates/views'));
hbs.registerPartials(path.join(__dirname, '/static/Templates/partials'));




require("./src/db/conn")

//omporting all the models
const product = require("./src/models/product");
const user = require("./src/models/User");

//configuring disk storage for multer
const Storage = multer.diskStorage({
    destination: 'upload',
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: Storage }).single('testImage');


app.get("/", (req, res) => {
    res.status(200).render("Home");
})
app.get("/sell", (req, res) => {
    res.status(200).render("Sell");
})

//Request 1:)POST request for submitting the product form
app.post("/sell", fetchuser, (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        } else {

            var newProduct = new product({
                productTitle: req.body.productTitle,
                productMRP: req.body.productMRP,
                productCategory: req.body.productCategory,
                productDescription: req.body.productDescription,
                user: req.user.id,
                productImage: {
                    data: req.file.path,
                    contentType: 'image/png'
                }
            });

            newProduct.save((err) => {
                if (err) {
                    return console.error(err.msg);
                }
            })
            res.json({ success: true, data: res.body });

        }
    })

})

//Req2:) "POST"  Creating user :signup

app.post("/user/signup",
    [body('userName').isLength({ min: 5 }), body('userEmail').isEmail(), body('userPassword').isLength({ min: 5 })],
    async (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const passwordHash = bcrypt.hashSync(req.body.userPassword, saltRounds);
            const newUser = new user({
                userName: req.body.userName,
                userEmail: req.body.userEmail,
                userPassword: passwordHash,
            })

            const data = {
                user: {
                    id: newUser.id
                }
            }

            const authtoken = jwt.sign(data, JWT_SECRET);

            newUser.save();

            res.json({ success: true, authtoken })
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

//Req 3:) 'POST' User:login

app.post('/user/login', [body('userEmail').isEmail(), body('userPassword').isLength({ min: 5 })], async (req, res) => {
    const { userEmail, userPassword } = req.body;
    var userExist = await user.findOne({ userEmail });

    if (!userExist) {
        res.status(404).send("Enter valid credentials");
    }
    var passCompare = await bcrypt.compare(userPassword, userExist.userPassword);
    if (!passCompare) {
        res.status(404).send("Enter valid credentials");
    }
    const data = {
        user: {
            id: userExist.id
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);


    // res.json(user)
    res.json({ success: true, authtoken })


})


//request 4:) 'GET' fetching product details
app.get('/fetch', fetchuser, async (req, res) => {
    try {

        const data = await product.find({ user: req.user.id });
        res.status(200).json(data);
    } catch (error) {
        res.status(404).send(error.message);
    }
})


app.listen(port, () => {
    console.log(`app is running at http://localhost:${port}`);
})