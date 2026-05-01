'use strict';

/*
 * StorageService keeps the updated Claude-test CRM functionality,
 * but uses the deployed SRCRM storage API/config keys.
 * Server keys are kept compatible with the previous deployed build:
 * srcrm_users, srcrm_clients, srcrm_deals, srcrm_tasks, srcrm_docs, srcrm_acts.
 */
const StorageService = (() => {
  const SERVER_KEY_MAP = {
    users: 'srcrm_users',
    clients: 'srcrm_clients',
    deals: 'srcrm_deals',
    tasks: 'srcrm_tasks',
    documents: 'srcrm_docs',
    docs: 'srcrm_docs',
    activities: 'srcrm_acts'
  };
  const LOCAL_ONLY = new Set(['session', 'lang', 'theme']);
  const LOCAL_PREFIX = 'srcrm_';
  let cache = {};

  function _serverKey(name) { return SERVER_KEY_MAP[name] || `srcrm_${name}`; }
  function _localKey(name) { return name.startsWith(LOCAL_PREFIX) ? name : LOCAL_PREFIX + name; }
  function _fallback(name) { return name === 'session' ? null : []; }

  async function syncFromServer() {
    try {
      const res = await fetch('/api/store', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      cache = await res.json() || {};
      return cache;
    } catch (err) {
      console.warn('SRCRM server storage unavailable; using browser storage fallback.', err);
      cache = {};
      return cache;
    }
  }

  const ready = syncFromServer();

  function initSocket() {
    if (typeof io === 'undefined') return;
    try {
      const socket = io();
      socket.on('store_updated', async () => {
        await syncFromServer();
        if (typeof window.renderCurrentPageFromLiveUpdate === 'function') window.renderCurrentPageFromLiveUpdate();
        else if (typeof window.navigate === 'function' && window._page) window.navigate(window._page);
      });
    } catch (err) { console.warn('Socket init failed', err); }
  }
  initSocket();

  function get(name) {
    if (LOCAL_ONLY.has(name)) {
      try {
        const raw = localStorage.getItem(_localKey(name));
        return raw ? JSON.parse(raw) : _fallback(name);
      } catch { return _fallback(name); }
    }
    const key = _serverKey(name);
    if (Object.prototype.hasOwnProperty.call(cache, key)) return cache[key];

    // Fallback/migration support for data created by the local Claude test build.
    try {
      const raw = localStorage.getItem(_localKey(name));
      return raw ? JSON.parse(raw) : _fallback(name);
    } catch { return _fallback(name); }
  }

  function set(name, value) {
    if (LOCAL_ONLY.has(name)) {
      if (value === null || typeof value === 'undefined') localStorage.removeItem(_localKey(name));
      else localStorage.setItem(_localKey(name), JSON.stringify(value));
      return;
    }
    const key = _serverKey(name);
    cache[key] = value;
    fetch('/api/store/' + encodeURIComponent(key), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value })
    }).catch(err => {
      console.warn('Server save failed; saving local fallback.', err);
      localStorage.setItem(_localKey(name), JSON.stringify(value));
    });
  }

  function remove(name) {
    if (LOCAL_ONLY.has(name)) { localStorage.removeItem(_localKey(name)); return; }
    const key = _serverKey(name);
    delete cache[key];
    fetch('/api/store/' + encodeURIComponent(key), { method: 'DELETE' })
      .catch(err => console.warn('Server remove failed', err));
  }

  function getList(name) { const val = get(name); return Array.isArray(val) ? val : []; }
  function setList(name, arr) { set(name, Array.isArray(arr) ? arr : []); }
  function uid(prefix = 'id') { return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }
  function now() { return Date.now(); }

  function addItem(name, item) {
    const list = getList(name);
    const row = { ...item, id: item?.id || uid(), createdAt: item?.createdAt || now() };
    list.unshift(row);
    setList(name, list);
    return row;
  }

  function updateItem(name, id, patch) {
    const list = getList(name);
    const idx = list.findIndex(x => x.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...patch, updatedAt: now() };
    setList(name, list);
    return list[idx];
  }

  function deleteItem(name, id) {
    const list = getList(name);
    const next = list.filter(x => x.id !== id);
    setList(name, next);
    return next.length !== list.length;
  }

  function findById(name, id) { return getList(name).find(x => x.id === id) || null; }

  return { ready, syncFromServer, get, set, remove, getList, setList, addItem, updateItem, deleteItem, findById, uid, now };
})();
