let BaseUrl = "https://bookish-8avz.onrender.com";
let signupForm = document.getElementById('signupForm');

function modal(errorInfo, bgColour) {
    let infoSec = document.getElementById("information");
    let modalSec = document.getElementById("modalSec");
    modalSec.style = `visibility:visible; background-color:${bgColour};`;
    infoSec.innerHTML = `Error: ${errorInfo}`;
    setTimeout(() => {
        modalSec.style = "visibility:hidden; background-color:none;";
        infoSec.innerHTML = "";
    }, 1500);
}


signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        "userName": document.getElementById("name").value,
        "userEmail": document.getElementById("email").value,
        "userPassword": document.getElementById("Password").value,
        "cPassword": document.getElementById("cPassword").value
    }
    try {
        await fetch('/signup', {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        }).then((response) => { return response.json() }).then((data) => {
            if (data.success) {
                location.href = `${BaseUrl}/login`;
                // localStorage.setItem('token', data.authtoken);
            }
            if (!data.success && !data.cPassword) {
                modal("Please! Confirm your password", "red");
            }
            if (!data.success && data.user) {
                modal("User Already Exist", "red");
            }
        })
    } catch (error) {
        console.log(error);
    }
})



