import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveAudioSource } from './audio.ts';

test('resolveAudioSource returns a manifest-backed audio path when available', () => {
  assert.deepEqual(
    resolveAudioSource({ 'B ... Bat. A little bat flies.': 'bluey/b-bat-8.mp3' }, 'B ... Bat. A little bat flies.'),
    { kind: 'audio', src: 'assets/audio/bluey/b-bat-8.mp3' },
  );
});

test('resolveAudioSource falls back to speech when manifest entry is missing', () => {
  assert.deepEqual(resolveAudioSource({}, 'New word'), {
    kind: 'speech',
    text: 'New word',
    lang: 'en-US',
  });
});
