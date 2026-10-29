# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks, no build step. Files are opened directly in a browser.

## Project Structure

A single scrolling page: one section per slide of the course deck (10 lessons), then a practice simulator.

- `index.html` — the whole course page
- `css/styles.css` — layout, colours, and the light/dark themes
- `js/main.js` — theme toggle, menu, "current section" highlight, Lesson/Quiz tabs, quiz scoring, and the simulator
- `images/` — pictures taken from the slide deck
- `CLAUDE.md` — this file

Update this section whenever files or folders are added.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.

## Feature Plan

### Site structure

One scrolling page with eleven sections: ten lessons (one per slide of the course deck) and a practice simulator:

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
11. Practice simulator

How students move between sections:

- Scroll down to read in order.
- Or use the menu to jump to any section. It is a side list on desktop and a drop-down on tablet and phone, and it highlights the section being read.
- The Dark mode switch is in the header on every screen size.
- Each lesson (sections 1 to 10) has two tabs on the same page: **Lesson** (the slide's content) and **Quiz** (1 multiple-choice question). A "Take the quiz" button at the end of the lesson switches tabs.
- The quiz shows right or wrong as soon as an answer is picked, then the score. A "Continue to the next section" link appears either way, and nothing ever blocks the student from moving on.
- The simulator (section 11) shows 9 role-matching scenarios one at a time with instant feedback, then a final score and "Try again".
- No sign-in, and answers are not saved. Without JavaScript the lessons still show in full, but the tabs, quizzes and simulator are hidden.

### Phases

- **Phase 1 – Course from the slides (built):** all ten slides as text sections with their images, plain-language notes, responsive layout, and the light/dark toggle.
- **Phase 2 – Tabs, quizzes and simulator (built):** Lesson/Quiz tabs on every lesson, one scored question each, and the role-matching simulator.
- **Phase 3 – Publish:** turn on GitHub Pages and share the link with the class.
- **Later:** nothing planned yet. Ask before adding anything.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.
