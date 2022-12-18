const Base_URL = "http://localhost:3000";
const sellerForm = document.querySelector("#sellers-form");
const submitBtn = document.querySelector("#product-submit-btn");
const array = document.getElementsByClassName("form-input-data");
submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    array[0].value && array[1].value && array[2].value && array[3].value ? loader() : swal("Sorry!", "Unable to list your product! please fill all inputs", "error");
})



const loader = () => {
    const loader = document.getElementById("loader");
    loader.style.display = "block";
    fetchedFormData()

}



const fetchedFormData = () => {
    const formData = new FormData();

    // let array = document.getElementsByClassName("form-input-data");
    const fileField = document.querySelector('input[type="file"]');
    formData.append('productTitle', array[0].value);
    formData.append('productMRP', array[1].value);
    formData.append('productCategory', array[2].value);
    formData.append('productDescription', array[3].value);
    formData.append('productImage', fileField.files[0]);

    fetch(`${Base_URL}/sell`, {
        method: 'POST',
        body: formData
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);

        if (data.success == true) {
            swal("Success!", "Product Listing Successfull", "success").then((value) => {
                if (value) {
                    location.href = `${Base_URL}/`;
                } else {
                    location.href = `${Base_URL}/`;
                }
            });
        }
        else {
            const loader = document.getElementById("loader");
            loader.style.display = "none";
            swal("Sorry!", "Unable to list your product", "error");

        }

    }).catch((err) => {
        console.log(err);
    })
}



