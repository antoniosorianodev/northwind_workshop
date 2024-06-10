"use strict"

window.onload = () => {
    const tbody = document.querySelector("#productTableBody");
    const theDropdown = document.querySelector("#productSearchDDL");
    const theOtherDropdown = document.querySelector("#categoryDDL");

    // this populates categoryDDL, only needs to run once
    displayCategories();

    theDropdown.addEventListener("change", (event) => generateTableBody(event, tbody));
    theOtherDropdown.addEventListener("change", (event) => generateTableBody(event, tbody));
}

async function generateTableBody(event, tbody) {
    try {
        const dropdown = event.target;
        const dropdownLength = dropdown.length;
        const dropdownValue = dropdown.value;

        if (dropdownValue) {
            // has to be let since it might change later
            let url = "http://localhost:8081/api/products/";

            // this would only run when the categoryDDL is passed in, since only that has more than 3 options
            if (dropdownLength > 3) {
                url += `bycategory/${dropdownValue}`;
            }

            const response = await fetch(url, {});
            const data = await response.json();

            // real funny guys, making me have to dig through documentation
            // for sorting special characters
            data.sort((a, b) => a.productName.localeCompare(b.productName));

            displayProducts(tbody, data);
        }

        // do all the hide/show logic after the work's been done
        hideAndSeek(dropdown, dropdownLength, dropdownValue);
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
        createHyperlink(newRow, product);
    });
}

async function displayCategories() {
    try {
        const dropdown = document.querySelector("#categoryDDL");
        const response = await fetch("http://localhost:8081/api/categories", {});
        const data = await response.json();

        const icons = ["🍺", "🧂", "🍰", "🐮", "🥖", "🥩", "🥦", "🦞"];

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "-- Select a Category --";

        dropdown.appendChild(defaultOption);

        // used idx to leverage the looping to apply the correct emoji
        data.forEach((category, idx) => {
            let newOption = document.createElement("option");
            newOption.value = category.categoryId;
            newOption.textContent = `${icons[idx]} ${category.name}`;

            dropdown.appendChild(newOption);
        });
    } catch (error) {
        console.log(error);
    }
}

function createCell(row, product, key) {
    const newCell = row.insertCell();
    const productProperty = product[`${key}`];

    if (key === "unitPrice") {
        newCell.innerHTML = `$${Number(productProperty).toFixed(2)}`;
    } else {
        newCell.innerHTML = productProperty;
    }
}

function createHyperlink(row, product) {
    const newCell = row.insertCell();
    newCell.innerHTML = `<a href="./product_details.html?productId=${product.productId}">Show Details</a>`;
}

function hideAndSeek(dropdown, length, value) {
    const table = document.querySelector("#productTable");
    let categoryDDL;

    // logic to try to reduce dom calls by passing in a dropdown
    if (length > 3) {
        categoryDDL = dropdown;
    } else {
        categoryDDL = document.querySelector("#categoryDDL");
    }

    // if value exists (i.e, not "")...
    if (value) {
        // QUESTION: is .classList.add("d-none") or .style.display = "none" better?

        // if the dropdown is categoryDDL
        if (length > 3) {
            table.classList.remove("d-none");

            // if the dropdown is productSearchDDL
        } else {
            switch (value) {
                case "all":
                    categoryDDL.classList.add("d-none");
                    table.classList.remove("d-none");
                    break;
                case "category":
                    table.classList.add("d-none");

                    // when I show the categoryDDL again, don't remember the previously selected option
                    categoryDDL.selectedIndex = 0;
                    categoryDDL.classList.remove("d-none");
                    break;
            }
        }
    } else {
        // if dropdown.value === "", ALWAYS HIDE THE TABLE
        table.classList.add("d-none");

        // ONLY if the productSearchDDL value is "", ALSO hide the categoryDDL
        if (length <= 3) {
            categoryDDL.classList.add("d-none");
        }
    }
}