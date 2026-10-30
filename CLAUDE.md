# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks, no build step.

## Project Structure

- `index.html` — the page
- `css/` — stylesheets
- `js/` — scripts
- `images/` — pictures
- `CLAUDE.md` — this file

Update this section whenever files or folders are added.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.

## Feature Plan

### Site structure

One long scrolling page for beginners, with one section per slide of the deck (10 sections, in slide order). Each section has the slide's key points, its picture, and a short "In plain words" note.

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
- Use the menu to jump to any section (JavaScript scrolls to it, on the same page): a side list on desktop, a drop-down on tablet and phone. It highlights where you are.
- The light/dark switch is in the header on every screen size.
- Each section ends with one multiple-choice check-in question, answered in place with instant right/wrong feedback. The student can move on either way.
- No sign-in, and answers are not saved or scored. Without JavaScript the full lesson still shows, but the check-in questions are hidden.

### Phases

- **Phase 1 – Course from my slides (built, plain styling):** all ten sections with images, plain-language notes, responsive layout and the light/dark toggle. The slide deck itself is not kept in the repository. Visual design comes next.
- **Phase 2 – Publish:** share the finished page with students.
- **Later:** nothing planned yet. Ask before adding anything.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.
