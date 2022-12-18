const handleCartRemove = (arg) => {
    fetch(`http://localhost:3000/deleteCart/${arg}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.success) {
            Swal.fire(
                'Removed SuccessFully',
                '',
                'success'
            ).then(() => {
                location.href = 'http://localhost:3000/cart';
            })
        }
    })
}