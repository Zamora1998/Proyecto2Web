$(document).ready(function () {
    // Captura el valor del parámetro "nombre" en la URL
    var nombrePelicula = new URLSearchParams(window.location.search).get("s");

    if (nombrePelicula) {
        // Si se proporciona el parámetro "s" en la URL, realiza la consulta
        consultarAPI(nombrePelicula);
    }
});

function consultarAPI(nombrePelicula) {
    $.ajax({
        url: "https://tiusr30pl.cuc-carrera-ti.ac.cr/APIV4/api/PeliculasF/GetPeliculasNombre?nombrePelicula=" + nombrePelicula,
        type: "GET",
        success: function (data) {
            if (data && data.length > 0) {
                mostrarResultadosEnTabla(data);
            } else {
                mostrarPeliculaNoEncontrada();
            }
        },
        error: function (xhr, status, error) {
            if (xhr.status === 404) {
                mostrarPeliculaNoEncontrada();
            } else {
                console.error("Error al obtener datos del API:", error);
            }
        }
    });
}

function mostrarResultadosEnTabla(resultados) {
    var tablaContainer = $("#tabla-container");
    var table = $("<table>").addClass("table");
    var tbody = $("<tbody>").appendTo(table);

    for (var i = 0; i < resultados.length; i++) {
        var pelicula = resultados[i];
        var row = $("<tr>").appendTo(tbody);
        var link = $("<a>").attr("href", "DetallePelicula.html?nombrePelicula=" + encodeURIComponent(pelicula));
        link.text(pelicula);
        $("<td>").append(link).appendTo(row);
    }

    tablaContainer.empty();
    table.appendTo(tablaContainer);
}

function mostrarPeliculaNoEncontrada() {
    $("#pelicula-no-encontrada").show();
}
