// script.js

// Función para cargar y mostrar las películas
function cargarPeliculas() {
    // URL del API
    var apiUrl = "https://tiusr30pl.cuc-carrera-ti.ac.cr/APIV3/api/PeliculasF/GetPeliculas";

    // Realiza una solicitud GET al API
    fetch(apiUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("No se pudo obtener los datos del API.");
            }
            return response.json();
        })
        .then(function (data) {
            // Llama a una función para mostrar las películas en la página
            mostrarPeliculas(data);
        })
        .catch(function (error) {
            console.error(error);
        });
}
function mostrarPeliculas(peliculas) {
    var container = document.getElementById("peliculas-container");

    // Recorre las películas y crea elementos para mostrarlas
    peliculas.forEach(function (pelicula) {
        var div = document.createElement("div");
        div.classList.add("col-md-4");

        var img = document.createElement("img");
        img.src = pelicula.rutaPoster;
        img.classList.add("img-thumbnail"); // Agrega una clase para reducir el tamaño de la imagen
        div.appendChild(img);

        var nombre = document.createElement("p");
        nombre.textContent = pelicula.nombre;
        div.appendChild(nombre);

        container.appendChild(div);
    });
}

// Cuando la página se carga, llama a la función para cargar las películas
window.addEventListener("load", cargarPeliculas);
