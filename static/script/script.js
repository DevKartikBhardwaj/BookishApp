const BaseUrl = "https://bookish-8avz.onrender.com";
let banner = document.getElementsByClassName("banner-img");
let dots = document.getElementsByClassName("banner-navigation");
Array.from(banner).forEach((element) => {
    let sum = 0;
    function func() {
        sum += 100;
        return sum;
    }

    setInterval(() => {
        func();
        if (sum >= 400) {
            sum = 0;
            element.style.transform = `translate(-${sum}%)`;
        }
        else {
            element.style.transform = `translate(-${sum}%)`;
        }
    }, 8000);
})



//js for custom color of banner navigation


let count = 1;
document.getElementById(`dot-${count}`).style.backgroundColor = "white";
setInterval(() => {
    count++;
    if (count == 4) {
        document.getElementById(`dot-${count}`).style.backgroundColor = "white";
        document.getElementById(`dot-${count - 1}`).style.backgroundColor = "black";
        count = 0;
    }
    else {
        document.getElementById(`dot-4`).style.backgroundColor = "black";
        if (count == 1) {
            document.getElementById(`dot-${count}`).style.backgroundColor = "white";
        }
        else {
            document.getElementById(`dot-${count}`).style.backgroundColor = "white";
            document.getElementById(`dot-${count - 1}`).style.backgroundColor = "black";
        }

    }
}, 8000)



function setBg1() {
    let dot1 = document.getElementById("dot-1");
    dot1.style.backgroundColor = "green";
    Array.from(banner).forEach((element) => {
        element.style.transform = `translate(0%)`;
    })
}
function setBg2() {
    let dot2 = document.getElementById("dot-2");
    dot2.style.backgroundColor = "green";
    Array.from(banner).forEach((element) => {
        element.style.transform = `translate(-100%)`;
    })
    sum = 100;
}
function setBg3() {
    let dot3 = document.getElementById("dot-3");
    dot3.style.backgroundColor = "green";
    Array.from(banner).forEach((element) => {
        element.style.transform = `translate(-200%)`;
    })
    sum = 200;
}
function setBg4() {
    let dot4 = document.getElementById("dot-4");
    dot4.style.backgroundColor = "green";
    Array.from(banner).forEach((element) => {
        element.style.transform = `translate(-300%)`;
    })
    sum = 300;
}

var dot = document.getElementsByClassName('dot');
Array.from(dot).forEach((element) => {
    document.addEventListener('click', function (event) {
        var isClickInside = element.contains(event.target);
        if (!isClickInside) {
            element.style.backgroundColor = "black";

        }
    });
})


// //toggling login and logout btns
// let scrollList = document.getElementById("scrollListPack");
// if (document.cookie.indexOf("jsonwebtok") == 0) {

//     scrollList.innerHTML = `  <li id="logoutBtn"><a class="sub-menu-item" id="sub-menu-item1"><i
// class="fa-solid fa-right-to-bracket list-icon" style="margin-right: 0.2em;"></i>
// Logout</a>
// </li>

// <li><a href="/dashboard/userdetails" class="sub-menu-item" id="sub-menu-item3"><i
// class="fa-solid fa-user list-icon"></i>Dashboard</a>
// </li>`;
// }
// else {
//     scrollList.innerHTML = `  <li ><a  href="/login" class="sub-menu-item" id="sub-menu-item1"><i
//     class="fa-solid fa-right-to-bracket list-icon" style="margin-right: 0.2em;"></i>
// login</a>
// </li>
// <li><a href="/signup" class="sub-menu-item" id="sub-menu-item2"><i
//     class="fa-solid fa-user-plus list-icon"
//     style="margin-right: 0.2em;"></i>Signup</a></li>
// <li><a href="/dashboard/userdetails" class="sub-menu-item" id="sub-menu-item3"><i
//     class="fa-solid fa-user list-icon"></i>Dashboard</a>
// </li>`;
// }

// let logoutBtn = document.getElementById("logoutBtn");
// document.cookie.indexOf("jsonwebtok") == 0 && logoutBtn.addEventListener("click", () => {
//     document.cookie.replace(
//         /(?<=^|;).+?(?=\=|;|$)/g,
//         name => location.hostname
//             .split(/\.(?=[^\.]+\.)/)
//             .reduceRight((acc, val, i, arr) => i ? arr[i] = '.' + val + acc : (arr[i] = '', arr), '')
//             .map(domain => document.cookie = `${name}=;max-age=0;path=/;domain=${domain}`)
//     );
//     location.href = "http://localhost:3000/"
// })

const singleProductPage = document.getElementById("singleProductPage");

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
        <button id="buyBtn" class="primary-btn" onclick="buyBtnHandler('${obj._id}')">Buy</button>
        <button id="addToCartBtn" class="primary-btn" onclick="cartClickHandler('${obj._id}')" >Add To cart</button>
    </div>`;
    }).catch(() => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong'
        })
    })


}


const handleCloseBtn = () => {
    singleProductPage.style.display = "none";
}



const cartClickHandler = (arg) => {
    fetch(`${BaseUrl}/cart/${arg}`).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.success) {
            Swal.fire(
                'Successs!',
                'Product added to the cart!',
                'success',
            )
        }
    }).catch((err) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Unable to add to the cart!'
        })
    })

}

//search button click handler

let searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", (e) => {
    console.log("clicked");
    e.preventDefault();
    let s = document.getElementById("search-box");
    location.href = `${BaseUrl}/products?title=${s.value}`;
})



