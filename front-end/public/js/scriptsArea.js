const urlAreas = 'http://localhost:3000/api/area'; // URL del backend para áreas

// Función para cargar áreas desde la base de datos
function cargarAreas() {
    fetch(urlAreas)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('areas-tbody');
            tbody.innerHTML = ''; // Limpiar tabla antes de cargar
            data.forEach(area => {
                const newRow = crearFilaDeArea(area);
                tbody.appendChild(newRow);
            });
        })
        .catch(error => console.error('Error al cargar áreas:', error));
}

// Función para crear una fila de área
function crearFilaDeArea(area) {
    const newRow = document.createElement('tr');
    newRow.dataset.id = area._id; // Agregar ID a la fila
    newRow.classList.add('hover:bg-gray-100', 'hover-effect');

    // Crear la celda para el nombre del área
    const areaNameCell = document.createElement('td');
    areaNameCell.classList.add('px-2', 'py-2', 'border-b', 'border-gray-300');
    areaNameCell.textContent = area.nombre; // Mostrar el nombre del área
    newRow.appendChild(areaNameCell);

    // Crear la celda para configurar permisos
    const configCell = document.createElement('td');
    configCell.classList.add('px-2', 'py-1', 'border-b', 'border-gray-300', 'text-center');
    const configButton = document.createElement('button');
    configButton.classList.add('mx-1');
    configButton.innerHTML = `<img src="/public/icons/icons8-configuración-de-datos-50.png" alt="Configurar Permisos" class="h-6 w-full">`;
    configButton.addEventListener('click', function () {
        window.location.href = `/public/views/configuPermisos.html?id=${area._id}`;
    });
    configCell.appendChild(configButton);
    newRow.appendChild(configCell);

    // Toggle de estado (Activo/Inactivo)
    const toggleCell = document.createElement('td');
    toggleCell.classList.add('px-4', 'py-2', 'border-b', 'border-gray-300', 'text-center');
    const toggleSwitch = document.createElement('label');
    toggleSwitch.classList.add('relative', 'inline-flex', 'items-center', 'cursor-pointer');
    toggleSwitch.innerHTML = `
        <input type="checkbox" class="sr-only peer" ${area.estado ? 'checked' : ''}>
        <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 
                    peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                    after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                    after:transition-all peer-checked:bg-blue-400"></div>
    `;

    const checkbox = toggleSwitch.querySelector('input');
    checkbox.addEventListener('change', function () {
        modificarEstado(area._id, this.checked); // Actualizar el estado en la base de datos
        area.estado = this.checked; // Actualiza el estado localmente
    });

    toggleCell.appendChild(toggleSwitch);
    newRow.appendChild(toggleCell);

    // Celda para acciones (Editar, Eliminar)
    const actionsCell = document.createElement('td');
    actionsCell.classList.add('px-4', 'py-2', 'border-b', 'border-gray-300', 'text-center');

    // Botón de editar
    const editButton = document.createElement('button');
    editButton.classList.add('mx-1');
    editButton.innerHTML = `<img src="/public/icons/icons8-editar.svg" alt="Editar" class="h-6 w-6">`;
    editButton.onclick = () => editAreaInline(newRow, area); // Edición inline
    actionsCell.appendChild(editButton);

    // Botón de eliminar
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('mx-1');
    deleteButton.innerHTML = `<img src="/public/icons/icons8-eliminar.svg" alt="Eliminar" class="h-6 w-6">`;
    deleteButton.onclick = () => deleteArea(area._id);
    actionsCell.appendChild(deleteButton);

    newRow.appendChild(actionsCell);
    return newRow;
}

// Función para editar inline un área
function editAreaInline(row, area) {
    const nombreActual = area.nombre;
    const nombreInput = document.createElement('input');
    nombreInput.type = 'text';
    nombreInput.value = nombreActual;
    nombreInput.classList.add('bg-transparent', 'outline-none', 'focus:ring-0', 'text-gray-700', 'w-full');

    const nameCell = row.querySelector('td:first-child');
    nameCell.innerHTML = ''; // Limpiar celda
    nameCell.appendChild(nombreInput); // Reemplazar con input

    const actionsCell = row.querySelector('td:last-child');
    actionsCell.innerHTML = ''; // Limpiar celda de acciones

    const saveButton = document.createElement('button');
    saveButton.classList.add('mx-1');
    saveButton.innerHTML = `<img src="/public/icons/icons8-marca-de-verificación.svg" alt="Guardar" class="h-6 w-6">`;
    
    saveButton.addEventListener('click', function () {
        const nuevoNombre = nombreInput.value.trim();
        if (nuevoNombre) {
            saveArea(area._id, { nombre: nuevoNombre }); // Guardar el área con el nuevo nombre
        } else {
            alert('El nombre del área no puede estar vacío.');
        }
    });

    actionsCell.appendChild(saveButton); // Mostrar botón de guardar
}

