const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART2_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

var showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function(url){
    var result = {};
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

function debeLoguearse(){
  if(!window.localStorage.getItem('logueado') && !(window.location.href.includes("login.html"))){
    window.location.href="login.html";
  }
  
  else if(window.localStorage.getItem('logueado') && window.location.href.includes("login.html")){
    alert("Usted ya está logueado");
    window.location.href="index.html";
  }
}

function mostrarUsuario(){
  if (!window.location.href.includes("login.html")){
    var elUser = document.getElementsByClassName("usuario-carrito")[0];
    elUser.innerHTML = ``+ window.localStorage.getItem("logueado") + ` `;
  }
}

function cerrarSesion(){
  localStorage.removeItem('logueado');
  window.location.href="index.html";
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  debeLoguearse();
  mostrarUsuario();

  if (!window.location.href.includes("login.html")){
    document.getElementsByClassName("logout")[0].addEventListener("click", function(e){
      cerrarSesion();
    });   
  }
});