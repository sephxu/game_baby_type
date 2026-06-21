# Local Desktop AI Maintenance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-only Electron desktop app and AI-friendly project structure for Game of Type.

**Architecture:** Keep the existing game behavior but move it behind a local Electron shell and Vite renderer. Split data, audio, game bootstrapping, and parent-maintenance concerns into named modules so AI coding tools can make small, verifiable edits.

**Tech Stack:** Electron, Vite, TypeScript, Node test runner, existing static assets, existing pending-word server helpers.

## Global Constraints

- Keep Chinese project guidance and parent-facing docs.
- Do not publish the app to the internet.
- Do not require the parent to run Terminal for daily use.
- Preserve existing flashcard behavior while changing the app structure.
- Use normal git author configuration and do not add AI co-author signatures.
- Commit each independent phase separately.

---

### Task 1: Documentation Baseline

**Files:**
- Create: `docs/superpowers/specs/2026-06-22-local-desktop-ai-maintenance-design.md`
- Create: `docs/superpowers/plans/2026-06-22-local-desktop-ai-maintenance.md`

**Interfaces:**
- Consumes: current single-file app and local pending-word workflow.
- Produces: design and implementation plan for the migration.

- [ ] **Step 1: Write the design and plan documents**

Use the documents in this commit as the source of truth for the migration scope.

- [ ] **Step 2: Verify existing tests**

Run: `node --test scripts/*.test.mjs`

Expected: all existing tests pass.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-06-22-local-desktop-ai-maintenance-design.md docs/superpowers/plans/2026-06-22-local-desktop-ai-maintenance.md
git commit -m "docs: add local desktop maintenance migration plan"
```

### Task 2: Project Tooling and Desktop Shell

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/electron/main.ts`
- Create: `src/electron/main.test.mjs`
- Modify: `scripts/dev_server.mjs`

**Interfaces:**
- Consumes: `createDevServer(options)` from `scripts/dev_server.mjs`.
- Produces: `resolveAppRoot(): string`, `startLocalServer(rootDir: string): Promise<{ server, url }>` and an Electron main process that loads `http://127.0.0.1:<port>/`.

- [ ] **Step 1: Write a failing Electron server-contract test**

Create `src/electron/main.test.mjs` with assertions that the Electron main source imports `createDevServer`, uses `127.0.0.1`, and exports `startLocalServer`.

- [ ] **Step 2: Run the failing test**

Run: `node --test src/electron/main.test.mjs`

Expected: FAIL because `src/electron/main.ts` does not exist.

- [ ] **Step 3: Add package tooling and Electron main**

Add Electron, Vite, and TypeScript scripts. Implement the main process and local server startup.

- [ ] **Step 4: Run tests**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json vite.config.ts src/electron/main.ts src/electron/main.test.mjs
git commit -m "feat: add local Electron desktop shell"
```

### Task 3: Vite Renderer Structure

**Files:**
- Create: `src/main.ts`
- Create: `src/styles.css`
- Create: `src/data/cards.ts`
- Create: `src/data/cards.test.mjs`
- Create: `src/audio/audio.ts`
- Create: `src/audio/audio.test.mjs`
- Modify: `index.html`
- Modify: `scripts/extract_cards.mjs`

**Interfaces:**
- Consumes: existing card data and audio assets.
- Produces: a Vite-rendered app loaded from `src/main.ts` and small data/audio modules with tests.

- [ ] **Step 1: Write failing data and audio tests**

Create tests for spoken-text construction and manifest-backed audio source selection.

- [ ] **Step 2: Run failing tests**

Run: `node --test src/data/cards.test.mjs src/audio/audio.test.mjs`

Expected: FAIL because modules do not exist.

- [ ] **Step 3: Extract renderer code**

Move CSS into `src/styles.css`, move app JavaScript into `src/main.ts`, and move reusable card/audio helpers into focused modules.

- [ ] **Step 4: Update extraction script**

Change `scripts/extract_cards.mjs` to import card data from `src/data/cards.ts` through a generated-compatible module or a source parser that no longer depends on inline `<script>` content.

- [ ] **Step 5: Run tests and build**

Run: `npm test`

Run: `npm run build`

Expected: both commands pass.

- [ ] **Step 6: Commit**

```bash
git add index.html src scripts package.json tsconfig.json vite.config.ts
git commit -m "refactor: split renderer into Vite modules"
```

### Task 4: Parent AI Maintenance Guide

**Files:**
- Create: `docs/妈妈维护指南.md`
- Create: `docs/ai-coding-prompts.md`
- Create: `scripts/docs_content.test.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: local desktop workflow and pending-word file contract.
- Produces: Chinese parent guidance and copyable AI coding prompts.

- [ ] **Step 1: Write failing docs-content test**

Create a test that checks the guide mentions opening the desktop app, adding pending words, asking AI to process pending words, running tests, and committing.

- [ ] **Step 2: Run failing test**

Run: `node --test scripts/docs_content.test.mjs`

Expected: FAIL because the guide files do not exist.

- [ ] **Step 3: Write the parent guide and prompts**

Add concise Chinese instructions and copyable prompt blocks.

- [ ] **Step 4: Run tests**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add docs/妈妈维护指南.md docs/ai-coding-prompts.md scripts/docs_content.test.mjs
git commit -m "docs: add parent AI maintenance guide"
```

### Task 5: Final Verification

**Files:**
- No required file changes.

**Interfaces:**
- Consumes: all migration outputs.
- Produces: verified local desktop app project.

- [ ] **Step 1: Run full verification**

Run: `npm test`

Run: `npm run build`

Run: `npm run electron:check`

Expected: all commands exit 0.

- [ ] **Step 2: Inspect git state**

Run: `git status --short`

Expected: clean or only intentional uncommitted runtime artifacts.
