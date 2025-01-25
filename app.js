
require('dotenv').config();
const express = require("express");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const hbs = require("hbs");
const path = require("path");
const { body, validationResult } = require('express-validator');
const app = express();
const fetchuser = require("./middleware/fetchuser");
const port = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET_STRING;
const CLDNRY_CLOUD_NAME = process.env.CLDNRY_CLOUD_NAME;
const CLDNRY_API_KEY = process.env.CLDNRY_API_KEY;
const CLDNRY_API_SECRET = process.env.CLDNRY_API_SECRET;
let BaseUrl = "https://bookish-pbl6.onrender.com/";

const stripe = require('stripe')(process.env.STRIPE_SK);
app.use(cookieParser());
app.use(express.static('static'))
app.use(express.urlencoded({ extended: "true" }));
app.use(express.json());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/static/Templates/views'));
hbs.registerPartials(path.join(__dirname, '/static/Templates/partials'));


cloudinary.config({
    cloud_name: CLDNRY_CLOUD_NAME,
    api_key: CLDNRY_API_KEY,
    api_secret: CLDNRY_API_SECRET
});


require("./src/db/conn")

app.use(fileUpload({
    useTempFiles: true
}))

//importing all the models
const product = require("./src/models/product");
const user = require("./src/models/User");
const cart = require("./src/models/cart");
const { response, json } = require('express');
const { isObjectIdOrHexString } = require('mongoose');
const { findByIdAndUpdate } = require('./src/models/User');
const { findByIdAndDelete } = require('./src/models/cart');



app.get("/", async (req, res) => {
    let Engineering = await product.find({ productCategory: "Engineering" }, { productImage: 1 }).limit(7);
    let Medical = await product.find({ productCategory: "Medical" }, { productImage: 1 }).limit(7);
    let Law = await product.find({ productCategory: "Law" }, { productImage: 1 }).limit(7);
    let Ncert = await product.find({ productCategory: "NCERT" }, { productImage: 1 }).limit(7);
    let CExams = await product.find({ productCategory: "Competetive-Exams" }, { productImage: 1 }).limit(7);
    let Others = await product.find({ productCategory: "Others" }, { productImage: 1 }).limit(7);
    console.log(await product.find({}));
    res.status(200).render("Home", { Engineering, Medical, Law, Ncert, CExams, Others });

})

app.get("/sell", fetchuser, (req, res) => {
    res.status(200).render("Sell");
});


//Request 1:)POST request for submitting the product form
app.post("/sell", fetchuser, (req, res) => {
    try {
        const file = req.files.productImage;//stores photo inside file
        cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
            const newProduct = new product({
                user: ` ObjectId(${req.body.user})`,
                productTitle: req.body.productTitle,
                productMRP: req.body.productMRP,
                productCategory: req.body.productCategory,
                productDescription: req.body.productDescription,
                productImage: result.secure_url
            })
            newProduct.save((err) => {
                if (err) {
                    res.status(404).json({ success: false, error: err.message });
                }
            })
            res.json({ success: true });
        })
    } catch (err) {
        res.status(404).json({ success: false, error: err.message });
    }
})





// Req:"Get" User : login
app.get('/signup', (req, res) => {
    res.status(200).render("Signup");
})

//Req2:) "POST"  Creating user :signup

app.post("/signup",
    [body('userName').isLength({ min: 5 }), body('userEmail').isEmail(), body('userPassword').isLength({ min: 5 })],
    async (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { userEmail, userPassword, cPassword } = req.body;
            var userExist = await user.findOne({ userEmail });
            if (!userExist) {
                if (userPassword == cPassword) {
                    const passwordHash = bcrypt.hashSync(req.body.userPassword, saltRounds);
                    const newUser = new user({
                        userName: req.body.userName,
                        userEmail: req.body.userEmail,
                        userPassword: passwordHash,
                    })

                    const data = {
                        user: {
                            id: newUser._id
                        }
                    }

                    const authtoken = jwt.sign(data, JWT_SECRET);
                    res.cookie('jsonwebtok', encodeURIComponent(authtoken));
                    newUser.save();
                    res.json({ success: true });
                } else {
                    res.status(404).json({ success: false, cPassword: false });
                }
            }
            else {
                res.status(404).json({ success: false, user: true });
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        }
    })


// Req:"Get" User : login
app.get('/login', (req, res) => {
    res.status(200).render("login");
})


//Req 3:) 'POST' User:login

