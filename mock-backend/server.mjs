// Mock backend for the Molly & Sophie React frontend.
// Mirrors the FastAPI endpoints in ../backend/server.py without Python or MongoDB.
//
// Endpoints:
//   GET  /api/                  → health
//   GET  /api/theme/info        → { name, version, size_kb, files, download_url }
//   GET  /api/theme/download    → streams the .zip
//   POST /api/theme/rebuild     → no-op (returns size of existing zip)
//   POST /api/contact           → logs to stdout, returns { status, id }
//   POST /api/newsletter        → logs to stdout, returns { status, id }

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || '5000', 10);

const REPO_ROOT = path.resolve(__dirname, '..');
const THEME_FOLDER = path.join(REPO_ROOT, 'shopify-theme', 'molly-and-sophie');
const THEME_ZIP = path.resolve(__dirname, '..', '..', 'molly-and-sophie-theme.zip');

function countFiles(dir) {
  let n = 0;
  if (!fs.existsSync(dir)) return 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) n += countFiles(full);
    else if (entry.isFile()) n += 1;
  }
  return n;
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function json(res, status, body) {
  setCors(res);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const { method } = req;
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  if (method === 'OPTIONS') {
    setCors(res);
    res.writeHead(204);
    return res.end();
  }

  if (method === 'GET' && pathname === '/api/') {
    return json(res, 200, { message: 'Molly & Sophie Shopify Theme Builder (mock)' });
  }

  if (method === 'GET' && pathname === '/api/theme/info') {
    const sizeKb = fs.existsSync(THEME_ZIP)
      ? Math.max(1, Math.floor(fs.statSync(THEME_ZIP).size / 1024))
      : 48;
    return json(res, 200, {
      name: 'Molly & Sophie',
      version: '1.0.0',
      size_kb: sizeKb,
      files: countFiles(THEME_FOLDER) || 30,
      download_url: '/api/theme/download',
    });
  }

  if (method === 'GET' && pathname === '/api/theme/download') {
    if (!fs.existsSync(THEME_ZIP)) {
      return json(res, 404, { detail: 'Theme zip not found at ' + THEME_ZIP });
    }
    setCors(res);
    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="molly-and-sophie-theme.zip"',
      'Content-Length': fs.statSync(THEME_ZIP).size,
    });
    return fs.createReadStream(THEME_ZIP).pipe(res);
  }

  if (method === 'POST' && pathname === '/api/theme/rebuild') {
    const sizeKb = fs.existsSync(THEME_ZIP) ? Math.floor(fs.statSync(THEME_ZIP).size / 1024) : 0;
    return json(res, 200, { status: 'ok', size_kb: sizeKb, note: 'mock: zip not regenerated' });
  }

  if (method === 'POST' && pathname === '/api/contact') {
    try {
      const body = await readBody(req);
      const id = randomUUID();
      console.log(`[contact] id=${id} from=${body.email} subject=${JSON.stringify(body.subject ?? '')}`);
      return json(res, 200, { status: 'ok', id });
    } catch (e) {
      return json(res, 400, { detail: 'invalid JSON' });
    }
  }

  if (method === 'POST' && pathname === '/api/newsletter') {
    try {
      const body = await readBody(req);
      const id = randomUUID();
      console.log(`[newsletter] id=${id} email=${body.email}`);
      return json(res, 200, { status: 'ok', id });
    } catch (e) {
      return json(res, 400, { detail: 'invalid JSON' });
    }
  }

  return json(res, 404, { detail: `Not Found: ${method} ${pathname}` });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`mock-backend listening on http://127.0.0.1:${PORT}`);
  console.log(`  THEME_FOLDER = ${THEME_FOLDER} (${fs.existsSync(THEME_FOLDER) ? 'found' : 'MISSING'})`);
  console.log(`  THEME_ZIP    = ${THEME_ZIP} (${fs.existsSync(THEME_ZIP) ? 'found' : 'MISSING'})`);
});
