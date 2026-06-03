
import { servicios } from './data.js';

// --- ESTADO GLOBAL (Declarado una sola vez) ---
let categoriaActual = 'todos';
let terminoBusqueda = "";

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
    
    // Refrescamos la vista actual sin perder el filtro
    aplicarFiltros(); 
    renderizarFavoritos();
}

// --- 2. RENDERIZADO CATÁLOGO (Usa la lógica de aplicarFiltros) ---
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

// --- FUNCIÓN CENTRALIZADA DE FILTROS (CON NORMALIZACIÓN) ---
function aplicarFiltros() {
    // Función auxiliar para quitar acentos
    const normalizar = (texto) => {
        return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const terminoNormalizado = normalizar(terminoBusqueda);

    const filtrados = servicios.filter(s => {
        const coincideCategoria = categoriaActual === 'todos' || s.categoria === categoriaActual;
        const nombreNormalizado = normalizar(s.nombre);
        const coincideTexto = nombreNormalizado.includes(terminoNormalizado);
        
        return coincideCategoria && coincideTexto;
    });

    renderizarServicios(filtrados);
}

// --- 5. CONTROL DE NAVEGACIÓN Y EVENTOS ---
document.addEventListener("DOMContentLoaded", () => {
    // Renderizado inicial
    renderizarServicios(servicios);
    renderizarFavoritos();

    // Navegación
    const btnFav = document.getElementById('btn-nav-favoritos');
    const btnVolver = document.getElementById('btn-volver-servicios');
    const secServicios = document.getElementById('servicios');
    const secFavoritos = document.getElementById('seccion-favoritos');

    if (btnFav && secServicios && secFavoritos) {
        btnFav.addEventListener('click', (e) => {
            e.preventDefault();
            secServicios.style.display = 'none';
            secFavoritos.style.display = 'block';
            secFavoritos.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (btnVolver && secServicios && secFavoritos) {
        btnVolver.addEventListener('click', () => {
            secFavoritos.style.display = 'none';
            secServicios.style.display = 'block';
            secServicios.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Búsqueda
    const inputBusqueda = document.getElementById('input-busqueda');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', (e) => {
            terminoBusqueda = e.target.value;
            aplicarFiltros();
        });
    }

    // Filtros por Categoría
    const botones = {
        'btn-todos': 'todos',
        'btn-oreja': 'oreja',
        'btn-facial': 'facial',
        'btn-avanzado': 'avanzado'
    };

    Object.entries(botones).forEach(([id, cat]) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                categoriaActual = cat;
                aplicarFiltros();
            });
        }
    });
});