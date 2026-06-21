#!/usr/bin/env node
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = resolve(fileURLToPath(new URL('../', import.meta.url)));
const OUT_DIR = join(ROOT_DIR, 'dist-local-app');
const APP_PATH = join(OUT_DIR, 'Game of Type.app');
const SCRIPT_PATH = join(OUT_DIR, 'launch-game-of-type.applescript');

function quoteAppleScript(value) {
  return value.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
}

async function createMacApp() {
  if (process.platform !== 'darwin') {
    throw new Error('Game of Type.app can only be generated on macOS.');
  }

  await mkdir(dirname(SCRIPT_PATH), { recursive: true });
  await rm(APP_PATH, { recursive: true, force: true });

  const appleScript = `
on run
  set projectPath to "${quoteAppleScript(ROOT_DIR)}"
  set launchCommand to "cd " & quoted form of projectPath & " && PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin npm run electron > /tmp/game-of-type.log 2>&1 &"
  do shell script launchCommand
end run
`;

  await writeFile(SCRIPT_PATH, appleScript.trimStart(), 'utf8');

  const result = spawnSync('osacompile', ['-o', APP_PATH, SCRIPT_PATH], {
    cwd: ROOT_DIR,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || 'osacompile failed');
  }

  console.log(`Created ${APP_PATH}`);
}

createMacApp().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
