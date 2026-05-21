'use strict';

/* ── H-3: Register crash handlers FIRST — before any require that could throw ── */
process.on('uncaughtException', (err) => {
  console.error(`[${new Date().toISOString()}] UNCAUGHT EXCEPTION:`, err.stack || err);
  // Do NOT call process.exit — let PM2 decide on restart policy
});
process.on('unhandledRejection', (reason) => {
  console.error(`[${new Date().toISOString()}] UNHANDLED REJECTION:`, reason);
});

require('dotenv').config();

const path    = require('path');
const fs      = require('fs');
const crypto  = require('crypto');
const express = require('express');
const cors    = require('cors');
const http    = require('http');
const net     = require('net');
const { Server } = require('socket.io');

const app    = express();
const server = http.createServer(app);
const PORT      = process.env.PORT     || 3000;
const CDR_PORT  = process.env.CDR_PORT || 5050;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || `http://localhost:${PORT}`;

/* ── FIX 9 — C-1: API token (generate once, persist to .env) ── */
let API_TOKEN = process.env.API_TOKEN;
if (!API_TOKEN) {
  API_TOKEN = crypto.randomBytes(32).toString('hex');
  const envPath = path.join(__dirname, '.env');
  fs.appendFileSync(envPath, `\nAPI_TOKEN=${API_TOKEN}\n`);
  console.log('[AUTH] Generated new API_TOKEN and saved to .env');
}

/* ── FIX 9 — C-1: Auth middleware — protect all /api/* except /api/health ── */
function requireAPIToken(req, res, next) {
  if (req.path === '/health') return next();          // public health check
  const auth = req.headers['authorization'] || '';
  if (!auth.startsWith('Bearer ') || auth.slice(7) !== API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

/* ── Data directory ── */
const DATA_DIR   = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');
const CDR_FILE   = path.join(DATA_DIR, 'cdr.json');

/* ── FIX 5 — H-1: In-memory CDR cache + debounced async write ── */
let cdrCache     = null;   // null = not yet loaded
let cdrWriteTimer = null;

function initDB() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STORE_FILE)) fs.writeFileSync(STORE_FILE, '{}', 'utf8');
  if (!fs.existsSync(CDR_FILE))   fs.writeFileSync(CDR_FILE,   '[]', 'utf8');
  // Load CDR into memory at startup
  try { cdrCache = JSON.parse(fs.readFileSync(CDR_FILE, 'utf8')) || []; }
  catch { cdrCache = []; }
  console.log(`DB ready (JSON files in ${DATA_DIR}) — ${cdrCache.length} CDR records loaded`);
}

/* ── JSON file helpers ── */
function readStore() {
  try { return JSON.parse(fs.readFileSync(STORE_FILE, 'utf8')) || {}; }
  catch { return {}; }
}
function writeStore(obj) {
  fs.writeFileSync(STORE_FILE, JSON.stringify(obj, null, 2), 'utf8');
}

/* FIX 5: readCDR uses in-memory cache; falls back to disk only if cache not ready */
function readCDR() {
  if (cdrCache !== null) return cdrCache;
  try { return JSON.parse(fs.readFileSync(CDR_FILE, 'utf8')) || []; }
  catch { return []; }
}

/* FIX 5: writeCDR updates in-memory cache, then flushes to disk after 500ms debounce */
function writeCDR(arr) {
  cdrCache = arr;
  if (cdrWriteTimer) clearTimeout(cdrWriteTimer);
  cdrWriteTimer = setTimeout(() => {
    fs.writeFile(CDR_FILE, JSON.stringify(arr, null, 2), 'utf8', err => {
      if (err) console.error('[CDR] async write error:', err.message);
    });
  }, 500);
}

/* Keys that the frontend is allowed to read/write */
const ALLOWED_KEYS = new Set([
  'srcrm_users', 'srcrm_clients', 'srcrm_deals', 'srcrm_tasks',
  'srcrm_docs', 'srcrm_acts', 'srcrm_visits', 'srcrm_sales', 'srcrm_calls'
]);

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '10mb' }));

/* FIX 9: Apply auth middleware to all /api/* routes */
app.use('/api', requireAPIToken);

