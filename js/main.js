// main.js - Lógica JavaScript para Gestión de Clientes
// Configuración de la API
const API_URL = 'http://localhost:8889/api/clientes';
const modal = new bootstrap.Modal(document.getElementById('modalCliente'));

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function () {
  listarClientes();
  configurarBusqueda();
  configurarValidacionFormulario();
  mostrarAlerta(
    '🔥 Sistema épico de clientes iniciado correctamente',
    'success'
  );
});

//  FUNCIONES DE UTILIDAD

/**
 * Mostrar alertas al usuario
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de alerta (success, danger, warning, info)
 */
function mostrarAlerta(mensaje, tipo = 'info') {
  const alertContainer = document.getElementById('alert-container');
  const alertId = 'alert-' + Date.now();

  const alert = document.createElement('div');
  alert.id = alertId;
  alert.className = `alert alert-${tipo}-epic alert-dismissible fade show alert-epic`;

  const iconos = {
    success: 'fa-fire',
    danger: 'fa-exclamation-triangle',
    warning: 'fa-exclamation-circle',
    info: 'fa-info-circle',
  };

  alert.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${iconos[tipo] || 'fa-info-circle'} me-3 fs-4"></i>
            <span class="fw-bold">${mensaje}</span>
        </div>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
    `;

  alertContainer.appendChild(alert);

  // Auto-remover después de 5 segundos
  setTimeout(() => {
    const alertElement = document.getElementById(alertId);
    if (alertElement && alertElement.parentNode) {
      alertElement.remove();
    }
  }, 5000);
}

/**
 * Mostrar/ocultar indicador de carga
 * @param {boolean} show - Mostrar o ocultar
 */
function toggleLoading(show) {
  const loadingElement = document.getElementById('loading');
  if (loadingElement) {
    loadingElement.style.display = show ? 'block' : 'none';
  }
}

// FUNCIONES DE API

/**
 * Listar todos los clientes
 */
function listarClientes() {
  toggleLoading(true);

  fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Error HTTP: ${response.status} - ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
      console.log('🔥 Clientes épicos cargados:', data);
      renderizarTabla(data);
      mostrarAlerta(
        `⚔️ Se cargaron ${data.length} clientes correctamente`,
        'success'
      );
    })
    .catch((error) => {
      console.error('💥 Error al listar clientes:', error);
      mostrarAlerta(
        '💥 Error al cargar los clientes. Verifique que la API esté funcionando en el puerto 8889.',
        'danger'
      );
      renderizarTabla([]);
    })
    .finally(() => {
      toggleLoading(false);
    });
}

/**
 * Renderizar tabla de clientes
 * @param {Array} clientes - Array de clientes
 */
function renderizarTabla(clientes) {
  const tbody = document.getElementById('tabla-clientes');
  tbody.innerHTML = '';

  if (clientes.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-5">
                    <div class="text-muted">
                        <i class="fas fa-users fa-4x mb-3" style="color: var(--flame-red); opacity: 0.5;"></i>
                        <h4 style="color: var(--golden-yellow);">🔥 No hay clientes registrados</h4>
                        <p style="color: var(--ghost-white); opacity: 0.8;">¡Es hora de reclutar nuevos clientes para la batalla!</p>
                        <small style="color: var(--burning-orange);">Haz clic en "Nuevo Cliente" para comenzar</small>
                    </div>
                </td>
            </tr>
        `;
    return;
  }

  clientes.forEach((cliente, index) => {
    const tr = document.createElement('tr');
    tr.className = 'epic-fade-in';
    tr.style.animationDelay = `${index * 0.1}s`;

    tr.innerHTML = `
            <td data-label="ID" style="background: white !important;">
                <strong style="color: #0a0a0a !important; font-family: 'Orbitron', monospace; font-weight: 700;">
                    #${cliente.id}
                </strong>
            </td>
            <td data-label="Cédula" style="background: white !important;">
                <span class="badge badge-epic">
                    <i class="fas fa-id-card me-1"></i>
                    ${cliente.ci}
                </span>
            </td>
            <td data-label="Nombres" style="background: white !important;">
                <div style="color: #0a0a0a !important; font-weight: 600;">
                    <i class="fas fa-user me-2" style="color: #CC6600 !important;"></i>
                    ${cliente.nombres}
                </div>
            </td>
            <td data-label="Apellidos" style="background: white !important;">
                <div style="color: #0a0a0a !important; font-weight: 600;">
                    <i class="fas fa-users me-2" style="color: #CC6600 !important;"></i>
                    ${cliente.apellidos}
                </div>
            </td>
            <td data-label="Contacto" style="background: white !important;">
                <small style="color: #0a0a0a !important; display: block; max-width: 200px; overflow: hidden; text-overflow: ellipsis; font-weight: 500;">
                    <i class="fas fa-phone me-1" style="color: #B8860B !important;"></i>
                    ${cliente.contacto}
                </small>
            </td>
            <td data-label="Acciones" style="background: white !important;">
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-epic btn-warning-epic" onclick="editarCliente(${cliente.id})" 
                            title="Modificar cliente" data-bs-toggle="tooltip">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-epic btn-danger-epic" onclick="eliminarCliente(${cliente.id})" 
                            title="Eliminar cliente" data-bs-toggle="tooltip">
                        <i class="fas fa-skull"></i>
                    </button>
                </div>
            </td>
        `;
    tbody.appendChild(tr);
  });

  // Inicializar tooltips
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// FUNCIONES DE BÚSQUEDA

