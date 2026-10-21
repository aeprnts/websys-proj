# Sketchbook

A small art-practice site: timed drawing drills, a palette generator, a colour quiz and a
local leaderboard. Plain HTML, CSS and JavaScript — no libraries, no build step, no server logic.

## Run it

Open `index.html` in a browser. That's it.

If your browser blocks `localStorage` on `file://`, start a tiny local server instead:

```
python -m http.server 8000
```

then visit `http://localhost:8000`.

## Files

| File | What it does |
|---|---|
| `index.html` | Practice page: random drill, timer, sketch pad, studio palette |
| `palettes.html` | Palette generator + the four harmonies explained + saved palettes |
| `quiz.html` | Ten questions, instant feedback, score at the end |
| `board.html` | Top ten, sorted by score then by who got there first |
| `style.css` | The whole look; palette lives in `:root` at the top |
| `script.js` | All the behaviour, one section per page |

## Where each idea lives (W3Schools coverage)

### HTML
- Semantic structure, headings, paragraphs, lists, links — every page
- `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`-style grouping
- Images/figures — not used; the visual is drawn with CSS and `<canvas>`/`<svg>`
- **Tables** — `board.html` (thead / tbody / th / td, `colspan` fallback)
- **Forms** — `quiz.html` (text input, button), `palettes.html` (select, buttons), `board.html`
- **Canvas** — `index.html` sketch pad, drawn with pointer events
- **SVG** — palette wheel and mini strips are inline SVG/HTML
- `data-*` attributes — `body[data-page]`, chip `data-sec`
- Accessibility basics — labels, `aria-current`, `aria-expanded`, `aria-live`, focus styles

### CSS
- Box model, margins, padding, borders, shadows — everywhere
- Custom properties (`:root` variables) — the palette
- Flexbox — header, chips, tool rows, saved palettes
- Grid — `grid-template-columns` for the practice layout, palette strip, quiz options
- Responsive design — media queries at 800px and 640px, mobile nav
- Pseudo-classes — `:hover`, `:active`, `:focus-visible`, `:disabled`
- Pseudo-elements — `::before` for the halftone dot texture
- Gradients — page dot texture, text highlight (`linear-gradient`)
- Transitions + transforms — button press, sticker rotation, progress bar
- `mix-blend-mode` — overprinted swatches
- Typography, colours, opacity, `clamp()`

### JavaScript
- Variables, `let`/`const`-style blocks, functions, arrays, objects
- Loops and array methods — `forEach`, `filter`, `map`, `slice`, `sort`
- Conditionals — quiz scoring, harmony choice, score messages
- DOM manipulation — `createElement`, `textContent`, `appendChild`, class changes
- Events — click, pointerdown/move/up, change, resize
- Timers — `setInterval` + `setTimeout`, counting down with `Date.now()`
- `Math.random` — drill shuffling, palette base hue
- `localStorage` + JSON — saved palettes and scores
- Canvas 2D API — freehand drawing, `toDataURL` for the PNG download
- Web Audio API — the timer's end beep
- Clipboard API — copy hex codes (with an `execCommand` fallback)
- Sorting with a comparator — `board.html`

## Honest notes

- The leaderboard is **local** (`localStorage`), not shared between computers. Seeded names keep it
  looking alive. A real shared board needs a backend, which is outside this unit.
- Palette colours are random, so a generated palette may not match the site's own green palette.
  That's intentional — it's a reference tool.
- The dot texture and "misregistered" shadows are CSS tricks imitating risograph printing.
