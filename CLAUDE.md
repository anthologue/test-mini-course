# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks, no build step. Files are opened directly in a browser.

## Project Structure

A single page with three tabs (Lesson, Quiz, Simulator). The Lesson tab has one section per slide of the course deck (10 sections).

- `index.html` — the whole course page
- `css/styles.css` — layout, colours, and the light/dark themes
- `js/main.js` — theme toggle, menu, "current section" highlight, the three tabs, quiz scoring, and the simulator
- `images/` — pictures taken from the slide deck
- `CLAUDE.md` — this file

Update this section whenever files or folders are added.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.

## Feature Plan

### Site structure

One page with three tabs at the top: **Lesson**, **Quiz** and **Simulator**. The Lesson tab is a scrolling page of ten sections, one per slide of the course deck:

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

- Lesson tab (the default): scroll down to read in order, or use the menu to jump to any section. A "Take the quiz" button at the end switches to the Quiz tab.
- Quiz tab: 8 multiple-choice questions on the whole course. Each answer shows right or wrong straight away, and the score appears once all 8 are answered. "Try again" starts over.
- Simulator tab: 9 role-matching scenarios, one at a time, with instant feedback, then a final score and "Try again".
- The menu lists the 10 lesson sections, then "Quiz" and "Simulator". Choosing any of them opens the right tab first. It is a side list on desktop and a drop-down on tablet and phone, and it highlights where you are.
- The Dark mode switch is in the header on every screen size.
- Everything stays on the one page. Nothing blocks the student from moving on, there is no sign-in, and answers are not saved. Without JavaScript the full lesson still shows, but the tabs, quiz and simulator are hidden.

### Phases

- **Phase 1 – Course from the slides (built):** all ten slides as text sections with their images, plain-language notes, responsive layout, and the light/dark toggle.
- **Phase 2 – Quiz and simulator tabs (built):** an 8-question scored quiz and the role-matching simulator, as tabs beside the lesson.
- **Phase 3 – Publish:** turn on GitHub Pages and share the link with the class.
- **Later:** nothing planned yet. Ask before adding anything.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.
