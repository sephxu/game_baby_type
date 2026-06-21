import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const sourcePath = new URL('./main.ts', import.meta.url);
const packageUrl = new URL('../../package.json', import.meta.url);

test('electron main starts the existing local dev server on loopback', async () => {
  const source = await readFile(sourcePath, 'utf8');

  assert.match(source, /createDevServer/);
  assert.match(source, /export async function startLocalServer/);
  assert.match(source, /127\.0\.0\.1/);
  assert.match(source, /loadURL\(serverInfo\.url\)/);
  assert.match(source, /--check/);
});

test('electron check script loads the main process with Electron runtime', async () => {
  const pkg = JSON.parse(await readFile(packageUrl, 'utf8'));

  assert.match(pkg.scripts['electron:check'], /electron --version/);
  assert.match(pkg.scripts['electron:check'], /node --import tsx --test src\/electron\/main\.test\.mjs/);
});

test('electron launch script points at the compiled main process', async () => {
  const pkg = JSON.parse(await readFile(packageUrl, 'utf8'));

  assert.equal(pkg.main, 'dist-electron/src/electron/main.js');
  assert.match(pkg.scripts.electron, /electron dist-electron\/src\/electron\/main\.js/);
});

test('development app root is the project working directory', async () => {
  const source = await readFile(sourcePath, 'utf8');

  assert.match(source, /return process\.cwd\(\)/);
  assert.doesNotMatch(source, /return resolve\(__dirname, '\.\.\/\.\.'\)/);
});

test('macOS app quits when the last window closes', async () => {
  const source = await readFile(sourcePath, 'utf8');

  assert.match(source, /app\.setName\('Game of Type'\)/);
  assert.match(source, /app\.on\('window-all-closed'[\s\S]*app\.quit\(\)/);
  assert.doesNotMatch(source, /process\.platform !== 'darwin'/);
});
