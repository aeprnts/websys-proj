# How Sketchbook came about

A short record of the decisions behind the project, written so someone who wasn't in the
conversation can follow the reasoning.

## In one paragraph

The brief was an education website built with only HTML, CSS and JavaScript, covering the lessons
from the course (W3Schools HTML, CSS and JavaScript). There was no topic, no rubric, and no
working concept — only the category "Educational". After ruling out several ideas, the project
became **Sketchbook**, a studio site for people who draw casually and want short, structured
practice: timed drawing drills, a colour palette generator, a colour quiz, and a local
leaderboard. The topic was chosen because it solves a problem the student actually has — needing
reference and inspiration, and not understanding colour theory.

## Constraints we were working with

- **Stack:** HTML, CSS and JavaScript only. No frameworks, no backend.
- **Course requirement:** the site should visibly use the HTML, CSS and JS topics taught from
  W3Schools — structure, forms, tables, canvas, flexbox, grid, media queries, transitions,
  DOM events, arrays, `localStorage` and so on.
- **Skill level:** beginner. Big scope was the main risk.
- **Deliverable:** a school project, so "finished and explainable" mattered more than "ambitious".
- **No rubric was provided**, which meant the safest strategy was breadth of visible features
  plus a document mapping features back to course topics.

## What we ruled out, and why

| Option | Why it was dropped |
|---|---|
| Tutoring-centre business site | Rejected — the student did not want a site built around pricing and subscriptions |
| Space / galaxy topic | Already used in a previous assignment |
| E-commerce (Shopee-style) | Needs cart state, checkout and product logic — too much for a first project |
| Web application (generic) | The vaguest category, and the easiest to over-promise on |
| Blog | Least code, but content-heavy and very common in a class |
| A topic site about dinosaurs, ocean, mythology, flags, etc. | Discussed as alternatives; none mattered personally to the student |

## The turn: build the tool you need

The student said they love sketching and painting but rely on references, need inspiration, and
find colour theory difficult. That turned the project from "a website about a topic" into "a
practice tool for someone like me". Every feature then had a reason:

- **Timed drills** solve "I don't know what to draw".
- **Palette generator + harmony explanations** solve "I don't understand colour".
- **Quiz + leaderboard** make the learning testable and give the project a reason to use
  JavaScript state and storage.

## Design direction

The visual style went through several rounds, each rejected for a specific reason:

1. **Paper-and-ink app** — rejected as overused: soft cream, rounded cards, muted accent.
2. **Four directions compared** — neo-brutalist, dark gallery, risograph zine, Swiss grid.
3. **Risograph zine chosen** — two-ink print feel, halftone dots, hard edges, rotated stickers,
   all achievable in plain CSS.
4. **Pink swapped for green**, then **softened**, then a **friendlier two-green + beige palette**
   taken from a reference image the student picked.

Final palette: evergreen `#1F3B2E`, moss `#3C5A3A`, leaf `#6B8E23`, sage `#A3B18A`,
soft lime `#C7D5A6`, sunlit beige `#DCD2B5`, plus a card cream tint for surfaces.

## What was built

Four pages sharing one stylesheet and one script:

| Page | Contents |
|---|---|
| `index.html` | Random drill, countdown timer, drawable canvas, studio palette |
| `palettes.html` | Palette generator in four harmonies, explanations, saved palettes |
| `quiz.html` | Ten colour questions with immediate feedback and a score |
| `board.html` | Top ten, sorted by score then earliest entry |

Technical choices worth explaining in a presentation:

- **The leaderboard is local.** A shared board needs a server, which the stack rules out, so
  scores live in `localStorage` and a few seeded names keep the table from looking empty.
- **No image files.** Every visual is CSS, SVG or canvas — which also avoids copyright issues
  and keeps the project self-contained offline.
- **The risograph look is CSS.** Halftone dots are a repeating `radial-gradient`; the
  "misprinted" shadows are offset `box-shadow`s; stickers are rotated with `transform`.
- **Testing was done in a browser**: timer countdown, palette save/delete, quiz scoring, result
  form, and a saved score appearing on the board.

## Still open

- Rewriting the drill prompts and quiz questions in the student's own words.
- Checking the concept against the course's chapter list (no rubric was supplied).
- Confirming the timeline dates in `PROJECT.md` against the real deadline.
- Optionally publishing via GitHub Pages.

## Tools and assistance

The concept, constraints, topic choice, palette choice and content direction came from the
student. The code scaffolding and design mock-ups were produced with AI assistance, then tested
in a browser and committed to the repository. Adjust this section if your course has its own
declaration wording for assisted work.