const io = new Server(server, {
  cors: { origin: CLIENT_ORIGIN, methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

/* ── CDR fields (order matches 3CX Active Socket CSV stream) ── */
const CDR_FIELDS = [
  'historyid','callid','duration','time_start','time_answered','time_end',
  'reason_terminated','from_no','to_no','from_dn','to_dn',
  'dial_no','reason_changed','final_number','final_dn'
];

/* ── Parse one CSV line from 3CX ── */
function parseCDRLine(line) {
  line = line.trim();
  if (!line) return null;
  const cols = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQ = !inQ; }
    else if (ch === ',' && !inQ) { cols.push(cur); cur = ''; }
    else { cur += ch; }
  }
  cols.push(cur);
  if (cols.length < CDR_FIELDS.length) return null;
  const rec = {};
  CDR_FIELDS.forEach((f, i) => { rec[f] = cols[i] ? cols[i].trim() : null; });
  rec.duration = rec.duration ? parseInt(rec.duration, 10) || 0 : 0;
  rec.id = Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  rec.created_at = new Date().toISOString();
  ['time_start','time_answered','time_end'].forEach(f => {
    if (rec[f] && rec[f].length > 0) {
      const d = new Date(rec[f]);
      rec[f] = isNaN(d.getTime()) ? null : d.toISOString();
    } else { rec[f] = null; }
  });
  if (!rec.duration && rec.time_answered && rec.time_end) {
    rec.duration = Math.max(0, Math.round((new Date(rec.time_end) - new Date(rec.time_answered)) / 1000));
  }
  return rec;
}

/* ── Save CDR record (uses in-memory cache) ── */
function saveCDR(rec) {
  try {
    const records = readCDR();
    // deduplicate by historyid
    if (rec.historyid && records.find(r => r.historyid === rec.historyid)) return;
    records.unshift(rec);
    // keep last 50000 records
    if (records.length > 50000) records.splice(50000);
    writeCDR(records);
    io.emit('cdr_new', rec);
    console.log('[CDR] saved:', rec.historyid, rec.from_no, '->', rec.to_no);
  } catch (err) {
    console.error('[CDR] error:', err.message);
  }
}

/* ── TCP server — 3CX Active Socket ── */
const tcpServer = net.createServer(socket => {
  const remote = `${socket.remoteAddress}:${socket.remotePort}`;

  /* FIX 1 — C-5: IP allowlist */
  const allowedIPs = process.env.CDR_ALLOWED_IPS
    ? process.env.CDR_ALLOWED_IPS.split(',').map(ip => ip.trim()).filter(Boolean)
    : [];
  if (allowedIPs.length > 0 && !allowedIPs.includes(socket.remoteAddress)) {
    console.warn(`[CDR] REJECTED connection from ${remote} — not in CDR_ALLOWED_IPS`);
    socket.destroy();
    return;
  }

  console.log(`[CDR] 3CX connected from ${remote}`);

  /* FIX 7 — M-1: Socket timeout (30s) */
  socket.setTimeout(30000);
  socket.on('timeout', () => {
    console.warn(`[CDR] socket timeout from ${remote} — disconnecting`);
    socket.destroy();
  });

  let buf = '';
  let bufSize = 0;  // FIX 7: track raw bytes received
  socket.setEncoding('utf8');

  socket.on('data', chunk => {
    /* FIX 7 — M-1: Enforce 1MB buffer limit */
    bufSize += chunk.length;
    if (bufSize > 1024 * 1024) {
      console.warn(`[CDR] buffer overflow (>1MB) from ${remote} — disconnecting`);
      socket.destroy();
      return;
    }
    buf += chunk;
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const line of lines) {
      const rec = parseCDRLine(line);
      if (rec) saveCDR(rec);
    }
  });

  socket.on('end', () => {
    if (buf.trim()) { const rec = parseCDRLine(buf); if (rec) saveCDR(rec); }
    console.log(`[CDR] 3CX disconnected from ${remote}`);
  });

  socket.on('error', err => console.error('[CDR] socket error:', err.message));
});

/* ── Health (public — no auth required, exempted in requireAPIToken) ── */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'json-files', store: STORE_FILE, cdr: CDR_FILE });
});

/* ── GET all store keys ── */
app.get('/api/store', (req, res) => {
  res.json(readStore());
});

