import { app, BrowserWindow } from 'electron';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDevServer } from '../../scripts/dev_server.mjs';

type LocalServerInfo = {
  server: ReturnType<typeof createDevServer>;
  url: string;
};

const __dirname = dirname(fileURLToPath(import.meta.url));

export function resolveAppRoot() {
  if (app.isPackaged) return resolve(process.resourcesPath, 'app');
  return resolve(__dirname, '../..');
}

export async function startLocalServer(rootDir = resolveAppRoot()): Promise<LocalServerInfo> {
  const server = createDevServer({ rootDir });
  const port = await new Promise<number>((resolvePort, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Unable to determine local server port.'));
        return;
      }
      resolvePort(address.port);
    });
  });

  return {
    server,
    url: `http://127.0.0.1:${port}/index.html`,
  };
}

async function createWindow() {
  const serverInfo = await startLocalServer();
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    title: 'Game of Type',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.on('closed', () => {
    serverInfo.server.close();
  });

  await win.loadURL(serverInfo.url);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) void createWindow();
});