/**
 * Configurar búsqueda en tiempo real
 */
function configurarBusqueda() {
  const buscarInput = document.getElementById('buscar-input');
  let timeoutId;

  buscarInput.addEventListener('input', function () {
    clearTimeout(timeoutId);
    const termino = this.value.toLowerCase().trim();

    timeoutId = setTimeout(() => {
      if (termino === '') {
        listarClientes();
      } else {
        buscarClientes(termino);
      }
    }, 300); // Esperar 300ms después de que el usuario deje de escribir
  });

  // Limpiar búsqueda con Escape
  buscarInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      this.value = '';
      listarClientes();
    }
  });
}

/**
 * Buscar clientes por término
 * @param {string} termino - Término de búsqueda
 */
function buscarClientes(termino) {
  toggleLoading(true);

  fetch(API_URL)
    .then((response) => response.json())
    .then((clientes) => {
      const clientesFiltrados = clientes.filter(
        (cliente) =>
          cliente.nombres.toLowerCase().includes(termino) ||
          cliente.apellidos.toLowerCase().includes(termino) ||
          cliente.ci.includes(termino) ||
          cliente.contacto.toLowerCase().includes(termino)
      );

      renderizarTabla(clientesFiltrados);

      if (clientesFiltrados.length === 0) {
        mostrarAlerta(
          `🔍 No se encontraron clientes que coincidan con "${termino}"`,
          'warning'
        );
      } else {
        mostrarAlerta(
          `⚔️ Se encontraron ${clientesFiltrados.length} clientes épicos`,
          'info'
        );
      }
    })
    .catch((error) => {
      console.error('💥 Error en la búsqueda:', error);
      mostrarAlerta('💥 Error al realizar la búsqueda épica', 'danger');
    })
    .finally(() => {
      toggleLoading(false);
    });
}

// FUNCIONES DEL MODAL

/**
 * Abrir modal para nuevo cliente
 */
function abrirModalNuevo() {
  limpiarFormulario();
  document.getElementById('modal-title').innerHTML =
    '<i class="fas fa-user-plus me-2"></i>Nuevo Cliente';
  modal.show();
}

/**
 * Limpiar formulario del modal
 */
function limpiarFormulario() {
  document.getElementById('cliente-id').value = '';
  document.getElementById('ci').value = '';
  document.getElementById('nombres').value = '';
  document.getElementById('apellidos').value = '';
  document.getElementById('contacto').value = '';

  // Limpiar clases de validación
  const form = document.getElementById('form-cliente');
  const inputs = form.querySelectorAll('input');
  inputs.forEach((input) => {
    input.classList.remove('is-invalid', 'is-valid');
    const feedback = input.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
      feedback.textContent = '';
    }
  });
}

// FUNCIONES CRUD

/**
 * Guardar cliente (crear o actualizar)
 */
