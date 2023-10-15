const ulLista = document.getElementById("lista");
const URL = " https://japceibal.github.io/japflix_api/movies-data.json";

async function fetchData(URL) {
    try {
        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error("Error: exploto");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("No funcionó", error);
    }
}

// FUNCIÓN QUE CARGA LOS PELICULAS EN EL HTML
async function cargarPeliculasEnHTML(peliculas) {
    ulLista.innerHTML = "";
    for (let pelicula of peliculas) {
        ulLista.innerHTML += cartaPelicula(pelicula);
    }
}

// FUNCIÓN PARA OBTENER EL FORMATO DE ESTRELLAS PARA LA PUNTUACIÓN
function putStars(cantidadStars) {
    const filledStars = "🍅".repeat(cantidadStars);
    const emptyStars = "🍏".repeat(10 - cantidadStars);
    return `<span class="checked">${filledStars}</span>${emptyStars}`;
}

// FUNCIÓN QUE DEFINE EL DISEÑO DE CARTAS EN HTML
function cartaPelicula(pelicula) {
    const id = pelicula.id;
    const cartaPelicula = `
    <button type="button" class="btn btn-transparent" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" onclick="infoPeli(${id})">
    <li class="item" name="${id}">
        <div class="ulLista-texto text-white" name="${id}">
            <p class="titulo text-white" id="titulo${id}" name="${id}">${pelicula.title}</p>
            <p class="tagline text-white" id="tagline${id}" name="${id}">${pelicula.tagline}</p>
            <p class="voto" id="voto${id}" name="${id}">${putStars(pelicula.vote_average)}</p>
        </div>
    </li>
    </button> 
    
        `;
    return cartaPelicula;
}
async function infoPeli(id) {
   const peliculas = await fetchData(URL);
    const peli = peliculas.find(peli => peli.id === id);
    const offcanvas = document.getElementById("offcanvasRight");

    // Modifica el título del Offcanvas
    const tituloElement = offcanvas.querySelector(".offcanvas-title");
    tituloElement.textContent = peli.title;

    // Modifica el contenido dentro del Offcanvas
    const yearElement = offcanvas.querySelector("#year");
    yearElement.innerHTML = `Year: <span>${peli.release_date.slice(0, 4)}</span>`;

    const runtimeElement = offcanvas.querySelector("#runtime");
    runtimeElement.innerHTML = `Runtime: <span>${peli.runtime}</span> mins`;

    const budgetElement = offcanvas.querySelector("#budget");
    budgetElement.innerHTML = `Budget: $<span>${peli.budget}</span>`;

    const revenueElement = offcanvas.querySelector("#revenue");
    revenueElement.innerHTML = `Revenue: $<span>${peli.revenue}</span>`;


    
}

document.addEventListener("DOMContentLoaded", async () => {
    const peliculas = await fetchData(URL);
    console.log(peliculas);

    const btnBuscar = document.getElementById("btnBuscar");

    btnBuscar.addEventListener("click", () => {
        const inputBuscar = document.getElementById("inputBuscar").value.toLowerCase();
        ulLista.innerHTML = "";

        const peliculaFiltrada = peliculas.filter((pelicula) => {
            return (
                pelicula.title.toLowerCase().includes(inputBuscar) ||
                pelicula.overview.toLowerCase().includes(inputBuscar) ||
                pelicula.tagline.toLowerCase().includes(inputBuscar) ||
                pelicula.genres.some((genero) =>
                    genero.name.toLowerCase().includes(inputBuscar)
                )
            )
        });
        console.log(peliculaFiltrada)
        cargarPeliculasEnHTML(peliculaFiltrada)


    });
});
