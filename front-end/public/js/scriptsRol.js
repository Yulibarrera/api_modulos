const url = 'http://localhost:3000/api/rol'; // URL del backend para obtener o interactuar con la API de roles

// Función para cargar los roles existentes desde el backend
function cargarRoles() {
    fetch(url) // Realiza una solicitud GET al servidor para obtener los roles
        .then(response => response.json()) // Convierte la respuesta en un objeto JSON
        .then(roles => {
            const tbody = document.getElementById('roles-tbody'); // Selecciona el cuerpo de la tabla donde se mostrarán los roles
            tbody.innerHTML = ''; // Limpia cualquier contenido existente en la tabla
            roles.forEach(role => { // Itera sobre la lista de roles obtenidos del backend
                const newRow = crearFilaDeRol(role); // Crea una nueva fila para cada rol
                tbody.appendChild(newRow); // Añade la nueva fila al cuerpo de la tabla
            });
        })
        .catch(error => console.error('Error al cargar los roles:', error)); // Muestra un mensaje de error si la solicitud falla
}

// Función para agregar una nueva fila con campos para un nuevo rol
function addNewRole() {
    const tbody = document.getElementById('roles-tbody'); // Selecciona el cuerpo de la tabla donde se añadirán las nuevas filas
    const newRow = crearFilaDeRol(); // Crea una fila vacía para un nuevo rol
    tbody.appendChild(newRow); // Añade la fila vacía al cuerpo de la tabla
}

// Función para crear una fila de rol (nueva o existente)
function crearFilaDeRol(role = {}) {
    const newRow = document.createElement('tr'); // Crea una nueva fila de tabla
    newRow.classList.add('hover:bg-gray-100', 'hover-effect'); // Añade clases para efectos de hover

    // Celda para el nombre del rol
    const roleNameCell = document.createElement('td'); // Crea una celda para el nombre del rol
    roleNameCell.classList.add('px-4', 'py-2', 'border-b', 'border-gray-300'); // Añade clases de estilo
    const roleNameInput = document.createElement('input'); // Crea un campo input para ingresar el nombre del rol
    roleNameInput.type = 'text'; // El input será de tipo texto
    roleNameInput.value = role.nombre || ''; // Si el rol tiene un nombre, lo asigna; si no, deja el campo vacío
    roleNameInput.classList.add('bg-transparent', 'outline-none', 'focus:ring-0', 'text-gray-700', 'w-full', 'p-1'); // Estilos para el input
    if (role._id) roleNameInput.disabled = true; // Si el rol es existente (tiene un _id), deshabilita el campo de texto
    roleNameCell.appendChild(roleNameInput); // Añade el input a la celda
    newRow.appendChild(roleNameCell); // Añade la celda a la fila

    // Celdas para los privilegios (agregar, visualizar, editar, eliminar)
    ['agregar', 'visualizar', 'editar', 'eliminar'].forEach((privilegio, index) => {
        const privilegeCell = document.createElement('td'); // Crea una celda para cada privilegio
        privilegeCell.classList.add('px-4', 'py-2', 'border-b', 'border-gray-300', 'text-center'); // Añade clases de estilo
        const checkbox = document.createElement('input'); // Crea un checkbox para el privilegio
        checkbox.type = 'checkbox'; // Tipo checkbox
        checkbox.checked = role.privilegios?.[privilegio] || false; // Si el privilegio está habilitado en el rol, marca el checkbox
        checkbox.disabled = !!role._id; // Si es un rol existente, deshabilita el checkbox
        privilegeCell.appendChild(checkbox); // Añade el checkbox a la celda
        newRow.appendChild(privilegeCell); // Añade la celda a la fila
    });

    // Celda para el estado del rol (toggle switch)
    const toggleCell = document.createElement('td'); // Crea una celda para el interruptor de estado
    toggleCell.classList.add('px-4', 'py-2', 'border-b', 'border-gray-300', 'text-center'); // Añade clases de estilo
    const toggleSwitch = document.createElement('label'); // Crea un elemento de tipo etiqueta para el toggle
    toggleSwitch.classList.add('relative', 'inline-flex', 'items-center', 'cursor-pointer'); // Añade clases de estilo al toggle
    toggleSwitch.innerHTML = `
        <input type="checkbox" class="sr-only peer" ${role.estado ? 'checked' : ''}> 
        <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 
                    peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                    after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                    after:transition-all peer-checked:bg-blue-400"></div>
    `; // HTML para un interruptor de encendido/apagado
    toggleSwitch.children[0].addEventListener('change', () => {
        // Al cambiar el estado del interruptor, actualiza el estado del rol en el backend
        actualizarEstadoRol(role._id, toggleSwitch.children[0].checked);
    });
    toggleCell.appendChild(toggleSwitch); // Añade el interruptor a la celda
    newRow.appendChild(toggleCell); // Añade la celda a la fila

    // Celda para acciones (guardar/eliminar/editar con íconos)
    const actionsCell = document.createElement('td'); // Crea una celda para los botones de acción
    actionsCell.classList.add('px-4', 'py-2', 'border-b', 'border-gray-300', 'text-center'); // Añade clases de estilo

    if (!role._id) {
        // Si el rol no tiene un _id, significa que es un nuevo rol, así que crea un botón de guardar
        const saveButton = document.createElement('button'); // Crea un botón para guardar el nuevo rol
        saveButton.classList.add('mx-1'); // Añade margen al botón
        saveButton.innerHTML = `<img src="/public/icons/icons8-marca-de-verificación.svg" alt="Guardar" class="h-4 w-4">`; // Imagen del botón
        saveButton.onclick = () => saveRole(null, {
            nombre: roleNameInput.value, // Obtiene el nombre del rol
            privilegios: {
                agregar: newRow.children[1].children[0].checked, // Obtiene el estado de cada privilegio
                visualizar: newRow.children[2].children[0].checked,
                editar: newRow.children[3].children[0].checked,
                eliminar: newRow.children[4].children[0].checked,
            },
            estado: toggleSwitch.children[0].checked // Obtiene el estado del interruptor
        }, newRow, actionsCell); // Llama a la función para guardar el nuevo rol
        actionsCell.appendChild(saveButton); // Añade el botón de guardar a la celda
    } else {
        // Si el rol es existente, añade los íconos de editar y eliminar
        addEditDeleteIcons(actionsCell, role, newRow);
    }

    newRow.appendChild(actionsCell); // Añade la celda de acciones a la fila
    return newRow; // Devuelve la fila completa
}

