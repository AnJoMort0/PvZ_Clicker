# PvZ Clicker

`PvZ Clicker` is a small browser prototype exploring what a Plants vs. Zombies-inspired incremental game could feel like. It's a way for me to show off Rogue Garden's art style, test features, and prototype clicker systems for bigger projects.

The current version is intentionally lightweight: a playable static web project built with vanilla HTML, CSS, and JavaScript.

## Why this repo exists

This repository is also a transparent experiment in working with Codex.

I am using Codex to help design, refactor, and implement parts of the project, but this is not "just vibe coding." I am actively reviewing the changes, reading the code, checking what was done, and asking questions whenever I do not understand something. A big part of this repo is also learning: using the tool to move faster while still staying accountable for the code and the direction of the project.

## Current prototype

- PvZ-inspired daytime lawn layout with a rectangular board and left-side seed packet navigation
- Clickable sunflower economy loop
- Sunflower upgrade line for click income, passive income, and timed sky drops
- Environment upgrade slot for lawn-wide economy bonuses
- Expandable structure so more plant families and mechanics can be added without reworking the whole app shell
- Fixed-size visual slots so future art assets can replace emoji placeholders cleanly

## Run locally

You can open `index.html` directly in a browser, or run a tiny local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.