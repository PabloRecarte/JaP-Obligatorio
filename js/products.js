var currentProductsArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;
var originalArray = [];
var texto = "";

const ORDER_ASC_BY_PRICE = "09";
const ORDER_DESC_BY_PRICE = "90";
const ORDER_BY_SOLD_COUNT = "Cant. ";

function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_SOLD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

function filterProductsPrice(min,max,array){
    if (min == undefined && max == undefined){
        currentProductsArray = array;
    } else {
        let result = array.filter(function(value) {
            if (min == undefined){
                return (value.cost <= max);
            } else if (max == undefined){
                return (value.cost >= min);
            } else {
                return (value.cost >= min && value.cost <= max);
            }
        })
        currentProductsArray = result;
    }
}

function showProductsList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductsArray.length; i++){
        let product = currentProductsArray[i];

        htmlContentToAppend += `
        <a href="product-info.html" class="list-group-item list-group-item-action producto">
            <div class="row">
                <div class="col-3">
                    <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1"><span class="filtro">`+ product.name + `</span> - ` + product.currency + ` ` + product.cost +`</h4>
                        <small class="text-muted">` + product.soldCount + ` artículos</small>
                    </div>
                    <p class="mb-1 filtro">` + product.description + `</p>
                </div>
            </div>
        </a>
        `

        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowProducts(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

    if(productsArray != undefined){
        currentProductsArray = productsArray;
        originalArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestro los productos ordenados
    showProductsList();
}

function filterProductsWords(){
    texto = document.getElementById("busqueda").value.toUpperCase();
    var productos = document.getElementsByClassName("producto");
    console.log(productos);
    var busqueda = "";
    for (let i = 0; i < productos.length; i++){
        busqueda = "";
        var objetivos = productos[i].getElementsByClassName("filtro");
        for (let j = 0; j < objetivos.length; j++){
            busqueda += " " + objetivos[j].textContent.toUpperCase();
        }
        console.log(texto);
        console.log(busqueda);
        console.log(busqueda.indexOf(texto));
        console.log(typeof productos[i]);
        if (busqueda.indexOf(texto) > -1){
            productos[i].style.display = "";
            console.log("mostrar")
        } else {
            productos[i].style.display = "none";
            console.log("no mostrar")
        }
    }
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            sortAndShowProducts(ORDER_ASC_BY_PRICE, resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_PRICE);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_PRICE);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_SOLD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        filterProductsPrice(minCount,maxCount,originalArray);
        showProductsList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de unidades vendidas por artículo.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }
        sortAndShowProducts(currentSortCriteria,filterProductsPrice(minCount,maxCount,originalArray));
    });
});