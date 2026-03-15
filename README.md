# Imposter Game

A real-time multiplayer word guessing experience. The client renders the web UI with React, the server manages FastAPI WebSocket rooms, and the two communicate over `/ws` to keep lobbies and rounds in sync.

## Repository layout
- `client/`: Vite-driven frontend that renders pages, manages routing state, and connects to `/ws` for lobby/game events.
- `server/`: FastAPI backend that owns every WebSocket, game lobby, and word/category pairing.
- `docs/`: Supplemental notes such as the todo list.

## Prerequisites
- Python 3.11
- Node.js 18+
- npm (or yarn)

## Backend (server)
1. `cd server`
2. `python -m venv env`
3. `source env/bin/activate` (on Windows use `env\Scripts\activate`)
4. `pip install -r requirements.txt`
5. `uvicorn main:app --reload`

The backend listens on http://localhost:8000 and exposes `/ws` for WebSocket traffic.

## Frontend (client)
1. `cd client`
2. `npm install`
3. `npm run dev`

Vite runs on http://localhost:5173 and proxies WebSocket traffic to the backend by using the same host/port as the browser window.

## Running both services together
Start the backend first so the WebSocket is live, then boot the frontend. The client automatically connects to `/ws`, so no extra proxy configuration is required.

## Game data
Add or adjust word categories inside `server/data.py` to change the universe of prompts the civilians and imposter see.

## Licensing
This project is open source; feel free to fork and improve the experience.
