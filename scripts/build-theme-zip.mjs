// Rebuild the Shopify-uploadable theme .zip from the source folder.
//
// Why this script exists: PowerShell's Compress-Archive on Windows
// produces zip entries with backslash separators ("layout\theme.liquid"),
// which Shopify rejects with "zip does not contain a valid theme: missing
// template layout/theme.liquid". This script uses Node's built-in zlib +
// stored/deflate to write a minimal, spec-compliant zip with forward-slash
// entry names so Shopify accepts it.
//
// Usage:   node scripts/build-theme-zip.mjs
// Output:  ../molly-and-sophie-theme.zip   (one level above the website2 repo)

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const THEME_DIR = path.join(REPO_ROOT, "shopify-theme", "molly-and-sophie");
const OUT_PATH  = path.resolve(REPO_ROOT, "..", "molly-and-sophie-theme.zip");

if (!fs.existsSync(THEME_DIR)) {
  console.error(`✗ Theme folder not found: ${THEME_DIR}`);
  process.exit(1);
}

// Walk THEME_DIR and yield { entryName, absPath } pairs. Entry names use
// forward slashes regardless of the host OS — that's the whole point.
function* walk(dir, prefix = "") {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === ".DS_Store" || e.name === "node_modules") continue;
    const abs = path.join(dir, e.name);
    const entryName = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isDirectory()) {
      yield* walk(abs, entryName);
    } else if (e.isFile()) {
      yield { entryName, absPath: abs };
    }
  }
}

// CRC32 — needed by the zip spec. Uses the standard polynomial table.
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ CRC_TABLE[(c ^ buf[i]) & 0xFF];
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function dosTime(d = new Date()) {
  return ((d.getHours() & 0x1F) << 11) | ((d.getMinutes() & 0x3F) << 5) | ((Math.floor(d.getSeconds() / 2)) & 0x1F);
}
function dosDate(d = new Date()) {
  return (((d.getFullYear() - 1980) & 0x7F) << 9) | (((d.getMonth() + 1) & 0x0F) << 5) | (d.getDate() & 0x1F);
}

const localHeaderSig   = 0x04034B50;
const centralDirSig    = 0x02014B50;
const endOfCentralDir  = 0x06054B50;

const records = [];
const localChunks = [];
let localOffset = 0;
const now = new Date();
const tt = dosTime(now);
const dd = dosDate(now);

let count = 0;
for (const { entryName, absPath } of walk(THEME_DIR)) {
  const data = fs.readFileSync(absPath);
  const compressed = zlib.deflateRawSync(data, { level: 9 });
  const useDeflate = compressed.length < data.length;
  const stored = useDeflate ? compressed : data;
  const method = useDeflate ? 8 : 0;
  const crc = crc32(data);
  const nameBuf = Buffer.from(entryName, "utf8");

  // Local file header
  const lh = Buffer.alloc(30);
  lh.writeUInt32LE(localHeaderSig, 0);
  lh.writeUInt16LE(20, 4);                 // version needed (2.0)
  lh.writeUInt16LE(0x0800, 6);             // bit 11 = UTF-8 names
  lh.writeUInt16LE(method, 8);
  lh.writeUInt16LE(tt, 10);
  lh.writeUInt16LE(dd, 12);
  lh.writeUInt32LE(crc, 14);
  lh.writeUInt32LE(stored.length, 18);     // compressed size
  lh.writeUInt32LE(data.length, 22);       // uncompressed size
  lh.writeUInt16LE(nameBuf.length, 26);
  lh.writeUInt16LE(0, 28);                 // extra field length

  localChunks.push(lh, nameBuf, stored);
  records.push({ entryName, nameBuf, crc, compressedSize: stored.length, uncompressedSize: data.length, method, tt, dd, headerOffset: localOffset });
  localOffset += lh.length + nameBuf.length + stored.length;
  count++;
}

// Central directory
const cdChunks = [];
let cdSize = 0;
for (const r of records) {
  const cd = Buffer.alloc(46);
  cd.writeUInt32LE(centralDirSig, 0);
  cd.writeUInt16LE(20, 4);                 // version made by
  cd.writeUInt16LE(20, 6);                 // version needed
  cd.writeUInt16LE(0x0800, 8);             // bit 11 = UTF-8
  cd.writeUInt16LE(r.method, 10);
  cd.writeUInt16LE(r.tt, 12);
  cd.writeUInt16LE(r.dd, 14);
  cd.writeUInt32LE(r.crc, 16);
  cd.writeUInt32LE(r.compressedSize, 20);
  cd.writeUInt32LE(r.uncompressedSize, 24);
  cd.writeUInt16LE(r.nameBuf.length, 28);
  cd.writeUInt16LE(0, 30);                 // extra field length
  cd.writeUInt16LE(0, 32);                 // comment length
  cd.writeUInt16LE(0, 34);                 // disk number
  cd.writeUInt16LE(0, 36);                 // internal attrs
  cd.writeUInt32LE(0, 38);                 // external attrs
  cd.writeUInt32LE(r.headerOffset, 42);
  cdChunks.push(cd, r.nameBuf);
  cdSize += cd.length + r.nameBuf.length;
}

// End-of-central-directory
const eocd = Buffer.alloc(22);
eocd.writeUInt32LE(endOfCentralDir, 0);
eocd.writeUInt16LE(0, 4);                  // disk number
eocd.writeUInt16LE(0, 6);                  // disk where CD starts
eocd.writeUInt16LE(records.length, 8);     // entries on this disk
eocd.writeUInt16LE(records.length, 10);    // total entries
eocd.writeUInt32LE(cdSize, 12);
eocd.writeUInt32LE(localOffset, 16);
eocd.writeUInt16LE(0, 20);                 // comment length

const out = Buffer.concat([...localChunks, ...cdChunks, eocd]);
fs.writeFileSync(OUT_PATH, out);

const sizeMB = (out.length / 1024 / 1024).toFixed(2);
console.log(`✓ Wrote ${OUT_PATH}`);
console.log(`  ${count} files · ${sizeMB} MB · forward-slash paths · UTF-8 names`);
