
const myFunc = () => {
    console.log("loading");
    const loader = document.getElementById("loader");
    loader.style.display = "block";


    fetch("http://localhost:3000/sell", {
        method: "get", headers: {
            "content-type": "application/json"
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
    })

}


