#!/usr/bin/env node
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { addPendingWord, readPendingWords } from './pending_words.mjs';

const ROOT_DIR = resolve(fileURLToPath(new URL('../', import.meta.url)));
const DEFAULT_PORT = 5173;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
};

function toPath(value) {
  return value instanceof URL ? fileURLToPath(value) : resolve(String(value));
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(`${JSON.stringify(body)}\n`);
}

function readRequestJson(req) {
  return new Promise((resolveJson, reject) => {
    let raw = '';
    req.setEncoding('utf8');
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 64 * 1024) {
        reject(new Error('request body is too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolveJson(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function resolveStaticPath(rootDir, pathname) {
  const decodedPath = decodeURIComponent(pathname === '/' ? '/index.html' : pathname);
  const safePath = normalize(decodedPath).replace(/^(\.\.[/\\])+/, '');
  const absolute = resolve(join(rootDir, safePath));
  const rel = relative(rootDir, absolute);
  if (rel.startsWith('..') || rel === '' || rel.includes('..\\')) return null;
  return absolute;
}

async function serveStatic(rootDirs, req, res, pathname) {
  const candidatePaths = rootDirs.map(rootDir => resolveStaticPath(rootDir, pathname));
  if (candidatePaths.some(filePath => filePath === null)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  for (const filePath of candidatePaths) {
    try {
      const info = await stat(filePath);
      if (!info.isFile()) throw Object.assign(new Error('not found'), { code: 'ENOENT' });
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream',
      });
      createReadStream(filePath).pipe(res);
      return;
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      res.writeHead(500);
      res.end('Server Error');
      return;
    }
  }

  res.writeHead(404);
  res.end('Not Found');
}

export function createDevServer(options = {}) {
  const rootDir = toPath(options.rootDir || ROOT_DIR);
  const staticDirs = (options.staticDirs || [rootDir]).map(toPath);
  const pendingFile = toPath(options.pendingFile || join(rootDir, 'data', 'pending-words.json'));

  return createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://localhost');

    try {
      if (url.pathname === '/api/pending-words' && req.method === 'GET') {
        sendJson(res, 200, await readPendingWords(pendingFile));
        return;
      }

      if (url.pathname === '/api/pending-words' && req.method === 'POST') {
        if (!String(req.headers['content-type'] || '').includes('application/json')) {
          sendJson(res, 400, { error: 'expected application/json' });
          return;
        }
        const body = await readRequestJson(req);
        sendJson(res, 200, await addPendingWord(pendingFile, body));
        return;
      }

      if (url.pathname.startsWith('/api/')) {
        sendJson(res, 404, { error: 'not found' });
        return;
      }

      await serveStatic(staticDirs, req, res, url.pathname);
    } catch (error) {
      sendJson(res, error.message === 'word is required' ? 400 : 500, { error: error.message });
    }
  });
}

export function parsePort(args = process.argv.slice(2)) {
  const portIndex = args.indexOf('--port');
  if (portIndex !== -1 && args[portIndex + 1]) return Number(args[portIndex + 1]);
  const inline = args.find(arg => arg.startsWith('--port='));
  if (inline) return Number(inline.slice('--port='.length));
  return DEFAULT_PORT;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = parsePort();
  const server = createDevServer();
  server.listen(port, () => {
    console.log(`Game of Type dev server running at http://localhost:${port}/`);
  });
}
