# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks, no build step. Files are opened directly in a browser.

## Project Structure

A single scrolling page with one section per slide of the course deck (10 slides).

- `index.html` — the whole course page
- `css/styles.css` — layout, colours, and the light/dark themes
- `js/main.js` — theme toggle, menu, "current section" highlight, and quick-check answers
- `images/` — pictures taken from the slide deck
- `CLAUDE.md` — this file

Update this section whenever files or folders are added.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.

## Feature Plan

### Site structure

One scrolling page with ten sections, one per slide of the course deck:

1. Course introduction
2. Will AI take over my job?
3. Frontline AI agents
4. Roles for AI co-workers
5. Job re-design & re-skilling
6. Customer service
7. Office concierge
8. Tourism & attractions
9. Retail challenges
10. Retail AI agents

How students move between sections:

- Scroll down to read in order.
- Or use the menu to jump to any section. It is a side list on desktop and a drop-down on tablet and phone, and it highlights the section being read.
- The Dark mode switch is in the header on every screen size.
- At the end of each section, one "Quick check" question shows right or wrong straight away. It stays inside that section (no new page or quiz screen) and never blocks the student from moving on.
- No sign-in, and answers are not saved.

### Phases

- **Phase 1 – Course from the slides (built):** all ten slides as text sections with their images, plain-language notes, responsive layout, and the light/dark toggle.
- **Phase 2 – Quick checks (built):** one multiple-choice question per section, with instant feedback and a "continue" link.
- **Phase 3 – Publish:** turn on GitHub Pages and share the link with the class.
- **Later:** nothing planned yet. Ask before adding anything.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.
