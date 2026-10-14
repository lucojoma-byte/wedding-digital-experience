(() => {
  'use strict';
  const config = {
    couple: { bride: 'Sofía Martínez', groom: 'Alejandro Rivera' },
    dateISO: '2027-03-20T17:00:00-06:00',
    schedule: [
      { label: 'Ceremonia', time: '5:00 PM', icon: '✦', description: 'Una ceremonia íntima para celebrar el comienzo de nuestra historia.' },
      { label: 'Recepción', time: '7:00 PM', icon: '⌂', description: 'Cena, brindis y celebración bajo el encanto de la hacienda.' }
    ],
    venue: { mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Zapopan%2C%20Jalisco%2C%20Mexico' },
    music: {
      title: 'Bachata romántica (composición original)',
      externalUrl: 'https://www.youtube.com/watch?v=LUmKUDTz1oE',
      // Archivo de audio con derechos de uso (p. ej. 'audio/sabes-una-cosa.mp3').
      // Vacío = el botón «Música» abre YouTube. Con archivo = suena al abrir la invitación.
      audioUrl: 'audio/bachata-romantica.mp3'
    },
    gallery: [
      { src: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=80', alt: 'Arreglo floral blanco y champaña decorativo' },
      { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80', alt: 'Mesa de boda decorativa' },
      { src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80', alt: 'Detalle decorativo de celebración' }
    ]
  };

  const $ = (selector) => document.querySelector(selector);
  const pad = (value) => String(value).padStart(2, '0');
  const eventMs = Date.parse(config.dateISO);

  function renderCountdown() {
    const seconds = Math.max(0, Math.floor((eventMs - Date.now()) / 1000));
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    $('#countdown').innerHTML = `<p class="days"><strong>${days}</strong> ${days === 1 ? 'día' : 'días'}</p><p class="hms">${pad(hours)} h · ${pad(minutes)} min · ${pad(seconds % 60)} s</p>`;
  }

  function renderContent() {
    $('#schedule-cards').innerHTML = config.schedule.map((item) => `<article class="event-card"><div class="event-icon" aria-hidden="true">${item.icon}</div><h3>${item.label}</h3><div class="event-time">${item.time}</div><p>${item.description}</p></article>`).join('');
    $('#gallery').innerHTML = config.gallery.map((image) => `<figure><img src="${image.src}" alt="${image.alt}" loading="lazy"></figure>`).join('');
    $('#maps-link').href = config.venue.mapsUrl;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(`Acompáñanos a celebrar la boda de ${config.couple.bride} y ${config.couple.groom}. ${window.location.href}`)}`;
    document.querySelectorAll('[data-share="whatsapp"]').forEach((link) => { link.href = shareUrl; });
  }

  // ---- Música: suena al tocar «Abrir invitación» (gesto del usuario) y se controla con «Música». ----
  let audio = null;

  function setMusicUi(playing) {
    const button = $('#music-control');
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
    button.querySelector('.music-label').textContent = playing ? 'Pausar' : 'Música';
    const bar = button.closest('.music-bar');
    if (bar) bar.classList.toggle('is-playing', playing);
  }

  function playMusic() {
    if (!audio) return;
    const attempt = audio.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => setMusicUi(false));
  }

  function setupMusic() {
    const button = $('#music-control');
    if (!config.music.audioUrl) {
      button.addEventListener('click', () => window.open(config.music.externalUrl, '_blank', 'noopener,noreferrer'));
      return;
    }
    audio = new Audio();
    audio.src = config.music.audioUrl;
    audio.loop = true;
    audio.preload = 'none';
    audio.addEventListener('play', () => setMusicUi(true));
    audio.addEventListener('pause', () => setMusicUi(false));
    audio.addEventListener('error', () => setMusicUi(false));
    setMusicUi(false);
    button.addEventListener('click', () => {
      if (audio.error) { window.open(config.music.externalUrl, '_blank', 'noopener,noreferrer'); return; }
      if (audio.paused) playMusic(); else audio.pause();
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden && !audio.paused) audio.pause(); });
  }

  function openInvitation(event) {
    if (event) event.preventDefault();
    playMusic(); // dentro del toque: requisito de iOS/Android para audio con sonido
    const cover = $('#cover');
    const invitation = $('#invitation');
    cover.classList.add('is-open');
    const reveal = () => {
      cover.hidden = true;
      invitation.hidden = false;
      invitation.removeAttribute('hidden');
      window.scrollTo(0, 0);
      invitation.setAttribute('tabindex', '-1');
      invitation.focus({ preventScroll: true });
      renderCountdown();
    };
    window.setTimeout(reveal, window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 250);
  }

  function setupRsvp() {
    $('#rsvp-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const name = String(form.get('name') || '').trim();
      const guests = Number(form.get('guests'));
      const attendance = form.get('attendance');
      document.querySelectorAll('.field-error').forEach((element) => { element.textContent = ''; });
      let valid = true;
      if (!name) { $('[data-error="name"]').textContent = 'Escribe tu nombre.'; valid = false; }
      if (!Number.isInteger(guests) || guests < 1 || guests > 12) { $('[data-error="guests"]').textContent = 'Indica entre 1 y 12 asistentes.'; valid = false; }
      if (attendance !== 'yes' && attendance !== 'no') { $('[data-error="attendance"]').textContent = 'Elige si podrás acompañarnos.'; valid = false; }
      $('#rsvp-result').textContent = valid ? `Gracias, ${name}. Tu respuesta fue validada en modo demo y no se almacenó ni envió.` : 'Revisa los campos marcados.';
    });
  }

  function boot() {
    const app = $('#app');
    $('#open-invitation').addEventListener('click', openInvitation);
    app.classList.remove('js-pending');
    app.classList.add('js-ready');
    setupMusic();
    renderContent();
    setupRsvp();
    renderCountdown();
    window.setInterval(renderCountdown, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
