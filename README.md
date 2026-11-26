# Cumulus Courier

[![make.fun · best-flight-game-20261126-0057](https://make.fun/badge/best-flight-game-20261126-0057.svg)](https://make.fun/bounty/best-flight-game-20261126-0057?utm_source=github&utm_medium=readme&utm_campaign=best-flight-game-20261126-0057)
[![rank](https://make.fun/badge/best-flight-game-20261126-0057/Ronaldddfrm/best-flight-game-20261126-0057/rank.svg)](https://make.fun/bounty/best-flight-game-20261126-0057/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-flight-game-20261126-0057)
[![reward](https://make.fun/badge/best-flight-game-20261126-0057/Ronaldddfrm/best-flight-game-20261126-0057/reward.svg)](https://make.fun/bounty/best-flight-game-20261126-0057?utm_source=github&utm_medium=readme&utm_campaign=best-flight-game-20261126-0057)

Built for the make.fun bounty [Make the best flight game](https://make.fun/bounty/best-flight-game-20261126-0057). Referral: https://make.fun/r/hvvdtetx

A 2D canvas flight game set at sunset — fly a courier plane along a mountain ridge, thread 6 glowing rings, drop supplies over the marked zone, then land gently on the destination runway.

## How to play

Complete three legs of your courier route:

### 1. RIDGE RINGS

Fly through all 6 glowing rings along the mountain ridge.

- Each ring earns +100 points.
- Collect all six before continuing to the supply drop.

### 2. SUPPLY DROP

Press SPACE while over the green marked drop zone.

- A precise delivery earns up to +500 points.
- Your score depends on drop accuracy.

### 3. FINAL APPROACH

Land on the destination runway slow and level.

- A gentle touchdown earns up to +1000 points by softness.
- Remaining fuel and time bonuses add to your final score.

## Controls

| Key | Action |
| --- | --- |
| ArrowUp / ArrowDown | Throttle |
| ArrowLeft / ArrowRight | Pitch |
| SPACE | Supply drop |
| P | Pause |
| M | Mute |
| ENTER | Start / restart |

## Run it

Start the local server:

```sh
node serve.ts
```

Then open http://localhost:8080, or open `game/index.html` directly in a browser.

## Tech

Vanilla JavaScript ES modules on a 2D canvas, with no dependencies and no network. The world is deterministic and seeded (seed=1).

## Screenshots

- `1-start.jpg` — title
- `2-play.jpg` — mid-flight through the rings
- `3-landing.jpg` — final approach
- `4-end.jpg` — delivery complete

---

Built for the make.fun 'Make the best flight game' bounty.
