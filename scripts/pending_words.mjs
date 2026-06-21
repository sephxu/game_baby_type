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
