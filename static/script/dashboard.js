let BaseUrl = "https://bookish-8avz.onrender.com";

const deleteButtonClick = (id) => {
    fetch(`${BaseUrl}/dashboard/listedbooks/delete/${id}`, {
        method: "DELETE"
    }).then((res) => {
        return res.json();
    }).then((data) => {
        if (data.done) {
            Swal.fire(
                'Success!',
                'listed product deleted successfully!',
                'success'
            ).then(() => {
                location.href = `${BaseUrl}/dashboard/listedbooks/`;
            })
        }
    })

}

let productid = "";
let updatePage = document.getElementById("updateModal");
const editButtonClick = async (id) => {
    productid = id;
    updatePage.style.visibility = "visible";
    updatePage.style.animation = "upsideDown 1.5s ease-in 0s 1";

}



const updateBtn = () => {
    const data = {
        productTitle: document.getElementById('productTitle').value,
        productMRP: document.getElementById('productMRP').value,
        productCategory: document.getElementById('productCategory').value,
        productDescription: document.getElementById('productDescription').value
    }
    if (productid != "") {
        fetch(`${BaseUrl}/dashboard/listedbooks/update/${productid}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then((res) => {
            return res.json();
        }).then((data) => {
            if (data.success) {
                location.href = `${BaseUrl}/dashboard/listedbooks`;
            }
        }).catch((err) => {
            console.log(err);
        })
    }
}



