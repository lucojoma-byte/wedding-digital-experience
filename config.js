export const invitationConfig = {
  eventType: 'wedding',
  demoMode: true,
  couple: { bride: 'Sofía Martínez', groom: 'Alejandro Rivera', initials: 'S & A' },
  dateISO: '2027-03-20T17:00:00-06:00',
  timeZone: 'America/Mexico_City',
  expirationISO: '2028-09-20T23:59:59-06:00',
  venue: {
    name: 'Hacienda Los Olivos',
    city: 'Zapopan, Jalisco',
    referenceLabel: 'Ubicación de referencia demostrativa — no corresponde al lugar del evento',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Zapopan%2C%20Jalisco%2C%20Mexico'
  },
  schedule: [
    { label: 'Ceremonia', time: '5:00 PM', icon: '✦', description: 'Una ceremonia íntima para celebrar el comienzo de nuestra historia.' },
    { label: 'Recepción', time: '7:00 PM', icon: '⌂', description: 'Cena, brindis y celebración bajo el encanto de la hacienda.' }
  ],
  attire: 'Formal',
  rsvpDeadline: '1 de marzo de 2027',
  message: 'Hay momentos que se vuelven eternos cuando los compartimos con quienes amamos. Nos encantaría que formaras parte del comienzo de nuestra historia.',
  closing: '¡Esperamos compartir este día contigo!',
  music: {
    title: 'Sabes una cosa — Luis Miguel',
    mode: 'external-official-link',
    externalUrl: 'https://www.youtube.com/watch?v=LUmKUDTz1oE',
    audioUrl: ''
  },
  gallery: [
    { src: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=80', alt: 'Arreglo floral blanco y champaña decorativo' },
    { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80', alt: 'Mesa de boda decorativa' },
    { src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80', alt: 'Detalle decorativo de celebración' }
  ]
};
