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

`audio/bachata-romantica.mp3` es una **composición original** (bachata romántica en Sol mayor con requinto, segunda guitarra, bajo, bongó y güira; 90 s) creada para esta invitación y renderizada con el banco de sonidos [GeneralUser GS](https://github.com/mrbumpy409/GeneralUser-GS), cuya licencia permite usarlo libremente en grabaciones. No contiene música comercial.

Suena al tocar «Abrir invitación» (los navegadores móviles exigen ese gesto) y se controla con el botón dorado. Para cambiarla, sustituir el archivo o editar `music.audioUrl` en `app.js`; si queda vacío o el archivo falla, el botón abre `music.externalUrl` en YouTube.

## Publicación estática

Compatible con GitHub Pages, Netlify o Vercel. Para este sitio no hay build: publicar el directorio raíz. Antes de publicar, actualizar metadatos Open Graph y `robots` según el dominio final.

## Vencimiento

`expirationISO` controla la pantalla vencida en el navegador. Es una protección de experiencia de usuario, no un control de seguridad: el código estático sigue accesible al descargarlo. Persistir RSVP requiere un backend.
