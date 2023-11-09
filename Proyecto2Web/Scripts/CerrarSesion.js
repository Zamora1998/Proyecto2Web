
setInterval(verificarToken, 1000);

function verificarToken() {
    // Obtener el token de las cookies
    const tokenExpiracion = obtenerTokenDeLasCookies();

    if (tokenExpiracion) {
        const tokenDate = convertirTokenADate(tokenExpiracion);
        const fechaActual = new Date();

        // Comparar la fecha de expiración del token con la fecha y hora actual
        if (tokenDate <= fechaActual) {
            // Token expirado, redirigir al usuario al login y eliminar la cookie
            eliminarCookie("token");
            window.location.href = "IngresoPeliculas.html";
        }
    }
}

function convertirTokenADate(token) {
    const partes = token.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
    if (partes && partes.length === 7) {
        const anio = parseInt(partes[1], 10);
        const mes = parseInt(partes[2], 10) - 1; // Meses en JavaScript son 0-indexados
        const dia = parseInt(partes[3], 10);
        const horas = parseInt(partes[4], 10);
        const minutos = parseInt(partes[5], 10);
        const segundos = parseInt(partes[6], 10);

        return new Date(anio, mes, dia, horas, minutos, segundos);
    } else {
        console.error("Formato de token inválido:", token);
        return null;
    }
}

// Función para obtener el token de las cookies
function obtenerTokenDeLasCookies() {
    const tokenCookie = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('token='));

    // Devolver el valor del token o null si no se encuentra la cookie
    return tokenCookie ? tokenCookie.split('=')[1] : null;
}

// Función para eliminar una cookie por su nombre
function eliminarCookie(nombre) {
    document.cookie = nombre + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
