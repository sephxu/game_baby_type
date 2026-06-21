#!/usr/bin/env node
import { cp, lstat, mkdir, readFile, readlink, rename, rm, symlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const ROOT_DIR = resolve(fileURLToPath(new URL('../', import.meta.url)));
const OUT_DIR = join(ROOT_DIR, 'dist-local-app');
const STAGING_DIR = join(OUT_DIR, 'package-source');
const APP_PATH = join(OUT_DIR, 'Game of Type.app');
const DESKTOP_APP_PATH = join(homedir(), 'Desktop', 'Game of Type.app');
const ELECTRON_TEMPLATE_APP = join(ROOT_DIR, 'node_modules', 'electron', 'dist', 'Electron.app');
const ICON_PATH = join(ROOT_DIR, 'assets', 'app-icon', 'game-of-type.icns');
const APP_RESOURCES_DIR = join(APP_PATH, 'Contents', 'Resources');
const APP_SOURCE_DIR = join(APP_RESOURCES_DIR, 'app');
const APP_EXECUTABLE = join(APP_PATH, 'Contents', 'MacOS', 'Game of Type');
const ELECTRON_EXECUTABLE = join(APP_PATH, 'Contents', 'MacOS', 'Electron');

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed`);
  }
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

function setPlist(key, value) {
  run('/usr/libexec/PlistBuddy', ['-c', `Set :${key} ${value}`, join(APP_PATH, 'Contents', 'Info.plist')]);
}

async function createStagingAppSource() {
  await rm(STAGING_DIR, { recursive: true, force: true });
  await mkdir(STAGING_DIR, { recursive: true });

  const packageJson = JSON.parse(await readFile(join(ROOT_DIR, 'package.json'), 'utf8'));
  await writeFile(join(STAGING_DIR, 'package.json'), JSON.stringify({
    name: packageJson.name,
    version: packageJson.version,
    private: true,
    type: 'module',
    main: packageJson.main,
  }, null, 2));

  await cp(join(ROOT_DIR, 'dist'), join(STAGING_DIR, 'dist'), { recursive: true });
  await cp(join(ROOT_DIR, 'dist-electron'), join(STAGING_DIR, 'dist-electron'), { recursive: true });
  await cp(join(ROOT_DIR, 'assets'), join(STAGING_DIR, 'assets'), {
    recursive: true,
    filter: source => !source.includes(`${join('assets', 'app-icon', 'GameOfType.iconset')}`),
  });
  await cp(join(ROOT_DIR, 'data'), join(STAGING_DIR, 'data'), { recursive: true });
}

async function createMacApp() {
  if (process.platform !== 'darwin') {
    throw new Error('Game of Type.app can only be generated on macOS.');
  }

  run('npm', ['run', 'build']);
  await createStagingAppSource();

  await rm(APP_PATH, { recursive: true, force: true });
  run('/usr/bin/ditto', [ELECTRON_TEMPLATE_APP, APP_PATH]);
  await rm(join(APP_RESOURCES_DIR, 'default_app.asar'), { force: true });
  await rm(APP_SOURCE_DIR, { recursive: true, force: true });
  await cp(STAGING_DIR, APP_SOURCE_DIR, { recursive: true });
  await cp(ICON_PATH, join(APP_RESOURCES_DIR, 'game-of-type.icns'));
  await rename(ELECTRON_EXECUTABLE, APP_EXECUTABLE);

  setPlist('CFBundleName', 'Game of Type');
  setPlist('CFBundleDisplayName', 'Game of Type');
  setPlist('CFBundleExecutable', 'Game of Type');
  setPlist('CFBundleIdentifier', 'local.game-of-type');
  setPlist('CFBundleIconFile', 'game-of-type.icns');

  await linkDesktopApp();

  console.log(`Created ${APP_PATH}`);
  console.log(`Linked ${DESKTOP_APP_PATH} -> ${APP_PATH}`);
}

createMacApp().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
