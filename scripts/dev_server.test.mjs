import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
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

test('dev server can prefer built renderer files and fall back to project assets', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'game-static-roots-'));
  const distDir = join(dir, 'dist');
  const rootAssetDir = join(dir, 'assets', 'bluey');
  await mkdir(distDir, { recursive: true });
  await mkdir(rootAssetDir, { recursive: true });
  await writeFile(join(dir, 'index.html'), 'source index', 'utf8');
  await writeFile(join(distDir, 'index.html'), 'built index', 'utf8');
  await writeFile(join(rootAssetDir, 'apple.txt'), 'apple asset', 'utf8');

  const server = createDevServer({
    rootDir: dir,
    staticDirs: [distDir, dir],
    pendingFile: join(dir, 'pending-words.json'),
  });

  const port = await listen(server);
  try {
    const indexResponse = await fetch(`http://127.0.0.1:${port}/index.html`);
    assert.equal(indexResponse.status, 200);
    assert.equal(await indexResponse.text(), 'built index');

    const assetResponse = await fetch(`http://127.0.0.1:${port}/assets/bluey/apple.txt`);
    assert.equal(assetResponse.status, 200);
    assert.equal(await assetResponse.text(), 'apple asset');
  } finally {
    await close(server);
  }
});
