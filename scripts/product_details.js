"use strict"

window.onload = () => {
    const urlParams = new URLSearchParams(location.search);

    // we can access the individual params by calling .get on the variable that holds the
    // and requesting by name

    if (urlParams.has("productId")) {
        // if we have a product id, display it's details
        displayProductDetails(urlParams.get("productId"));

    } else {
        // let them know we didn't have a valid product id and send them back to home page
        alert("no valid product id");
        window.location.href = "./index.html";
    }
}

async function displayProductDetails(productId) {
    let response = await fetch(`http://localhost:8081/api/products/${productId}`, {});
    let data = await response.json();

    for (const property in data) {
        let dataToShow = data[`${property}`]
        if (property === "unitPrice") {
            dataToShow = `$${Number(dataToShow).toFixed(2)}`;
        }
        document.querySelector(`#${property}Section`).innerHTML = `<b>${property}:</b> ` + dataToShow;
    }
}