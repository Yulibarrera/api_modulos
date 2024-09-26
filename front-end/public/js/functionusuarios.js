// Escucha el evento DOMContentLoaded cuando se carga completamente el documento HTML
document.addEventListener('DOMContentLoaded', () => {
    loadUsers(); // Cargar usuarios cuando se carga la página
    loadRoles(); // Cargar roles cuando se carga la página
    loadAreas(); // Cargar áreas cuando se carga la página

    // Generar nombre de usuario cuando se ingresan datos en los campos de nombres y apellidos
    document.getElementById('nombres').addEventListener('input', generateUsername);
    document.getElementById('apellidos').addEventListener('input', generateUsername);
});

// Función para generar automáticamente el nombre de usuario con el primer nombre y primer apellido
function generateUsername() {
    const nombres = document.getElementById('nombres').value.trim(); // Obtener y limpiar el valor de "nombres"
    const apellidos = document.getElementById('apellidos').value.trim(); // Obtener y limpiar el valor de "apellidos"

    // Si ambos campos tienen valores, generar el nombre de usuario
    if (nombres && apellidos) {
        const nombreUsuario = `${nombres.split(' ')[0].toLowerCase()}.${apellidos.split(' ')[0].toLowerCase()}`; // Tomar el primer nombre y primer apellido, convertir a minúsculas y formar el nombre de usuario
        document.getElementById('usuario').value = nombreUsuario; // Asignar el nombre de usuario al campo correspondiente
    }
}

