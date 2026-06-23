# Comultrasim — Static site

Pure static website (no build step, no package manager, no CI). Serve directly from filesystem or any web server.

## Architecture

- **Pages**: `index.html`, `servicios.html`, `nosotros.html`, `rutas.html`, `personal.html`, `contacto.html`
- Each page has `<header id="header">`, `<main>`, `<footer id="footer">` — components are loaded dynamically
- **Components**: `components/<name>/` — each has `*.html` + `*.css`, registered in `js/app.js` at line 9
- **Entrypoint**: `js/app.js` — on `DOMContentLoaded`, fetches component HTML/CSS into placeholders that exist on the current page
- **CSS**: `css/global.css` (design tokens, utilities) + per-component CSS loaded dynamically
- Subpages use `<main class="subpage-main">` for fixed-header offset

## Conventions

- All content is in **Spanish**
- WhatsApp: `+57 320 489 6514` (hardcoded in header and hero)
- Design tokens in `:root` of `global.css`: primary green `#36A92D`, secondary orange `#F56A00`, accent red `#7A0B0B`
- Fonts: Montserrat (headings), Plus Jakarta Sans (body) — loaded from Google Fonts

## Adding a page

1. Create `page.html` with `<header>`, `<footer>`, and a `<section id="my-section" class="section">` placeholder
2. Create `components/my-section/` with `my-section.html` + `my-section.css`
3. Register in `js/app.js` component list (add `{ id: 'my-section', url: …, css: … }`)

## JS interactions

- Header: mobile menu toggle, active link highlighting, scroll-based sticky class
- Routes (`rutas.html`): filter route cards by origin/destination dropdowns
- Personal (`personal.html`): gallery filter by vehicle category buttons
