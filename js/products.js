/* This script fetchs the products from our category API, we show it to the user formatting products.html 
We want to sort, and filter the products, using different arrays */

const ORDER_ASC_BY_PRICE = "Asc."
const ORDER_DESC_BY_PRICE = "Desc." 
const ORDER_BY_UNIT_SOLD = "Units"
const userSearch = document.getElementById("input-search");
let currentCriteria = "";
let CAT_URL = "";
let currentCategoryData = [];
let currentCategoryName = [];
let filteredCategoryData = [];
let maxCost = undefined;
let minCost = undefined;

// We want to storage the product id so we can redirect the user to the product-info
function setProdID(id) 
{
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}

// We set the three different sort criterias
function sortProducts(criteria, array)
{
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE)
    {
        result = array.sort(function(a, b) 
        {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }
    else if (criteria === ORDER_DESC_BY_PRICE)
    {
        result = array.sort(function(a, b) 
        {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }
    else if (criteria === ORDER_BY_UNIT_SOLD)
    {
        result = array.sort(function(a, b) 
        {
            let aUnits = parseInt(a.soldCount);
            let bUnits = parseInt(b.soldCount);

            if ( aUnits > bUnits ){ return -1; }
            if ( aUnits < bUnits ){ return 1; }
            return 0;
        });
    }
    return result;
}

/* We set the criteria for the sorting and show the products sorted, 
if it's already filtered by search to the new array, else to the original array */
function sortAndShowProducts(sortCriteria)
{
    currentCriteria = sortCriteria;
    array = sortProducts(currentCriteria, currentCategoryData);
    
    if (userSearch.value != "")
    {
        array = sortProducts(currentCriteria, filteredCategoryData);
        showProductsList(filteredCategoryData);
    }
    else
    {
        array = sortProducts(currentCriteria, currentCategoryData);
        showProductsList(currentCategoryData);
    }
}

// This function will set our category based on his ID
function setCat()
{
    let currentID = localStorage.getItem("catID");
    if (currentID != null)
    {
        CAT_URL = `https://japceibal.github.io/emercado-api/cats_products/${currentID}.json`; // This url has the products data from our API
    }
    else
    {
        window.location.href ="categories.html";
    }
}

// This functions iterates on every product and formats the html
function showProductsList(array)
{
    let htmlContentToAppend = "";

    for (i = 0; i < array.length; i++)
    {   
        let product = array[i];
        
        // This are the filter by price conditions
        if (((minCost == undefined) || (minCost != undefined && parseInt(product.cost) >= minCost)) &&
            ((maxCost == undefined) || (maxCost != undefined && parseInt(product.cost) <= maxCost))) 
        {
            // Formatting the html with bootstrap
            htmlContentToAppend += `
            <div onclick="setProdID(${product.id})" class="list-group-item list-group-item-action cursor-active">
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
    }

    let subContentToAppend = `Verás aquí todos los productos de la categoría ${currentCategoryName.catName}.`

    // Adding our html format to the products.html
    document.getElementById("category").innerHTML = subContentToAppend;
    document.getElementById("cat-data-container").innerHTML = htmlContentToAppend;
}

/* We set the conditions to filter by price, if it's already filtered by search it applies to the new array, 
else to the original array */
function filterByPrice()
{
    minCost = document.getElementById("range-filter-cost-min").value;
    maxCost = document.getElementById("range-filter-cost-max").value;

    if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0)
    {
        minCost = parseInt(minCost);
    }
    else
    {
        minCost = undefined;
    }

    if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0)
    {
        maxCost = parseInt(maxCost);
    }
    else
    {
        maxCost = undefined;
    }

    if (userSearch.value != "")
    {
        showProductsList(filteredCategoryData);
    }
    else
    {
        showProductsList(currentCategoryData);
    }
}

// This function clear every filter including the search one
function clearFilter()
{
    document.getElementById("range-filter-cost-min").value = "";
    document.getElementById("range-filter-cost-max").value = "";
    minCost = undefined;
    maxCost = undefined;

    userSearch.value = "";
    filteredCategoryData = [];
    showProductsList(currentCategoryData);
}

// The filter by search conditions
function productSearch()
{
    filteredCategoryData = currentCategoryData.filter(product => 
        `${product.name.toLowerCase()} ${product.description.toLowerCase()}`.includes(userSearch.value.toLowerCase()));   
}

// Fetching the products data and calling our functions
document.addEventListener('DOMContentLoaded', function()
{
    setCat(); //We set the category

    fetch(CAT_URL) // We fetch the API
    .then(response => response.json())  
    .then(data => 
    {
        currentCategoryData = data.products;
        currentCategoryName = data;

        showProductsList(currentCategoryData);  //Showing our products normally

        // Our buttons call our sort, filter and clear functions by click events
        document.getElementById("sort-desc").addEventListener("click", function(){
            sortAndShowProducts(ORDER_DESC_BY_PRICE);
        });

        document.getElementById("sort-asc").addEventListener("click", function(){
            sortAndShowProducts(ORDER_ASC_BY_PRICE);
        });

        document.getElementById("sort-by-unit").addEventListener("click", function(){
            sortAndShowProducts(ORDER_BY_UNIT_SOLD);
        });

        document.getElementById("range-filter-cost").addEventListener("click", filterByPrice);

        document.getElementById("clear-range-filter").addEventListener("click", clearFilter);

        // The input of our search bar shows a new array instead of the original on real time 
        document.getElementById("input-search").addEventListener("input", function()
            {   
                productSearch();
                showProductsList(filteredCategoryData);
            }
        );
    });   
});
