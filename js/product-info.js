/* This script fetch the product from our products API, we show it to the user formatting product-info.html 
We want to show its info, the comments and make new comments (rate it with an opinion) */

const formSubmit = document.getElementById("commentForm");
const currentID = localStorage.getItem("prodID");
let PROD_URL = "";
let COMMENTS_URL = "";
let currentProductInfo = [];
let currentProductComments = [];

//From the ID on the localStorage we get the url we want to fetch
function setProd()
{
    if (currentID != null)
    {
        PROD_URL = `https://japceibal.github.io/emercado-api/products/${currentID}.json`; // This url has the product info data from our API
        COMMENTS_URL = `https://japceibal.github.io/emercado-api/products_comments/${currentID}.json`; // This url has the product comments from our API
    }
    else
    {
        window.location.href ="products.html";
    }
}

// We want to show the products info
function showProductInfo()
{
    let htmlContentToAppend = "";
    let htmlTitleToAppend = "";
    let product = currentProductInfo;

    htmlTitleToAppend += `${product.name}`
    document.getElementById("product-name").innerHTML = htmlTitleToAppend;
        
    // Formatting the html with bootstrap
    htmlContentToAppend += `
        <div class="list-group-item d-flex w-100 justify-content-between">         
        `

    for (i = 0; i < product.images.length; i++)
    {
        htmlContentToAppend += `
             <div class="col-3">
                    <img src="${product.images[i]}" alt="${product.description}" class="img-thumbnail">
            </div>
        `
    }

    htmlContentToAppend += `
        </div>
        <div class="list-group-item">
            <div class="row">
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost} </h4>
                        <small class="text-muted">${product.soldCount} vendidos</small>
                    </div>
                    <p class="mb-1">Categoría: ${product.category}</p>
                    <p class="mb-1">Descripción: ${product.description}</p>
                </div>
            </div>
        </div>
        `
    document.getElementById("prod-info-container").innerHTML = htmlContentToAppend;
}

// Showing the comments
function showProductComments()
{
    let htmlContentToAppend = "";
    
    for (i = 0; i < currentProductComments.length; i++)
    {
        let comment = currentProductComments[i];
    
        htmlContentToAppend += `
        <div class="list-group-item">
            <div class="row">
                <div class="col">
                    <h5 class="mb-1"><b>${comment.user}</b> - ${comment.dateTime} - 
                    <span class="fa fa-star ${comment.score >= 1 ? "checked" : ""}"></span>
                    <span class="fa fa-star ${comment.score >= 2 ? "checked" : ""}"></span>
                    <span class="fa fa-star ${comment.score >= 3 ? "checked" : ""}"></span>
                    <span class="fa fa-star ${comment.score >= 4 ? "checked" : ""}"></span>
                    <span class="fa fa-star ${comment.score >= 5 ? "checked" : ""}"></span></h5>
                    <p class="mb-1">${comment.description}</p> 
                </div>
            </div>
        </div>
        `
    }
    document.getElementById("prod-comments-container").innerHTML = htmlContentToAppend;
}

// Adding a new comment
function addComment()
{
    setProd();

    let userDescriptionInput = document.getElementById("userDescription").value;
    let userScoreInput = document.getElementById("userScore").value;
    let userNav = document.getElementById("username");
    
    //Formatting the date to show it as seen on the API
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(); 
    let dateTime = date+' '+time;
    
    //If the user is logged we push the new comment to the array, storing the array on our localStorage
    if (userNav.innerHTML !== "")
    {
        currentProductComments.push(
            {
                product: `${currentID}`,
                score: `${userScoreInput}`,
                description: `${userDescriptionInput}`,
                user: `${userNav.innerHTML}`,
                dateTime: `${dateTime}`
            }
        );

        localStorage.setItem("currentProductComments", JSON.stringify(currentProductComments));
        document.getElementById("loginRequest").innerHTML = null;
    }
    // Else we ask the user to login
    else 
    {
        document.getElementById("loginRequest").innerHTML = `
        <h4 class="mt-3">
            <a href="index.html" class="link-danger">¡Debes iniciar sesión para comentar!</a>
        </h4>
        `
    }
    // We show the array with the new comment pushed
    showProductComments();
}

//Calling our functions once the DOM is loaded
document.addEventListener('DOMContentLoaded', function()
{
    setProd(); // We set the product
    
    fetch(PROD_URL) // We fetch the product info API
    .then(response => response.json())  
    .then(data => 
        {
            currentProductInfo = data;
            showProductInfo();
        });

    fetch(COMMENTS_URL) // We fetch the comments API
    .then(response => response.json())  
    .then(data => 
        {
            currentProductComments = data;
            
            // If we have a new comment we want to get the full new array stored (not the one fetched)
            if (localStorage.getItem("currentProductComments") !== null)
            {
                currentProductComments = JSON.parse(localStorage.getItem("currentProductComments"));
            }
        
            showProductComments(); // We show the comments

            // If the user submits the form we show the comments array with the new one included
            formSubmit.addEventListener("submit", function(e)
            {
                (e).preventDefault();
                addComment();      
            });
        });
});