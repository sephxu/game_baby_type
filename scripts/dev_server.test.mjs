import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createDevServer } from './dev_server.mjs';
import { readPendingWords } from './pending_words.mjs';

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      resolve(server.address().port);
    });
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  });
}

test('dev server accepts pending word JSON submissions', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'game-dev-server-'));
  const pendingFile = join(dir, 'data', 'pending-words.json');
  const server = createDevServer({
    rootDir: new URL('../', import.meta.url),
    pendingFile,
  });

  const port = await listen(server);
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/pending-words`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: 'Blanket', library: 'bluey' }),
    });

    assert.equal(response.status, 200);
    assert.equal((await response.json()).status, 'added');

    const data = await readPendingWords(pendingFile);
    assert.equal(data.words.length, 1);
    assert.equal(data.words[0].word, 'Blanket');
    assert.equal(data.words[0].library, 'bluey');
  } finally {
    await close(server);
  }
});
