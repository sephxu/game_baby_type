// 从 src/data/cards.ts 中提取 LETTER_MAP（emoji 库）与 BLUEY_CARDS（bluey 库），
// 输出 scripts/cards.json，供生成音频脚本使用。
// spoken 文本格式与 src/data/cards.ts 中 spokenFor 的逻辑保持一致。
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/data/cards.ts', import.meta.url), 'utf8');

// 仅保留 LETTER_MAP 与 BLUEY_CARDS 数据声明部分，避免运行 DOM 代码。
const start = source.indexOf('export const LETTER_MAP');
const cutAt = source.indexOf('export const DEFAULT_LIBRARY');
const dataSrc = source
  .slice(start, cutAt)
  .replace(/export const LETTER_MAP:[^=]+=/, 'const LETTER_MAP =')
  .replace(/export const BLUEY_CARDS:[^=]+=/, 'const BLUEY_CARDS =');

const sandbox = {};
const fn = new Function(dataSrc + '\nreturn { LETTER_MAP, BLUEY_CARDS };');
const { LETTER_MAP, BLUEY_CARDS } = fn.call(sandbox);

// 与 index.html showLetterCard 中构造 spoken 的格式完全一致
function spokenFor(key, card) {
  const base = key.toUpperCase() + ' ... ' + card.word;
  return card.sentence ? base + '. ' + card.sentence : base;
}

const out = { bluey: {}, emoji: {} };
for (const key of Object.keys(BLUEY_CARDS)) {
  out.bluey[key] = BLUEY_CARDS[key].map(c => ({
    word: c.word,
    sentence: c.sentence || '',
    spoken: spokenFor(key, c),
  }));
}
for (const key of Object.keys(LETTER_MAP)) {
  out.emoji[key] = LETTER_MAP[key].map(c => ({
    word: c.word,
    sentence: c.sentence || '',
    spoken: spokenFor(key, c),
  }));
}

fs.writeFileSync(new URL('./cards.json', import.meta.url), JSON.stringify(out, null, 2));

const cnt = (o) => Object.values(o).reduce((n, arr) => n + arr.length, 0);
console.log(`bluey: ${cnt(out.bluey)} 张, emoji: ${cnt(out.emoji)} 张, 共 ${cnt(out.bluey) + cnt(out.emoji)} 条待生成`);
