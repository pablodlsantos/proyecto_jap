const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

// Adding the username to our navbar
let username = localStorage.getItem("username");
let googleUser = localStorage.getItem("googleUser");
let userNav = document.getElementById("username");

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

function showNavbarDropdown()
{
  if (googleUser != null && userNav != null)
  {
    userNav.innerHTML = `
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="nav-item-username" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        ${googleUser}
      </a>
      
      <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="nav-item-username">
        <li><a class="dropdown-item" href="cart.html">Mi carrito</a></li>
        <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
        <li><a class="dropdown-item" href="index.html" id="logout">Cerrar Sesión</a></li>
      </ul>
    </li>
    `
  }
  else if (username != null && userNav != null)
  {
    userNav.innerHTML = `
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="nav-list" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        ${username}
      </a>
      
      <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="nav-list">
        <li><a class="dropdown-item" href="cart.html">Mi carrito</a></li>
        <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
        <li><a class="dropdown-item" href="index.html" id="logout">Cerrar Sesión</a></li>
      </ul>
    </li>
    `
  }
  else if (userNav != null)
  {
    userNav.innerHTML = `
    <a class="btn btn-danger" href="index.html" role="button">Inicia Sesión</a>
    `
  }
}

function logout()
{
  localStorage.removeItem("username");
  localStorage.removeItem("googleUser");
}

document.addEventListener("DOMContentLoaded", function()
{
  showNavbarDropdown();

  if ((username != null || googleUser != null) && userNav != null)
  {
    let logoutLink = document.getElementById("logout");

    logoutLink.addEventListener("click", logout);
  }  
});