// Función para cargar usuarios y mostrarlos en una tabla
function loadUsers() {
    // Hacer una solicitud GET al servidor para obtener la lista de usuarios
    fetch('http://localhost:3000/api/user')
        .then(response => response.json()) // Convertir la respuesta a formato JSON
        .then(users => {
            const tbody = document.getElementById('user-table-body'); // Obtener el cuerpo de la tabla donde se mostrarán los usuarios
            tbody.innerHTML = ''; // Limpiar el contenido previo de la tabla

            // Iterar sobre los usuarios obtenidos del servidor y agregar una fila para cada uno en la tabla
            users.forEach(user => {
                const row = `
                    <tr class="border-b hover:bg-gray-100">
                        <td class="px-4 py-2">${user.documento}</td> <!-- Mostrar el documento del usuario -->
                        <td class="px-4 py-2">${user.nombre}</td> <!-- Mostrar el nombre del usuario -->
                        <td class="px-4 py-2">${user.apellido}</td> <!-- Mostrar el apellido del usuario -->
                        <td class="px-4 py-2">${user.rol?.nombre || 'N/A'}</td> <!-- Mostrar el rol del usuario o "N/A" si no tiene -->
                        <td class="px-4 py-2">${user.area?.nombre || 'N/A'}</td> <!-- Mostrar el área del usuario o "N/A" si no tiene -->
                        <td class="px-4 py-2 justify-center items-center">
                            <!-- Checkbox para activar/desactivar el estado del usuario -->
                            <label class="relative inline-flex justify-center items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" ${user.estado ? 'checked' : ''} onchange="toggleUserStatus('${user._id}', this.checked)"> <!-- Si el estado está activo, el checkbox está marcado -->
                                <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-400 
                                             peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] 
                                             after:left-[2px] after:bg-white after:border-gray-300 after:border 
                                             after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                        </td>
                        <td class="px-4 py-2 justify-center items-center">
                            <!-- Iconos para editar y eliminar el usuario -->
                            <div class="flex items-center px-4">
                                <img src="/public/icons/icons8-editar.svg" alt="Editar" class="h-6 w-6 cursor-pointer" onclick="editUser('${user._id}')">
                                <img src="/public/icons/icons8-eliminar.svg" alt="Eliminar" class="h-6 w-6 cursor-pointer" onclick="deleteUser('${user._id}')">
                            </div>
                        </td>
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', row); // Agregar la fila al final del cuerpo de la tabla
            });
        })
        .catch(error => console.error('Error al cargar usuarios:', error)); // Manejar errores en la carga de usuarios
}

// Función para cambiar el estado activo/inactivo de un usuario
function toggleUserStatus(userId, isActive) {
    // Hacer una solicitud POST para actualizar el estado del usuario en el servidor
    fetch(`http://localhost:3000/api/user/${userId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Especificar que los datos enviados están en formato JSON
        body: JSON.stringify({ estado: isActive }) // Enviar el estado (activo o inactivo) como JSON
    })
    .then(() => loadUsers()) // Volver a cargar la lista de usuarios después de actualizar el estado
    .catch(error => console.error('Error al cambiar estado del usuario:', error)); // Manejar errores en el cambio de estado
}

// Función para cargar los roles en un selector
function loadRoles() {
    // Hacer una solicitud GET al servidor para obtener la lista de roles
    fetch('http://localhost:3000/api/rol')
        .then(response => response.json()) // Convertir la respuesta a formato JSON
        .then(roles => {
            const selectRol = document.getElementById('rol'); // Obtener el selector de roles
            selectRol.innerHTML = ''; // Limpiar las opciones previas

            // Iterar sobre los roles obtenidos y agregar una opción para cada uno
            roles.forEach(rol => {
                const option = document.createElement('option'); // Crear una nueva opción
                option.value = rol._id; // Asignar el ID del rol como valor
                option.textContent = rol.nombre; // Asignar el nombre del rol como texto
                selectRol.appendChild(option); // Agregar la opción al selector
            });
        })
        .catch(error => console.error('Error al cargar roles:', error)); // Manejar errores en la carga de roles
}

// Función para cargar las áreas en checkboxes
function loadAreas() {
    // Hacer una solicitud GET al servidor para obtener la lista de áreas
    fetch('http://localhost:3000/api/area')
        .then(response => response.json()) // Convertir la respuesta a formato JSON
        .then(areas => {
            const container = document.getElementById('areas-checkboxes'); // Obtener el contenedor de checkboxes de áreas
            container.innerHTML = ''; // Limpiar los checkboxes previos

            // Iterar sobre las áreas obtenidas y agregar un checkbox para cada una
            areas.forEach(area => {
                const checkbox = `
                    <label class="inline-flex items-center space-x-2">
                        <input type="checkbox" name="areas" value="${area._id}" class="h-4 w-4 rounded"> <!-- Checkbox con el ID del área como valor -->
                        <span>${area.nombre}</span> <!-- Mostrar el nombre del área -->
                    </label>
                `;
                container.insertAdjacentHTML('beforeend', checkbox); // Agregar el checkbox al contenedor
            });
        })
        .catch(error => console.error('Error al cargar áreas:', error)); // Manejar errores en la carga de áreas
}

// Función para abrir el modal de creación de usuario
function openModal() {
    document.getElementById('modal').classList.remove('hidden'); // Mostrar el modal eliminando la clase "hidden"
}

// Función para cerrar el modal de creación de usuario
function closeModal() {
    document.getElementById('modal').classList.add('hidden'); // Ocultar el modal agregando la clase "hidden"
}

// Evento de envío del formulario de creación de usuario
document.getElementById('user-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío automático del formulario

    // Obtener los valores de los campos del formulario
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const documento = document.getElementById('documento').value;
    const rol = document.getElementById('rol').value; // Obtener el rol seleccionado
    const usuario = document.getElementById('usuario').value; // Obtener el nombre de usuario generado automáticamente
    const contrasena = document.getElementById('contrasena').value;
    const confirmarContrasena = document.getElementById('confirmar-contrasena').value;

    // Validar que las contraseñas coincidan
    if (contrasena !== confirmarContrasena) {
        alert('Las contraseñas no coinciden'); // Mostrar alerta si las contraseñas no coinciden
        return; // Detener la ejecución si no coinciden
    }

    // Obtener las áreas seleccionadas
    const areasSeleccionadas = Array.from(document.querySelectorAll('input[name="areas"]:checked')).map(cb => cb.value);

    // Crear un objeto con los datos del nuevo usuario
    const newUser = {
        nombres,
        apellidos,
        documento,
        rol, // Enviar el rol seleccionado
        nombre_usuario: usuario, // Enviar el nombre de usuario generado
        contrasena,
        areas: areasSeleccionadas // Enviar las áreas seleccionadas
    };

    // Hacer una solicitud POST para crear un nuevo usuario
    fetch('http://localhost:3000/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Especificar que los datos están en formato JSON
        body: JSON.stringify(newUser) // Enviar el objeto newUser como JSON
    })
    .then(response => {
        if (response.ok) {
            alert('Usuario creado exitosamente'); // Mostrar un mensaje si la creación fue exitosa
            closeModal(); // Cerrar el modal
            loadUsers(); // Volver a cargar la lista de usuarios
        } else {
            alert('Error al crear usuario'); // Mostrar un mensaje si hubo un error
        }
    })
    .catch(error => console.error('Error al crear usuario:', error)); // Manejar errores en la creación del usuario
});

