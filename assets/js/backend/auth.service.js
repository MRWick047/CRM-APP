'use strict';

const AuthService = (() => {
  const STORE = 'users';
  const SESSION = 'session';
  const SUPERADMIN_EMAIL = 'tamerlan.lutfaliyev@srgroupco.com';

  const ROLES = [
    { value: 'user',                  label: { ru: 'Пользователь',     az: 'İstifadəçi'      } },
    { value: 'reception',             label: { ru: 'Ресепшн',          az: 'Resepsiya'       } },
    { value: 'salesperson',           label: { ru: 'Продавец',         az: 'Satıcı'          } },
    { value: 'sales_director',        label: { ru: 'Директор продаж',  az: 'Satış Direktoru' } },
    { value: 'callcenter_specialist', label: { ru: 'Специалист КЦ',    az: 'ƏM Mütəxəssisi' } },
    { value: 'callcenter_manager',    label: { ru: 'Менеджер КЦ',      az: 'ƏM Meneceri'    } },
    { value: 'callcenter_admin',     label: { ru: 'Администратор 3CX', az: '3CX Admini'      } },
    { value: 'admin',                 label: { ru: 'Администратор',    az: 'Admin'           } },
    { value: 'superadmin',            label: { ru: 'Супер-Админ',      az: 'Super-Admin'     } }
  ];

  const DEPT_ROLES = {
    sales:       ['user', 'reception', 'salesperson', 'sales_director'],
    it:          ['user', 'admin', 'superadmin'],
    procurement: ['user', 'salesperson', 'sales_director'],
    callcenter:  ['user', 'callcenter_specialist', 'callcenter_manager', 'callcenter_admin'],
    marketing:   ['user', 'reception', 'salesperson', 'sales_director', 'callcenter_specialist', 'callcenter_manager', 'admin'],
    service:     ['user', 'reception', 'salesperson', 'sales_director', 'callcenter_specialist', 'callcenter_manager', 'admin']
  };

  const _HASH_SALT = 'srcrm_v2_9f3a';

  function _hash(str) {
    const input = _HASH_SALT + str;
    let h = 5381;
    for (let iter = 0; iter < 2048; iter++) {
      for (let i = 0; i < input.length; i++) {
        h = (((h << 5) + h) ^ input.charCodeAt(i)) >>> 0;
      }
    }
    return 'v2_' + h.toString(16).padStart(8, '0');
  }

  function _hashLegacy(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    }
    return h.toString(16);
  }

  /* FIX: Ensure exactly one superadmin; self-heal duplicates */
  let _superadminInitDone = false;

  function _deduplicateUsers() {
    const users = StorageService.getList(STORE);
    const seen = new Map();
    const keep = [];
    const removed = [];
    const sorted = [...users].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    sorted.forEach(u => {
      const key = String(u.email || u.id).toLowerCase();
      if (seen.has(key)) { removed.push(u.id); }
      else { seen.set(key, u); keep.push(u); }
    });
    if (removed.length > 0) {
      console.log('[Auth] Deduplicating users: removing ' + removed.length + ' duplicate(s)');
      StorageService.setList(STORE, keep);
    }
    return removed.length;
  }

  function _ensureSuperadmin() {
    if (_superadminInitDone) return;
    _superadminInitDone = true;

    StorageService.ready.then(() => {
      _deduplicateUsers();

      const users = StorageService.getList(STORE);
      if (users.find(u => u.role === 'superadmin')) return;

      const RESET_PASS =
        document.querySelector('meta[name="reset-password"]')?.content || 'TL123#@!tl';

      console.log('[Auth] No superadmin found -- creating initial superadmin account');
      StorageService.addItem(STORE, {
        id: StorageService.uid(),
        name: 'Tamerlan Lutfaliyev',
        email: SUPERADMIN_EMAIL,
        password: _hash(RESET_PASS),
        role: 'superadmin',
        status: 'active',
        dept: 'it',
        department: 'it',
        company: 'srgroup',
        createdAt: Date.now()
      });
    });
  }

  function init() { _ensureSuperadmin(); }

  function _token() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  function login(email, password) {
    const users = StorageService.getList(STORE);
    const user = users.find(u => String(u.email || '').toLowerCase() === String(email || '').toLowerCase());
    if (!user) return { ok: false, error: 'İstifadəçi tapılmadı / Пользователь не найден' };
    if (user.disabled) return { ok: false, error: 'Hesab deaktivdir / Аккаунт деактивирован' };
    if (user.status === 'pending') return { ok: false, error: 'Hesabınız təsdiq gözləyir. / Ваш аккаунт ожидает подтверждения администратора.', isPending: true };
    const hashed = _hash(password);
    const legacyHashed = _hashLegacy(password);
    const passwordMatch = user.password === hashed ||
                          user.password === legacyHashed ||
                          user.password === password;
    if (!passwordMatch) return { ok: false, error: 'Şifrə yanlışdır / Неверный пароль' };
    if (user.password !== hashed) StorageService.updateItem(STORE, user.id, { password: hashed });
    const sessionToken = _token();
    StorageService.updateItem(STORE, user.id, { sessionToken });
    const session = { userId: user.id, sessionToken, loginAt: Date.now() };
    StorageService.set(SESSION, session);
    return { ok: true, user: _safe(user) };
  }

  function registerUser(data) {
    const { name, email, password, dept, company } = data;
    const users = StorageService.getList(STORE);
    if (users.find(u => String(u.email || '').toLowerCase() === String(email || '').toLowerCase())) {
      return { ok: false, error: 'Email artıq qeydiyyatdadır / Email уже зарегистрирован' };
    }
    if (!name || !email || !password) return { ok: false, error: 'Bütün sahələri doldurun / Заполните все поля' };
    if (password.length < 6) return { ok: false, error: 'Şifrə minimum 6 simvol / Минимум 6 символов' };
    const user = StorageService.addItem(STORE, {
      id: StorageService.uid(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: _hash(password),
      role: 'user',
      dept: dept || 'sales',
      department: dept || 'sales',
      company: company || 'changan',
      status: 'pending',
      createdAt: Date.now()
    });
    return { ok: true, user: _safe(user) };
  }

  function getPendingUsers() {
    return StorageService.getList(STORE).filter(u => u.status === 'pending').map(_safe);
  }

  function approveUser(id) {
    return StorageService.updateItem(STORE, id, { status: 'active' });
  }

  function rejectUser(id) {
    return StorageService.deleteItem(STORE, id);
  }

  function createUser(data) {
    const { name, email, password, dept, company, role } = data;
    const users = StorageService.getList(STORE);
    if (users.find(u => String(u.email || '').toLowerCase() === String(email || '').toLowerCase())) {
      return { ok: false, error: 'Email artıq qeydiyyatdadır / Email уже зарегистрирован' };
    }
    if (!name || !email || !password) return { ok: false, error: 'Bütün sahələri doldurun / Заполните все поля' };
    if (password.length < 6) return { ok: false, error: 'Şifrə minimum 6 simvol / Минимум 6 символов' };
    const user = StorageService.addItem(STORE, {
      id: StorageService.uid(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: _hash(password),
      role: role || 'salesperson',
      dept: dept || 'sales',
      department: dept || 'sales',
      company: company || 'changan',
      createdAt: Date.now()
    });
    return { ok: true, user: _safe(user) };
  }

  function logout() {
    const session = StorageService.get(SESSION);
    if (session?.userId) {
      StorageService.updateItem(STORE, session.userId, { sessionToken: null });
    }
    StorageService.set(SESSION, null);
  }

  function currentUser() {
    const session = StorageService.get(SESSION);
    if (!session) return null;
    const user = StorageService.findById(STORE, session.userId);
    if (!user) return null;
    if (session.sessionToken && user.sessionToken && session.sessionToken !== user.sessionToken) {
      StorageService.set(SESSION, null);
      return null;
    }
    return _safe(user);
  }

  function _safe(u) {
    const { password, ...rest } = u;
    return { ...rest, dept: rest.dept || rest.department || 'sales', department: rest.department || rest.dept || 'sales' };
  }

  function getAllUsers() {
    return StorageService.getList(STORE).map(_safe);
  }

  function updateUser(id, patch) {
    if (patch.password) patch.password = _hash(patch.password);
    return StorageService.updateItem(STORE, id, patch);
  }

  function deleteUser(id) {
    const me = currentUser();
    if (me && me.id === id) return false;
    return StorageService.deleteItem(STORE, id);
  }

  function canAdmin() {
    const u = currentUser();
    return u && (u.role === 'superadmin' || u.role === 'admin');
  }

  function isSuperadmin() {
    const u = currentUser();
    return u && u.role === 'superadmin';
  }

  function hasRole(...roles) {
    const u = currentUser();
    return u && roles.includes(u.role);
  }

  function getRolesForDept(dept) {
    const allowed = DEPT_ROLES[dept] || ROLES.map(r => r.value);
    return ROLES.filter(r => allowed.includes(r.value));
  }

  function roleLabel(val, lang = 'az') {
    const r = ROLES.find(x => x.value === val);
    return r ? (r.label[lang] || r.label.az) : val;
  }

  return {
    init, login, registerUser, createUser, logout, currentUser, getAllUsers, updateUser, deleteUser,
    canAdmin, isSuperadmin, hasRole, getRolesForDept, roleLabel,
    getPendingUsers, approveUser, rejectUser,
    ROLES, DEPT_ROLES
  };
})();
