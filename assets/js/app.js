const API_URL = "https://thesimpsonsapi.com/api/characters";
const CDN_URL = "https://cdn.thesimpsonsapi.com/500";

const contenedor = document.getElementById("cartaPj");
const mensaje = document.getElementById("mensajeEstado");
const inputBuscar = document.getElementById("buscarPj");
const formBuscar = document.getElementById("formBuscar");
const btnLimpiar = document.getElementById("btnLimpiar");

let personajes = [];

async function obtenerPersonajes() {
  try {

    const respuesta = await fetch(API_URL);

    const datos = await respuesta.json();

    personajes = datos.results;

    mostrarPersonajes(personajes);
  } catch (error) {
    console.log(error);
    mensaje.innerHTML = `<div class="alert alert-danger">No se pudieron cargar los personajes</div>`;
  }
}

function mostrarPersonajes(lista) {

  contenedor.innerHTML = "";

  if (lista.length === 0) {
    mensaje.innerHTML = `<div class="alert alert-warning">No se encontraron personajes</div>`;

    return;
  }

  mensaje.innerHTML = "";
  
  lista.forEach((personaje) => {

    const imagen = CDN_URL + personaje.portrait_path;

    contenedor.innerHTML += `
      <div class="col-md-3">
        <div class="card h-100">
          <img src="${imagen}" class="card-img-top" alt="${personaje.name}">
          <div class="card-body">
            <h5 class="card-title">${personaje.name}</h5>
            <p class="card-text">Ocupación: ${personaje.occupation}</p>
            <p class="card-text">Estado: ${personaje.status}</p>
            <button class="btn btn-warning btn-detalle" data-id="${personaje.id}">
              Ver detalle
            </button>
          </div>
        </div>
      </div>
        `;
  });
}

function filtrarPersonajes() {

  const texto = inputBuscar.value.trim().toLowerCase();

  if (texto === "") {
    mostrarPersonajes(personajes);
    return;
  }

  const filtrados = personajes.filter((personaje) =>

    personaje.name.toLowerCase().includes(texto),
  );
  mostrarPersonajes(filtrados);
}

async function obtenerDetalle(id) {
  try {

    const respuesta = await fetch(`${API_URL}/${id}`);

    const personaje = await respuesta.json();

    mostrarModal(personaje);

  } catch (error) {
    console.log(error);
    alert("No se pudo cargar el detalle del personaje");
  }
}

function mostrarModal(personaje) {

  document.getElementById("modalNombre").textContent = personaje.name;
  document.getElementById("modalImagen").src =
    CDN_URL + personaje.portrait_path;

  document.getElementById("modalEdad").textContent =
    personaje.age ?? "Desconocida";
  document.getElementById("modalNacimiento").textContent =
    personaje.birthdate ?? "Desconocida";
  document.getElementById("modalGenero").textContent =
    personaje.gender ?? "Desconocido";
  document.getElementById("modalOcupacion").textContent = personaje.occupation;
  document.getElementById("modalEstado").textContent = personaje.status;

  document.getElementById("modalFrase").textContent =
    personaje.phrases[0] ?? "Sin frases";


  const modal = new bootstrap.Modal(document.getElementById("modalDetalle"));
  modal.show();
}

document.addEventListener("DOMContentLoaded", obtenerPersonajes);

inputBuscar.addEventListener("input", filtrarPersonajes);

contenedor.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-detalle")) {
    const id = event.target.dataset.id;
    obtenerDetalle(id);
  }
});

formBuscar.addEventListener("submit", (event) => {
  event.preventDefault();
  inputBuscar.value = "";
  mostrarPersonajes(personajes);
});