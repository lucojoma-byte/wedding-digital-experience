(() => {
  'use strict';
  const config = {
    couple: { bride: 'Sofía Navarro', groom: 'Carlos Villarreal' },
    dateISO: '2026-11-14T17:00:00-06:00',
    ceremony: {
      name: 'Parroquia de San Francisco de Asís',
      city: 'Chapala, Jal.',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Parroquia%20de%20San%20Francisco%20de%20As%C3%ADs%2C%20Chapala%2C%20Jalisco'
    },
    reception: {
      name: 'Terraza Las Brisas',
      city: 'Ribera de Chapala',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Terraza%20Las%20Brisas%2C%20Ribera%20de%20Chapala%2C%20Jalisco'
    },
    schedule: [
      { label: 'Ceremonia', time: '5:00 PM', icon: '✦', description: 'Parroquia de San Francisco de Asís · Chapala, Jal.' },
      { label: 'Recepción', time: '7:00 PM', icon: '⌂', description: 'Terraza Las Brisas · Ribera de Chapala.' }
    ],
    attire: 'Formal Guayabera / Vestido Cóctel',
    rsvpWhatsApp: '5213312345678',
    venue: { mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Parroquia%20de%20San%20Francisco%20de%20As%C3%ADs%2C%20Chapala%2C%20Jalisco' },
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
    const fullNames = `${config.couple.bride} & ${config.couple.groom}`;
    const initials = `${config.couple.bride.trim().charAt(0)}&${config.couple.groom.trim().charAt(0)}`;
    const eventDate = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City' }).format(new Date(config.dateISO));
    const title = `${fullNames} — ¡Nos casamos!`;

    document.title = title;
    document.querySelector('meta[name="description"]').content = `Invitación digital demostrativa para la boda de ${fullNames}.`;
    document.querySelector('meta[property="og:title"]').content = title;
    document.querySelectorAll('.seal, .wreath-letters').forEach((element) => { element.innerHTML = `${initials.charAt(0)}<em>&amp;</em>${initials.charAt(2)}`; });
    document.querySelector('.wreath').setAttribute('aria-label', `Iniciales ${initials.charAt(0)} y ${initials.charAt(2)}`);
    document.querySelectorAll('.names, .closing h2').forEach((element) => { element.innerHTML = `<span>${config.couple.bride}</span><em>&amp;</em><span>${config.couple.groom}</span>`; });
    document.querySelector('.info-strip .info-item:first-child p').innerHTML = `<span class="info-label">Fecha</span>${eventDate}`;
    document.querySelector('.info-strip .info-item:nth-child(2) p').innerHTML = `<span class="info-label">Ceremonia</span>5:00 PM`;
    document.querySelector('.info-strip .info-item:nth-child(3) p').innerHTML = `<span class="info-label">Recepción</span>7:00 PM`;
    document.querySelector('#venue-heading').textContent = config.ceremony.name;
    document.querySelector('.venue-text p').textContent = config.ceremony.city;
    document.querySelector('.detail-row .detail:first-child p').innerHTML = `Ceremonia en<br /><strong>${config.ceremony.name}</strong>`;
    document.querySelector('.duo .mini:nth-child(2) p').innerHTML = `Código de vestimenta:<br /><strong>${config.attire}</strong>`;

    $('#schedule-cards').innerHTML = config.schedule.map((item) => `<article class="event-card"><div class="event-icon" aria-hidden="true">${item.icon}</div><h3>${item.label}</h3><div class="event-time">${item.time}</div><p>${item.description}</p></article>`).join('');
    $('#gallery').innerHTML = config.gallery.map((image) => `<figure><img src="${image.src}" alt="${image.alt}" loading="lazy"></figure>`).join('');
    $('#maps-link').href = config.ceremony.mapsUrl;
    const shareText = `Acompáñanos a celebrar la boda de ${fullNames}. Ceremonia: ${config.ceremony.name}, ${config.ceremony.city}. Recepción: ${config.reception.name}, ${config.reception.city}.`;
    document.querySelectorAll('[data-share="whatsapp"]').forEach((link) => {
      link.href = `https://wa.me/${config.rsvpWhatsApp}?text=${encodeURIComponent(shareText)}`;
    });
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
