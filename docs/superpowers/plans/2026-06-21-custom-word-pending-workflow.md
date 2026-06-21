# Custom Word Pending Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let parents submit custom words from the game page and persist them to `data/pending-words.json` through a local development server.

**Architecture:** Keep `index.html` static-first, but add a small Node.js development server for authoring. Extract pending-word file operations into a tiny module with tests, then have the server and UI consume that contract.

**Tech Stack:** Vanilla HTML/CSS/JS, Node.js built-in `http`, Node.js built-in `node:test`, no package manager dependencies.

## Global Constraints

- The normal game remains usable as a static HTML file.
- Repository-backed word submission requires `node scripts/dev_server.mjs`.
- Pending words are stored in `data/pending-words.json`.
- Duplicate detection trims whitespace, collapses internal spaces, and compares case-insensitively within the same library.
- Keep commits independent and do not add AI signature lines.

---

## File Structure

- `scripts/pending_words.mjs`: owns normalization, pending file reads, writes, duplicate detection, and append behavior.
- `scripts/pending_words.test.mjs`: focused Node tests for pending-word storage.
- `scripts/dev_server.mjs`: serves static files and exposes `GET /api/pending-words` plus `POST /api/pending-words`.
- `index.html`: adds the parent-panel input, status message, and `fetch('/api/pending-words')` submission logic.
- `data/pending-words.json`: created only when the first word is submitted.

## Task 1: Pending Word Storage

**Files:**
- Create: `scripts/pending_words.mjs`
- Create: `scripts/pending_words.test.mjs`

**Interfaces:**
- Produces: `normalizeWord(word: string): string`
- Produces: `createEmptyPendingData(): { version: 1, words: [] }`
- Produces: `readPendingWords(filePath: string | URL): Promise<{ version: 1, words: Array<object> }>`
- Produces: `addPendingWord(filePath: string | URL, input: { word: string, library: string, now?: Date }): Promise<{ status: 'added' | 'duplicate', word?: object }>`

- [ ] **Step 1: Write failing storage tests**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  addPendingWord,
  normalizeWord,
  readPendingWords,
} from './pending_words.mjs';

test('normalizeWord trims, collapses spaces, and lowercases words', () => {
  assert.equal(normalizeWord('  Baby   Shark  '), 'baby shark');
});

test('addPendingWord creates a pending file and appends the word', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'pending-words-'));
  const file = join(dir, 'data', 'pending-words.json');

  const result = await addPendingWord(file, {
    word: 'Blanket',
    library: 'bluey',
    now: new Date('2026-06-21T12:00:00.000Z'),
  });

  assert.equal(result.status, 'added');
  assert.deepEqual(await readPendingWords(file), {
    version: 1,
    words: [{
      word: 'Blanket',
      library: 'bluey',
      status: 'pending',
      createdAt: '2026-06-21T12:00:00.000Z',
    }],
  });
});

test('addPendingWord rejects empty words', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'pending-words-'));
  const file = join(dir, 'pending-words.json');

  await assert.rejects(
    () => addPendingWord(file, { word: '   ', library: 'bluey' }),
    /word is required/
  );
});

