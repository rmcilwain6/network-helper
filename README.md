# Network Helper
Electron + React desktop app for tracking your personal and professional network. Data is stored locally in SQLite via `better-sqlite3`.

## Tech Stack
- Electron (main process in `src/main`)
- React + TypeScript (renderer in `src/renderer`)
- SQLite (`better-sqlite3`) with schema in `src/main/database`
- Shared types in `src/shared`
- Tooling: Webpack, ESLint, Prettier, Vitest

## Prerequisites (Windows)
- Node.js 20+ (includes npm) and Git.
- Build tools for native modules: Python 3.x and Visual Studio Build Tools (Desktop development with C++ + Windows 10/11 SDK). Needed for `better-sqlite3` when prebuilt binaries are unavailable.
- PowerShell or Command Prompt.

## Getting Started
1) Clone the repo and open a terminal in the project root.
2) Install dependencies: `npm install`
3) If native modules fail to build, run: `npm run rebuild` (rebuilds `better-sqlite3` for your Electron version).

## Running the App
1) Build bundled assets: `npm run build`
2) Launch Electron: `npm start`

Notes:
- Re-run `npm run build` after changing TypeScript/React code; there is no watch task configured yet.
- The SQLite database is created at `%APPDATA%/network-helper/network-helper.db` (Electron `userData` path).

## Development Scripts
- `npm test` or `npm run test:run` — run Vitest tests.
- `npm run lint` / `npm run lint:fix` — lint code.
- `npm run format` / `npm run format:check` — Prettier formatting.
- `npm run build` — bundle main and renderer.

## Project Layout
- `src/main` — Electron main process, IPC wiring, and SQLite access.
- `src/renderer` — React UI rendered in the BrowserWindow.
- `src/shared` — Types shared between main and renderer.
- `dist` — Build output consumed by Electron.