// Función para agregar los íconos de editar y eliminar a una fila existente
function addEditDeleteIcons(actionsCell, role, newRow) {
    actionsCell.innerHTML = ''; // Limpia las acciones actuales en la celda

    // Botón de editar
    const editButton = document.createElement('button'); // Crea un botón para editar el rol
    editButton.classList.add('mx-1'); // Añade margen entre íconos
    editButton.innerHTML = `<img src="/public/icons/icons8-editar.svg" alt="Editar" class="h-4 w-4">`; // Añade ícono de editar

    // Funcionalidad al hacer clic en el botón de editar
    editButton.onclick = () => {
        // Habilitar los campos de la fila para permitir la edición
        newRow.children[0].children[0].disabled = false; // Habilita el campo para el nombre del rol
        for (let i = 1; i <= 4; i++) { // Habilita los checkboxes de privilegios (agregar, visualizar, etc.)
            newRow.children[i].children[0].disabled = false;
        }

        // Reemplaza los íconos de editar/eliminar por un botón de guardar
        actionsCell.innerHTML = '';
        const saveButton = document.createElement('button'); // Crea el botón para guardar los cambios
        saveButton.classList.add('mx-1'); // Añade margen
        saveButton.innerHTML = `<img src="/public/icons/icons8-marca-de-verificación.svg" alt="Guardar" class="h-4 w-4">`; // Ícono de verificación para guardar
        saveButton.onclick = () => saveRole(role._id, { // Guarda los cambios en el rol
            nombre: newRow.children[0].children[0].value, // Toma el valor del nombre del rol
            privilegios: { // Toma los valores de los checkboxes de privilegios
                agregar: newRow.children[1].children[0].checked,
                visualizar: newRow.children[2].children[0].checked,
                editar: newRow.children[3].children[0].checked,
                eliminar: newRow.children[4].children[0].checked
            },
            estado: newRow.children[5].children[0].children[0].checked // Obtiene el estado (activo/inactivo)
        }, newRow, actionsCell); // Llama a la función para guardar los cambios
        actionsCell.appendChild(saveButton); // Añade el botón de guardar a la celda de acciones
    };
    actionsCell.appendChild(editButton); // Añade el botón de editar a la celda de acciones

    // Botón de eliminar
    const deleteButton = document.createElement('button'); // Crea un botón para eliminar el rol
    deleteButton.classList.add('mx-1'); // Añade margen
    deleteButton.innerHTML = `<img src="/public/icons/icons8-eliminar.svg" alt="Eliminar" class="h-4 w-4">`; // Ícono de eliminar

    // Funcionalidad para eliminar el rol
    deleteButton.onclick = () => eliminarRol(role._id, newRow); // Llama a la función para eliminar el rol
    actionsCell.appendChild(deleteButton); // Añade el botón de eliminar a la celda de acciones
}

