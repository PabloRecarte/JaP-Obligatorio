var currentProduct=[];
var currentComments = [];

function showImages(array){
    let toAppend = ``;
    for (let i = 0; i < array.length; i++){
        toAppend +=`
        <div class="clipped-border">
            <img src="` + array[i] + `" id="clipped">
        </div>
        
        `
    }
    return toAppend;
}

function showImages2(array){
    let toAppend2 = ``;
    for (let i = 0; i < array.length; i++){
        toAppend2 += `
        <li><img src="` + array[i] + `" alt="imagen` + i + `" /></li>`
    }
    return toAppend2;
}

function showProductInfo(){

let htmlContentToAppend = "";
    let product = currentProduct;

    htmlContentToAppend += `
    <div class="container">
        <div class="text-center p-4">
            <h2>`+ product.name +`</h2>
        </div>
        <div class="row justify-content-md-center">
            <div class="col-md-12 order-md-1">
                <h4 class="mb-3">
                    Información del producto
                </h4>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <h5>Precio</h5>
                        <p>`+ product.currency + ` ` +  product.cost +`</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-9 mb-3">
                        <h5>Decripción</h5>
                        <p>`+ product.description +`</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <h5>Categoría</h5>
                        <a href="category-info.html">Autos</a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <h5>Cantidad de vendidos</h5>
                        <p>`+ product.soldCount +`</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <h5>Imágenes ilustrativas:</h5>
                        <ul>
                        ` + showImages2(product.images) + `
                        </ul>
                    </div>
                </div>

                <!-- <div class = "row gallery">
                ` + showImages(product.images) + `
                    <div class = "shadow"></div>
                </div> -->
            </div>
        </div>
    </div>
    `

    document.getElementById("informaciondeproducto").innerHTML = htmlContentToAppend;
}

function showPuntuacion(num){
    let res = "";
    for (let i = 1; i <= num; i++){
        res += `
        <span class="fa fa-star checked"></span>`
    }
    for (let j = 5; j > num; j--){
        res += `
        <span class="fa fa-star"></span>`
    }
    return res;
}

function showCadaComentario(){
    let res = "";
    for(let i = 0; i < currentComments.length; i++){
        res += `
        <h6 class="mb-3"><span class="usercomment">` + currentComments[i].user + `</span> - ` + currentComments[i].dateTime + ` - ` + showPuntuacion(currentComments[i].score) + `</h6>
        <div class="d-block my-3">
            <p>` + currentComments[i].description + `</p>
        </div>
        <hr class="mb-4">`
    }
    return res;
}

function showComentarios(){
    let htmlContentToAppend = `
    <div class="container">
    <hr class="mb-4">
        <div class="row justify-content-md-center">
            <div id="comentarios" class="col-md-12 order-md-1">
                <h4 class="mb-4">
                    Comentarios
                </h4>
                ` + showCadaComentario() + `
            </div>
        </div>
    </div>
    `
    
    document.getElementById("comentariosdeproducto").innerHTML = htmlContentToAppend;
}

function adecuacionFechaHora(num){
    res = "";
    if (num < 10){
        res += "0";
    }
    res += num;
    return res;
}

function validacionNuevoComentario(){
    var form = document.getElementById("formnuevocomentario");
    var contenido = document.getElementById("descripcion-producto").value;
    var calificacion = document.getElementById("valoracion-producto").value;
    if (calificacion == -1){
        alert("La calificación es obligatoria");
    } else {
        if (contenido != "" || confirm("¿Desea enviar el comentario vacío?")){
            //adapto la fecha
            var today = new Date();
            var fecha = today.getFullYear();
            fecha += "-" + adecuacionFechaHora(today.getMonth()+1);
            fecha += "-" + adecuacionFechaHora(today.getDate());

            //adapto la hora
            var hora = "";
            hora += adecuacionFechaHora(today.getHours());
            hora += ":" + adecuacionFechaHora(today.getMinutes());
            hora += ":" + adecuacionFechaHora(today.getSeconds()); 

            //html del nuevo comentario
            var add = `
            <h6 class="mb-3"><span class="usercomment">` + window.localStorage.getItem('logueado') + `</span> - ` + fecha + ` ` + hora + ` - ` + showPuntuacion(calificacion) + `</h6>
            <div class="d-block my-3">
                <p>` + contenido + `</p>
            </div>
            <hr class="mb-4">`;

            //creo el nodo donde lo insertare
            var div = document.createElement("div");
            div.classList.add("nuevocomentario");
            document.getElementById("comentarios").appendChild(div);

            //agrego el comentario a la pagina
            var comments = document.getElementsByClassName("nuevocomentario");
            comments[comments.length-1].innerHTML = add;

            //reseteo el formulario
            form.reset();
        }
    }
    return false;


    
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentProduct = resultObj.data;
            showProductInfo();
        }
    });

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentComments = resultObj.data;
            showComentarios();
        }
    });

});
