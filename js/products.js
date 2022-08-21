// This script fetchs the products from our API, we show it to the user formatting products.html 

// This url has the products data from our API
const CAT_CAR_URL = "https://japceibal.github.io/emercado-api/cats_products/101.json"
let catCarData = [];

// This functions iterates on every product and formats the html
function showProductsList()
{
    let htmlContentToAppend = "";

    for (i = 0; i < catCarData.length; i++)
    {   
        let product = catCarData[i];
        
        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action cursor-active">
            <div class="row">
                <div class="col-3">
                    <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost} </h4>
                        <small class="text-muted">${product.soldCount} vendidos</small>
                    </div>
                    <p class="mb-1">${product.description}</p>
                </div>
            </div>
        </div>
        `         
    }

    // Adding our html format to the products.html div id 
    document.getElementById("cat-data-container").innerHTML = htmlContentToAppend;
}

// Fetching the products data and calling our function
document.addEventListener('DOMContentLoaded', function()
{
    fetch(CAT_CAR_URL) // We fetch the API
    .then(response => response.json())  
    .then(data => 
    {
        catCarData = data.products;
        showProductsList();  //Calling our function
    })   
});
