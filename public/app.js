const STORAGE_KEY = "alumnos";

const formAlta = document.getElementById("form-alta");
const mensajeForm = document.getElementById("mensaje-form");
const formFiltro = document.getElementById("form-filtro");
const btnLimpiarFiltro = document.getElementById("btn-limpiar-filtro");
const btnBorrarTodos = document.getElementById("btn-borrar-todos");
const tablaBody = document.getElementById("tabla-alumnos-body");
const sinResultados = document.getElementById("sin-resultados");
const contador = document.getElementById("contador-alumnos");

function obtenerAlumnos() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function guardarAlumnos(alumnos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alumnos));
}

function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function mostrarMensaje(texto, tipo) {
  mensajeForm.textContent = texto;
  mensajeForm.className = "mensaje " + tipo;
}

function formatearFecha(fechaISO) {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
}

function renderizarAlumnos(alumnos) {
  tablaBody.innerHTML = "";

  alumnos.forEach((alumno) => {
    const fila = document.createElement("tr");
    fila.dataset.testid = "fila-alumno";
    fila.dataset.legajo = alumno.legajo;

    fila.innerHTML = `
      <td>${alumno.nombre}</td>
      <td>${alumno.apellido}</td>
      <td>${formatearFecha(alumno.fechaNacimiento)}</td>
      <td>${alumno.legajo}</td>
      <td>${alumno.carrera}</td>
      <td>${alumno.genero || "-"}</td>
      <td><button type="button" class="btn-eliminar" data-testid="btn-eliminar" data-id="${alumno.id}">Eliminar</button></td>
    `;

    tablaBody.appendChild(fila);
  });

  sinResultados.hidden = alumnos.length > 0;
  contador.textContent = `${alumnos.length} alumno${alumnos.length === 1 ? "" : "s"}`;
}

function aplicarFiltros() {
  const alumnos = obtenerAlumnos();
  const nombre = document.getElementById("filtro-nombre").value.trim().toLowerCase();
  const apellido = document.getElementById("filtro-apellido").value.trim().toLowerCase();
  const legajo = document.getElementById("filtro-legajo").value.trim().toLowerCase();
  const carrera = document.getElementById("filtro-carrera").value;
  const fechaDesde = document.getElementById("filtro-fecha-desde").value;
  const fechaHasta = document.getElementById("filtro-fecha-hasta").value;

  const filtrados = alumnos.filter((alumno) => {
    if (nombre && !alumno.nombre.toLowerCase().includes(nombre)) return false;
    if (apellido && !alumno.apellido.toLowerCase().includes(apellido)) return false;
    if (legajo && !alumno.legajo.toLowerCase().includes(legajo)) return false;
    if (carrera && alumno.carrera !== carrera) return false;
    if (fechaDesde && alumno.fechaNacimiento < fechaDesde) return false;
    if (fechaHasta && alumno.fechaNacimiento > fechaHasta) return false;
    return true;
  });

  renderizarAlumnos(filtrados);
}

formAlta.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;
  const legajo = document.getElementById("legajo").value.trim();
  const carrera = document.getElementById("carrera").value;
  const genero = document.getElementById("genero").value.trim();

  if (!nombre || !apellido || !fechaNacimiento || !legajo || !carrera) {
    mostrarMensaje("Completá todos los campos.", "error");
    return;
  }

  const alumnos = obtenerAlumnos();

  if (alumnos.some((a) => a.legajo.toLowerCase() === legajo.toLowerCase())) {
    mostrarMensaje(`Ya existe un alumno con el legajo ${legajo}.`, "error");
    return;
  }

  alumnos.push({
    id: generarId(),
    nombre,
    apellido,
    fechaNacimiento,
    legajo,
    carrera,
    genero,
  });

  guardarAlumnos(alumnos);
  formAlta.reset();
  mostrarMensaje(`Alumno ${nombre} ${apellido} agregado correctamente.`, "exito");
  aplicarFiltros();
});

formFiltro.addEventListener("submit", (evento) => {
  evento.preventDefault();
  aplicarFiltros();
});

btnLimpiarFiltro.addEventListener("click", () => {
  formFiltro.reset();
  aplicarFiltros();
});

btnBorrarTodos.addEventListener("click", () => {
  if (obtenerAlumnos().length === 0) return;
  const confirmado = confirm("¿Seguro que querés borrar todos los alumnos?");
  if (!confirmado) return;
  guardarAlumnos([]);
  aplicarFiltros();
});

tablaBody.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".btn-eliminar");
  if (!boton) return;

  const id = boton.dataset.id;
  const alumnos = obtenerAlumnos().filter((a) => a.id !== id);
  guardarAlumnos(alumnos);
  aplicarFiltros();
});

aplicarFiltros();
