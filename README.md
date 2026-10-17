# YOGITIER® App – Prototipo interactivo

Aplicación web (en **alemán**) de yoga, respiración y mindfulness para niños, basada en la marca
[YOGITIER®](https://yogitier.de) y en el diseño del menú *„Was möchtest du machen?“*.
Está pensada para **presentarla a clientes** en local y, más adelante, desplegarla en **Vercel**.

- En el **móvil** se ve como una app a pantalla completa (también instalable como PWA).
- En **tablet/escritorio** se muestra dentro de un marco de iPhone con un panel de presentación al lado.
- Incluye el **YOGITIER® Studio** (`/admin`): el administrador sube vídeos instructivos, diseña *Lernwelten*
  (mundos de aprendizaje) con su propio ambiente y las publica con un clic en la app infantil.

---

## Módulos

| Ruta | Módulo | Qué hace |
|---|---|---|
| `/` | Menú principal | Las 6 tarjetas del diseño + “Echte Yogalehrerin finden”, candado del área de padres |
| `/yoga` | Yoga | 7 clases guiadas + recomendación según la hora del día |
| `/yoga/stunde/[slug]` | Clase de yoga | Detalle y **reproductor**: cuenta atrás, temporizador circular, narración por voz, sonidos, pausa, teclado (espacio / ← →), pantalla siempre encendida, celebración final |
| `/yoga/uebungen` | Biblioteca | 23 posturas con filtros (de pie, equilibrio, suelo, relajación, invierno) |
| `/yoga/wuerfel` | Yoga-Würfel | Dado 3D basado en el “DIY-Yoga-Würfel” oficial |
| `/meditation` | Meditación | 8 respiraciones (una por personaje) y 5 *Fantasiereisen* |
| `/meditation/atmen/[slug]` | Respiración | Reproductor con animación propia (globo, león, flor y vela, abeja, peluche, arcoíris, elefante, mano) |
| `/meditation/reise/[slug]` | Viaje de fantasía | Lectura por párrafos con voz alemana y fondos animados |
| `/tierfreunde` | Tierfreunde | La *YOGITIER-Bande* (8 personajes) con frase de ánimo, superpoder, dato curioso y su esterilla de la tienda |
| `/memo` | Affirmation-Memo | Juego de memoria (3 niveles) basado en el “Affirmation-Memory” oficial, con récords |
| `/tagebuch` | Diario de emociones | Estado de ánimo + consejo según la emoción, gratitud, nota y dibujo con el dedo |
| `/besonderes` | Besonderes | Lernwelten nuevas del Studio (la destacada primero) + temporada de Navidad: Adviento (24 puertas), yoga de Navidad, viaje de invierno, manualidades |
| `/welten` | Lernwelten | Todas las Lernwelten publicadas + **álbum de stickers** |
| `/welten/[id]` | Lernwelt | Escenario animado, personaje guía con saludo hablado, camino de estaciones tipo aventura, sonido ambiente y premio final |
| `/finder` | Buscador de profesoras | Búsqueda por CP/ciudad, filtros, mapa ilustrado, ficha y solicitud de contacto (datos de ejemplo) |
| `/eltern` | Área de padres | Control parental (multiplicación) → progreso semanal, estados de ánimo, ajustes, guía para padres, tienda, descargas, blog, historia y FAQ |

Detalles profesionales incluidos: transiciones nativas entre pantallas (View Transitions con “morph” del personaje
desde la tarjeta), control parental antes de cualquier enlace externo o compra (requisito de Apple/Google para apps
infantiles), accesibilidad (roles ARIA, foco visible, `prefers-reduced-motion`), metadatos SEO/Open Graph, iconos y
manifiesto PWA, página 404 y de error en alemán.

## YOGITIER® Studio (administración)

Ruta `/admin` · **PIN de demo: `1234`** (se cambia en *Einstellungen*). En escritorio también hay un acceso desde el
panel de presentación.

| Pantalla | Qué hace |
|---|---|
| **Übersicht** | Indicadores (Lernwelten, vídeos, espacio usado, completadas), últimas editadas y guía en 3 pasos |
| **Lernwelten** | Lista con filtros (publicadas / borradores), duplicar, borrar y vista previa; *Neue Lernwelt* con 4 plantillas |
| **Editor** | 1) Datos básicos: título, categoría, edad, personaje guía y saludo (con prueba de voz) · 2) **Ambiente**: 8 escenarios animados (Dschungel, Unterwasser, Weltraum, Zauberwald, Sommerwiese, Winterland, Regenbogenland, Strand), color, sonido ambiente (con prueba) y sticker de premio · 3) **Camino de estaciones**: añadir, ordenar, duplicar y editar · guardado automático · aviso de lo que falta antes de publicar · **vista previa en vivo** en un iPhone · publicar/retirar · destacar |
| **Medien** | Subida de vídeos e imágenes (arrastrar y soltar, varios a la vez, barra de progreso), miniatura y duración automáticas, reproducción, “usado en N Lernwelten” y espacio ocupado |
| **Einstellungen** | Etiqueta de la tarjeta *Besonderes* (p. ej. “Weihnachten”, “Neu!”), Lernwelt destacada, PIN, exportar/importar JSON, restaurar ejemplos y reiniciar |

