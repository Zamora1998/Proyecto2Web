document.addEventListener("DOMContentLoaded", function () {
    // Obtiene el nombre de la película de la URL
    var urlParams = new URLSearchParams(window.location.search);
    var nombrePelicula = urlParams.get("nombrePelicula");

    // Realiza una solicitud al API de detalles de película
    var apiUrl = "https://tiusr30pl.cuc-carrera-ti.ac.cr/APIV4/api/PeliculaDetalle/ObtenerDetallesPorNombre?nombrePelicula=" + encodeURIComponent(nombrePelicula);

    fetch(apiUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("No se pudieron obtener los detalles de la película del API.");
            }
            return response.json();
        })
        .then(function (data) {
            // Llena los elementos HTML con los datos de la película
            document.getElementById("poster").src = data.rutaPoster;
            document.getElementById("poster").style.width = "400px"; // Aplica el ancho fijo
            document.getElementById("poster").style.height = "600px"; // Aplica la altura fija
            document.getElementById("nombre").textContent = data.nombre;
            document.getElementById("calificacion").textContent = "Calificación: " + data.calificacionGenerQal;
            document.getElementById("resena").textContent = data.resena;

            var actoresList = document.getElementById("actores");
            data.actoresStaff.forEach(function (actor) {
                var listItem = document.createElement("li");
                listItem.textContent = actor.nombreActor + " - " + actor.rol;
                actoresList.appendChild(listItem);
            });

            var comentariosList = document.getElementById("comentarios");
            data.comentarios.forEach(function (comentario) {
                var listItem = document.createElement("li");
                listItem.textContent = comentario.comentario;
                comentariosList.appendChild(listItem);
            });
        })
        .catch(function (error) {
            console.error(error);
        });
});
