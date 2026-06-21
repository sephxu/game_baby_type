# Local Desktop AI Maintenance Design

## Goal

Turn Game of Type into a local-only desktop application that Ayu's mom can open without technical setup, while keeping the source layout easy for Codex or other AI coding tools to modify safely.

## Users

- Child player: uses the game surface only.
- Parent maintainer: opens the app, adds new words, and later asks an AI coding tool to enrich pending words into full flashcards.
- AI coding tool: reads small, named modules, updates data/assets, runs tests, and commits changes.

## Product Shape

The app stays local. It is not published to the internet. The normal entry point becomes a desktop app wrapper instead of `file://index.html` or a manually started `localhost` server.

The desktop app starts a local loopback HTTP server, opens the game in an Electron window, and serves all images, audio, JSON data, and parent-maintenance APIs through the same origin. This removes the current mismatch between `file://` resource loading and localhost resource loading.

## Architecture

Use Electron for the local desktop shell and Vite with TypeScript for the renderer code. Electron is chosen because the current app is already browser-based, the migration cost is low, and AI coding tools handle Node/Electron projects well.

The codebase is split by responsibility:

- `src/data/`: flashcard data, spoken-text construction, and library helpers.
- `src/audio/`: pre-generated audio manifest loading, playback, and speech fallback.
- `src/game/`: keyboard/touch game state and card rendering.
- `src/parent/`: parent panel, settings, and pending-word submission UI.
- `src/electron/`: desktop window creation and local server startup.
- `scripts/`: repository maintenance utilities, tests, audio generation, and pending-word storage helpers.
- `docs/`: parent-facing maintenance instructions and AI coding prompts.

## Local Data Flow

1. Parent opens the desktop app.
2. Electron starts the local server on `127.0.0.1` using an available port.
3. Electron loads the renderer through that local server.
4. The renderer fetches `assets/audio/manifest.json` from the same origin.
5. The parent panel posts new words to `/api/pending-words`.
6. The local server writes pending words to `data/pending-words.json`.
7. Later, the parent asks Codex or another AI coding tool to process pending words into final cards, assets, audio, tests, and commits.

## Parent Workflow

The parent does not need Terminal for daily use. She opens the app and adds words from the parent panel. For AI-assisted maintenance, the repository includes a Chinese guide with copyable prompts for common tasks:

- process pending words into flashcards;
- adjust simple game settings;
- add a new parent option;
- run tests and commit changes.

## Error Handling

- If the audio manifest fails to load, the renderer falls back to Web Speech and exposes a testable state.
- If `/api/pending-words` is unavailable, the parent panel shows a short local-app troubleshooting message.
- If Electron cannot start the local server, the main process fails with a clear error message.
- Pending-word writes preserve existing entries and avoid same-library duplicates.

## Testing

Keep the existing Node tests and add focused tests for the new structure:

- data helpers construct spoken text and export libraries;
- audio source selection prefers manifest-backed MP3 and falls back to speech;
- Electron entry references the local server contract;
- renderer HTML no longer contains the full application script inline;
- parent workflow docs contain the key AI prompts.

The verification gate for this migration is:

```bash
npm test
npm run build
```

When available, `npm run electron:check` should validate that Electron main-process modules load without launching an interactive window.

## Non-Goals

- No internet deployment.
- No login system.
- No cloud database.
- No requirement that the parent manually edits source files.
- No full content-management system in this migration.