function guardarCliente() {
  if (!validarFormulario()) {
    mostrarAlerta(
      '⚠️ Por favor, corrija los errores en el formulario épico',
      'warning'
    );
    return;
  }

  const id = document.getElementById('cliente-id').value;
  const cliente = {
    ci: document.getElementById('ci').value.trim(),
    nombres: document.getElementById('nombres').value.trim(),
    apellidos: document.getElementById('apellidos').value.trim(),
    contacto: document.getElementById('contacto').value.trim(),
  };

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/${id}` : API_URL;
  const accion = id ? 'actualizado' : 'creado';

  // Deshabilitar botón para evitar doble envío
  const btnGuardar = document.querySelector('#modalCliente .btn-fire');
  const originalText = btnGuardar.innerHTML;
  btnGuardar.disabled = true;
  btnGuardar.innerHTML =
    '<i class="fas fa-spinner fa-spin me-2"></i>Guardando cliente...';

  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cliente),
  })
    .then((response) => {
      if (response.status === 409) {
        throw new Error(
          '⚔️ Ya existe un cliente registrado con esa cédula épica'
        );
      }
      if (response.status === 400) {
        throw new Error(
          '💥 Datos del cliente inválidos. Verifique la información épica ingresada.'
        );
      }
      if (!response.ok) {
        throw new Error(`💥 Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then((clienteGuardado) => {
      console.log('🔥 Cliente guardado:', clienteGuardado);
      modal.hide();
      listarClientes();
      mostrarAlerta(
        `⚔️ Cliente ${accion} correctamente en la batalla`,
        'success'
      );

      // Limpiar campo de búsqueda si existe
      const buscarInput = document.getElementById('buscar-input');
      if (buscarInput.value.trim()) {
        buscarInput.value = '';
      }
    })
    .catch((error) => {
      console.error('💥 Error al guardar cliente:', error);
      mostrarAlerta(error.message, 'danger');
    })
    .finally(() => {
      // Rehabilitar botón
      btnGuardar.disabled = false;
      btnGuardar.innerHTML = originalText;
    });
}

/**
 * Editar cliente existente
 * @param {number} id - ID del cliente
 */
function editarCliente(id) {
  fetch(`${API_URL}/${id}`)
    .then((response) => {
      if (response.status === 404) {
        throw new Error('🔍 Cliente no encontrado en el campo de batalla');
      }
      if (!response.ok) {
        throw new Error(`💥 Error al cargar cliente: ${response.status}`);
      }
      return response.json();
    })
    .then((cliente) => {
      console.log('🔥 Cliente cargado para edición:', cliente);

      // Llenar formulario
      document.getElementById('cliente-id').value = cliente.id;
      document.getElementById('ci').value = cliente.ci;
      document.getElementById('nombres').value = cliente.nombres;
      document.getElementById('apellidos').value = cliente.apellidos;
      document.getElementById('contacto').value = cliente.contacto;

      // Cambiar título del modal
      document.getElementById('modal-title').innerHTML =
        '<i class="fas fa-user-edit me-2"></i>Modificar Cliente';
      modal.show();
    })
    .catch((error) => {
      console.error('💥 Error al cargar cliente:', error);
      mostrarAlerta(error.message, 'danger');
    });
}

/**
 * Eliminar cliente
 * @param {number} id - ID del cliente
 */
