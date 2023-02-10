//BuyButton Handler
// let BaseUrl = "https://bookish-8avz.onrender.com";
const buyBtnHandler = async (arg) => {
    fetch(`${BaseUrl}/product/${arg}`).then((response) => {
        return response.json();
    }).then((Data) => {
        Data[0].cartItemId = Data[0]._id;
        Data[0].qty = 1;
        for (let i = 0; i < Data.length; i++) {
            Data[i].productMRP = Math.round(Data[i].productMRP * 0.8);
        }
        const user = {
            productsArray: Data,
            userId: Data[0].user,
            shippingCharge: Math.round(Data[0].productMRP * 0.02)
        }

        //request for creating checkout sessions
        return fetch(`${BaseUrl}/create-checkout-session`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(user)
        })
    }).then((res) => {
        return res.json();
    }).then((data) => {
        location.href = data.url;
    }).catch((err) => {
        console.log(err);

    })
}