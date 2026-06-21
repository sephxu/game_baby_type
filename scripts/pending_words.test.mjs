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

  await addPendingWord(file, {
    word: 'Baby   Shark',
    library: 'bluey',
    now: new Date('2026-06-21T12:00:00.000Z'),
  });
  const duplicate = await addPendingWord(file, {
    word: ' baby shark ',
    library: 'bluey',
    now: new Date('2026-06-21T12:01:00.000Z'),
  });
  const otherLibrary = await addPendingWord(file, {
    word: 'baby shark',
    library: 'emoji',
    now: new Date('2026-06-21T12:02:00.000Z'),
  });

  assert.equal(duplicate.status, 'duplicate');
  assert.equal(otherLibrary.status, 'added');

  const raw = JSON.parse(await readFile(file, 'utf8'));
  assert.equal(raw.words.length, 2);
});
