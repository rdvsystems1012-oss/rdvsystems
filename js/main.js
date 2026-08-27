/* ============================================================
   RDV SYSTEMS - main.js
   Comportamientos de la web (script principal, se carga con `defer`).
   1) Animación de aparición al hacer scroll (reveal)
   2) Menú hamburguesa en móvil
   3) Formulario de contacto -> abre WhatsApp (con anti-spam honeypot)
   4) Burbuja de chat de WhatsApp expandible
   ============================================================ */

/* ------------------------------------------------------------
   1) ANIMACIÓN "REVEAL" (aparición al hacer scroll)
   Los elementos con clase .reveal se muestran al entrar en pantalla.
   Usa IntersectionObserver (compatible con navegadores modernos).
   ------------------------------------------------------------ */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      // Añade la clase que hace visible el elemento (transición CSS)
      e.target.classList.add('is-visible');
      // Deja de observarlo: la animación ya se disparó
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* ------------------------------------------------------------
   2) MENÚ HAMBURGUESA (móvil)
   Al pulsar .menu-btn se abre/cierra el menú (.navlinks.is-open).
   También actualiza el atributo aria-expanded para accesibilidad
   y cierra el menú al hacer clic en cualquier enlace.
   ------------------------------------------------------------ */
const menuBtn = document.getElementById('menuBtn');
const navlinks = document.getElementById('navlinks');
if (menuBtn && navlinks) {
  menuBtn.addEventListener('click', () => {
    navlinks.classList.toggle('is-open');
    menuBtn.classList.toggle('is-open');
    const open = navlinks.classList.contains('is-open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // Cerrar el menú al elegir una sección
  navlinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navlinks.classList.remove('is-open');
      menuBtn.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ------------------------------------------------------------
   3) FORMULARIO DE CONTACTO -> WHATSAPP (con anti-spam)
   Al enviar se arma un mensaje con los datos y se abre WhatsApp.
   Anti-spam: si el campo honeypot (.honeypot) está relleno,
   significa que es un bot -> se cancela el envío en silencio.
   ------------------------------------------------------------ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // ---- Anti-spam honeypot ----
    const honeypot = contactForm.querySelector('.honeypot');
    if (honeypot && honeypot.value.trim() !== '') {
      // Un bot rellenó un campo que un humano no ve: lo ignoramos
      return;
    }

    const nombre = contactForm.querySelector('[name="nombre"]').value.trim();
    const negocio = contactForm.querySelector('[name="negocio"]').value.trim();
    const mensaje = contactForm.querySelector('[name="mensaje"]').value.trim();

    // Se arma el texto del mensaje de WhatsApp
    let texto = `Hola RDV SYSTEMS, soy ${nombre}.`;
    if (negocio) texto += ` Mi negocio es ${negocio}.`;
    texto += ` Quisiera más información: ${mensaje}`;

    // Número de WhatsApp de RDV SYSTEMS (reemplazar aquí si cambia)
    const numero = '573223690657';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  });
}

/* ------------------------------------------------------------
   4) BURBUJA DE CHAT DE WHATSAPP (expandible)
   .wa-chat contiene el botón (.wa-btn) y el panel (.wa-panel).
   Al pulsar el botón se abre/cierra el panel (clase .is-open).
   Se cierra también al hacer clic fuera del chat.
   ------------------------------------------------------------ */
const waChat = document.querySelector('.wa-chat');
const waBtn = document.getElementById('waBtn');
if (waChat && waBtn) {
  waBtn.addEventListener('click', () => {
    const open = waChat.classList.toggle('is-open');
    waBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // Cerrar al hacer clic fuera del área del chat
  document.addEventListener('click', (e) => {
    if (!waChat.contains(e.target)) {
      waChat.classList.remove('is-open');
      waBtn.setAttribute('aria-expanded', 'false');
    }
  });
}
