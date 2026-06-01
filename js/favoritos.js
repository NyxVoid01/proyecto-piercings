
import { servicios } from './data.js';

document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-favoritos");
    const idsFavoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const listaFavoritos = servicios.filter(s => idsFavoritos.includes(s.id));

    if (listaFavoritos.length === 0) {
        contenedor.innerHTML = "<p>Aún no tienes servicios en tu lista de deseados.</p>";
        return;
    }

    listaFavoritos.forEach(item => {
        const card = document.createElement("article");
        card.className = "servicio-card";
        card.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" class="img-referencia">
            <h3>${item.nombre}</h3>
            <p>${item.descripcion}</p>
            <span class="precio">$${item.precio.toLocaleString()}</span>
        `;
        contenedor.appendChild(card);
    });
});