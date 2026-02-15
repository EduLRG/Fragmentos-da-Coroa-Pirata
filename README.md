# Fragmentos da Coroa Pirata

A 2D top-down game built with **Phaser 3** where the player explores an island, collects coins, finds a key, and unlocks the treasure while avoiding enemy pirates.

## Project Overview

This project was developed to practice and demonstrate:

- gameplay programming with Phaser scenes and entities;
- collision and overlap logic with Arcade Physics;
- enemy AI behavior (patrol + chase);
- responsive input for both desktop and mobile.

The game includes **2 playable levels**, a full menu/flow system, score tracking, audio feedback, and mobile joystick support.

## Core Features

- Main menu with mouse and keyboard navigation.
- In-game instructions screen.
- Score system (`+10` points per coin).
- Multi-level progression.
- Enemy pirates with patrol and chase behavior based on distance and facing direction.
- Level complete, game complete, and results screens.
- Background music and SFX.
- Virtual joystick for touch devices.

## Gameplay Loop

1. Start in the main menu.
2. Enter a level and explore the map.
3. Collect the key.
4. Reach and unlock the treasure.
5. Avoid enemies and collect coins to maximize score.
6. Progress to the next level or finish the game.

## Tech Stack

- JavaScript (ES Modules)
- [Phaser 3](https://phaser.io/) (`3.88.2`)
- Tiled JSON maps

## Controls

### Desktop

- `Arrow Keys`: move the player
- `Enter`: confirm actions in menus/transition screens

### Mobile

- Virtual joystick (bottom-left corner)


## Project Structure

```text
.
├── index.html
├── phaser.js
├── assets/
│   ├── audio/
│   ├── images/
│   ├── joystick/
│   ├── maps/
│   └── plugins/
└── src/
    ├── main.js
    ├── Player.js
    ├── Pirate.js
    ├── Key.js
    ├── Coin.js
    └── scenes/
```

## Current Status

- Level 1 and Level 2 are implemented.
- Level 2 includes randomized spawn selection for enemies/key/coins.
- Victory after clearing the final level.
- Defeat when the player is captured by enemies.

## Challenges & Learnings

1. **Scaled collisions in a top-down map**  
Challenge: sprite scale and physics body alignment caused inconsistent collisions.  
Solution: manually tuned body size/offset for player and enemies, then validated against map boundaries and object colliders.  
Learning: visual scale and physics scale must be treated independently for reliable gameplay.

2. **Enemy chase behavior with directional awareness**  
Challenge: basic distance checks made enemies feel unfair and unrealistic.  
Solution: added a field-of-view condition using a normalized direction vector and dot product before triggering chase mode.  
Learning: simple vector math can significantly improve AI readability and game feel.

3. **Desktop and mobile input parity**  
Challenge: gameplay needed to feel consistent across keyboard and touch devices.  
Solution: merged keyboard cursors with virtual joystick cursors through a single movement path.  
Learning: unifying input at one abstraction layer keeps behavior predictable and easier to maintain.

## Author

- Eduardo Goncalves
