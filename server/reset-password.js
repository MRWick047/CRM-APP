'use strict';
/*
 * reset-password.js
 * Resets the superadmin password directly in server/data/store.json
 *
 * Usage:
 *   cd server
 *   node reset-password.js              // sets password to TL123#@!tl
 *   node reset-password.js MyNewPass    // sets custom password
 */

const path = require('path');
const fs   = require('fs');

const TARGET_EMAIL = 'tamerlan.lutfaliyev@srgroupco.com';
const NEW_PASSWORD = process.argv[2] || 'TL123#@!tl';
const STORE_FILE   = path.join(__dirname, 'data', 'store.json');
const STORE_KEY    = 'srcrm_users';

function _hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return h.toString(16);
}

function uid() {
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Ensure data dir exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(STORE_FILE)) fs.writeFileSync(STORE_FILE, '{}', 'utf8');

let store = {};
try { store = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8')); } catch {}

let users = Array.isArray(store[STORE_KEY]) ? store[STORE_KEY] : [];

const newHash = _hash(NEW_PASSWORD);
const idx = users.findIndex(u => String(u.email || '').toLowerCase() === TARGET_EMAIL.toLowerCase());

let action;
if (idx === -1) {
  users.push({
    id: uid(),
    name: 'Tamerlan Lutfaliyev',
    email: TARGET_EMAIL,
    password: newHash,
    role: 'superadmin',
    status: 'active',
    dept: 'it',
    department: 'it',
    company: 'srgroup',
    createdAt: Date.now()
  });
  action = 'created new superadmin';
} else {
  users[idx] = {
    ...users[idx],
    password: newHash,
    status: 'active',
    disabled: false,
    sessionToken: null,
    updatedAt: Date.now()
  };
  action = 'updated existing user';
}

store[STORE_KEY] = users;
fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');

console.log('--------------------------------------------------');
console.log('  SRCRM password reset');
console.log('--------------------------------------------------');
console.log(`  Email   : ${TARGET_EMAIL}`);
console.log(`  Password: ${NEW_PASSWORD}`);
console.log(`  Action  : ${action}`);
console.log('--------------------------------------------------');
console.log('  Done. You can now log in to the CRM.');
