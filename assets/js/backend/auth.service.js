'use strict';

const AuthService = (() => {
  const STORE = 'users';
  const SESSION = 'session';
  const SUPERADMIN_EMAIL = 'tamerlan.lutfaliyev@srgroupco.com';

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
    if (!user) return { ok: false, error: 'Пользователь не найден / İstifadəçi tapılmadı' };
    if (user.disabled) return { ok: false, error: 'Аккаунт деактивирован / Hesab deaktivdir' };
    const hashed = _hash(password);
    if (user.password !== hashed && user.password !== password) return { ok: false, error: 'Неверный пароль / Şifrə yanlışdır' };
    if (user.password === password) StorageService.updateItem(STORE, user.id, { password: hashed });
    const session = { userId: user.id, loginAt: Date.now() };
    StorageService.set(SESSION, session);
    return { ok: true, user: _safe(user) };
  }

  function register(data) {
    const { name, email, password, dept, company } = data;
    const users = StorageService.getList(STORE);
    if (users.find(u => String(u.email || '').toLowerCase() === String(email || '').toLowerCase())) {
      return { ok: false, error: 'Email уже зарегистрирован / Email artıq qeydiyyatdadır' };
    }
    if (!name || !email || !password) return { ok: false, error: 'Заполните все поля' };
    if (password.length < 6) return { ok: false, error: 'Пароль минимум 6 символов' };
    const user = StorageService.addItem(STORE, {
      id: StorageService.uid(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: _hash(password),
      role: 'manager',
      dept: dept || 'sales',
      department: dept || 'sales',
      company: company || 'changan',
      createdAt: Date.now()
    });
    const session = { userId: user.id, loginAt: Date.now() };
    StorageService.set(SESSION, session);
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
    return u && (u.role === 'superadmin' || u.role === 'head');
  }

  function isSuperadmin() {
    const u = currentUser();
    return u && u.role === 'superadmin';
  }

  return { init, login, register, logout, currentUser, getAllUsers, updateUser, deleteUser, canAdmin, isSuperadmin };
})();
