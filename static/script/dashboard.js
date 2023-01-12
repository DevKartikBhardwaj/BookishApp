const BaseUrl = "http://localhost:3000";

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