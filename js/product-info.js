/* This script fetch the product from our products API, we show it to the user formatting product-info.html 
We want to show its info, the comments and make new comments (rate it with an opinion) */

const formSubmit = document.getElementById("comment-form");
const currentID = localStorage.getItem("prodID");
const buySubmit = document.getElementById("buy-btn");
let PROD_URL = "";
let COMMENTS_URL = "";
let currentProductInfo = [];
let currentProductComments = [];
let newProductComments = [];
let currentRelatedProducts = [];
let cartArray = JSON.parse(localStorage.getItem("cartArray")) || [];

//The same function as the product.js
function setProdID(id) 
{
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}

// This functions adds our product to the cart
function buyProd()
{
    // Formatting our product object
    let newProd =
        {
            id: currentProductInfo.id,
            name: currentProductInfo.name,
            unitCost: currentProductInfo.cost,
            currency: currentProductInfo.currency,
            image: currentProductInfo.images[0],
            count: 1
        };
    
    
    let productRepeated = false;
    
    // If the product is repeated we add a count to it instead of add it to the array
    cartArray = cartArray.map((product) => {
        if (product.id === currentProductInfo.id) {
            productRepeated = true;
            product.count++;
            window.location = "cart.html"
        }
        return product; 
    });

    // If the product isnt repeated we add it to our array
    if (!productRepeated){
        cartArray.push(newProd);
        window.location = "cart.html"
    }

    // We add the array to the local storage to parse it in the cart.html
    localStorage.setItem("cartArray", JSON.stringify(cartArray));
}

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
        
    /* Formatting the html with bootstrap, we divide the variable in parts so we doesnt broke the bootstrap formatting when
    we iterate */

    // Carrousel begins
    
    htmlContentToAppend += `
        <div class="list-group-item w-100"> 
            <div id="carouselProducts" class="carousel slide carousel-fade carousel-dark" data-bs-ride="carousel">  
                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        `

    for (i = 1; i < product.images.length; i++)
    {
        htmlContentToAppend +=`
                    <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="${i}" aria-label="Slide ${i}"></button>
        `
    }

    htmlContentToAppend += `
            </div>
                <div class="carousel-inner">  
                    <div class="carousel-item active">
                                <img src="${product.images[0]}" alt="${product.description}" class="img-thumbnail mx-auto d-block w-50">
                    </div>

        `

    
    for (i = 1; i < product.images.length; i++)
    {
        htmlContentToAppend += `    
                    <div class="carousel-item ">
                                <img src="${product.images[i]}" alt="${product.description}" class="img-thumbnail mx-auto d-block w-50">
                    </div>
        `
    }

    // The images of the carrousel are already loaded, now we want the carrousel buttons and effects and the products info
    htmlContentToAppend += `
                </div>
            </div>

            <button class="carousel-control-prev carousel-dark" type="button" data-bs-target="#carouselProducts" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
        
        
            <button class="carousel-control-next carousel-dark" type="button" data-bs-target="#carouselProducts" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        
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

    //Iterating in the API array to show the comments
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

    //Iterating in our new comments array (stored in the local storage) to show the new comments too
    if (localStorage.getItem("newProductComments") != null)
    {
        for (i = 0; i < newProductComments.length; i++)
        {
            let comment = newProductComments[i];
            
            if (currentID === comment.product)
            {
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
                            <xmp class="mb-1">${comment.description}</xmp> 
                        </div>
                    </div>
                </div>
                `
            }
        }
    }
    // I'm using xmp as user description tag to eliminate the html tags out of the comments
    document.getElementById("prod-comments-container").innerHTML = htmlContentToAppend;
}

// Adding a new comment
function addComment()
{
    setProd();

    let userDescriptionInput = document.getElementById("user-description").value;
    let userScoreInput = document.getElementById("user-score").value;
    let userNav = document.getElementById("nav-list");
    let userNotLogged = document.getElementById("not-logged");

    //Formatting the date to show it as seen on the API
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(); 
    let dateTime = date+' '+time;
    
    //If the user is logged in we push the new comment to the array, storing the array on our localStorage
    if (userNav !== null)
    {
        newProductComments.push(
            {
                product: `${currentID}`,
                score: `${userScoreInput}`,
                description:`${userDescriptionInput}`,
                user: `${userNav.innerText}`,
                dateTime: `${dateTime}`
            }
        );
        
        localStorage.setItem("newProductComments", JSON.stringify(newProductComments));
        document.getElementById("login-request").innerHTML = null;
    }
    // Else we ask the user to login
    else if (userNotLogged.innerText === "Inicia Sesión")
    {
        document.getElementById("login-request").innerHTML = `
        <h4 class="mt-3">
            <a href="index.html" class="link-danger">¡Debes iniciar sesión para comentar!</a>
        </h4>
        `
    }
    // We show the array with the new comment pushed
    showProductComments();
}

// Showing the related products
function showRelatedProducts()
{
    let htmlContentToAppend = "";
    
    htmlContentToAppend += `
        <div class="list-group-item d-flex w-100"> 
    `

    //Iterating in the related products array to show them
    for (i = 0; i < currentRelatedProducts.length; i++)
    {
        let relatedProduct = currentRelatedProducts[i];
        
        htmlContentToAppend += `
        <div onclick="setProdID(${relatedProduct.id})" class="list-group-item-action cursor-active">
            <div class="col text-center">
                <img src="${relatedProduct.image}" alt="${relatedProduct.name}" class="img-thumbnail w-50">
                <h4 class="mb-1 mt-2">${relatedProduct.name}</h4>
            </div>
        </div>  
        `  
    }

    htmlContentToAppend += `
        </div> 
    `

    document.getElementById("prod-related-container").innerHTML = htmlContentToAppend;
}

function commentValidation(){
    (() => {
        'use strict'
    
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.needs-validation')
    
        // Loop over them and prevent submission
        Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
            }
    
            form.classList.add('was-validated')
        }, false)
        })
    })();
}

//Calling our functions once the DOM is loaded
document.addEventListener('DOMContentLoaded', function()
{
    setProd(); // We set the product
    commentValidation(); // Validating the comments form with Bootstrap

    fetch(PROD_URL) // We fetch the product info API
    .then(response => response.json())  
    .then(data => 
        {
            currentProductInfo = data;
            currentRelatedProducts = data.relatedProducts;
            showProductInfo(); // Showing the product info
            showRelatedProducts(); // Showing the related products;
            
            buySubmit.addEventListener("click", buyProd);
        });

    fetch(COMMENTS_URL) // We fetch the comments API
    .then(response => response.json())  
    .then(data => 
        {
            currentProductComments = data;

            if (localStorage.getItem("newProductComments") != null)
            {
                newProductComments = JSON.parse(localStorage.getItem("newProductComments"));
            }
            
            showProductComments(); // We show the comments

            // If the user submits the form we show the comments array with the new one included
            formSubmit.addEventListener("submit", function(e)
            {
                (e).preventDefault();

                if (formSubmit.checkValidity() === true){
                    addComment();
                }  
            });
        });
});