app.post('/login', [body('userEmail').isEmail(), body('userPassword').isLength({ min: 5 })], async (req, res) => {
    const { userEmail, userPassword } = req.body;
    var userExist = await user.findOne({ userEmail });
    let success = false;
    if (!userExist) {
        res.json({ success });
    }
    try {
        var passCompare = await bcrypt.compare(userPassword, userExist.userPassword);
        if (!passCompare) {
            res.json({ success });
        }
        const data = {
            user: {
                id: userExist.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.cookie('jsonwebtok', encodeURIComponent(authtoken), {
            expires: new Date(Date.now() + 900000000)//httpOnly: true
        });

        res.json({ success: true })
    } catch (error) {

    }
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


//dashboard related requests
app.get('/dashboard/userdetails', fetchuser, async (req, res) => {
    try {
        const userId = req.body.user;
        const userDetails = await user.find({ _id: userId }, { userName: 1, userEmail: 1 });
        res.status(200).render("Userdetails", { userDetails });
    } catch (error) {
        res.status(404).send(error.message);
    }
})
app.get('/dashboard/listedbooks', fetchuser, async (req, res) => {
    try {
        const userId = req.body.user;
        const listedProducts = await product.find({ user: ` ObjectId(${userId})` }, { productTitle: 1, productCategory: 1, productMRP: 1, productImage: 1 });
        res.status(200).render("listedbooks", { listedProducts });
    } catch (error) {
        res.status(404).send(error.message);
    }
})


//Single product page
app.get("/product/:id", async (req, res) => {
    try {
        let productId = req.params.id;
        let result = await product.find({ _id: productId });
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(404).send("404 : something went wrong");
    }
})


app.get("/products", async (req, res) => {
    try {
        let query = req.query.category;
        let productName = req.query.title;
        if (query) {
            let filteredProducts = await product.find({ productCategory: `${query}` });
            for (let i = 0; i < filteredProducts.length; i++) {
                filteredProducts[i].discountedPrice = Math.round(filteredProducts[i].productMRP * 0.8);
            }
            res.status(200).render("productPage", { filteredProducts });
        } else if (productName) {
            let filteredProducts = await product.find({ $text: { $search: productName } });

            if (filteredProducts.length == 0) {
                let notFound = [{ "title": "Not Found" }];
                res.status(200).render("productPage", { notFound });
            } else {
                for (let i = 0; i < filteredProducts.length; i++) {
                    filteredProducts[i].discountedPrice = Math.round(filteredProducts[i].productMRP * 0.8);
                }
                res.status(200).render("productPage", { filteredProducts });
            }
        }
        else {
            let allProducts = await product.find({});
            for (let i = 0; i < allProducts.length; i++) {
                allProducts[i].discountedPrice = Math.round(allProducts[i].productMRP * 0.8);
            }

            res.status(200).render("productPage", { allProducts });
        }
    } catch (err) {
        res.status(404).send(err);
    }
})


// ********************************************************************************************************************************
// ****************************************CART API's******************************************************************************
// ********************************************************************************************************************************

//saving cart item in database
app.get("/cart/:id", fetchuser, async (req, res) => {
    try {
        let cartExist = await cart.find({ userId: req.body.user, productId: req.params.id });

        if (!cartExist[0]) {
            let newCartItem = new cart({
                userId: req.body.user,
                productId: req.params.id
            });

            newCartItem.save().then(() => {
                res.status(200).json({ success: true });

            }).catch((err) => {
                res.status(404).json({ error: err.message });
            })
        } else {
            let currentCart = await cart.find({ userId: req.body.user, productId: req.params.id });
            let currentCartId = (currentCart[0]._id).toString();
            await cart.findByIdAndUpdate(currentCartId, { qty: currentCart[0].qty + 1 }, function (err, docs) {
                if (err) {
                    console.log(err.message);
                }
            }).clone();
            res.status(200).send({ success: true });
        }


    } catch (error) {
        res.status(500).send(error.message);
    }
})

//deleting cartitem
app.delete('/deleteCart/:id', async (req, res) => {
    await cart.findByIdAndDelete(req.params.id, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            res.status(200).json({ success: true });
        }
    }).clone()
})

//fetch all cart items

app.get('/cart', fetchuser, async (req, res) => {
    let cartItems = await cart.find({ userId: req.body.user });
    let arr = [];
    let totalPrice = 0;
    for (i = 0; i < cartItems.length; i++) {
        const newObj = {};
        let productObj = await product.find({ _id: cartItems[i].productId });
        newObj.productId = cartItems[i].productId;
        newObj.productTitle = productObj[0].productTitle;
        newObj.productImage = productObj[0].productImage;
        newObj.productMRP = Math.round((productObj[0].productMRP / 100) * 80) * cartItems[i].qty;
        totalPrice += Math.round((productObj[0].productMRP / 100) * 80) * cartItems[i].qty;
        newObj.productCategory = productObj[0].productCategory;
        newObj.qty = cartItems[i].qty;
        newObj.cartItemId = (cartItems[i]._id).toString();
        arr.push(newObj);
    }



    let shippingCharge = Math.round((totalPrice * 2) / 100);
    let gross = totalPrice + shippingCharge;
    let arr2 = [{ totalPrice, shippingCharge, gross }];
    res.status(200).render('Cart', { arr, arr2 });
})




// ********************************************************************************************************************************
// ****************************************User Dashboard API's******************************************************************************
// ********************************************************************************************************************************

//api for productDeletion
app.delete('/dashboard/listedbooks/delete/:id', fetchuser, async (req, res) => {
    try {
        await product.findByIdAndDelete(req.params.id, async function (err, docs) {
            if (err) {
                res.status(404).send("Something Went Wrong!!");
            } else {

                //DO SOMETHING HERE FOR DELETING ITEMS FROM CART AS WELL
                let val = await cart.deleteOne({ productId: req.params.id });
                if (val.acknowledged) {
                    return res.status(200).json({ done: true });
                }
                res.status(404).send("Something Went Wrong!!");
            }
        }).clone();

    } catch (error) {
        res.status(404).send("Something Went Wrong!!");
    }

})



// *******************************************************************************************************************************
// *******************************************************************************************************************************
// *******************************************************************************************************************************
// **************************************Update Listed Books**********************************************************************
// *******************************************************************************************************************************
// *******************************************************************************************************************************

app.put('/dashboard/listedbooks/update/:id', fetchuser, async (req, res) => {

    const productDetails = await product.findById(req.params.id);

    if (productDetails.user != ` ObjectId(${req.body.user})`) {
        return res.status(401).send("Not Authorized");
    }


    const newObj = {};
    const { productTitle, productMRP, productCategory, productDescription } = req.body;


    if (productTitle) { newObj.productTitle = productTitle }
    if (productMRP) { newObj.productMRP = productMRP }
    if (productCategory) { newObj.productCategory = productCategory }
    if (productDescription) { newObj.productDescription = productDescription }


    await product.findByIdAndUpdate(req.params.id, { $set: newObj }, { new: true });
    res.status(200).json({ success: "true" });
})



// *****************************************************************************************************************************
// *********************************************** STRIPE RELATED API's  *******************************************************
// *****************************************************************************************************************************
app.post('/create-checkout-session', async (req, res) => {
    let productsArray = [];
    let arr = req.body.productsArray;
    for (let i = 0; i < arr.length; i++) {
        productsArray[i] = {
            price_data: {
                currency: 'inr',
                product_data: {
                    name: arr[i].productTitle,
                    images: [arr[i].productImage],
                    description: arr[i].productDescription,
                    metadata: {
                        id: arr[i].cartItemId
                    }
                },
                unit_amount: arr[i].productMRP * 100,
            },
            quantity: arr[i].qty,
        }
    }


    const session = await stripe.checkout.sessions.create({
        line_items: productsArray,
        shipping_address_collection: { allowed_countries: ['IN'] },
        phone_number_collection: { enabled: true },
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: req.body.shippingCharge * 100,
                        currency: 'inr',
                    },
                    display_name: 'DelhiVery',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 2,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 5,
                        },
                    },
                },
            },
        ],
        mode: 'payment',
        success_url: `${BaseUrl}/checkout-Success`,
        cancel_url: `${BaseUrl}/checkout-Failed`,
    });
    res.status(303).json({ url: session.url });
});


