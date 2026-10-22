# Sketchbook — project proposal

## Title

**Sketchbook: An Interactive Drawing Practice and Colour Learning Website**

Alternatives if the shorter one is preferred:

- *Sketchbook — draw badly, on purpose.*
- *Sketchbook: timed drawing drills, palette generation and a colour quiz.*

## Concept

Sketchbook is a small, browser-based studio for people who want to draw better but never know
what to practise. It does three things: it gives a timed drawing drill from a bank of prompts, it
generates five-colour palettes and explains why they work, and it tests the user on colour theory
with a ten-question quiz whose result is ranked on a local leaderboard.

The idea comes from a real problem: people who sketch casually often stop because they lack a
subject and don't understand colour. Most reference sites solve only the first half. Sketchbook
pairs a drawing timer with a palette tool, so the user practises looking and choosing colour in
the same session.

It is built with plain **HTML, CSS and JavaScript** — no frameworks and no server. The only
storage is the browser's `localStorage`, which keeps saved palettes and quiz scores on that
device.

**Target user:** students and hobbyists who draw in their own time and want short, structured
practice.

**Tone:** a risograph-printed sketchbook — warm paper, two ink greens, hard edges, slightly
misregistered shadows.

## Objectives

1. Give the user something specific to draw within one click.
2. Teach four colour harmonies (analogous, complementary, triadic, monochromatic) through tools
   rather than text alone.
3. Test that knowledge with immediate feedback and a score worth comparing.
4. Demonstrate the HTML, CSS and JavaScript topics covered in the course.

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Timed drill, sketch pad, studio palette |
| `palettes.html` | Palette generator, harmony explanations, saved palettes |
| `quiz.html` | Ten questions, feedback, result and score entry |
| `board.html` | Top ten scores, sorted and highlighted |

## Technology

- HTML5: semantic structure, forms, table, `<canvas>`, `data-*` attributes
- CSS3: custom properties, flexbox, grid, transitions, transforms, `mix-blend-mode`, media queries
- JavaScript: DOM manipulation, events, arrays and objects, `setInterval`, `Math.random`,
  `localStorage`, Canvas 2D, Web Audio, Clipboard API

## Limitations (stated honestly)

- The leaderboard is local to one browser; a shared board would need a backend.
- Palettes are random, so a generated palette may not match the site's own colours.
- No accounts, no uploads, no image files — all visuals are drawn with CSS, SVG or canvas.

## Timeline

Assumes a four-week window, Monday 26 October to Friday 20 November 2026. Shift the dates if the
deadline differs.

| # | Task | Start | End |
|---|---|---|---|
| 1 | Concept, scope and planning | 26 Oct | 27 Oct |
| 2 | Wireframes and colour system | 27 Oct | 29 Oct |
| 3 | HTML: all four pages | 29 Oct | 3 Nov |
| 4 | CSS: layout, components, responsive | 3 Nov | 6 Nov |
| 5 | JS: practice timer and sketch pad | 6 Nov | 9 Nov |
| 6 | JS: palette generator and storage | 9 Nov | 11 Nov |
| 7 | JS: quiz and leaderboard | 11 Nov | 13 Nov |
| 8 | Content: prompts, questions, colour notes | 10 Nov | 13 Nov |
| 9 | Testing: browsers, phone, fixes | 16 Nov | 17 Nov |
| 10 | Documentation: README and coverage list | 17 Nov | 18 Nov |
| 11 | Buffer, final polish, submission | 18 Nov | 20 Nov |

Milestones: **HTML + CSS complete** (6 Nov), **all features working** (13 Nov), **submitted** (20 Nov).
