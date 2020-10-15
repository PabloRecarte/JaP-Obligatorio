
var currentCart = {};
var currentCartElements = [];
var fadeTime = 300;

function showCartElementsList(){
    let htmlContentToAppend = "";
    for(let i = 0; i < currentCartElements.length; i++){
        let element = currentCartElements[i];

        htmlContentToAppend += `
        <div class="producto">
            <div class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + element.src + `" alt="` + element.name + `" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1 prodname">`+ element.name + `</h4>
                            <div>
                            <p class="mb-1">Precio unitario:  <span class="moneda">` + element.currency + `</span> <span class="precio">` + element.unitCost +`</span></p>
                            <!-- <p class="mb-1">Unidades:  ` + element.count + `</p> -->
                            <div class="remover-producto">
                                <button class="btn btn-danger boton-remover" type="button" style="float: right; vertical-align: text-bottom;">Quitar</button>
                            </div>
                            </div>
                        </div>
                        <p>Cantidad: <input class="cantidad" type="number" min="0" value=`+ element.count +`></p>
                        <p>Subtotal: <span class="moneda">` + element.currency +`</span> <span class="subtotalProd"></span> <span class="uyus"></span></p>
                    </div>
                </div>
            </div>
        </div>
        `
    }
    document.getElementById("cart-list-container").innerHTML = htmlContentToAppend;
}

// remover cantidades
function removerItem(boton)
{
  /* Remove row from DOM and recalc cart total */
  var producto = $(boton).parent().parent().parent().parent().parent().parent().parent();
  producto.slideUp(fadeTime, function() {
    producto.remove();
    actualizarSubtotales();
  });
}

function showCartResume(){
    let htmlContentToAppend = "";

    htmlContentToAppend = `
    <div>
        <div class="list-group-item list-group-item-action">
            <h4 class="mb-1">Resumen</h4><div>
            <table class="table table-borderless table-sm">
                <tbody>
                    <tr>
                        <th scope="row">Unidades:</th>
                        <td><span id="totalUnidades"></span> unidades</td>
                    </tr>
                    <tr>
                        <th scope="row">Subtotal:</th>
                        <td>UYU <span id="subtotal"></span></td>
                    </tr>
                    <tr>
                        <th scope="row">Costo envío:</th>
                        <td>UYU <span id="costoEnvio"></span></td>
                    </tr>
                    <tr>
                        <th scope="row">Total:</th>
                        <td>UYU <span id="total"></span></td>
                    </tr>
                </tbody>
            </table>
            <form onsubmit="return comprarValidacion()">
                <button type="submit" class="btn btn-primary">Comprar</button>
            </form>
        </div>
    </div>
    `
    document.getElementById("cart-container").innerHTML = htmlContentToAppend;
}

function showDataEnvio(){
    let htmlContentToAppend = "";

    htmlContentToAppend = `
    <div>
        <div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col">
                    <h4 class="mb-1">Envío</h4><div>
                    <input id="calle" type="text" class="form-control" placeholder="Calle" value="">
                    <div class="row">
                        <div class="col">
                            <input id="numeropuerta" type="number" class="form-control" placeholder="Nº" value="">
                        </div>
                        <div class="col">
                            <input id="esquina" type="text" class="form-control" placeholder="Esquina" value="">
                        </div>
                    </div>
                    <input id="pais" type="text" class="form-control" placeholder="País" value="">
                    <select class="custom-select d-block w-100" id="metodoEnvio">
                        <option disabled selected value="0">Tipo de envío</option>
                        <option value="15">Premium</option>
                        <option value="7">Express</option>
                        <option value="5">Standard</option>
                    </select>
                    <button type="button" class="m-1 btn btn-link" data-toggle="modal" data-target="#modalTiposEnvio">Ver tipos de envío</button>
                </div>
            </div>
        </div>
    </div>
    `
    document.getElementById("cart-dataenvio-container").innerHTML = htmlContentToAppend;
}

function showDataPago(){
    let htmlContentToAppend = "";

    htmlContentToAppend = `
    <div>
        <div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col">
                    <h4 class="mb-1">Pago</h4><div>
                    <div class="d-block my-3">
                        <div class="custom-control custom-radio">
                            <input id="tarjeta" name="publicationType" type="radio" class="custom-control-input" checked="" required="">
                            <label class="custom-control-label" for="tarjeta">Tarjeta de crédito</label>
                        </div>
                        <div class="custom-control custom-radio">
                            <input id="transferencia" name="publicationType" type="radio" class="custom-control-input" required="">
                            <label class="custom-control-label" for="transferencia">Transferencia bancaria</label>
                        </div>
                    </div>
                    <select class="custom-select d-block w-100" id="selectorTarjeta">
                        <option disabled selected value="">Seleccionar tarjeta</option>
                    </select>
                    <button type="button" class="m-1 btn btn-link" data-toggle="modal" data-target="#modalTarjeta">Agregar tarjeta</button>
                    <input id="cuentaTransferencia" type="text" class="form-control" placeholder="Nº de cuenta" value="">
                </div>
            </div>
        </div>
    </div>
    `
    document.getElementById("cart-datapago-container").innerHTML = htmlContentToAppend;
}

function actualizarSubtotales(){
    // variables globales
    let productos = document.getElementsByClassName("producto");
    let subtotal = 0;
    let unidades = 0;
    let producto;

    // variables por producto
    let cantidad, precio, precioxcantUYU, moneda, precioxcant, subtotalProdELEM;

    for(let i = 0; i < productos.length; i++){
        producto = productos[i];
        cantidad = producto.getElementsByClassName("cantidad")[0].value;
        moneda = producto.getElementsByClassName("moneda")[0].textContent;
        precio = producto.getElementsByClassName("precio")[0].textContent;

        precioxcant = precio*cantidad;

        if(moneda == "USD"){
            precioxcantUYU = precioxcant*40;
            producto.getElementsByClassName("uyus")[0].innerHTML = `(UYU ` + precioxcantUYU + `)`;
        } else {
            precioxcantUYU = precioxcant;
        }

        subtotalProdELEM = producto.getElementsByClassName("subtotalProd")[0];
        subtotalProdELEM.innerHTML = precioxcant;

        // actualizacion variables resumen compra
        unidades += Number.parseInt(cantidad);
        subtotal += Number.parseInt(precioxcantUYU);
    }

    // insercion variables resumen compra actualizadas
    let subtotalELEM = document.getElementById("subtotal");
    let cantotalELEM = document.getElementById("totalUnidades");

    subtotalELEM.innerHTML = subtotal;
    cantotalELEM.innerHTML = unidades;

    let costoEnvio = Number.parseInt(document.getElementById("metodoEnvio").value);
    let costoEnvioELEM = document.getElementById("costoEnvio");
    let totalELEM = document.getElementById("total");
    if(costoEnvio != 0){
        costoEnvioELEM.innerHTML = subtotal*costoEnvio/100;
        totalELEM.innerHTML = Math.round(subtotal*(1+costoEnvio/100)*100)/100;
    } else {
        costoEnvioELEM.innerHTML = "--";
        totalELEM.innerHTML = "--";
    }
}

function agregarEventosCantidades(){
    let todasLasCantidades = document.getElementsByClassName("cantidad");
    for(let i = 0; i < todasLasCantidades.length; i++){
        todasLasCantidades[i].addEventListener("input", function(e){
            actualizarSubtotales();
        });
    }
    let cambiaEnvio = document.getElementById("metodoEnvio");
    cambiaEnvio.addEventListener("input", function(e){
        actualizarSubtotales();
    });
    $('.remover-producto button').click( function() {
        removerItem(this);
    });
}

function enableCardOrNot(){
    let transferenciaELEM = document.getElementById("cuentaTransferencia");
    let sel = document.getElementById("selectorTarjeta");
    let tarjetaELEM = document.getElementById("tarjeta");
    let esTarjeta = tarjetaELEM.checked;
    if(esTarjeta){
        transferenciaELEM.disabled = true;
        sel.disabled = false;
    } else {
        transferenciaELEM.disabled = false;
        sel.disabled = true;
    }
}

function agregarTarjeta(){
    // se chequea el vencimiento

    let month = Number.parseInt(document.getElementById("mesExp").value);
    let year = Number.parseInt(document.getElementById("anioExp").value);
    let today = new Date();
    let vencimiento = new Date(year,month-1,today.getDate());

    if(vencimiento < today){
        if(!(vencimiento.getFullYear() == today.getFullYear() && vencimiento.getMonth() == today.getMonth())){
            alert("Ingrese una tarjeta vigente");
            return false;
        }
    }

    // se agrega
    let nuevaTarjeta = document.getElementById("cardnumber").value;
    let sel = document.getElementById("selectorTarjeta");
    var opt = document.createElement('option');
    opt.appendChild(document.createTextNode(nuevaTarjeta));
    opt.value = nuevaTarjeta;
    sel.appendChild(opt);
    alert("Tarjeta " + nuevaTarjeta + " agregada");

    // limpiar formulario
    let form = document.getElementById("formNuevaTarjeta");
    form.reset();

    // seteo email
    var elUser = document.getElementById("temail");
    elUser.value = window.localStorage.getItem("logueado");

    return false;
}

function chequearDatosEnvio(){
    // chequeo de calle, nropuerta, esquina
    let calle = document.getElementById("calle").value;
    let nropuerta = document.getElementById("numeropuerta").value;
    let esquina = document.getElementById("esquina").value;
    let pais = document.getElementById("pais").value;
    let envio = document.getElementById("metodoEnvio").value;

    if(calle == ""){
        alert("Agregue una calle para el envío.");
        return false;
    } else if(nropuerta == ""){
        alert("Agregue un número de puerta para el envío.");
        return false;
    } else if(esquina == ""){
        alert("Agregue una esquina para el envío.");
        return false
    } else if(pais == ""){
        alert("Agregue un país para el envío.");
        return false;
    } else if(envio == 0){
        alert("Seleccione método de envío.");
        return false;
    }

    return true;
}

function comprarValidacion(){
    let esTarjeta = document.getElementById("tarjeta").checked;
    let tarjeta = document.getElementById("selectorTarjeta").value;
    let nroCuenta = document.getElementById("cuentaTransferencia").value;

    if(!chequearDatosEnvio()){
        return false;
    }


    if(esTarjeta){
        if(tarjeta == ""){
            alert("Seleccione una tarjeta, añadiéndola de ser necesario.");
            return false;
        }
    } else if(nroCuenta == ""){
            alert("Ingrese un número de cuenta.");
            return false;
    } else {
        if(!confirm("¿Desea confirmar la compra?")){
            return false;
        }
    }
    alert("Compra realizada, ¡muchas gracias!");
    return true;
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(CART2_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentCart = resultObj.data
            currentCartElements = currentCart["articles"];
            showCartElementsList();
            showCartResume();
            showDataEnvio();
            showDataPago();
            actualizarSubtotales();
        }
        agregarEventosCantidades();
        enableCardOrNot();

        document.getElementById("tarjeta").addEventListener("click", function(){
            enableCardOrNot();
        });

        document.getElementById("transferencia").addEventListener("click", function(){
            enableCardOrNot();
        });

        
        var elUser = document.getElementById("temail");
        elUser.value = window.localStorage.getItem("logueado");
    });
});