/* This script fetchs the user API (or loads his local storage), get his articles in the cart and show it to the user with the articles info
User must fill a form with shipping options to finally buy the products  */

//const USER_URL = "https://japceibal.github.io/emercado-api/user_cart/25801.json";
let articlesArray = [];

/* This function will show our articles array, if we have items in the local storage it'll show the products
in the local storage, else it'll show the one in the API */
function showArticlesArray(){
    const articlesTable = document.getElementById("articles-container");
    const articlesHeader = document.getElementById("articles-header");
    const cartFiller = document.getElementById("cart-filler");
    
    if (JSON.parse(localStorage.getItem("cartArray")) !== null){ // Parsing the local storage if it isn't null to get the products in our array
        articlesArray = JSON.parse(localStorage.getItem("cartArray"));
        articlesHeader.style.display = "table";
        cartFiller.style.display = "none";
    }
    
    for (let i = 0; i < articlesArray.length; i++){ // Formatting the html
        let htmlContentToAppend = 
        `<td style="width: 275px;"><img src="${articlesArray[i].image}" style="min-width: 100px;" alt="${articlesArray[i].name}" class="img-thumbnail img-fluid"></td>
        <td>${articlesArray[i].name}</td>
        <td>${articlesArray[i].currency} ${articlesArray[i].unitCost}</td>
        <td><input type="number" id="${articlesArray[i].id}" min="1" max="99" value="${articlesArray[i].count}"></td>
        <td class="fw-bold" id="${articlesArray[i].id}-cost"></td>
        <td id="${articlesArray[i].id}-btn-td"></td>` 
        
        // Creating each table row inside our table
        let articleRow = document.createElement("tr");
        articleRow.innerHTML = htmlContentToAppend;
        articlesTable.appendChild(articleRow);
        
        //Creating a delete button inside the table row of each product
        let deleteBtn = document.createElement("div"); 
        deleteBtn.innerHTML = `<button type="button" class="btn btn-danger" id="${articlesArray[i].id}-btn">
        <i class="fas fa-window-close"></i> Eliminar</button>`
        let tdBtn = document.getElementById(`${articlesArray[i].id}-btn-td`);
        tdBtn.appendChild(deleteBtn);

        let userInput = document.getElementById(`${articlesArray[i].id}`);
        let cost =  articlesArray[i].unitCost;
        let newCost = document.getElementById(`${articlesArray[i].id}-cost`);
        newCost.innerHTML = `${articlesArray[i].currency} ${userInput.value * cost}`;

        userInput.addEventListener("input", function(){ // This event uploads our subtotal in real time when the quantity input gets changed
            newCost.innerHTML = `${articlesArray[i].currency} ${userInput.value * cost}`;
            articlesArray[i].count = userInput.value;
            localStorage.setItem("cartArray", JSON.stringify(articlesArray));
            showTotalCost();
        });

        deleteBtn.addEventListener("click", function(){ // This event revomes the article from the table and from the array, then the localStorage gets updated
            let articleIndex = articlesArray.indexOf(articlesArray[i]);
            articlesArray.splice(articleIndex, 1);
            if (articlesArray.length !== 0){
                localStorage.setItem("cartArray", JSON.stringify(articlesArray));
                articlesArray = [];
                articlesTable.innerHTML = "";
                showArticlesArray();
                showTotalCost();
            }
            else {
                localStorage.removeItem("cartArray");
                articlesHeader.style.display = "none";
                cartFiller.style.display = "block";
                showTotalCost();
            }
        });
    }
};

