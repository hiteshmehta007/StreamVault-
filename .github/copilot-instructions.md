# Copilot instructions for StreamVault (Online Video Streaming Platform)

Quick reference for AI coding agents working in this repo. Be concise, follow existing conventions, and change only what is discoverable in the codebase.

## Big picture
- Monorepo-like layout: a frontend SPA (root) and a backend service under `backend/`. See `README.md` (root) and `backend/README.md` for overall goals.
- Real-time features (live view counts, comments, typing indicators) are implemented over Socket.IO on the backend and socket.io-client on the frontend.
  - Key server file: `backend/src/config/socket.ts` (auth middleware, event handlers, room naming conventions).
  - Server bootstrap: `backend/src/server.ts` initializes the Socket.IO server.

## Important patterns & conventions
- Authentication for sockets: token is read from `socket.handshake.auth.token` or `socket.handshake.headers.authorization` in `backend/src/config/socket.ts`. Clients must send the JWT in the socket handshake (see example below).
- Room naming conventions (used throughout socket code):
  - `user:{userId}` — private room for a user
  - `video:{videoId}` — viewers of a specific recorded video
  - `stream:{streamId}` — live-stream viewers (used for viewer counts and live events)
- Events (server listens/emit; be specific when adding new events):
  - Client -> server: `watch-video`, `leave-video`, `join-live-stream`, `leave-live-stream`, `new-comment`, `typing-comment`
  - Server -> clients: `viewer-joined`, `viewer-left`, `viewer-joined-stream`, `viewer-left-stream`, `comment-added`, `user-typing`
- When emitting viewer counts the server uses `io.sockets.adapter.rooms.get(room)?.size` (may be undefined; fall back accordingly).

## How to run / developer workflows
- Root (frontend):
  - Install: `npm i`
  - Dev: `npm run dev` (Vite dev server; see root `README.md`).
- Backend (from repo root):
  - `cd backend`
  - Follow `backend/README.md` — typically `npm i` then `npm run dev` (Node 18+ expected). Backend expects PostgreSQL and Redis for full functionality; Socket.IO runs inside `backend/src/server.ts`.
- Local quick-check for real-time behavior:
  - Start backend (dev mode), start frontend. Open browser and observe socket connection logs in backend (`logger.info` lines in `socket.ts`).

## Socket usage example (client)
Use these exact patterns when prototyping Socket.IO clients so they match server auth expectations:

```js
import { io } from 'socket.io-client';

// include the JWT token in the initial handshake
const socket = io('http://localhost:4000', {
  auth: { token: 'Bearer <JWT_TOKEN>' } // server reads handshake.auth.token or Authorization header
});

// join a live stream
socket.emit('join-live-stream', { streamId: 'abc123' });

socket.on('viewer-joined-stream', (payload) => {
  console.log('viewer count:', payload.viewerCount);
});

// send a comment
socket.emit('new-comment', { videoId: 'vid123', comment: { text: 'Nice!', userId: 'u1' } });
```

## Files & folders to inspect first
- `backend/src/config/socket.ts` — authoritative socket logic (auth, room logic, events)
- `backend/src/server.ts` — how Socket.IO is wired to HTTP server and what options are set
- Frontend `src/components/*` and `src/ui/*` — UI primitives and patterns (e.g., `Avatar`, `Badge`, `Button`) used across components
- `video-upload-platform/` — standalone upload UI and services (useful if touching upload/processing work)

## Project-specific gotchas
- The server enforces authentication middleware on sockets. Creating unauthenticated test sockets requires intentionally bypassing or mocking the token-decoding code (look at `backend/src/config/socket.ts` for how tokens are decoded and what fields are expected on the socket object: `socket.userId`, `socket.username`).
- Room size for viewer counts uses the Socket.IO in-memory adapter by default. In multi-process / clustered deployments this will not reflect global counts — code assumes single-process Socket.IO unless a distributed adapter is configured.
- Many UI components are custom primitives (under `src/ui/`); prefer reusing them instead of creating ad-hoc markup to keep styling consistent.

## When adding features
- Follow existing event names and room conventions — keep naming consistent (`video:`, `stream:`, `user:` prefixes).
- Add server-side logging using the same `logger` used in `socket.ts` for traceability.
- If you change real-time semantics, update both `backend/src/config/socket.ts` and any frontend components that listen/emit the events (search the codebase for `join-live-stream` / `watch-video` to find usages).

## Suggested quick tasks for onboarding
- Run backend and frontend locally, open devtools and verify a socket connects and `io.on('connection')` logs the connect. File to watch: `backend/src/config/socket.ts`.
- Create a small client script using `socket.io-client` to join a `stream:{id}` room and print viewer count events.

## Notes about tests and load testing
- There are no canonical load-test scripts in the repo. For load testing the real-time layer, use a dedicated tool (k6, Artillery, or custom Node script using `socket.io-client` to open many connections). Target `join-live-stream` and measure emitted `viewer-joined-stream` behavior. Be aware of local machine limits and rate limits.

---
If any of these sections need more detail (for example a canonical `socket.io-client` load-test script, or precise backend start commands), tell me which area to expand and I will add code snippets or test scripts next.
