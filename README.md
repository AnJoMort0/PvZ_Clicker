# PvZ_Clicker

Simple game to show off Rogue Garden's art style, test features, and prototype clicker systems for bigger projects.

## Platform recommendation

For your goals (fast iteration, browser target like itch.io, hand-drawn art tests, and simple incremental mechanics), the best starting point is:

- **HTML + CSS + JavaScript (vanilla)** for this first prototype.

Why:
- Instant browser play without build tooling.
- Easy deployment to itch.io as a web game.
- Low overhead while you explore art style, animations, and game feel.
- Simple path to scale later into Phaser, Godot Web export, or a custom engine if needed.

## Current prototype features

- Clickable sunflower placeholder that gives **1 sun per click**.
- Upgrade: **Sunflower Growth** for passive sun per second.
- Upgrade: **Richer Sun** to increase sun gained per click.
- Upgrade: **Sky Sun Drop** that adds periodic big sun drops.
- Rising upgrade costs to support incremental progression.

## Run locally

Open `index.html` directly in your browser, or run a tiny local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
