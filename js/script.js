/* ===== Son de Sueños · Lógica del sitio ===== */

// --- Datos de eventos ---
const eventos = [
  {
    title: "Paco Candela en Concierto",
    artist: "Paco Candela",
    venue: "Villanueva del Río y Minas",
    date: "Próximamente",
    price: "30€",
    priceValue: 30,
    emoji: "💃"
  }
];

// --- Datos de géneros musicales ---
const generos = [
  { name: "Flamenco", emoji: "💃" },
  { name: "Pop", emoji: "🎤" },
  { name: "Rock", emoji: "🎸" },
  { name: "Clásica", emoji: "🎻" },
  { name: "Jazz", emoji: "🎷" },
  { name: "Electrónica", emoji: "🎧" },
  { name: "Reggaetón", emoji: "🔥" },
  { name: "Indie", emoji: "🎹" }
];

// --- Renderizar eventos ---
function renderEventos() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;
  grid.innerHTML = eventos.map((e, i) => `
    <article class="event-card">
      <div class="event-emoji">${e.emoji}</div>
      <h3 class="event-title">${e.title}</h3>
      <p class="event-artist">${e.artist}</p>
      <div class="event-meta">
        <span>📍 ${e.venue}</span>
        <span>📅 ${e.date}</span>
      </div>
      <div class="event-footer">
        <span class="event-price">${e.price}</span>
        <button class="btn btn-primary" data-event="${i}">Comprar entradas</button>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('[data-event]').forEach(btn => {
    btn.addEventListener('click', () => abrirModal(parseInt(btn.dataset.event, 10)));
  });
}

// --- Renderizar géneros ---
function renderGeneros() {
  const grid = document.getElementById('genresGrid');
  if (!grid) return;
  grid.innerHTML = generos.map(g => `
    <div class="genre-card">
      <div class="genre-emoji">${g.emoji}</div>
      <p class="genre-name">${g.name}</p>
    </div>
  `).join('');
}

// --- Modal de compra ---
let eventoActual = null;
const overlay = document.getElementById('modalOverlay');

function abrirModal(index) {
  eventoActual = eventos[index];
  document.getElementById('modalEvent').textContent =
    `${eventoActual.title} · ${eventoActual.venue}`;
  document.getElementById('ticketQty').value = 1;
  actualizarTotal();
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function actualizarTotal() {
  if (!eventoActual) return;
  const qty = Math.max(1, parseInt(document.getElementById('ticketQty').value, 10) || 1);
  document.getElementById('modalTotal').textContent = `${eventoActual.priceValue * qty}€`;
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
  renderEventos();
  renderGeneros();

  // Año dinámico en el footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Navbar al hacer scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Menú móvil
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );

  // Cierre del modal
  document.getElementById('modalClose').addEventListener('click', cerrarModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrarModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModal(); });
  document.getElementById('ticketQty').addEventListener('input', actualizarTotal);

  // Envío del formulario de compra
  document.getElementById('purchaseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    cerrarModal();
    alert(`¡Gracias por tu compra! 🎶\nHemos enviado la confirmación de tus entradas para "${eventoActual.title}" a tu correo.`);
    e.target.reset();
  });

  // Formulario de contacto
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('formFeedback').textContent =
      '¡Gracias por escribirnos! Te responderemos lo antes posible.';
    e.target.reset();
  });
});
