import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const sourceUrl = new URL('./create_macos_app.mjs', import.meta.url);

test('macOS app generator creates a double-click launcher for Electron', async () => {
  const source = await readFile(sourceUrl, 'utf8');

  assert.match(source, /Game of Type\.app/);
  assert.match(source, /node_modules.+electron.+dist.+Electron\.app/s);
  assert.match(source, /\/usr\/bin\/ditto/);
  assert.match(source, /game-of-type\.icns/);
  assert.match(source, /CFBundleDisplayName/);
  assert.match(source, /CFBundleExecutable/);
  assert.match(source, /rename\(ELECTRON_EXECUTABLE, APP_EXECUTABLE\)/);
  assert.match(source, /CFBundleExecutable', 'Game of Type'/);
  assert.match(source, /Game of Type/);
  assert.match(source, /STAGING_DIR/);
  assert.match(source, /package-source/);
  assert.match(source, /dist-local-app/);
  assert.match(source, /Desktop/);
  assert.match(source, /symlink/);
  assert.match(source, /DESKTOP_APP_PATH/);
  assert.doesNotMatch(source, /@electron\/packager/);
  assert.doesNotMatch(source, /osacompile/);
  assert.doesNotMatch(source, /npm run electron/);
});