// Función para guardar un área nueva o actualizada
function saveArea(id, areaData) {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${urlAreas}/${id}` : urlAreas;

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(areaData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar el área');
        }
        console.log('Área guardada correctamente');
        cargarAreas(); // Recargar las áreas después de guardar
    })
    .catch(error => console.error('Error al guardar el área:', error));
}

// Función para modificar el estado del área
function modificarEstado(id, nuevoEstado) {
    fetch(`${urlAreas}/${id}/estado`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: nuevoEstado }) // Enviamos el nuevo estado
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al modificar el estado');
        }
        console.log('Estado modificado correctamente');
    })
    .catch(error => console.error('Error al modificar el estado:', error));
}

// Función para eliminar un área
function deleteArea(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta área?')) {
        fetch(`${urlAreas}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el área');
            }
            console.log('Área eliminada correctamente');
            cargarAreas(); // Recargar áreas después de eliminar
        })
        .catch(error => console.error('Error al eliminar el área:', error));
    }
}

// Función para agregar una nueva área
function addNewArea() {
    const tbody = document.getElementById('areas-tbody');
    const newRow = document.createElement('tr');

    // Crear la celda para el nombre del área
    const areaNameCell = document.createElement('td');
    areaNameCell.classList.add('px-2', 'py-2', 'border-b', 'border-gray-300');
    const areaNameInput = document.createElement('input');
    areaNameInput.type = 'text';
    areaNameInput.placeholder = 'Nombre área'; 
    areaNameInput.classList.add('bg-transparent', 'outline-none', 'focus:ring-0', 'text-gray-700', 'w-full');
    areaNameCell.appendChild(areaNameInput);
    newRow.appendChild(areaNameCell);

    // Crear la celda para configurar permisos
    const configCell = document.createElement('td');
    configCell.classList.add('px-2', 'py-1', 'border-b', 'border-gray-300', 'text-center');
    const configButton = document.createElement('button');
    configButton.classList.add('mx-1');
    configButton.innerHTML = `<img src="/public/icons/icons8-configuración-de-datos-50.png" alt="Configurar Permisos" class="h-6 w-full">`;
    configButton.addEventListener('click', function () {
        alert('Primero guarda el área antes de configurar permisos.');
    });
    configCell.appendChild(configButton);
    newRow.appendChild(configCell);

    // Crear la celda para el estado (toggle)
    const toggleCell = document.createElement('td');
    toggleCell.classList.add('px-4', 'py-2', 'border-b', 'border-gray-300', 'text-center');
    const toggleSwitch = document.createElement('label');
    toggleSwitch.classList.add('relative', 'inline-flex', 'items-center', 'cursor-pointer');
    toggleSwitch.innerHTML = `
        <input type="checkbox" class="sr-only peer">
        <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 
                    peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                    after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                    after:transition-all peer-checked:bg-blue-400"></div>
    `;

    toggleCell.appendChild(toggleSwitch);
    newRow.appendChild(toggleCell);

    // Crear la celda para las acciones (Guardar)
    const actionsCell = document.createElement('td');
    actionsCell.classList.add('px-4', 'py-2', 'border-b', 'border-gray-300', 'text-center');

    const saveButton = document.createElement('button');
    saveButton.classList.add('mx-1');
    saveButton.innerHTML = `<img src="/public/icons/icons8-marca-de-verificación.svg" alt="Guardar" class="h-6 w-6">`;
    saveButton.addEventListener('click', function () {
        const nombre = areaNameInput.value.trim();
        const estado = toggleSwitch.querySelector('input').checked;
        if (nombre) {
            saveArea(null, { nombre: nombre, estado: estado });
        } else {
            alert('El nombre del área no puede estar vacío.');
        }
    });

    actionsCell.appendChild(saveButton);
    newRow.appendChild(actionsCell);

    tbody.appendChild(newRow);
}

// Cargar áreas cuando se cargue la página
window.onload = cargarAreas;