function eliminarCliente(id) {
  // Primero obtener datos del cliente para mostrar en la confirmación
  fetch(`${API_URL}/${id}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('🔍 Cliente no encontrado');
    })
    .then((cliente) => {
      const mensaje =
        `⚔️ ¿Estás seguro de eliminar este cliente de la batalla?\n\n` +
        `🔥 Cliente: ${cliente.nombres} ${cliente.apellidos}\n` +
        `🆔 Cédula: ${cliente.ci}\n` +
        `📞 Contacto: ${cliente.contacto}\n\n` +
        `💀 Esta acción no se puede deshacer y el cliente será eliminado permanentemente.`;

      if (confirm(mensaje)) {
        realizarEliminacion(id);
      }
    })
    .catch((error) => {
      console.error('💥 Error al obtener datos del cliente:', error);
      // Si no se puede obtener la info, confirmar de forma simple
      if (
        confirm(
          '⚔️ ¿Estás seguro de eliminar este cliente?\n\n💀 Esta acción no se puede deshacer.'
        )
      ) {
        realizarEliminacion(id);
      }
    });
}

/**
 * Realizar eliminación del cliente
 * @param {number} id - ID del cliente
 */
function realizarEliminacion(id) {
  fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.status === 404) {
        throw new Error('🔍 Cliente no encontrado');
      }
      if (!response.ok) {
        throw new Error(`💥 Error al eliminar cliente: ${response.status}`);
      }

      console.log('💀 Cliente eliminado:', id);
      listarClientes();
      mostrarAlerta('💀 Cliente eliminado del campo de batalla', 'success');

      // Limpiar búsqueda si existe
      const buscarInput = document.getElementById('buscar-input');
      if (buscarInput.value.trim()) {
        buscarInput.value = '';
      }
    })
    .catch((error) => {
      console.error('💥 Error al eliminar cliente:', error);
      mostrarAlerta(error.message, 'danger');
    });
}

// VALIDACIONES

/**
 * Configurar validación épica en tiempo real del formulario
 */
function configurarValidacionFormulario() {
  const inputs = document.querySelectorAll('#form-cliente input[required]');

  inputs.forEach((input) => {
    input.addEventListener('blur', () => validarCampo(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        validarCampo(input);
      }
    });
  });
}

/**
 * Validar un campo específico épico
 * @param {HTMLElement} input - Campo a validar
 */
function validarCampo(input) {
  const valor = input.value.trim();
  const feedbackEl = input.nextElementSibling;

  // Limpiar clases anteriores
  input.classList.remove('is-invalid', 'is-valid');

  if (!valor) {
    input.classList.add('is-invalid');
    feedbackEl.textContent = '⚠️ Este campo épico es obligatorio';
    return false;
  }

  // Validaciones específicas por campo
  let esValido = true;
  let mensaje = '';

  switch (input.id) {
    case 'ci':
      if (!/^\d{10}$/.test(valor)) {
        esValido = false;
        mensaje = '🆔 La cédula épica debe tener exactamente 10 dígitos';
      }
      break;

    case 'nombres':
    case 'apellidos':
      if (valor.length < 2) {
        esValido = false;
        mensaje = '⚔️ Debe tener al menos 2 caracteres épicos';
      } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(valor)) {
        esValido = false;
        mensaje = '🔥 Solo se permiten letras y espacios épicos';
      }
      break;

    case 'contacto':
      if (valor.length < 5) {
        esValido = false;
        mensaje = '📞 El contacto debe tener al menos 5 caracteres épicos';
      }
      break;
  }

  if (esValido) {
    input.classList.add('is-valid');
    feedbackEl.textContent = '';
  } else {
    input.classList.add('is-invalid');
    feedbackEl.textContent = mensaje;
  }

  return esValido;
}

/**
 * Validar todo el formulario épico
 * @returns {boolean} True si es válido
 */
function validarFormulario() {
  const form = document.getElementById('form-cliente');
  const inputs = form.querySelectorAll('input[required]');
  let esValido = true;

  inputs.forEach((input) => {
    if (!validarCampo(input)) {
      esValido = false;
    }
  });

  return esValido;
}

// FUNCIONES DE UTILIDAD ADICIONALES

/**
 * Formatear texto para mostrar
 * @param {string} texto - Texto a formatear
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto formateado
 */
function truncateText(texto, maxLength = 30) {
  if (texto.length > maxLength) {
    return texto.substring(0, maxLength) + '...';
  }
  return texto;
}

/**
 * Exportar datos a CSV
 */
function exportarCSV() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((clientes) => {
      const csvContent = [
        ['ID', 'Cédula', 'Nombres', 'Apellidos', 'Contacto'],
        ...clientes.map((c) => [
          c.id,
          c.ci,
          c.nombres,
          c.apellidos,
          c.contacto,
        ]),
      ]
        .map((row) => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clientes_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      mostrarAlerta(
        '📊 Archivo CSV de clientes descargado correctamente',
        'success'
      );
    })
    .catch((error) => {
      console.error('💥 Error al exportar:', error);
      mostrarAlerta('💥 Error al exportar datos épicos', 'danger');
    });
}

// EVENTOS GLOBALES

// Manejar errores de red globalmente
window.addEventListener('online', () => {
  mostrarAlerta(
    '🔥 Conexión épica restaurada - ¡La batalla continúa!',
    'success'
  );
});

window.addEventListener('offline', () => {
  mostrarAlerta('⚠️ Conexión perdida - Modo offline activado', 'warning');
});

// Confirmación antes de cerrar si hay cambios sin guardar
window.addEventListener('beforeunload', (e) => {
  const form = document.getElementById('form-cliente');
  const hasChanges = Array.from(form.querySelectorAll('input')).some((input) =>
    input.value.trim()
  );
  const modalIsOpen = document
    .getElementById('modalCliente')
    .classList.contains('show');

  if (modalIsOpen && hasChanges) {
    e.preventDefault();
    e.returnValue = '';
  }
});

console.log(
  '🔥⚔️ Sistema Épico de Gestión de Clientes cargado correctamente ⚔️🔥'
);
