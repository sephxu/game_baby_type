import assert from 'node:assert/strict';
import test from 'node:test';
import { BLUEY_CARDS, DEFAULT_LIBRARY, LETTER_MAP, VOCAB_LIBRARIES, spokenFor } from './cards.ts';

test('spokenFor combines the key, word, and sentence when present', () => {
  assert.equal(
    spokenFor('b', { word: 'Bat', sentence: 'A little bat flies.' }),
    'B ... Bat. A little bat flies.',
  );
});

test('spokenFor omits the sentence suffix when it is blank', () => {
  assert.equal(spokenFor('x', { word: 'Xylophone', sentence: '' }), 'X ... Xylophone');
});

test('default vocabulary library is Bluey and exposes migrated card data', () => {
  assert.equal(DEFAULT_LIBRARY, 'bluey');
  assert.equal(VOCAB_LIBRARIES.bluey.cards, BLUEY_CARDS);
  assert.equal(VOCAB_LIBRARIES.emoji.cards, LETTER_MAP);
  assert.equal(BLUEY_CARDS.b.some(card => card.word === 'Bat'), true);
});
