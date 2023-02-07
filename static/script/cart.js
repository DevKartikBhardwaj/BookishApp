const BaseUrl = "http://localhost:3000";

const handleCartRemove = (arg) => {
    fetch(`http://localhost:3000/deleteCart/${arg}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.success) {
            Swal.fire(
                'Removed SuccessFully',
                '',
                'success'
            ).then(() => {
                location.href = 'http://localhost:3000/cart';
            })
        }
    })
}



// *****In this i used nested fetch requests

const handleCheckout = () => {
    fetch('http://localhost:3000/checkout-items', {
        method: 'GET',
        headers: {
            "content-type": "application/json"
        }
    }).then((response) => {
        return response.json();
    }).then((Data) => {
        const user = {
            productsArray: Data.arr,
            userId: Data.userId,
            shippingCharge: Data.shippingCharge
        }

        //request for creating checkout sessions
        return fetch('http://localhost:3000/create-checkout-session', {
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