app.get('/checkout-Success', (req, res) => {
    res.status(200).render('CheckoutSuccess');
})
app.get('/checkout-Failed', (req, res) => {
    res.status(200).render('CheckoutFailed');
})

// app.get('*', (req, res) => {
//     res.status(404).send("404 not found");
// })


// ***get checkout item details
app.get('/checkout-items', fetchuser, async (req, res) => {
    let cartItems = await cart.find({ userId: req.body.user });
    if (cartItems) {
        const userId = req.body.user;
        let arr = [];
        let totalPrice = 0;
        for (i = 0; i < cartItems.length; i++) {
            const newObj = {};
            let productObj = await product.find({ _id: cartItems[i].productId });
            newObj.productTitle = productObj[0].productTitle;
            newObj.productImage = productObj[0].productImage;
            newObj.productMRP = Math.round((productObj[0].productMRP / 100) * 80);
            totalPrice += Math.round((productObj[0].productMRP / 100) * 80) * cartItems[i].qty;
            newObj.productCategory = productObj[0].productCategory;
            newObj.qty = cartItems[i].qty;
            newObj.cartItemId = (cartItems[i]._id).toString();
            arr.push(newObj);
        }


        let shippingCharge = Math.round((totalPrice * 2) / 100);
        return res.status(200).json({ arr, userId, shippingCharge });
    }
    res.status(404).send("failed");
})
app.listen(port, () => {
    console.log(`app is running at ${port}`);
})





