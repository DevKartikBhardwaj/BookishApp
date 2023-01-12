const BaseUrl = "http://localhost:3000";
const func = async (arg) => {
    await fetch(`${BaseUrl}/product/${arg}`).then((response) => {
        return response.json();
    }).then((data) => {
        let obj = data[0];
        let discountedPrice = Math.round((obj.productMRP / 100) * 80);
        singleProductPage.style.display = "flex";
        singleProductPage.innerHTML = `<div id="leftpart">
        <img src="${obj.productImage}" height="350px" alt="product img">
    </div>
    <div id="rightpart">
        <i class="fa-solid fa-xmark" onclick="handleCloseBtn()"></i>
        <h2 id="productTitle"> <span>Product Title : </span> ${obj.productTitle}</h2>
        <h4 id="productCategory"> <span>Product Category : </span>${obj.productCategory}</h4>
        <p id="productDescription"><span>About Product : </span>${obj.productDescription} </p>
        <h4 id="actualPrice"><span>Actual Price : </span>Rs. ${obj.productMRP}</h4>
        <h4 id="discountedPrice"><span>Discounted Price : </span>Rs. ${discountedPrice}</h4>
        <button id="buyBtn" class="primary-btn">Buy</button>
        <button id="addToCartBtn" class="primary-btn" >Add To cart</button>
    </div>`;
    })
}


const handleCloseBtn = () => {
    singleProductPage.style.display = "none";
}


const cartClickHandler = (arg) => {
    fetch(`http://localhost:3000/cart/${arg}`).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.success) {
            Swal.fire(
                'Good job!',
                'Product added to the cart!',
                'success'
            )
        }
    }).catch((err) => {
        console.log(err);
    })
}

//search button click handler

let searchBtn = document.getElementById("search-btn");
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let s = document.getElementById("search-box");
    location.href = `${BaseUrl}/products?title=${s.value}`;
})