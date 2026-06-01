
import { servicios } from './data.js';

// --- 1. GESTOR DE FAVORITOS ---
function toggleFavorito(id, botonElemento) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(fId => fId !== id);
        if (botonElemento) botonElemento.classList.remove('activo');
    } else {
        favoritos.push(id);
        if (botonElemento) botonElemento.classList.add('activo');
    }
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    
    // Refrescamos ambas secciones al instante para mantener todo sincronizado
    renderizarServicios(servicios);
    renderizarFavoritos();
}

// --- 2. RENDERIZADO CATÁLOGO COMPLETO ---
function renderizarServicios(lista) {
    const contenedor = document.getElementById("contenedor-servicios-dinamico");
    if (!contenedor) return;

    contenedor.innerHTML = ""; 
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    lista.forEach(item => {
        const card = document.createElement("article");
        card.className = "servicio-card";
        
        const btn = document.createElement("button");
        btn.className = "btn-favorito";
        btn.textContent = "❤️";
        if (favoritos.includes(item.id)) btn.classList.add('activo');
        
        btn.onclick = () => toggleFavorito(item.id, btn);

        card.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" class="img-referencia">
            <h3>${item.nombre}</h3>
            <p>${item.descripcion}</p>
            <span class="precio">$${item.precio.toLocaleString()}</span>
        `;
        card.appendChild(btn);
        contenedor.appendChild(card);
    });
}

// --- 3. RENDERIZADO SECCIÓN FAVORITOS ---
function renderizarFavoritos() {
    const contenedor = document.getElementById("contenedor-favorites") || document.getElementById("contenedor-favoritos");
    if (!contenedor) return;
    
    const ids = JSON.parse(localStorage.getItem('favoritos')) || [];
    const filtrados = servicios.filter(s => ids.includes(s.id));
    
    contenedor.innerHTML = "";

    if (filtrados.length === 0) {
        contenedor.innerHTML = "<p style='text-align: center; width: 100%; grid-column: 1 / -1; color: #aaa; padding: 20px;'>Aún no has marcado ningún servicio con corazón.</p>";
        return;
    }

    filtrados.forEach(item => {
        const card = document.createElement("article");
        card.className = "servicio-card";
        
        const btn = document.createElement("button");
        btn.className = "btn-favorito activo";
        btn.textContent = "❤️";
        
        btn.onclick = () => toggleFavorito(item.id, btn);

        card.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" class="img-referencia">
            <h3>${item.nombre}</h3>
            <p>${item.descripcion}</p>
            <span class="precio">$${item.precio.toLocaleString()}</span>
        `;
        card.appendChild(btn);
        contenedor.appendChild(card);
    });
}

// --- 4. CONTROL DE NAVEGACIÓN Y FILTROS ---
document.addEventListener("DOMContentLoaded", () => {
    // Dibujamos ambas secciones inicialmente
    renderizarServicios(servicios);
    renderizarFavoritos();

    // Capturamos los contenedores de secciones
    const btnFav = document.getElementById('btn-nav-favoritos');
    const btnVolver = document.getElementById('btn-volver-servicios');
    const secServicios = document.getElementById('servicios');
    const secFavoritos = document.getElementById('seccion-favoritos');

    // Al hacer click en "❤️ Favoritos" en el menú superior
    if (btnFav && secServicios && secFavoritos) {
        btnFav.addEventListener('click', (e) => {
            e.preventDefault();
            secServicios.style.display = 'none';
            secFavoritos.style.display = 'block';
            secFavoritos.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Al hacer click en "← Volver a Servicios"
    if (btnVolver && secServicios && secFavoritos) {
        btnVolver.addEventListener('click', () => {
            secFavoritos.style.display = 'none';
            secServicios.style.display = 'block';
            secServicios.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Filtros de categorías tradicionales
    const btnTodos = document.getElementById('btn-todos');
    const btnOreja = document.getElementById('btn-oreja');
    const btnFacial = document.getElementById('btn-facial');
    const btnAvanzado = document.getElementById('btn-avanzado');

    if(btnTodos) btnTodos.addEventListener('click', () => renderizarServicios(servicios));
    if(btnOreja) btnOreja.addEventListener('click', () => renderizarServicios(servicios.filter(s => s.categoria === 'oreja')));
    if(btnFacial) btnFacial.addEventListener('click', () => renderizarServicios(servicios.filter(s => s.categoria === 'facial')));
    if(btnAvanzado) btnAvanzado.addEventListener('click', () => renderizarServicios(servicios.filter(s => s.categoria === 'avanzado')));
});