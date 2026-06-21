import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const main = await readFile(new URL('../src/main.ts', import.meta.url), 'utf8');

test('parent panel includes custom word controls', () => {
  assert.match(html, /id="custom-word-input"/);
  assert.match(html, /id="custom-word-add"/);
  assert.match(html, /id="custom-word-status"/);
});

test('custom word controls submit to the pending words API', () => {
  assert.match(main, /fetch\('\/api\/pending-words'/);
  assert.match(main, /library:\s*currentLibrary/);
});

test('index uses Vite module entry instead of inline application script', () => {
  assert.match(html, /<script type="module" src="\/src\/main\.ts"><\/script>/);
  assert.doesNotMatch(html, /const LETTER_MAP =/);
});
