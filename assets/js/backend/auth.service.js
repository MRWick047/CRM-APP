'use strict';

const AuthService = (() => {
  const STORE = 'users';
  const SESSION = 'session';
  const SUPERADMIN_EMAIL = 'tamerlan.lutfaliyev@srgroupco.com';

  const ROLES = [
    { value: 'reception',             label: { ru: 'Ресепшн',          az: 'Resepsiya'       } },
    { value: 'salesperson',           label: { ru: 'Продавец',         az: 'Satıcı'          } },
    { value: 'sales_director',        label: { ru: 'Директор продаж',  az: 'Satış Direktoru' } },
    { value: 'callcenter_specialist', label: { ru: 'Специалист КЦ',    az: 'ƏM Mütəxəssisi' } },
    { value: 'callcenter_manager',    label: { ru: 'Менеджер КЦ',      az: 'ƏM Meneceri'    } },
    { value: 'admin',                 label: { ru: 'Администратор',    az: 'Admin'           } },
    { value: 'superadmin',            label: { ru: 'Супер-Админ',      az: 'Super-Admin'     } }
  ];

  const DEPT_ROLES = {
    sales:       ['reception', 'salesperson', 'sales_director'],
    it:          ['admin', 'superadmin'],
    procurement: ['salesperson', 'sales_director'],
    callcenter:  ['callcenter_specialist', 'callcenter_manager'],
    marketing:   ['reception', 'salesperson', 'sales_director', 'callcenter_specialist', 'callcenter_manager', 'admin'],
    service:     ['reception', 'salesperson', 'sales_director', 'callcenter_specialist', 'callcenter_manager', 'admin']
  };

  function _hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    }
    return h.toString(16);
  }

  function _ensureSuperadmin() {
    const users = StorageService.getList(STORE);
    if (users.find(u => u.email === SUPERADMIN_EMAIL)) return;
    StorageService.addItem(STORE, {
      id: StorageService.uid(),
      name: 'Tamerlan Lutfaliyev',
      email: SUPERADMIN_EMAIL,
      password: _hash('Admin@SR2024'),
      role: 'superadmin',
      dept: 'it',
      department: 'it',
      company: 'srgroup',
      createdAt: Date.now()
    });
  }

  function init() { _ensureSuperadmin(); }

  function login(email, password) {
    const users = StorageService.getList(STORE);
    const user = users.find(u => String(u.email || '').toLowerCase() === String(email || '').toLowerCase());
    if (!user) return { ok: false, error: 'İstifadəçi tapılmadı / Пользователь не найден' };
    if (user.disabled) return { ok: false, error: 'Hesab deaktivdir / Аккаунт деактивирован' };
    const hashed = _hash(password);
    if (user.password !== hashed && user.password !== password) return { ok: false, error: 'Şifrə yanlışdır / Неверный пароль' };
    if (user.password === password) StorageService.updateItem(STORE, user.id, { password: hashed });
    const session = { userId: user.id, loginAt: Date.now() };
    StorageService.set(SESSION, session);
    return { ok: true, user: _safe(user) };
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

  function logout() { StorageService.set(SESSION, null); }

  function currentUser() {
    const session = StorageService.get(SESSION);
    if (!session) return null;
    const user = StorageService.findById(STORE, session.userId);
    return user ? _safe(user) : null;
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
    init, login, createUser, logout, currentUser, getAllUsers, updateUser, deleteUser,
    canAdmin, isSuperadmin, hasRole, getRolesForDept, roleLabel, ROLES, DEPT_ROLES
  };
})();
