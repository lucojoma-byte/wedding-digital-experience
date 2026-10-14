import { invitationConfig as config } from './config.js';
import { eventState, timeRemaining, validateRsvp, whatsappUrl } from './logic.js';

const $ = (selector) => document.querySelector(selector);
const state = eventState(Date.now(), config.dateISO, config.expirationISO);

// Fecha de respaldo: evita que una fecha local incorrecta del dispositivo bloquee una demo futura.
const previewGrace = new URLSearchParams(window.location.search).get('preview') === '1';
const cover = $('#cover');
const invitation = $('#invitation');

function pad(value) { return String(value).padStart(2, '0'); }
function renderCountdown() {
  const target = state === 'event-day' ? config.expirationISO : config.dateISO;
  const t = timeRemaining(Date.now(), target);
  const label = state === 'event-day' ? 'La celebración está ocurriendo' : 'Faltan';
  $('.countdown-section .eyebrow').textContent = label;
  $('#countdown').innerHTML = [['days','Días'],['hours','Horas'],['minutes','Minutos'],['seconds','Segundos']].map(([key,labelText]) => `<div class="time-box"><strong>${key === 'days' ? t[key] : pad(t[key])}</strong><span>${labelText}</span></div>`).join('');
}
function renderSchedule() {
  $('#schedule-cards').innerHTML = config.schedule.map(item => `<article class="event-card"><div class="event-icon" aria-hidden="true">${item.icon}</div><h3>${item.label}</h3><div class="event-time">${item.time}</div><p>${item.description}</p></article>`).join('');
}
function renderGallery() {
  $('#gallery').innerHTML = config.gallery.map(image => `<figure><img src="${image.src}" alt="${image.alt}" loading="lazy" /></figure>`).join('');
}
function setupMusic() {
  const control = $('#music-control');
  control.addEventListener('click', () => {
    window.open(config.music.externalUrl, '_blank', 'noopener,noreferrer');
    control.setAttribute('aria-pressed', 'true');
    $('.music-label').textContent = 'Abrir canción';
  });
}
function setupRsvp() {
  const form = $('#rsvp-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const values = { name: formData.get('name'), guests: formData.get('guests'), attendance: formData.get('attendance'), comments: formData.get('comments') };
    const result = validateRsvp(values);
    document.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; });
    if (!result.valid) {
      Object.entries(result.errors).forEach(([field, text]) => { document.querySelector(`[data-error="${field}"]`).textContent = text; });
      $('#rsvp-result').textContent = 'Revisa los campos marcados.';
      return;
    }
    $('#rsvp-result').textContent = `Gracias, ${values.name}. Tu respuesta fue validada en modo demo y no se almacenó ni envió.`;
  });
}
function setupSharing() {
  $('#whatsapp-share').href = whatsappUrl({ couple: config.couple, url: window.location.href });
}
function openInvitation() {
  cover.classList.add('is-open');
  setTimeout(() => {
    cover.hidden = true;
    invitation.hidden = false;
    renderCountdown();
    setInterval(renderCountdown, 1000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 10 : 850);
}
function boot() {
  if (state === 'expired' && !previewGrace) {
    $('#expired-screen').hidden = false;
    cover.hidden = true;
    return;
  }
  renderSchedule(); renderGallery(); setupMusic(); setupRsvp(); setupSharing();
  $('#maps-link').href = config.venue.mapsUrl;
  $('#open-invitation').addEventListener('click', openInvitation);
}
boot();
