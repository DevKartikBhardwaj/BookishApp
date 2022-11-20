
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



///Js for sell


// const sellClicked = async () => {
//     await fetch("/Sell", {
//         headers: {
//             "Content-Type": "application/json",
//             "auth-token": localStorage.getItem('token')
//         }
//     })
// }

async function sellClicked() {
    await fetch("/Sell", {
        headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
        },
        redirect: 'follow'
    }).catch((e) => { console.log(e) })
}