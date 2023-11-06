// script.js

// Función para cargar y mostrar las películas
function cargarPeliculas() {
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
    var containerPrimeraFila = document.getElementById("peliculas-container");
    var containerSegundaFila = document.getElementById("peliculas-container-segunda-fila");

    // Tamaño fijo para las imágenes de la primera fila
    var imgWidthPrimeraFila = 400; // Ajusta el ancho según tus necesidades
    var imgHeightPrimeraFila = 500; // Ajusta la altura según tus necesidades

    peliculas.forEach(function (pelicula, index) {
        var div = document.createElement("div");
        div.classList.add("col-md-4");

        var img = document.createElement("img");
        img.src = pelicula.rutaPoster;
        img.classList.add("img-thumbnail");
        img.classList.add("img-zoom"); // Agrega la clase para el efecto de zoom

        var enlace = document.createElement("a");
        enlace.href = "#"; // Esto es temporal, debes reemplazarlo con la URL del API
        enlace.textContent = pelicula.nombre;

        enlace.addEventListener("click", function (event) {
            event.preventDefault(); // Evita el comportamiento predeterminado del enlace
            enviarNombreAPi(pelicula.nombre); // Llama a una función para enviar el nombre al API
        });


        var resena = document.createElement("p");
        resena.textContent = "Reseña: " + pelicula.resena;
        resena.style.textAlign = "justify"; // Alinea el texto en justificado

        var fechaEstreno = document.createElement("p");
        fechaEstreno.textContent = "Fecha Estreno: " + new Date(pelicula.fechaLanzamiento).toLocaleDateString();

        div.appendChild(img);
        div.appendChild(enlace);
        div.appendChild(resena);
        div.appendChild(fechaEstreno);

        if (index < 3) {
            // Aplicar el tamaño fijo solo a las imágenes de la primera fila
            img.style.width = imgWidthPrimeraFila + "px";
            img.style.height = imgHeightPrimeraFila + "px";

            containerPrimeraFila.appendChild(div);
        } else {
            containerSegundaFila.appendChild(div);
        }
    });
    function enviarNombreAPi(nombrePelicula) {
        // Construye la URL para la página de detalles de película
        var detalleUrl = "detallePelicula.html?nombrePelicula=" + encodeURIComponent(nombrePelicula);

        // Redirige a la página de detalles de película
        window.location.href = detalleUrl;
    }

}


// Cuando la página se carga, llama a la función para cargar las películas
window.addEventListener("load", cargarPeliculas);
