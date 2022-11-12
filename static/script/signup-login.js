

async function handleSubmit() {
    const data = {
        "userName": document.getElementById("name").value,
        "userEmail": document.getElementById("email").value,
        "userPassword": document.getElementById("Password").value,
        "cPassword": document.getElementById("cPassword").value
    }
    console.log("function invoked");
    console.log(data);
    try {
        await fetch('/signup', {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        }).then((r) => { return r.json() }).then((data) => {
            console.log(data);
        })
    } catch (error) {
        console.log(error);
    }
}