// Función para eliminar un usuario
function deleteUser(userId) {
    // Confirmar antes de eliminar el usuario
    if (confirm('¿Seguro que quieres eliminar este usuario?')) {
        // Hacer una solicitud DELETE para eliminar el usuario
        fetch(`http://localhost:3000/api/user/${userId}`, {
            method: 'DELETE'
        })
        .then(() => loadUsers()) // Volver a cargar la lista de usuarios después de eliminar
        .catch(error => console.error('Error al eliminar usuario:', error)); // Manejar errores en la eliminación
    }
}

// Editar usuario
function editUser(userId) {
    // Realizar petición para obtener los datos del usuario
    fetch(`http://localhost:3000/api/user/${userId}`)
        .then(response => response.json())
        .then(user => {
            // Llenar el formulario del modal con los datos del usuario
            document.getElementById('nombres').value = user.nombre;
            document.getElementById('apellidos').value = user.apellido;
            document.getElementById('documento').value = user.documento;
            document.getElementById('rol').value = user.rol?._id || ''; // Asignar el rol actual
            document.getElementById('usuario').value = user.nombre_usuario; // El nombre de usuario no cambia
            document.getElementById('contrasena').value = ''; // No se carga la contraseña por seguridad
            document.getElementById('confirmar-contrasena').value = '';

            // Marcar las áreas seleccionadas por el usuario
            const checkboxes = document.querySelectorAll('input[name="areas"]');
            checkboxes.forEach(cb => {
                cb.checked = user.area.some(area => area._id === cb.value); // Marca las áreas actuales
            });

            // Abrir el modal para editar usuario
            openModal();

            // Configurar el evento de envío del formulario para actualizar el usuario
            document.getElementById('user-form').onsubmit = function(event) {
                event.preventDefault();
                updateUser(userId); // Llama a la función para actualizar el usuario
            };
        })
        .catch(error => console.error('Error al cargar datos del usuario:', error));
}
function updateUser(userId) {
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const documento = document.getElementById('documento').value;
    const rol = document.getElementById('rol').value;
    const usuario = document.getElementById('usuario').value; // Nombre de usuario no cambia
    const contrasena = document.getElementById('contrasena').value; // Nueva contraseña (si se introduce)
    const confirmarContrasena = document.getElementById('confirmar-contrasena').value;

    // Validar contraseñas si se ha ingresado una nueva
    if (contrasena && contrasena !== confirmarContrasena) {
        alert('Las contraseñas no coinciden');
        return;
    }

    // Obtener áreas seleccionadas
    const areasSeleccionadas = Array.from(document.querySelectorAll('input[name="areas"]:checked')).map(cb => cb.value);

    // Crear el objeto con los datos actualizados
    const updatedUser = {
        nombres,
        apellidos,
        documento,
        rol,
        nombre_usuario: usuario, // El nombre de usuario no cambia
        contrasena: contrasena || undefined, // Solo enviar la contraseña si se ha cambiado
        areas: areasSeleccionadas
    };

    // Realizar petición PUT para actualizar el usuario
    fetch(`http://localhost:3000/api/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
    })
    .then(response => {
        if (response.ok) {
            alert('Usuario actualizado exitosamente');
            closeModal();  // Cerrar el modal después de actualizar
            loadUsers();   // Volver a cargar la lista de usuarios
        } else {
            alert('Error al actualizar el usuario');
        }
    })
    .catch(error => console.error('Error al actualizar el usuario:', error));
}


function toggleUserStatus(userId, isActive) {
    // Realiza una solicitud PUT al servidor para actualizar el estado del usuario
    fetch(`http://localhost:3000/api/user/${userId}/estado`, {
        method: 'PUT',  // Se usa el método PUT para actualizar el estado del usuario; también podría usarse PATCH
        headers: { 'Content-Type': 'application/json' }, // Especifica que el contenido enviado es de tipo JSON
        body: JSON.stringify({ estado: isActive }) // Convierte el estado actualizado a JSON y lo envía en el cuerpo de la solicitud
    })
    .then(response => {
        // Verifica si la respuesta es exitosa (status 200-299)
        if (response.ok) {
            console.log('Estado del usuario actualizado exitosamente'); // Mensaje de éxito en la consola
            loadUsers();  // Recarga la lista de usuarios para reflejar los cambios en la interfaz
        } else {
            console.error('Error al actualizar el estado del usuario'); // Mensaje de error si la actualización falla
        }
    })
    .catch(error => console.error('Error al cambiar el estado del usuario:', error)); // Maneja cualquier error de red o en la solicitud
}
