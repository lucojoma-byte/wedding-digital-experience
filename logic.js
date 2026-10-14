export function eventState(nowMs, eventISO, expirationISO) {
  const eventMs = Date.parse(eventISO);
  const expiryMs = Date.parse(expirationISO);
  if (!Number.isFinite(eventMs) || !Number.isFinite(expiryMs)) throw new Error('Invalid ISO date');
  if (nowMs > expiryMs) return 'expired';
  if (nowMs >= eventMs) return 'event-day';
  return 'upcoming';
}

export function timeRemaining(nowMs, targetISO) {
  const diff = Math.max(0, Date.parse(targetISO) - nowMs);
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };
}

export function validateRsvp({ name, guests, attendance }) {
  const errors = {};
  if (!String(name || '').trim()) errors.name = 'Escribe tu nombre.';
  const count = Number(guests);
  if (!Number.isInteger(count) || count < 1 || count > 12) errors.guests = 'Indica entre 1 y 12 asistentes.';
  if (!['yes', 'no'].includes(attendance)) errors.attendance = 'Elige si podrás acompañarnos.';
  return { valid: Object.keys(errors).length === 0, errors };
}

export function whatsappUrl({ couple, url }) {
  const text = `Acompáñanos a celebrar la boda de ${couple.bride} y ${couple.groom}. ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
