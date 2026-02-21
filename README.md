# PixelMon Retro – Gen 1 Pokémon Clone 🐾✨

A faithful, browser-based recreation of the classic **Pokémon Red/Blue** experience — built from scratch with modern web tech.  
Explore Kanto, catch 'em all (151 Pokémon), battle trainers, collect badges, and become Champion... all in your browser!

PLAY LIVE ON : https://pixelmon-retro-al1o.vercel.app/

## ✨ Features

- **Retro Overworld** – Top-down exploration, grid movement, tall grass encounters, NPC interactions
- **Turn-Based Battles** – Classic Pokémon combat with type advantages, moves, items, switching, status effects
- **Full Gen 1 Roster** – All 151 Pokémon with stats, sprites, cries, evolutions, learnsets
- **Story Progression** – 8 gyms, Elite Four, Hall of Fame ending
- **Catch Mechanics** – Poké Balls, shake animation, HP-based success rate
- **Team & PC** – Manage party of 6 + infinite PC storage
- **Modern Extras**  
  - Save/load anywhere (localStorage + cloud sync)  
  - Multiplayer Pokémon trading & PvP battles  
  - Daily random challenges  
  - Leaderboards (fastest Champion runs, most shinies caught)  
  - CRT filter, chiptune BGM, sound effects  
  - Responsive (plays great on phone)

## 🛠️ Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Frontend    | Vite + React (TypeScript)               |
| Rendering   | PixiJS (canvas-based pixel art)         |
| Styling     | Tailwind CSS (retro green-blue palette) |
| Game Logic  | Custom engine + chess.js-inspired state |
| Audio       | Tone.js / Howler.js (chiptune + cries)  |
| Backend     | Node.js + Express + Socket.io           |
| Storage     | Vercel KV / Postgres (saves & leaderboards) |
| Deployment  | Vercel (frontend static + serverless API) |

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+
- npm or yarn

### Run the Game

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/pixelmon-retro.git
cd pixelmon-retro

# 2. Install backend
cd backend
npm install

# 3. Install frontend
cd ../frontend
npm install

# 4. Start backend (in one terminal)
cd backend
npm start
# → Server running on http://localhost:3001

# 5. Start frontend (in another terminal)
cd ../frontend
npm run dev
# → Open http://localhost:5173
OR VISIT LIVE ON :https://pixelmon-retro-jyxv.vercel.app/
