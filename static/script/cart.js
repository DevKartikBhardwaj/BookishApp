let BaseUrl = "https://bookish-8avz.onrender.com";

const handleCartRemove = (arg) => {
    fetch(`${BaseUrl}/deleteCart/${arg}`, {
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
                location.href = `${BaseUrl}/cart`;
            })
        }
    })
}



// *****In this i used nested fetch requests

const handleCheckout = () => {
    loader();
    fetch(`${BaseUrl}/checkout-items`, {
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


const loader = () => {
    const loader = document.getElementById("loader");
    loader.style.display = "block";
}