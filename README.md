# Wedding Digital Experience v1.0

Invitación digital estática, mobile-first y reutilizable. Este proyecto es una **demostración** con datos ficticios.

## Ejecutar localmente

```bash
npm test
npm run serve
# abrir http://localhost:4173
```

## Reutilizar una invitación

### Archivo único de datos finales

La fuente canónica para personalizar la invitación es:

```text
config.js
```

Actualizar ahí: `couple`, `dateISO`, `timeZone`, `expirationISO`, `venue`, `schedule`, `attire`, textos, `gallery` y `music`.

> **Importante — estado actual del machote:** la prueba local de datos ficticios se hizo en `app.js`. Antes de una publicación real, mover o reflejar los datos aprobados desde `config.js` hacia `app.js`, ya que la interfaz actual carga `app.js` directamente. No publicar hasta validar el render final en navegador.

### Fotografías de los novios

Crear y usar esta carpeta:

```text
img/novios/
```

Ejemplo de reemplazo en `app.js`, dentro de `gallery`:

```js
{ src: 'img/novios/sofia-carlos-01.jpg', alt: 'Sofía y Carlos' }
```

**Dimensiones recomendadas:** archivos JPG o WebP de **1600 × 1200 px (relación 4:3)**, con el rostro o elemento importante dentro de la zona central. El layout aplica recorte proporcional (`object-fit: cover`) y no estira las imágenes; para fotos verticales, usar mínimo **1200 × 1600 px** y revisar el recorte en móvil.

Los elementos decorativos actuales se reemplazan directamente en `index.html`:

- `img/flores-sup-izq.jpg` — flor superior izquierda.
- `img/campanario.jpg` — imagen lateral superior.
- `img/hacienda.jpg` — imagen principal de ubicación.
- `img/flores-inf-izq.jpg` y `img/flores-inf-der.jpg` — flores inferiores.

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
