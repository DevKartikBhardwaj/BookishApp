
let loginForm = document.getElementById('loginForm');

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


loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        "userEmail": document.getElementById("email").value,
        "userPassword": document.getElementById("Password").value
    }
    try {
        await fetch('/login', {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        }).then((response) => { return response.json() }).then((data) => {
            if (data.success) {
                location.href = "http://localhost:3000/";
                localStorage.setItem('token', data.authtoken);
            }
            if (!data.success) {
                modal("Invalid Credentials", "blue");
            }
        })
    } catch (error) {
        console.log(error);
    }
})