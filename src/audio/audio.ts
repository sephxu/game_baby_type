export type AudioManifest = Record<string, string>;

export type AudioSource =
  | { kind: 'audio'; src: string }
  | { kind: 'speech'; text: string; lang: 'en-US' };

export async function loadAudioManifest(src: string): Promise<AudioManifest | null> {
  const response = await fetch(src);
  if (!response.ok) return null;
  return response.json();
}

export function resolveAudioSource(manifest: AudioManifest | null, text: string): AudioSource {
  const audioPath = manifest?.[text];
  if (audioPath) return { kind: 'audio', src: `assets/audio/${audioPath}` };
  return { kind: 'speech', text, lang: 'en-US' };
}
