const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const errorMensaje = document.getElementById('errorMensaje');
let intentosFallidos = 0;

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

function mostrarError(elemento, mensaje, recargarPagina) {
    elemento.textContent = mensaje;
    setTimeout(function () {
        elemento.textContent = "";
        if (recargarPagina) {
            location.reload();
        }
    }, 5000);
}

//METODOS PARA LOGUEO
async function validarLogin(usuario, contrasena) {
    try {
        const requestBody = {
            NombreUsuario: usuario,
            Contrasena: contrasena
        };
        const response = await fetch("http://localhost:59842/api/UsuariosF/ValidarLogin", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody) // No necesitas envolver requestBody dentro de otro objeto
        });

        // En lugar de verificar response.ok, verifica el código de estado directamente
        if (response.status === 200) {
            const data = await response.json();
            if (data === 2) {
                // El usuario está inactivo, mostrar mensaje
                mostrarError(errorMensaje, "Su usuario se encuentra inactivo, por favor comuníquese con el administrador", false);
            } else {
                // El usuario está activo, guardar el token en las cookies y redirigir
                document.cookie = "token=" + data.Token + "; path=/";
                window.location.href = "PaginaPrincipal.aspx";
            }
        } else if (response.status === 404) {
            intentosFallidos++;
            // Verificar si se alcanzaron los 3 intentos fallidos
            if (intentosFallidos >= 3) {
                // Llamar a la función para consumir la otra API
                consumirInactivarUSU(usuario);
            }
            else {
                mostrarError(errorMensaje, "Usuario y/o contraseña incorrectos", false);
            }
        } else if (response.status === 400) {
            mostrarError(errorMensaje, "Error al generar el token", true);
        }
    } catch (error) {
        mostrarError(errorMensaje, "Error desconocido", true);
    }
}

async function consumirInactivarUSU(usuario) {
    try {
        const devolver = 2;
        // Preparar los datos para la otra API
        const requestBody = {
            NombreUsuario: usuario,
            IDEstado: 2, // Este valor representa el estado inactivo en la otra API
            noReturn: devolver
        };
        // Hacer la solicitud a la otra API
        const response = await fetch("http://localhost:59842/api/UsuariosF/ActualizarEstadoUsuario", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
        //// Verificar la respuesta de la otra API y manejarla según sea necesario
        //if (response.status === 200) {
        //    mostrarError(errorMensaje, "Su usuario se encuentra inactivo, por favor comuníquese con el administrador", false);
        //} else {
        //    mostrarError(errorMensaje, "Error inesperado", false);
        //}
    } catch (error) {
        mostrarError(errorMensaje, error, true);
    }
}

// Obtener referencia al formulario y campos de entrada
const loginForm = document.getElementById('loginForm');
const usuarioInput = document.getElementById('usuario');
const passwordInput = document.getElementById('password');

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const usuario = usuarioInput.value;
    const contrasena = passwordInput.value;

    // Validar el formato del usuario y la contraseña (solo letras y números)
    const usuarioRegex = /^[a-zA-Z0-9]+$/;
    if (!usuarioRegex.test(usuario)) {
        mostrarError(errorMensaje, "El usuario solo puede contener letras y números", false);
        return;
    }
    // Llamar a la función validarLogin con el usuario y la contraseña
    validarLogin(usuario, contrasena);
});


//METODOS PARA REGISTRAR UN NUEVO USUARIO
// Obtener referencia al formulario y campos de entrada del formulario de registro
const registroForm = document.getElementById('registroForm');
const usuarioRegistroInput = document.getElementsByName('usuarioR')[0];
const nombreRegistroInput = document.getElementsByName('nombreR')[0];
const apellidosRegistroInput = document.getElementsByName('apellidosR')[0];
const emailRegistroInput = document.getElementsByName('emailR')[0];
const passwordRegistroInput = document.getElementsByName('passwordR')[0];

//Validaciones para que no ingresen numeros ni simbolos en los campos de usuario, nombre, apellidos
usuarioRegistroInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^a-zA-Z]/g, '');
});

nombreRegistroInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^a-zA-Z]/g, '');
});

apellidosRegistroInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^a-zA-Z]/g, '');
});

registroForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Obtener valores de los campos del formulario de registro
    const usuarioRegistro = usuarioRegistroInput.value;
    const nombreRegistro = nombreRegistroInput.value;
    const apellidosRegistro = apellidosRegistroInput.value;
    const emailRegistro = emailRegistroInput.value;
    const passwordRegistro = passwordRegistroInput.value;
    try {
        const requestBody = {
            NombreUsuario: usuarioRegistro,
            Nombre: nombreRegistro,
            Apellidos: apellidosRegistro,
            Email: emailRegistro,
            Contrasena: passwordRegistro
        };

        // Realizar la solicitud a la API de Registro
        const response = await fetch("http://localhost:59842/api/UsuariosF/RegistrarUsuario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        if (response.status === 201) {
            // Registro exitoso, mostrar mensaje y limpiar campos del formulario
            mostrarError(errorMensaje, "“Usuario creado con éxito", true);
            usuarioRegistroInput.value = "";
            nombreRegistroInput.value = "";
            apellidosRegistroInput.value = "";
            emailRegistroInput.value = "";
            passwordRegistroInput.value = "";
        } else if (response.status === 409) {
            // Conflicto, el nombre de usuario ya existe, mostrar mensaje de error
            mostrarError(errorMensaje, "Ha ocurrido un error intente de nuevo", false);
        } else {
            // Otro código de estado, mostrar mensaje de error genérico
            mostrarError(errorMensaje, "Ha ocurrido un error intente de nuevo", false);
        }
    } catch (error) {
        // Error en la solicitud, mostrar mensaje de error genérico
        mostrarError(errorMensaje, "Ha ocurrido un error intente de nuevo", false);
    }
});