#!/usr/bin/env node
import { lstat, mkdir, readlink, rm, symlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const ROOT_DIR = resolve(fileURLToPath(new URL('../', import.meta.url)));
const OUT_DIR = join(ROOT_DIR, 'dist-local-app');
const APP_PATH = join(OUT_DIR, 'Game of Type.app');
const SCRIPT_PATH = join(OUT_DIR, 'launch-game-of-type.applescript');
const DESKTOP_APP_PATH = join(homedir(), 'Desktop', 'Game of Type.app');

function quoteAppleScript(value) {
  return value.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
}

async function linkDesktopApp() {
  await mkdir(dirname(DESKTOP_APP_PATH), { recursive: true });

  try {
    const info = await lstat(DESKTOP_APP_PATH);
    if (!info.isSymbolicLink()) {
      throw new Error(`${DESKTOP_APP_PATH} already exists and is not a symlink. Remove it manually before relinking.`);
    }
    const currentTarget = await readlink(DESKTOP_APP_PATH);
    if (resolve(dirname(DESKTOP_APP_PATH), currentTarget) !== APP_PATH) {
      await rm(DESKTOP_APP_PATH, { force: true });
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  try {
    await symlink(APP_PATH, DESKTOP_APP_PATH, 'dir');
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
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

  await linkDesktopApp();

  console.log(`Created ${APP_PATH}`);
  console.log(`Linked ${DESKTOP_APP_PATH} -> ${APP_PATH}`);
}

createMacApp().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