**Tipos de estación** (lo que vive el niño en cada parada):

| Estación | Experiencia en la app |
|---|---|
| **Video** | Vídeo subido, enlace MP4 o YouTube/Vimeo. Con vídeos propios o MP4 se ponen **pausas interactivas** (“Jetzt du!”): el vídeo se detiene, se lee la consigna, cuenta atrás y continúa |
| **Info-Karte** | Explicación corta con imagen opcional, leída por el personaje guía |
| **Yoga-Übung** | Una de las 23 posturas, con temporizador y narración |
| **Atemübung** | Una de las 8 respiraciones animadas |
| **Mitmach-Timer** | Tramos con aviso por voz (p. ej. cepillado: “Oben links” 30 s…) |
| **Quiz-Frage** | 2–4 respuestas con emoji; si falla puede reintentar; al acertar, confeti y explicación |
| **Mission** | Reto para el día (p. ej. 6 vasos de agua) que el niño va marcando |

Al completar todas las estaciones: celebración, **+3 estrellas** y el sticker en su álbum; el área de padres lo registra.

**Lernwelten de ejemplo:** Dschungel-Bewegungspause (con vídeo de demo y pausa interactiva), Zähneputz-Profi,
Wasser-Detektive, Weltraum-Traumreise y un borrador (Die bunte Brotdose).

> **Cómo se guarda en el prototipo:** el Studio guarda las Lernwelten y los vídeos en el navegador (IndexedDB), sin
> servidor. Lo que se crea en un navegador se ve en ese mismo navegador (Studio y app en el mismo equipo). En la versión
> completa se sustituye `src/lib/studio/db.ts` por una API (p. ej. Vercel Blob + base de datos) y el contenido aparece
> en todos los dispositivos; el resto del código no cambia.

## Stack

- **Next.js 16.4** (App Router, Cache Components, Partial Prefetching, View Transitions) · **React 19.3** · **TypeScript**
- **Tailwind CSS 4** · iconos **lucide-react** · fuente **Quicksand** (la del diseño)
- Sin backend: los datos del niño (perfil, progreso, diario, stickers) en `localStorage`; el Studio (Lernwelten y vídeos) en **IndexedDB**
- APIs del navegador: Web Speech (voz alemana), Web Audio (sonidos y ambientes sintetizados, sin archivos), Wake Lock, BroadcastChannel (vista previa en vivo)

## Requisitos

- Node.js **20.9 o superior** (probado con Node 24) y npm

## Ejecutar en local

```bash
npm install
npm run dev        # desarrollo → http://localhost:3000
```