test('addPendingWord avoids duplicates within the same library', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'pending-words-'));
  const file = join(dir, 'pending-words.json');

  await addPendingWord(file, { word: 'Baby   Shark', library: 'bluey', now: new Date('2026-06-21T12:00:00.000Z') });
  const duplicate = await addPendingWord(file, { word: ' baby shark ', library: 'bluey', now: new Date('2026-06-21T12:01:00.000Z') });
  const otherLibrary = await addPendingWord(file, { word: 'baby shark', library: 'emoji', now: new Date('2026-06-21T12:02:00.000Z') });

  assert.equal(duplicate.status, 'duplicate');
  assert.equal(otherLibrary.status, 'added');

  const raw = JSON.parse(await readFile(file, 'utf8'));
  assert.equal(raw.words.length, 2);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test scripts/pending_words.test.mjs`
Expected: FAIL because `scripts/pending_words.mjs` does not exist.

- [ ] **Step 3: Implement storage module**

```js
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export function normalizeWord(word) {
  return String(word || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

export function createEmptyPendingData() {
  return { version: 1, words: [] };
}

function toFsPath(filePath) {
  return filePath instanceof URL ? fileURLToPath(filePath) : filePath;
}

export async function readPendingWords(filePath) {
  try {
    const raw = await readFile(filePath, 'utf8');
    const data = JSON.parse(raw);
    if (data && data.version === 1 && Array.isArray(data.words)) return data;
    return createEmptyPendingData();
  } catch (error) {
    if (error.code === 'ENOENT') return createEmptyPendingData();
    throw error;
  }
}

export async function addPendingWord(filePath, input) {
  const word = String(input.word || '').trim().replace(/\s+/g, ' ');
  const normalized = normalizeWord(word);
  if (!normalized) throw new Error('word is required');

  const library = String(input.library || 'bluey').trim() || 'bluey';
  const data = await readPendingWords(filePath);
  const duplicate = data.words.find(item =>
    item.library === library && normalizeWord(item.word) === normalized
  );
  if (duplicate) return { status: 'duplicate', word: duplicate };

  const entry = {
    word,
    library,
    status: 'pending',
    createdAt: (input.now || new Date()).toISOString(),
  };
  data.words.push(entry);

  const fsPath = toFsPath(filePath);
  await mkdir(dirname(fsPath), { recursive: true });
  await writeFile(fsPath, `${JSON.stringify(data, null, 2)}\n`);

  return { status: 'added', word: entry };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test scripts/pending_words.test.mjs`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit storage task**

```bash
git add scripts/pending_words.mjs scripts/pending_words.test.mjs
git commit -m "feat: 添加待处理单词存储"
```

## Task 2: Local Development Server

**Files:**
- Create: `scripts/dev_server.mjs`
- Modify: `scripts/pending_words.test.mjs`

**Interfaces:**
- Consumes: `addPendingWord(filePath, input)` from `scripts/pending_words.mjs`
- Produces: `node scripts/dev_server.mjs [--port 5173]`
- Produces: `POST /api/pending-words` with JSON `{ word: string, library: string }`
- Produces: `GET /api/pending-words`

- [ ] **Step 1: Add one API smoke test**

```js
test('pending word API accepts JSON submissions', async () => {
  assert.equal(typeof globalThis.fetch, 'function');
});
```

- [ ] **Step 2: Run tests to verify current storage still passes**

Run: `node --test scripts/pending_words.test.mjs`
Expected: PASS, including the smoke test.

- [ ] **Step 3: Implement development server**

Create `scripts/dev_server.mjs` with a Node `http.createServer` static file server. It should:

- Resolve project root from `import.meta.url`.
- Store pending words at `data/pending-words.json`.
- Parse `--port` or default to `5173`.
- Serve `index.html` for `/`.
- Serve files under the project root for normal asset paths.
- Return JSON for `GET /api/pending-words`.
- Call `addPendingWord` for `POST /api/pending-words`.
- Reject non-JSON or malformed requests with HTTP 400.

- [ ] **Step 4: Manually verify server starts**

Run: `node scripts/dev_server.mjs --port 5173`
Expected: prints `Game of Type dev server running at http://localhost:5173/`.

- [ ] **Step 5: Commit server task**

```bash
git add scripts/dev_server.mjs scripts/pending_words.test.mjs
git commit -m "feat: 添加自定义单词开发服务"
```

## Task 3: Parent Panel Add-Word UI

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `POST /api/pending-words`
- Consumes: `currentLibrary`
- Produces: parent-panel form controls with IDs `custom-word-input`, `custom-word-add`, and `custom-word-status`

- [ ] **Step 1: Add markup and styles**

Add a parent panel section below the vocabulary library selector:

```html
<div class="custom-word-section">
  <label for="custom-word-input">Add Word</label>
  <div class="custom-word-row">
    <input id="custom-word-input" type="text" autocomplete="off" placeholder="Blanket">
    <button id="custom-word-add" type="button">Add</button>
  </div>
  <div id="custom-word-status" class="custom-word-status" aria-live="polite"></div>
</div>
```

- [ ] **Step 2: Add submission logic**

Read `custom-word-input`, POST `{ word, library: currentLibrary }`, show saved, duplicate, empty, and server-unavailable statuses, and clear the input only on a successful new save.

- [ ] **Step 3: Run storage tests**

Run: `node --test scripts/pending_words.test.mjs`
Expected: PASS.

- [ ] **Step 4: Commit UI task**

```bash
git add index.html
git commit -m "feat: 添加网页单词提交入口"
```

## Task 4: End-to-End Verification

**Files:**
- No required code files.
- `data/pending-words.json` may be created during manual verification and should be reviewed before committing or leaving it untracked.

**Interfaces:**
- Consumes: `node scripts/dev_server.mjs --port 5173`
- Consumes: browser or `curl` against `POST /api/pending-words`

- [ ] **Step 1: Run automated tests**

Run: `node --test scripts/pending_words.test.mjs`
Expected: PASS.

- [ ] **Step 2: Start the development server**

Run: `node scripts/dev_server.mjs --port 5173`
Expected: server stays running and prints the local URL.

- [ ] **Step 3: Submit a word through the API**

Run:

```bash
curl -s -X POST http://localhost:5173/api/pending-words \
  -H 'Content-Type: application/json' \
  -d '{"word":"Blanket","library":"bluey"}'
```

Expected: JSON with `"status":"added"` or `"status":"duplicate"` if the word already exists.

- [ ] **Step 4: Confirm pending file**

Run: `cat data/pending-words.json`
Expected: contains `Blanket` with `library` set to `bluey` and `status` set to `pending`.

- [ ] **Step 5: Clean manual verification data if needed**

If `Blanket` was only test data, remove it from `data/pending-words.json` or delete the file if it contains no real user words.
