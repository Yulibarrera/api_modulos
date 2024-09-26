// Simulación de permisos por área
const permisosData = {
    diseno: ["Colección", "Delivery", "Referencia", "Estilo", "Línea"],
    produccion: ["Orden", "Tamaño", "Material"],
    calidad: ["Revisión", "Aprobación"]
};

// Cargar permisos dinámicamente cuando se selecciona un área
document.getElementById('selectArea').addEventListener('change', function() {
    const area = this.value; // Obtener el área seleccionada
    renderPermisos(area); // Llamar a la función para renderizar permisos de esa área
});

// Función para renderizar los permisos según el área seleccionada
function renderPermisos(selectedArea) {
    const container = document.getElementById('permisos-container'); // Obtener el contenedor para los permisos
    container.innerHTML = ''; // Limpiar contenido anterior

    // Recorremos todas las áreas para mostrar los permisos de cada una, separados en secciones
    Object.keys(permisosData).forEach(area => {
        const areaContainer = document.createElement('div'); // Crear un contenedor para cada área
        areaContainer.classList.add('mb-6', 'border', 'p-4', 'rounded-lg', 'bg-gray-50'); // Agregar estilos

        // Crear un título para el área
        const areaTitle = document.createElement('h2');
        areaTitle.textContent = area === selectedArea ? `${area} (Área Seleccionada)` : area; // Resaltar área seleccionada
        areaTitle.classList.add('text-lg', 'font-semibold', 'mb-2'); // Agregar clases para estilos
        areaContainer.appendChild(areaTitle); // Agregar el título al contenedor del área

        const table = document.createElement('table'); // Crear una tabla para los permisos
        table.classList.add('w-full', 'border-collapse'); // Agregar clases para estilos

        // Crear el encabezado de la tabla
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th class="px-4 py-2 border-b border-gray-300 text-left">Permiso (Campo)</th>
                <th class="px-4 py-2 border-b border-gray-300 text-center">Agregar</th>
                <th class="px-4 py-2 border-b border-gray-300 text-center">Editar</th>
                <th class="px-4 py-2 border-b border-gray-300 text-center">Visualizar</th>
                <th class="px-4 py-2 border-b border-gray-300 text-center">Eliminar</th>
            </tr>
        `;
        table.appendChild(thead); // Agregar el encabezado a la tabla

        const tbody = document.createElement('tbody'); // Crear el cuerpo de la tabla
        // Iterar sobre los permisos de cada área y crear filas en la tabla
        permisosData[area].forEach(permiso => {
            const row = document.createElement('tr'); // Crear una nueva fila
            row.innerHTML = `
                <td class="px-4 py-2 border-b border-gray-300">${permiso}</td>
                <td class="px-4 py-2 border-b border-gray-300 text-center"><input type="checkbox" name="agregar-${area}-${permiso}" /></td>
                <td class="px-4 py-2 border-b border-gray-300 text-center"><input type="checkbox" name="editar-${area}-${permiso}" /></td>
                <td class="px-4 py-2 border-b border-gray-300 text-center"><input type="checkbox" name="visualizar-${area}-${permiso}" /></td>
                <td class="px-4 py-2 border-b border-gray-300 text-center"><input type="checkbox" name="eliminar-${area}-${permiso}" /></td>
            `; // Crear celdas para cada permiso con checkboxes para las acciones
            tbody.appendChild(row); // Agregar la fila al cuerpo de la tabla
        });
        table.appendChild(tbody); // Agregar el cuerpo a la tabla
        areaContainer.appendChild(table); // Agregar la tabla al contenedor del área
        container.appendChild(areaContainer); // Agregar el contenedor del área al contenedor principal
    });
}

// Función para agregar un nuevo permiso a un área
function addNewPermiso() {
    const selectedArea = document.getElementById('selectArea').value; // Obtener el área seleccionada
    const newPermiso = prompt("Nombre del nuevo permiso para el área de " + selectedArea + ":"); // Solicitar el nombre del nuevo permiso
    if (newPermiso) { // Si se proporciona un nombre
        permisosData[selectedArea].push(newPermiso); // Agregar el nuevo permiso a la lista de permisos del área
        renderPermisos(selectedArea); // Volver a renderizar los permisos para mostrar el nuevo permiso
    }
}

// Inicializar la vista de permisos al cargar el documento
document.addEventListener('DOMContentLoaded', function() {
    const defaultArea = document.getElementById('selectArea').value; // Obtener el área seleccionada por defecto
    renderPermisos(defaultArea); // Renderizar los permisos para el área seleccionada
});