// This function will update the subtotal, shipping and total values in real time
function showTotalCost(){
    const standardShipping = document.getElementById("standard");
    const expressShipping = document.getElementById("express");
    const premiumShipping = document.getElementById("premium");
    const shipping = document.getElementById("shipping");
    const total = document.getElementById("total");

    let subtotal = 0;
    let shippingSubtotal = 0;

    // Iterating the products array to sum the costs (this is the subtotal)
    if (articlesArray.length !== 0){
        for (let i = 0; i < articlesArray.length; i++){
            if(articlesArray[i].currency === "USD"){
                subtotal += articlesArray[i].unitCost * articlesArray[i].count;
            } else if (articlesArray[i].currency === "UYU"){
                subtotal += (Math.round(articlesArray[i].unitCost / 41)) * articlesArray[i].count;
            }
        }      
    }

    // When we check the radio input the shipping value will get updated 
    standardShipping.addEventListener("input", function(){
        shippingSubtotal = Math.round((5 / 100) * subtotal); 
        shipping.innerHTML = `USD ${shippingSubtotal}`;
        total.innerHTML = `USD ${subtotal + shippingSubtotal}`;
    });

    expressShipping.addEventListener("input", function(){
        shippingSubtotal = Math.round((7 / 100) * subtotal); 
        shipping.innerHTML = `USD ${shippingSubtotal}`;
        total.innerHTML = `USD ${subtotal + shippingSubtotal}`;
    });

    premiumShipping.addEventListener("input", function(){
        shippingSubtotal = Math.round((15 / 100) * subtotal); 
        shipping.innerHTML = `USD ${shippingSubtotal}`;
        total.innerHTML = `USD ${subtotal + shippingSubtotal}`;
    });

    // When we update the count value of the products the shipping value will get updated 
    if (standardShipping.checked === true){
        shippingSubtotal = Math.round((5 / 100) * subtotal); 
        shipping.innerHTML = `USD ${shippingSubtotal}`;
        total.innerHTML = `USD ${subtotal + shippingSubtotal}`;
    } 
    
    else if (expressShipping.checked === true){
        shippingSubtotal = Math.round((7 / 100) * subtotal); 
        shipping.innerHTML = `USD ${shippingSubtotal}`;
        total.innerHTML = `USD ${subtotal + shippingSubtotal}`;
    }

    else if (premiumShipping.checked === true){
        shippingSubtotal = Math.round((15 / 100) * subtotal); 
        shipping.innerHTML = `USD ${shippingSubtotal}`;
        total.innerHTML = `USD ${subtotal + shippingSubtotal}`;
    }
    
    document.getElementById("subtotal").innerHTML = `USD ${subtotal}`;
    total.innerHTML = `USD ${subtotal + shippingSubtotal}`;
}

// This function holds our buying form validations
function formValidations(){
    const cardRadio = document.getElementById("credit-card");
    const bankRadio = document.getElementById("bank-account");
    const cardFieldset = document.getElementById("card-fieldset");
    const bankFieldset = document.getElementById("bank-fieldset");
    const buyCondition = document.getElementById("buy-condition");
    const successAlert = document.getElementById("success-alert");
    const emptyCartAlert = document.getElementById("empty-cart-alert");
    const buyForm = document.getElementById("buying-form");

    // If we select a way of paying the other fieldset gets disabled
    cardRadio.addEventListener("input", function(){
        cardFieldset.disabled = false;
        bankFieldset.disabled = true;
        buyCondition.innerHTML = "Tarjeta de crédito";
    });
    
    bankRadio.addEventListener("input", function(){
        bankFieldset.disabled = false;
        cardFieldset.disabled = true;
        buyCondition.innerHTML = "Transferencia bancaria";
    });


    // If we submit the buying form and everything is validated we show a success alert
    buyForm.addEventListener("submit", event =>{
        event.preventDefault();
        
        if (buyForm.checkValidity() === true && JSON.parse(localStorage.getItem("cartArray")) !== null){
            successAlert.style.display = "flex";
        } else if (JSON.parse(localStorage.getItem("cartArray")) === null){
            emptyCartAlert.style.display = "flex";
        }
    });

    // Example starter JavaScript for disabling form submissions if there are invalid fields
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

// Calling our functions when the DOM is loaded
document.addEventListener('DOMContentLoaded', function(){
    /* fetch(USER_URL) // We fetch the article from the users cart API
    .then(response => response.json())
    .then(data =>{
        articlesArray = data.articles; 
    }); */

    showArticlesArray();
    showTotalCost();
    formValidations();
});