// Función para guardar un rol (POST para crear, PUT para editar)
function saveRole(id, roleData, newRow, actionsCell) {
    const method = id ? 'PUT' : 'POST'; // Si hay un id, es una edición (PUT), de lo contrario es un nuevo rol (POST)
    const endpoint = id ? `${url}/${id}` : url; // Determina la URL correcta según si es una edición o creación

    // Recolecta los valores de los checkboxes de privilegios desde la fila del rol
    const privilegiosActualizados = {
        agregar: newRow.children[1].children[0].checked,
        visualizar: newRow.children[2].children[0].checked,
        editar: newRow.children[3].children[0].checked,
        eliminar: newRow.children[4].children[0].checked // Asegúrate de que esta línea esté bien
    };

    // Combina los privilegios actualizados con el resto de los datos del rol
    const roleDataUpdated = {
        ...roleData, // Mantiene el resto de la información del rol (nombre, estado)
        privilegios: privilegiosActualizados // Sobrescribe los privilegios con los nuevos valores
    };

    // Envía la solicitud al servidor para guardar el rol (POST o PUT según corresponda)
    fetch(endpoint, {
        method: method, // Determina si es POST o PUT
        headers: {
            'Content-Type': 'application/json' // Especifica que los datos están en formato JSON
        },
        body: JSON.stringify(roleDataUpdated) // Convierte los datos del rol en un string JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor'); // Maneja errores de la respuesta del servidor
        }
        return response.json(); // Convierte la respuesta en JSON si es exitosa
    })
    .then(data => {
        console.log('Rol guardado:', data); // Imprime el rol guardado en la consola

        // Deshabilitar los campos después de guardar
        newRow.children[0].children[0].disabled = true; // Deshabilita el campo del nombre del rol
        for (let i = 1; i <= 4; i++) { // Deshabilita los checkboxes de privilegios
            newRow.children[i].children[0].disabled = true;
        }

        // Si es un nuevo rol (no tenía id), actualiza la fila con los nuevos íconos de editar/eliminar
        if (!id) {
            addEditDeleteIcons(actionsCell, data, newRow); // Agrega los íconos de editar y eliminar
        } else {
            cargarRoles(); // Si es una edición, recarga los roles para reflejar los cambios
        }
    })
    .catch(error => console.error('Error al guardar el rol:', error)); // Muestra un error en la consola si la solicitud falla
}

// Función para actualizar el estado del rol (activar/desactivar) sin editar otros campos
function actualizarEstadoRol(id, estado) {
    fetch(`${url}/${id}/estado`, {
        method: 'PUT', // Método PUT para actualizar el estado
        headers: {
            'Content-Type': 'application/json' // Especifica que los datos están en formato JSON
        },
        body: JSON.stringify({ estado }) // Envía el estado actualizado en el cuerpo de la solicitud
    })
    .then(response => response.json()) // Convierte la respuesta en JSON
    .then(data => {
        console.log('Estado del rol actualizado:', data); // Imprime la respuesta en la consola
    })
    .catch(error => console.error('Error al actualizar el estado del rol:', error)); // Muestra un error en la consola si la solicitud falla
}

// Función para eliminar un rol
function eliminarRol(id, row) {
    if (confirm('¿Estás seguro de eliminar este rol?')) { // Muestra una confirmación antes de eliminar
        fetch(`${url}/${id}`, {
            method: 'DELETE' // Método DELETE para eliminar el rol
        })
        .then(() => {
            console.log('Rol eliminado'); // Imprime un mensaje de éxito en la consola
            row.remove(); // Elimina la fila correspondiente de la tabla
        })
        .catch(error => console.error('Error al eliminar el rol:', error)); // Muestra un error en la consola si la solicitud falla
    }
}

// Cargar los roles al iniciar la página
cargarRoles(); // Llama a la función cargarRoles para obtener y mostrar los roles al cargar la página
