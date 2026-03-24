# nslt.studio

Custom JavaScript for [nslt.studio](https://nslt.studio) — hosted on Webflow, bundled with Vite, served via jsDelivr.

## Stack

- **Swup.js** — page transitions
- **Embla Carousel** — details page slider (auto-scroll, drag free, loop)
- **Vite** — bundler (lib mode, ES output)

## Modules

| Module | Description |
|---|---|
| `main.js` | Entry point — initializes swup, nav, page, media, buttons |
| `src/swup.js` | Page transitions, body class state machine, click capture for details |
| `src/nav.js` | Active nav link + `.indicator` positioning |
| `src/router.js` | Routes to page-specific init based on `data-swup` namespace |
| `src/buttons.js` | `#first` / `#second` interactive buttons — CET clock, hover effects, details freeze |
| `src/media.js` | Lazy-load videos via `data-src`, play/pause on viewport, image fade-in |
| `src/state.js` | Shared state — previous URL, details name/services |
| `src/pages/home.js` | Home page init |
| `src/pages/work.js` | Work page — randomized item order, project counter |
| `src/pages/info.js` | Info page init |
| `src/pages/details.js` | Details page — back link, Embla carousel |

## Webflow attributes

| Attribute / Selector | Purpose |
|---|---|
| `[data-swup]` | Swup container — value is the page namespace (`home`, `work`, `info`, `details`) |
| `[data-to="details"]` | Link triggering details transition — must have `data-name` and `data-services` |
| `[data-name]` | Hover → updates `#first` button text |
| `[data-services]` | Hover → updates `#second` button text |
| `#first` | Left button — shows project name or default text. Set default via `data-default` attr |
| `#second` | Right button — shows CET time or project services |
| `#currentYear` | Receives current year |
| `#backLink` | Back button on details page — href set to previous page |
| `#projectsCounter` | Work page — displays `(n)` project count |
| `.work-list` | Work page list container |
| `.work-item` | Work page items — displayed in random order |
| `.embla` | Carousel root on details page |
| `.embla__viewport` | Carousel viewport |
| `.embla__container` | Carousel slides container |
| `.embla__slide` | Individual slide |
| `video[data-src]` | Lazy-loaded video — `src` set on viewport enter |

## Body classes (CSS hooks)

| Class | Meaning |
|---|---|
| `body.on-details` | Currently on a details page |
| `body.details-transition` | Transitioning to/from a details page |

## Dev

```bash
npm install
npm run dev        # Vite dev server on :5173
node start.js      # Vite + Cloudflare tunnel (prints script URL)
```

## Build & deploy

```bash
npm run build      # outputs dist/main.js
git add dist/main.js && git commit -m "..." && git push
```

Then update the jsDelivr URL in Webflow with the new commit hash:

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/nslt-studio/nslt-studio@{hash}/dist/main.js"></script>
```

## License

Private — All rights reserved.
