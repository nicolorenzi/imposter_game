# Imposter Game

A real-time multiplayer word-guessing party game. The React/Vite frontend renders the lobby, game, and results views while the FastAPI backend owns every `/ws` WebSocket room, lobby state, and randomized word/imposter assignment.

## Repository layout
- `client/`: Vite-driven React app. `src/App.jsx` wires together the `Home`, `CreateLobby`, `JoinLobby`, `Lobby`, `Game`, and `EndGame` pages, and the `useWebSocket` hook keeps the connection open, routes socket messages, and proxies the top-level actions (ready toggle, start, reveal, leave). Styling is centralized in `src/index.css`, assets live in `src/assets`, and `package.json` exposes the usual `dev`, `build`, `preview`, and `lint` scripts.
- `server/`: FastAPI backend (`server/main.py`) that exposes `/ws`, handles lobby commands (`create_lobby`, `join_room`, `toggle_ready`, `start_game`, `reveal_imposter`, `leave_room`), broadcasts lobby updates, and keeps the `CATEGORIES` dictionary (default or from `server/data.py`).
- `docs/`: supporting notes such as `todo.txt` for next steps.

## Requirements
- Python 3.11 (for the FastAPI stack defined in `server/requirements.txt`)
- Node.js 18+ and npm (or another npm-compatible package manager) to build the Vite client

## Backend (server)
1. `cd server`
2. `python -m venv env`
3. `source env/bin/activate` (Windows: `env\Scripts\activate`)
4. `pip install -r requirements.txt`
5. `uvicorn main:app --reload --host 0.0.0.0 --port 8000`

The backend listens on `http://localhost:8000` (GET `/` returns a simple message) and exposes `/ws` for the lobby/game WebSocket. The CORS middleware currently allows `https://imposter-party-game-nico.vercel.app/`; add any other trusted origins (e.g., `http://localhost:5173`) to `allow_origins` in `server/main.py` before running locally.

## Frontend (client)
1. `cd client`
2. `npm install`
3. `npm run dev`

Vite launches at `http://localhost:5173`. The client defaults to connecting to `ws://localhost:8000/ws` when `VITE_WS_URL` is unset; set `VITE_WS_URL=wss://your-host/ws` if the backend lives elsewhere. The client UI animates the multi-page flow (`Home`, lobby setup, game, and results) and uses `useWebSocket` to send the command payloads above.

## Running both services together
Start the backend first so `/ws` is available, then boot the frontend. The client automatically reuses the browser host/port for WebSocket traffic (or the value of `VITE_WS_URL`), so no extra proxy is required.

## WebSocket contract
| Client → Server | Description |
|-----------------|-------------|
| `create_lobby` | Send `{ name, max_players }` to create a room and receive `lobby_created` with a 4-digit code. |
| `join_room` | Send `{ name, room_code }`; the server validates capacity and replies with `lobby_update` or `lobby_full`/`error`. |
| `toggle_ready` | Toggles the sender's ready flag, triggering `lobby_update`. |
| `start_game` | Host-only; the server picks a random category, word, imposter, and starter, then sends `game_started` to each participant (civilians get the real word, imposters see `IMPOSTER`). |
| `reveal_imposter` | Host-only; reveals `game_ended` with both the imposter name and the actual word. |
| `leave_room` | Removes the player; if the room empties, it is deleted. |

The server also emits `connected` when a socket opens and surfaces errors via `error` messages.

## Game flow
1. A player creates a lobby (specifying `max_players`, clamped between 2 and 10); every joining player shows up in the lobby list tracked by `room.players`.
2. Players toggle ready. The host sees `Start Game` enabled once there are at least two players and everyone is ready.
3. Starting a round randomizes the category/word from `CATEGORIES`, picks one player as the imposter, and selects a random starting player. The UI shows the category, who's going first, and either the secret word (civilians) or the `IMPOSTER` placeholder.
4. The host can hit `Reveal Imposter`, which broadcasts the true imposter and word and resets all ready flags so the lobby is back to the pre-game state.

## Customization
- **Categories:** `server/main.py` defines `DEFAULT_CATEGORIES` from `_CATEGORY_SOURCE` (title-cased keys/entries). To override, create `server/data.py` with a `CATEGORIES` dict; the server imports it if present.
- **CORS & WebSocket hosts:** Update the `allow_origins` list in `server/main.py` and/or set `VITE_WS_URL` when deploying to a different domain.

## Licensing
Open source project—feel free to fork, experiment, and improve the experience.
