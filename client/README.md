# Imposter Game Frontend

The `client` folder holds the web-facing experience built with React (via Vite). It renders the lobby/game flow, talks to the backend over `/ws`, and ships a single-page layout powered by `App.jsx` and the page components in `src/pages`.

## Local development
1. `cd client`
2. `npm install`
3. `npm run dev`

Vite starts on http://localhost:5173. The bundled code uses the same host as the browser window, so WebSocket traffic automatically targets the backend at `/ws`.

## Available scripts
- `npm run dev` – start the Vite dev server with fast refresh
- `npm run build` – produce a production build under `dist/`
- `npm run preview` – serve the production build locally
- `npm run lint` – run ESLint across the source tree

## WebSocket endpoint
By default the dev server targets `ws://localhost:8000/ws`. Set `VITE_WS_URL` (e.g. `VITE_WS_URL=wss://example.com/ws npm run dev`) if your backend lives on a different host or port.

## Source overview
- `src/main.jsx` boots the React tree and mounts `App`.
- `src/App.jsx` coordinates navigation, players, and WebSocket events.
- `src/hooks/useWebSocket.js` keeps the socket connection alive and routes messages into callbacks shared with `App`.
- `src/pages` contains `Home`, `CreateLobby`, `JoinLobby`, `Lobby`, `Game`, and `EndGame` views.
