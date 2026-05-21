# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SR Auto CRM** — a single-page CRM application for SR Group MMC (Azerbaijan) managing car sales across multiple brands: Changan, Lynk & Co, Škoda, AVATR, Mercedes/Autostar, Leap Motors. The UI is bilingual (Azerbaijani and Russian).

## Common Commands

### Server Management (PM2)
```bash
# Restart server after code changes
pm2 restart srcrm --update-env

# View live logs
pm2 logs srcrm --lines 50

# Start fresh (from /var/www/srcrm/server/)
pm2 start server.js --name srcrm --update-env

# Health check
curl http://localhost:3000/api/health
```

### Deploy / Update
```bash
cd /var/www/srcrm && git pull && cd server && npm install && pm2 restart srcrm --update-env
```

### Database
```bash
# Connect to PostgreSQL
PGPASSWORD='P@$$word@24' psql -h localhost -U admin -d crm

# Or via URL
psql "postgresql://admin:P%40%24%24word%4024@localhost:5432/crm"
```

### Install server dependencies
```bash
cd /var/www/srcrm/server && npm install
```

## Architecture

### Dual-Layer Storage
All CRM data lives in PostgreSQL's single `app_state` table (schema: `key TEXT PK, value JSONB, updated_at TIMESTAMP`). The front-end `StorageService` reads from this via `GET /api/store` on page load and writes individual keys via `PUT /api/store/:key`. When the server is unreachable it falls back to `localStorage` with the `srcrm_` prefix.

Session state (`session`, `lang`, `theme`) is **always** localStorage-only and never sent to the server.

### Server-side key map
| JS name | DB key |
|---|---|
| `users` | `srcrm_users` |
| `clients` | `srcrm_clients` |
| `deals` | `srcrm_deals` |
| `tasks` | `srcrm_tasks` |
| `documents` / `docs` | `srcrm_docs` |
| `activities` | `srcrm_acts` |

### Frontend Script Load Order
Scripts in `index.html` must stay in this exact order (each depends on the previous):
1. `storage.service.js` — data layer, exposes `StorageService`
2. `auth.service.js` — login/session/roles, exposes `AuthService`
3. `crm.service.js` — business logic, exposes `CRMService`
4. `ui.service.js` — modal/toast helpers, exposes `UIService`
5. `app.js` — page rendering and event wiring, uses all above globals

All modules are IIFE patterns that expose a single global constant. There is no bundler.

### Backend (`server/server.js`)
- Express + Socket.IO, port 3000, managed by PM2 as `srcrm`
- Generic CRUD routes: `GET/POST /api/:table`, `PUT/DELETE /api/:table/:id`
- `GET /api/store` returns all `app_state` rows as `{ key: value }` — this is the main data bootstrap endpoint
- Every write emits a `data_changed` Socket.IO event so other connected clients refresh
- Static files served from `../` (the repo root), so `index.html` is the catch-all fallback

### Role System
Roles (defined in `auth.service.js`): `reception`, `salesperson`, `sales_director`, `callcenter_specialist`, `callcenter_manager`, `admin`, `superadmin`. Sidebar navigation items are shown/hidden based on the logged-in user's role and department. Admins and superadmins see all menu items; other roles only see their department's data entry pages.

### Password Hashing
Auth uses a simple polynomial hash (`Math.imul(31, h)`), not bcrypt. Passwords must be at least 6 characters. The superadmin account (`tamerlan.lutfaliyev@srgroupco.com`) is auto-created with default password `Admin@SR2024` if it doesn't exist.

## Key Files for Common Changes

| What to change | File |
|---|---|
| UI styles | `assets/css/main.css` |
| Login / session / roles | `assets/js/backend/auth.service.js` |
| Data collections (clients, deals, calls, visits, sales, tasks) | `assets/js/backend/crm.service.js` |
| Server persistence / localStorage fallback | `assets/js/backend/storage.service.js` |
| Modal, toast, confirm dialogs | `assets/js/frontend/ui.service.js` |
| Page rendering, navigation, i18n strings | `assets/js/app/app.js` |
| API routes, database connection | `server/server.js` |
| Server environment | `server/.env` (gitignored) |

## Important Caveats

- The generic `/api/:table` route interpolates the table name directly into SQL — adding new real DB tables requires care to avoid injection via that route.
- The `app_state` table stores all CRM data as JSONB blobs, not as normalized relational tables. There are no separate `clients`, `deals`, etc. tables in the DB.
- Real-time sync relies on `StorageService.initSocket()` listening for `store_updated` events. If a server-side write needs to trigger a UI refresh on all clients, emit that event from the server.
