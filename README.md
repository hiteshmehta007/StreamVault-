
# StreamVault

StreamVault is an online video streaming platform prototype with a React/Vite web client and a separate TypeScript backend. The web client includes recorded video playback, reels, live-streaming interfaces, creator tools, community posts, profiles, playlists, queue management, a mini-player, settings, and localization support.

The repository also contains the backend foundation for authentication, video processing, uploads, analytics, live streaming, notifications, and mobile clients. The UI currently uses a mixture of local/mock data and backend services; this is a working prototype rather than a production-ready deployment.

## Contents

```text
.
├── src/                 React application and UI components
├── public/              Static assets
├── DemoReels/           Bundled reel video assets used by the reels page
├── backend/             Express, Prisma, Redis, Bull, and Socket.IO service
├── tools/load-test/     Socket.IO load-test utility and its documentation
├── index.html           Vite HTML entry point
├── vite.config.ts       Vite configuration and port settings
└── package.json         Frontend dependencies and scripts
```

## Requirements

- Node.js 18 or newer
- npm
- PostgreSQL 14 or newer for the backend
- Redis 6 or newer for the backend queues and cache
- FFmpeg for video processing

The frontend can be installed and run independently. PostgreSQL, Redis, FFmpeg, and backend environment variables are required for a complete backend run.

## Run The Frontend

From the repository root:

```powershell
npm install
npm run dev
```

Vite opens the web client at `http://localhost:3000`. The production build is written to `build/`:

```powershell
npm run build
```

The application entry point is `src/main.tsx`, which mounts `src/App.tsx`. Navigation is state-based in `App.tsx`; there is no React Router configuration.

## Run The Backend

```powershell
Set-Location backend
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

The backend listens on port `5000` by default. Available backend scripts include:

```text
npm run dev          Start the TypeScript server with nodemon
npm run build        Compile TypeScript and copy SQL files
npm start            Run the compiled server
npm test             Run Jest tests
npm run lint         Run ESLint
npm run db:migrate   Apply Prisma migrations
npm run db:seed      Seed the database
npm run db:studio    Open Prisma Studio
```

Create `backend/.env` before starting the service. The checked-in `backend/.env.example` is currently empty, so the backend configuration must be supplied from the variables expected by `backend/src/config` and the service modules. At minimum, configure the database, Redis, JWT, server port, CORS/web URL, upload storage, and any Cloudinary, email, or Stripe integrations used by the selected feature.

## Architecture

### Frontend

- `src/main.tsx`: browser entry point
- `src/App.tsx`: application shell and view switching
- `src/components/`: pages, players, dashboards, live-streaming UI, and shared feature components
- `src/ui/`: reusable UI primitives
- `src/services/`: API, authentication, video, and other service clients
- `src/translations/`: language resources
- `src/styles/`: feature-specific CSS
- `public/` and `DemoReels/`: static media and demo content

Major user-facing areas include home/feed, watch pages, creator dashboard, channel/profile pages, upload, reels, community, live streaming, music, queue, settings, and support. The queue and mini-player are coordinated through providers and managers such as `QueueProvider`, `FloatingQueue`, and `FloatingPlayerManager`.

### Backend

- `backend/src/server.ts`: Express and Socket.IO bootstrap
- `backend/src/routes/`: HTTP route registration
- `backend/src/controllers/` and `backend/src/services/`: request handling and business logic
- `backend/src/config/socket.ts`: Socket.IO authentication, rooms, and events
- `backend/prisma/schema.prisma`: persistence model
- `backend/src/jobs/`: background video-processing jobs
- `backend/tests/`: backend tests

The backend uses PostgreSQL through Prisma, Redis for caching/queues, Bull for background jobs, Cloudinary for media storage, FFmpeg for processing, Winston for logging, and JWT-based authentication.

## API And Real-Time Notes

The backend exposes authentication, video, upload, mobile feed/playback, search, live-stream, and supporting routes under `/api`. The health endpoint is `/health`.

Socket.IO uses these room names:

```text
user:{userId}       Private user events
video:{videoId}     Viewers of a recorded video
stream:{streamId}   Viewers of a live stream
```

Relevant events include `watch-video`, `leave-video`, `join-live-stream`, `leave-live-stream`, `new-comment`, `typing-comment`, `viewer-joined`, `viewer-left`, `comment-added`, and `user-typing`. Clients should provide a JWT in the Socket.IO handshake auth token or authorization header.

## Current Integration Boundaries

These are important when testing the project:

- The frontend API client currently uses `http://localhost:3009/api` in development, while the backend documentation and server default use port `5000`. Update the client or proxy configuration before relying on browser-to-backend requests.
- `src/services/authService.ts` currently contains in-memory/mock authentication behavior; it is not yet the same flow as the backend JWT endpoints.
- Several backend route modules are scaffolding or placeholder responses. Do not assume every documented endpoint persists data or is production-complete.
- The frontend includes fallback/demo data so many screens can be explored without a running backend.
- Socket.IO viewer counts use the in-memory adapter and therefore represent only one backend process unless a distributed adapter is configured.

## Verification

Frontend build:

```powershell
npm run build
```

Backend checks:

```powershell
Set-Location backend
npm run build
npm test
npm run lint
```

For manual verification, start the backend and frontend separately, open the client at `http://localhost:3000`, exercise the upload/watch/live flows, and inspect backend logs. Full upload and live-stream verification requires PostgreSQL, Redis, FFmpeg, and valid external media credentials where applicable.

## Development Guidance

- Reuse primitives under `src/ui/` and existing feature patterns before adding new UI infrastructure.
- Preserve `DemoReels/` assets; the reels page references the bundled MP4 files directly.
- Keep Socket.IO room prefixes and event names consistent with `backend/src/config/socket.ts`.
- Add backend logging with the existing Winston logger when changing real-time behavior.
- Keep secrets out of source control. Use local `.env` files based on the variables consumed by the backend.

## Design Reference

The original visual design reference is hosted at [Figma](https://www.figma.com/design/88PJSC1FBV4UU5gmNWkhUi/Online-Video-Streaming-Platform).
  