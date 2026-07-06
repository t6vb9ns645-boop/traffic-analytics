#!/usr/bin/env node
// Encrypts src/app.html with a password (AES-256-GCM, key via PBKDF2-SHA256)
// and writes a self-contained password gate + ciphertext to public/index.html.
// The password itself is never written to disk or committed.
const fs = require('fs');
const path = require('path');
const { webcrypto } = require('crypto');
const { subtle } = webcrypto;

const ITERATIONS = 250000;

async function main() {
  const password = process.env.SITE_PASSWORD || process.argv[2];
  if (!password) {
    console.error('Usage: SITE_PASSWORD=... node build.js   (or: node build.js <password>)');
    process.exit(1);
  }

  const appHtml = fs.readFileSync(path.join(__dirname, 'src/app.html'), 'utf8');
  const template = fs.readFileSync(path.join(__dirname, 'src/loader.template.html'), 'utf8');

  const enc = new TextEncoder();
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));

  const baseKey = await subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const ciphertext = await subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(appHtml));

  const b64 = (buf) => Buffer.from(buf).toString('base64');
  const output = template
    .replace('__SALT__', b64(salt))
    .replace('__IV__', b64(iv))
    .replace('__CIPHERTEXT__', b64(ciphertext))
    .replace('__ITERATIONS__', String(ITERATIONS));

  fs.mkdirSync(path.join(__dirname, 'public'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'public/index.html'), output);
  console.log('Built public/index.html (' + output.length + ' bytes)');
}

main().catch((e) => { console.error(e); process.exit(1); });