/* ── PUT (upsert) one key ── */
app.put('/api/store/:key', (req, res) => {
  const key = req.params.key;
  if (!ALLOWED_KEYS.has(key)) return res.status(400).json({ error: 'Invalid key' });
  try {
    const store = readStore();
    store[key] = req.body.value;
    writeStore(store);
    io.emit('store_updated', { key });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── DELETE one key ── */
app.delete('/api/store/:key', (req, res) => {
  const key = req.params.key;
  if (!ALLOWED_KEYS.has(key)) return res.status(400).json({ error: 'Invalid key' });
  try {
    const store = readStore();
    delete store[key];
    writeStore(store);
    io.emit('store_updated', { key });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── CDR: list with filters ── */
app.get('/api/cdr', (req, res) => {
  try {
    const { from, to, agent, limit = 100 } = req.query;
    let records = readCDR();
    if (from)  records = records.filter(r => r.time_start && r.time_start >= from);
    if (to)    records = records.filter(r => r.time_start && r.time_start <= to);
    if (agent) records = records.filter(r =>
      (r.from_dn && r.from_dn.includes(agent)) ||
      (r.to_dn   && r.to_dn.includes(agent))
    );
    res.json(records.slice(0, Math.min(parseInt(limit, 10) || 100, 1000)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── CDR: aggregated stats ── */
app.get('/api/cdr/stats', (req, res) => {
  try {
    const { from: _from, to: _to } = req.query;
    const allRecords = readCDR();
    let records = allRecords;
    if (_from) records = records.filter(r => r.time_start && r.time_start >= _from);
    if (_to)   records = records.filter(r => r.time_start && r.time_start <= _to + 'T23:59:59');
    const now = new Date();
    const startOfDay  = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const startOfWeek = (() => {
      const d = new Date(now);
      d.setDate(d.getDate() - d.getDay());
      d.setHours(0, 0, 0, 0);
      return d.toISOString();
    })();
    const since24h = new Date(now - 24 * 60 * 60 * 1000).toISOString();

    // KPI scope: today when no date filter, else the filtered date range
    const kpiRecords = (_from || _to)
      ? records
      : records.filter(r => r.time_start && r.time_start >= startOfDay);
    const _isOutgoing = r => r.from_no && String(r.from_no).startsWith("Ext.");
    const answered_calls = kpiRecords.filter(r => r.time_answered).length;
    const missed_calls   = kpiRecords.filter(r => !r.time_answered && !_isOutgoing(r)).length;
    const durations = kpiRecords
      .filter(r => r.time_answered && r.time_end)
      .map(r => r.duration > 0 ? r.duration
        : Math.max(0, Math.round((new Date(r.time_end) - new Date(r.time_answered)) / 1000)))
      .filter(d => d > 0);
    const avg_duration = durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

    // calls by hour (last 24h, Baku = UTC+4)
    const calls_by_hour = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: 0 }));
    allRecords.filter(r => r.time_start && r.time_start >= since24h).forEach(r => {
      const h = (new Date(r.time_start).getUTCHours() + 4) % 24;
      calls_by_hour[h].count++;
    });

    // top agents — only known agent DNs (excludes queues/ring groups), with names
    const _cdrAgents = (readStore().srcrm_cdr_agents || []);
    const _dnNameMap = {};
    _cdrAgents.forEach(a => { _dnNameMap[a.dn] = a.name; });
    const _knownDNs = new Set(Object.keys(_dnNameMap));
    const agentMap = {};
    records.forEach(r => {
      const dns = [];
      if (r.from_dn && _knownDNs.has(r.from_dn)) dns.push(r.from_dn);
      if (r.to_dn   && _knownDNs.has(r.to_dn))   dns.push(r.to_dn);
      dns.forEach(dn => {
        if (!agentMap[dn]) agentMap[dn] = { calls: 0, answered: 0, missed: 0, total_dur: 0 };
        agentMap[dn].calls++;
        if (r.time_answered) { agentMap[dn].answered++; agentMap[dn].total_dur += (r.duration || 0); }
        else agentMap[dn].missed++;
      });
    });
    const calls_by_agent = Object.entries(agentMap)
      .map(([dn, a]) => ({ dn, name: _dnNameMap[dn] || dn, calls: a.calls, answered: a.answered, missed: a.missed, avg_duration: a.answered ? Math.round(a.total_dur / a.answered) : 0 }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 10);

    res.json({
      total_calls:     kpiRecords.length,
      answered_calls,
      missed_calls,
      avg_duration,
      calls_by_hour,
      calls_by_agent,
      calls_today:     kpiRecords.length,
      calls_this_week: records.filter(r => r.time_start && r.time_start >= startOfWeek).length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── FIX 9 — C-1: Serve index.html dynamically, injecting API token as meta tag ── */
const INDEX_HTML = path.join(__dirname, '../index.html');
function serveIndex(req, res) {
  try {
    let html = fs.readFileSync(INDEX_HTML, 'utf8');
    // FIX 9: inject API token; FIX 8: inject reset-password for superadmin bootstrap
    const injected = [
      `  <meta name="api-token" content="${API_TOKEN}">`,
      `  <meta name="reset-password" content="${process.env.RESET_PASSWORD || ''}">`
    ].join('\n');
    html = html.replace('</head>', injected + '\n</head>');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(html);
  } catch (err) {
    res.status(500).send('Could not load application');
  }
}

/* Static assets (CSS/JS/images) — index: false so we handle index.html ourselves */
app.use(express.static(path.join(__dirname, '../'), { index: false }));
/* SPA catch-all */
app.get('*', serveIndex);

io.on('connection', socket => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

/* ── Keep-alive: prevents Node from exiting when event loop drains ── */
setInterval(() => {}, 1000 * 60 * 60);

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[ERROR] Port ${PORT} is already in use. Kill the old process first.`);
  } else {
    console.error('[ERROR] HTTP server:', err.message);
  }
  process.exit(1);
});

tcpServer.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[ERROR] CDR port ${CDR_PORT} is already in use.`);
  } else {
    console.error('[CDR] TCP server error:', err.message);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  initDB();
  console.log(`SRCRM server running on port ${PORT}`);
  console.log(`[AUTH] API token active (${API_TOKEN.slice(0, 8)}...)`);
});

tcpServer.listen(CDR_PORT, '0.0.0.0', () => {
  const allowedIPs = process.env.CDR_ALLOWED_IPS || '(open)';
  console.log('CDR TCP server listening on port ' + CDR_PORT + ' — allowed IPs: ' + allowedIPs);
});
