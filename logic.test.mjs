import test from 'node:test';
import assert from 'node:assert/strict';
import { eventState, timeRemaining, validateRsvp, whatsappUrl } from './logic.js';

test('event state is upcoming before wedding', () => {
  assert.equal(eventState(Date.parse('2027-03-01T00:00:00-06:00'), '2027-03-20T17:00:00-06:00', '2027-09-20T23:59:59-06:00'), 'upcoming');
});
test('event state expires after configured expiry', () => {
  assert.equal(eventState(Date.parse('2027-09-21T00:00:00-06:00'), '2027-03-20T17:00:00-06:00', '2027-09-20T23:59:59-06:00'), 'expired');
});
test('remaining time calculates whole units', () => {
  assert.deepEqual(timeRemaining(Date.parse('2027-03-19T17:00:00-06:00'), '2027-03-20T17:00:00-06:00'), { days: 1, hours: 0, minutes: 0, seconds: 0 });
});
test('rsvp accepts valid response', () => {
  assert.equal(validateRsvp({ name: 'Ana', guests: 2, attendance: 'yes' }).valid, true);
});
test('rsvp rejects missing values', () => {
  const result = validateRsvp({ name: '', guests: 0, attendance: '' });
  assert.equal(result.valid, false);
  assert.deepEqual(Object.keys(result.errors).sort(), ['attendance', 'guests', 'name']);
});
test('whatsapp share creates encoded wa link', () => {
  assert.match(whatsappUrl({ couple: { bride: 'Sofía', groom: 'Alejandro' }, url: 'https://example.com' }), /^https:\/\/wa\.me\/\?text=/);
});
