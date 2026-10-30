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

One page with three tabs at the top: **Lesson**, **Quiz** and **Simulator**. Everything stays on the same page.

The Lesson tab is one long scrolling page for beginners, with one section per slide of the deck (10 sections, in slide order). Each section has the slide's key points, its picture, a short "In plain words" note, and a check-in question.

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
- Each section ends with one multiple-choice check-in question, answered in place with instant right/wrong feedback. The student can move on either way.
- Quiz tab: 8 multiple-choice questions on the whole course. Each answer shows right or wrong straight away, and the score appears once all 8 are answered. "Try again" starts over.
- Simulator tab: 9 role-matching scenarios, one at a time (the learner picks which AI role should handle each), with instant feedback, then a final score and "Try again".
- The menu lists the 10 lesson sections, then "Quiz" and "Simulator". Choosing any of them opens the right tab first (JavaScript, same page). It is a side list on desktop and a drop-down on tablet and phone, and it highlights where you are.
- The light/dark switch is in the header on every screen size.
- No sign-in, and answers are not saved. Without JavaScript the full lesson still shows, but the tabs, check-in questions, quiz and simulator are hidden.

### Phases

- **Phase 1 – Course from my slides (built, plain styling):** all ten sections with images, plain-language notes, responsive layout and the light/dark toggle. The slide deck itself is not kept in the repository. Visual design comes next.
- **Phase 2 – Quiz and simulator tabs (built):** the 8-question scored quiz and the role-matching simulator, as tabs beside the lesson.
- **Phase 3 – Publish:** share the finished page with students.
- **Later:** nothing planned yet. Ask before adding anything.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.