Para **presentar al cliente** usa el modo producción (más rápido y con prefetch completo):

```bash
npm run demo       # = next build && next start → http://localhost:3000
```

Para verlo en el **móvil**: conecta el móvil a la misma Wi‑Fi y abre `http://<IP-de-tu-PC>:3000`
(la IP aparece en la consola como “Network”). Recomendado con `npm run demo`.

### Paquete para compartir (sin instalar nada)

```bash
npm run paquete -- --destino "C:\ruta\avances"   # sin --destino → dist/
```

Genera `YOGITIER_avance_<fecha>.zip` y un `INSTRUCTIVO.txt` (en español) en la carpeta indicada. Quien lo recibe
solo tiene que extraer el ZIP y hacer doble clic en **`Iniciar YOGITIER.bat`**: el paquete trae un Node.js portátil,
la app ya compilada (`output: "standalone"`, solo al empaquetar) y el código fuente. Arranca en
`http://localhost:3100` y abre el navegador. En Mac/Linux, con Node.js instalado: `node runtime/iniciar.mjs`.
El texto del instructivo está en `scripts/paquete/INSTRUCTIVO.txt`.

> Pesa unos 60 MB por el Node.js incluido: compártelo por Drive, OneDrive o WeTransfer (Gmail bloquea ZIPs con
> `.bat` o `.exe`).

### Consejos para la demo

- **Guion recomendado (5 min):** app en el escritorio → *Besonderes* → *Dschungel-Bewegungspause* → reproducir el
  vídeo hasta la pausa “Jetzt du!” → pasar al **Studio** (botón del panel izquierdo, PIN `1234`) → *Neue Lernwelt* →
  plantilla → subir un vídeo propio (p. ej. grabado con el móvil) → añadir una pausa interactiva → cambiar el escenario
  y mirar la vista previa en vivo → **Veröffentlichen** → volver a la app: ya aparece en *Besonderes*.
- Haz la demo del Studio y de la app **en el mismo navegador** (ver “Cómo se guarda en el prototipo”).
- **Primera visita:** aparece la bienvenida (nombre del niño y animal favorito).
- **Área de padres** (candado arriba a la derecha): resolver la multiplicación → botón **“Demo-Daten laden”** para llenar
  el panel con 7 días de actividad de ejemplo. Allí mismo: “Begrüßung erneut zeigen” y “Alle Daten löschen”.
- **Voz:** las voces más naturales están en **Microsoft Edge** (“Katja Online (Natural)”) y en Chrome (“Google Deutsch”).
- **Calendario de Adviento:** fuera de diciembre funciona en modo vista previa (todas las puertas abiertas); en diciembre
  se abre una puerta por día.

## Calidad

```bash
npm run lint        # ESLint (incluye las reglas del React Compiler)
npm run typecheck   # TypeScript
npm run build       # build de producción (92 páginas pregeneradas)
npm run check       # los tres seguidos
```

## Estructura

```
src/
├─ app/                  # Rutas (una carpeta = una pantalla)
├─ components/
│  ├─ shell/             # Marco del iPhone + panel de presentación
│  ├─ ui/                # Botones, cabeceras, hojas inferiores, control parental, confeti…
│  ├─ player/            # Reproductor de clases de yoga
│  ├─ meditation/        # Reproductores de respiración y de viajes de fantasía
│  ├─ poses/             # Ilustraciones SVG de las posturas (kid-figure.tsx)
│  ├─ worlds/            # Lernwelten para niños: escenarios, camino, vídeo interactivo, estaciones
│  ├─ studio/            # YOGITIER® Studio: panel, editor, mediateca, ajustes
│  ├─ memo/ diary/ advent/ finder/ parents/ yoga/ animals/ onboarding/
├─ content/              # TODO el contenido en alemán (fácil de editar)
├─ lib/                  # store (localStorage), audio, ambientes, voz, estadísticas
│  └─ studio/            # Datos del Studio: tipos, IndexedDB (db.ts) y acciones (store.ts)
└─ assets/               # Personajes, posturas y logo (de las descargas oficiales de yogitier.de)
```

