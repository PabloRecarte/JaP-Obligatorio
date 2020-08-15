function validation(){
    var nombre = document.getElementById("name");
    var password = document.getElementById("pass");
    if (nombre.value == ""){
        alert("Usuario vacío");
        nombre.focus();
        return false;
    } else if (password.value == ""){
        alert("Contraseña vacía");
        password.focus();
        return false;
    } else {
        window.localStorage.setItem('logueado','si');
        return true;
    }
}

function showPassword(){
    var check = document.getElementById("showpass");
    var pass = document.getElementById("pass");
    if (check.checked){
        pass.type="text";
    } else {
        pass.type="password";
    }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

});