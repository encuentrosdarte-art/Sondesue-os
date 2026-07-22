/* ===== Son de Sueños · Lógica del sitio ===== */

// --- Datos de eventos ---
const eventos = [
  {
    title: "Paco Candela · 30 Aniversario",
    artist: "Paco Candela",
    venue: "Pozo 5 · Villanueva del Río y Minas, Sevilla",
    date: "19 de septiembre de 2026 · 22:00 h",
    price: "33€",
    priceNote: "30€ + 10% IVA",
    capacity: "Aforo limitado: 500 personas",
    image: "images/paco-candela.jpeg",
    ticketUrl: "https://www.eventbrite.com/e/paco-candela-concert-tickets-1994799329493",
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
    <article class="event-card${e.image ? ' event-card--poster' : ''}">
      ${e.image ? `<div class="event-poster"><img src="${e.image}" alt="Cartel ${e.title}" loading="lazy" /></div>` : ''}
      <div class="event-body">
        ${e.image ? '' : `<div class="event-emoji">${e.emoji}</div>`}
        <h3 class="event-title">${e.title}</h3>
        <p class="event-artist">${e.artist}</p>
        <div class="event-meta">
          <span>📍 ${e.venue}</span>
          <span>📅 ${e.date}</span>
          ${e.capacity ? `<span>🎟️ ${e.capacity}</span>` : ''}
        </div>
        <div class="event-footer">
          <div class="event-price-wrap">
            <span class="event-price">${e.price}</span>
            ${e.priceNote ? `<span class="event-price-note">${e.priceNote}</span>` : ''}
          </div>
          ${e.ticketUrl
            ? `<a class="btn btn-primary" href="${e.ticketUrl}" target="_blank" rel="noopener">Comprar entradas</a>`
            : `<button class="btn btn-primary" data-event="${i}">Comprar entradas</button>`}
        </div>
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

  // Formulario de contacto (envío vía FormSubmit AJAX)
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const feedback = document.getElementById('formFeedback');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';
    feedback.style.color = '';
    feedback.textContent = '';

    try {
      const response = await fetch('https://formsubmit.co/ajax/sondesuenos@gmail.com', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: contactForm.nombre.value,
          email: contactForm.email.value,
          asunto: contactForm.asunto.value,
          mensaje: contactForm.mensaje.value,
          _subject: 'Nuevo mensaje desde Son de Sueños',
          _template: 'table'
        })
      });

      if (response.ok) {
        feedback.style.color = 'var(--gold-light)';
        feedback.textContent = '¡Gracias por escribirnos! Hemos recibido tu mensaje y te responderemos lo antes posible.';
        contactForm.reset();
      } else {
        throw new Error('Error en el envío');
      }
    } catch (err) {
      feedback.style.color = '#e08a8a';
      feedback.textContent = 'No hemos podido enviar tu mensaje. Escríbenos directamente a sondesuenos@gmail.com.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});