## Editar contenido

Todos los textos están en `src/content/` (en alemán), separados del código:

| Archivo | Contenido |
|---|---|
| `animals.ts` | Los 8 personajes, frases de ánimo, colores, enlaces a sus esterillas |
| `poses.ts` | Posturas: pasos, beneficios, consejo para padres, ilustración |
| `lessons.ts` | Clases: secuencia de posturas, segundos y narración de cada paso |
| `breathing.ts` | Respiraciones: ritmo (inhalar/retener/exhalar), ciclos, frases |
| `journeys.ts` | Viajes de fantasía (párrafos) |
| `advent.ts` | Las 24 puertas del calendario |
| `moods.ts` | Emociones del diario y su consejo |
| `teachers.ts` | Profesoras **de ejemplo (ficticias)** del buscador |
| `brand.ts` | Tienda, descargas, blog, historia, valores, FAQ, enlaces legales |
| `worlds.ts` | Escenarios, sonidos, categorías, plantillas y las Lernwelten de ejemplo del Studio |

Para añadir una postura nueva sin ilustración, define sus articulaciones en `src/components/poses/kid-figure.tsx`.

## Desplegar en Vercel

1. Sube el repositorio a GitHub (ver abajo).
2. En [vercel.com/new](https://vercel.com/new) importa el repositorio. Vercel detecta Next.js automáticamente; no hace
   falta configuración extra.
3. Opcional: variable `NEXT_PUBLIC_SITE_URL` con el dominio final (ver `.env.example`).

> El prototipo **no se indexa** en buscadores (`robots.ts` y `metadata.robots`). Quítalo al publicar la versión final.

## Subir a GitHub

Remotos configurados: `origin` → `github.com/14-David-06/yogitier` y `kracnaro` → `github.com/Kracnaro/yogitier`
(copia personal, privada).

```bash
git add .
git commit -m "Descripción del cambio"
git push origin main && git push kracnaro main
```

## Próximos pasos (versión completa)

- **Studio en la nube:** vídeos en Vercel Blob (o Mux para streaming adaptativo), base de datos para las Lernwelten,
  **usuarios con roles** (administración, editor, profesora) en lugar del PIN, publicación programada y estadísticas de uso.
- **Cuentas y sincronización** entre dispositivos (p. ej. Supabase o Firebase) en lugar de `localStorage`.
- **CMS** para que YOGITIER edite clases, textos y temporadas sin programar.
- **Tienda real** vía Shopify Storefront API (yogitier.de funciona con Shopify): esterillas y packs dentro del área de padres.
- **Directorio real de profesoras** con mapa, disponibilidad y reservas (red de *Kinderyogalehrende* de YOGITIER).
- **Audios grabados** por locutores profesionales en lugar de la voz del navegador; música relajante.
- **Recordatorios push**, modo offline (service worker) y publicación en App Store / Google Play (PWA o Capacitor).
- Analítica con consentimiento (DSGVO), auditoría de accesibilidad y versión en inglés.

## Notas

- Textos, personajes e ilustraciones provienen de yogitier.de y de sus descargas gratuitas (octubre 2026). Precios
  y enlaces: verificar antes de publicar. Los derechos de la marca pertenecen a YOGITIER® / 8samsam.
- Los perfiles del buscador de profesoras son **ficticios** y están marcados como datos de ejemplo.
- `public/media/demo-baum.mp4` es un vídeo de demostración (26 s) generado a partir de las ilustraciones de la app;
  sustitúyelo por un vídeo real de YOGITIER cuando lo tengáis.
- Conocido: Turbopack falla en el build si Quicksand se carga con una lista de pesos fijos; por eso se usa como
  fuente variable (`src/app/layout.tsx`).
