# Wedding Digital Experience v1.0

Invitación digital estática, mobile-first y reutilizable. Este proyecto es una **demostración** con datos ficticios.

## Ejecutar localmente

```bash
npm test
npm run serve
# abrir http://localhost:4173
```

## Reutilizar una invitación

Editar únicamente `config.js`:
- `couple`, `dateISO`, `timeZone`, `expirationISO`
- `venue`, `schedule`, `attire`, textos y `gallery`
- `music.externalUrl` o, cuando exista licencia, `music.audioUrl`

La plantilla implementada es `eventType: 'wedding'`. La arquitectura deja el contenido centralizado para posteriores plantillas de XV años, bautizos y cumpleaños, sin construirlas aún.

## RSVP

Está en `demoMode: true`: valida campos en el navegador y **no persiste ni transmite datos**. Para una versión real se requiere backend con autenticación de organizador, base de datos privada, validación de servidor y antispam.

## Música

No incluye ni descarga música comercial. El control abre la página de YouTube configurada en `config.js`, en una pestaña nueva. No afirma reproducir audio dentro de la invitación. Si se obtiene un MP3 autorizado, se puede configurar `audioUrl` y agregar un reproductor HTML5.

## Publicación estática

Compatible con GitHub Pages, Netlify o Vercel. Para este sitio no hay build: publicar el directorio raíz. Antes de publicar, actualizar metadatos Open Graph y `robots` según el dominio final.

## Vencimiento

`expirationISO` controla la pantalla vencida en el navegador. Es una protección de experiencia de usuario, no un control de seguridad: el código estático sigue accesible al descargarlo. Persistir RSVP requiere un backend.
