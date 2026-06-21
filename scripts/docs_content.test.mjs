import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const guideUrl = new URL('../docs/妈妈维护指南.md', import.meta.url);
const promptsUrl = new URL('../docs/ai-coding-prompts.md', import.meta.url);

test('parent maintenance guide covers the local app and AI-assisted workflow', async () => {
  const guide = await readFile(guideUrl, 'utf8');

  assert.match(guide, /Game of Type\.app/);
  assert.match(guide, /添加新单词/);
  assert.match(guide, /data\/pending-words\.json/);
  assert.match(guide, /Codex|AI Coding/);
  assert.match(guide, /npm test/);
  assert.match(guide, /git commit/);
});

test('AI prompt library includes copyable maintenance prompts', async () => {
  const prompts = await readFile(promptsUrl, 'utf8');

  assert.match(prompts, /处理待补充单词/);
  assert.match(prompts, /调整游戏设置/);
  assert.match(prompts, /新增家长设置/);
  assert.match(prompts, /完成验证并提交/);
});
