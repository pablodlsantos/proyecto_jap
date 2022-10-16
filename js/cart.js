/* This script fetchs the user API (or loads his local storage), get his articles in the cart and show it to the user with the articles info
User must fill a form with shipping options to finally buy the products  */

const USER_URL = "https://japceibal.github.io/emercado-api/user_cart/25801.json";
const articlesTable = document.getElementById("articles-container");
let articlesArray = [];

/* This function will show our articles array, if we have items in the local storage it'll show the products
in the local storage, else it'll show the one in the API */
function showArticlesArray(){
    if (JSON.parse(localStorage.getItem("cartArray")) !== null){ // Parsing the local storage if it isn't null to get the products in our array
        articlesArray = JSON.parse(localStorage.getItem("cartArray"));
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
        });

        deleteBtn.addEventListener("click", function(){ // This event revomes the article from the table and from the array, then the localStorage gets updated
            articleRow.remove();
            let articleIndex = articlesArray.indexOf(articlesArray[i]);
            articlesArray.splice(articleIndex, 1);
            if (articlesArray.length !== 0){
                localStorage.setItem("cartArray", JSON.stringify(articlesArray));
            }
            else {
                localStorage.removeItem("cartArray");
            }
        });
    }   
};

// Calling our functions when the DOM is loaded
document.addEventListener('DOMContentLoaded', function(){
    fetch(USER_URL) // We fetch the article from the users cart API
    .then(response => response.json())
    .then(data =>{
        articlesArray = data.articles;
        showArticlesArray();
    });
});