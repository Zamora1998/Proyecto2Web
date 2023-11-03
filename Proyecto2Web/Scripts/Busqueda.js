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
        url: "https://tiusr30pl.cuc-carrera-ti.ac.cr/APIV3/api/PeliculasF/GetPeliculasNombre?nombrePelicula=" + nombrePelicula,
        type: "GET",
        success: function (data) {
            console.log(data);
            mostrarResultadosEnTabla(data);
        },
        error: function () {
            console.error("No se pudo obtener datos del API.");
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
        $("<td>").text(pelicula).appendTo(row);
    }

    tablaContainer.empty();
    table.appendTo(tablaContainer);
}
