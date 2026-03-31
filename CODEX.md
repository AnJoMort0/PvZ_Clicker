## Project structure

`index.html` provides the static shell.

`style.css` handles the PvZ-inspired presentation and scaling rules for placeholder art and future assets.

`src/main.js` wires the game together.

`src/config/gameData.js` defines plant categories and upgrades.

`src/game/` contains state and economy logic.

`src/ui/render.js` renders the packet columns and HUD.


## Tech choice

This prototype uses plain HTML, CSS, and JavaScript on purpose.

- No build step
- Easy to inspect and learn from
- Fast to iterate on
- Easy to publish as a simple web game

For an early prototype focused on feel, layout, and economy tuning, this is a practical starting point. If the project grows, the code is now organized so it can either keep expanding as modular vanilla JS or later be migrated into a heavier framework or engine with less cleanup.


## Next steps

- Replace emoji placeholders with real PvZ-style art assets
- Add more plant lines and their dedicated upgrade trees
- Introduce enemies, lanes, and combat logic
- Add save/load support and balancing passes