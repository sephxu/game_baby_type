# Custom Word Pending Workflow Design

## Goal

Parents can add new words from the game page. The page records those words in a repository file during local development. After the user says the words are ready, Codex can read that file, enrich each word with a toddler-friendly sentence, image, emoji, and color, then merge the finished cards into the existing vocabulary.

## User Flow

1. The user starts a local development server with `node scripts/dev_server.mjs`.
2. The server opens or serves the static game page.
3. In the parent settings panel, the user enters one or more words.
4. The page posts each word to the local server.
5. The server writes pending words to `data/pending-words.json`.
6. The user returns to this conversation and says the words were added.
7. Codex reads `data/pending-words.json`, generates finished card assets and metadata, updates the vocabulary, and marks pending words as processed.

## Scope

This feature adds the intake path only:

- A parent-panel input for adding words.
- A local development server that serves the app and accepts word submissions.
- A pending words JSON file that Codex can read later.
- Basic duplicate handling so repeated submissions do not create noisy work.

The enrichment pass is a later workflow handled by Codex after the user confirms words are ready. It will create or choose sentences, images, emoji, and colors that match the existing Bluey-style cards.

## Architecture

The app remains a static-first single-page game. A small Node.js development server is added for the local authoring workflow:

- `index.html` keeps the game UI and sends `POST /api/pending-words` requests when the add-word form is submitted.
- `scripts/dev_server.mjs` serves static files and exposes JSON endpoints for pending words.
- `data/pending-words.json` is the handoff file between the page and Codex.

The normal game can still be opened as static HTML, but adding words to the repository file requires the development server. If the API is unavailable, the UI should show a short failure state instead of silently losing the word.

## Pending File Format

`data/pending-words.json` stores a versioned object:

```json
{
  "version": 1,
  "words": [
    {
      "word": "Blanket",
      "library": "bluey",
      "status": "pending",
      "createdAt": "2026-06-21T12:00:00.000Z"
    }
  ]
}
```

Words are normalized for duplicate detection by trimming whitespace, collapsing internal spaces, and comparing case-insensitively within the same library. The original display casing is preserved.

## UI Design

The parent panel gets a compact "Add Word" area under the vocabulary library selector:

- A single text input for the word.
- An add button.
- A small status line for saved, duplicate, and error states.

The game surface stays child-focused. The add-word controls remain inside the parent panel so they do not distract from play.

## Error Handling

- Empty input is ignored with a clear status message.
- Duplicate words return a duplicate status and do not rewrite another item.
- Server read/write errors return HTTP 500 and show an error status in the panel.
- If the page is opened without the development server, submissions fail visibly and tell the parent to use the local server.

## Testing

Add focused tests around the pending-word server helpers:

- Create a new pending file when none exists.
- Append a new word with normalized duplicate detection.
- Preserve existing pending words.
- Reject empty words.

Manual verification:

- Start the server.
- Add a word from the parent panel.
- Confirm `data/pending-words.json` contains the submitted word.
- Re-add the same word and confirm no duplicate is created.
