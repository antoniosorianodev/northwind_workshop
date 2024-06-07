"use strict"

window.onload = () => {
    const tbody = document.querySelector("#productTableBody");
    const theDropdown = document.querySelector("#productSearchDDL");

    theDropdown.addEventListener("change", (event) => generateTableBody(event, tbody, "http://localhost:8081/api/products"));
}

async function generateTableBody(event, tbody, url) {
    try {
        let response = await fetch(url, {});
        let data = await response.json();
        let dropdown = event.target;

        if (dropdown.value) {
            displayProducts(tbody, data);
        } else {
            document.querySelector("#productTable").classList.add("d-none");
        }
    } catch (error) {
        console.log(error);
    }
}

function displayProducts(tbody, products) {
    tbody.innerHTML = "";
    products.forEach((product) => {
        const newRow = tbody.insertRow();
        createCell(newRow, product, "productId");
        createCell(newRow, product, "productName");
        createCell(newRow, product, "unitPrice");
    });
    document.querySelector("#productTable").classList.remove("d-none");
}

function createCell(row, product, key) {
    const newCell = row.insertCell();
    const productProperty = product[`${key}`];

    if (key === "unitPrice") {
        newCell.innerHTML = Number(productProperty).toFixed(2);
    } else {
        newCell.innerHTML = productProperty;
    }
}

function createHyperlink(row, product) {
    const newCell = row.insertCell();
    newCell.innerHTML = `<a href="http://localhost:8081/api/products/"`
}