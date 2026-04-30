'use strict';

/* ══ STATE ══ */
let _lang = localStorage.getItem('srcrm_lang') || 'ru';
let _user = null;
let _page = 'dashboard';

/* ══ THEME ══ */
function applyTheme(dark){
  document.body.classList.toggle('dark', dark);
  const btn = document.getElementById('themeToggleBtn');
  if(btn) btn.textContent = dark ? '☀️' : '🌙';
}
function toggleTheme(){
  const dark = !document.body.classList.contains('dark');
  localStorage.setItem('srcrm_theme', dark ? 'dark' : 'light');
  applyTheme(dark);
}
applyTheme(localStorage.getItem('srcrm_theme') === 'dark');

/* ══ I18N ══ */
const T = {
  ru: {
    dashboard:'Дашборд', clients:'Клиенты', deals:'Сделки', tasks:'Задачи',
    employees:'Сотрудники', documents:'Документы', reports:'Отчёты', admin:'Администрация',
    logout:'Выйти', main:'Главное', management:'Управление',
    add:'Добавить', edit:'Редактировать', delete:'Удалить', save:'Сохранить', cancel:'Отмена',
    search:'Поиск...', all:'Все',
    name:'Имя', phone:'Телефон', email:'Email', company:'Компания', department:'Отдел',
    source:'Источник', notes:'Примечания', status:'Статус', role:'Роль',
    stage:'Стадия', amount:'Сумма (AZN)', dueDate:'Срок',
    priority:'Приоритет', assignTo:'Назначить', description:'Описание',
    type:'Тип', title:'Название',
    confirmDelete:'Удалить запись? Это действие необратимо.',
    totalClients:'Клиенты', totalDeals:'Сделки', revenue:'Выручка (выигр.)', pendingTasks:'Задачи в работе',
    recentClients:'Последние клиенты', dealsByStage:'Сделки по стадиям', clientsByBrand:'Клиенты по маркам',
    superadmin:'Супер-Админ', head:'Руководитель', manager:'Менеджер',
    active:'Активный', inactive:'Неактивный',
    noData:'Нет данных', loading:'Загрузка...',
    client:'Клиент', deal:'Сделка',
    password:'Пароль', newPassword:'Новый пароль (оставьте пустым, чтобы не менять)',
    position:'Должность',
    docContract:'Договор', docInvoice:'Счёт', docAct:'Акт', docOther:'Другое',
    docContent:'Содержание / Описание',
    won:'Выиграно', lost:'Проиграно', winRate:'Win Rate',
    addClient:'Добавить клиента', addDeal:'Добавить сделку', addTask:'Добавить задачу',
    addEmployee:'Добавить сотрудника', addDocument:'Добавить документ',
    editClient:'Редактировать клиента', editDeal:'Редактировать сделку',
    editTask:'Редактировать задачу', editEmployee:'Редактировать сотрудника',
    taskDone:'Выполнено', taskTodo:'К выполнению', taskInProgress:'В процессе',
    adminSysInfo:'Системная информация', adminUsers:'Пользователи', adminClients:'Клиенты',
    adminDeals:'Сделки', adminPendingTasks:'Задачи (в работе)',
    adminDataMgmt:'Управление данными', adminExport:'Экспорт JSON', adminImport:'Импорт JSON',
    adminClear:'Очистить все данные', adminClearConfirm:'Удалить ВСЕ данные CRM? Это необратимо!',
    adminUserList:'Зарегистрированные пользователи', adminChangePass:'Сменить пароль',
    adminNewPass:'Новый пароль', adminPassSaved:'Пароль изменён', adminPassMin:'Минимум 6 символов',
    adminAccessDenied:'Доступ запрещён'
  },
  az: {
    dashboard:'İdarə paneli', clients:'Müştərilər', deals:'Sövdələşmələr', tasks:'Tapşırıqlar',
    employees:'İşçilər', documents:'Sənədlər', reports:'Hesabatlar', admin:'Administrasiya',
    logout:'Çıxış', main:'Əsas', management:'İdarəetmə',
    add:'Əlavə et', edit:'Redaktə et', delete:'Sil', save:'Yadda saxla', cancel:'İmtina',
    search:'Axtar...', all:'Hamısı',
    name:'Ad', phone:'Telefon', email:'Email', company:'Şirkət', department:'Şöbə',
    source:'Mənbə', notes:'Qeydlər', status:'Status', role:'Rol',
    stage:'Mərhələ', amount:'Məbləğ (AZN)', dueDate:'Son tarix',
    priority:'Prioritet', assignTo:'Təyin et', description:'Təsvir',
    type:'Növ', title:'Başlıq',
    confirmDelete:'Qeydi silmək istəyirsiniz? Bu əməliyyat geri qaytarıla bilməz.',
    totalClients:'Müştərilər', totalDeals:'Sövdələşmələr', revenue:'Gəlir (qazanılan)', pendingTasks:'İcrada olan tapşırıqlar',
    recentClients:'Son müştərilər', dealsByStage:'Mərhələ üzrə sövdələşmələr', clientsByBrand:'Marka üzrə müştərilər',
    superadmin:'Super-Admin', head:'Rəhbər', manager:'Menecer',
    active:'Aktiv', inactive:'Qeyri-aktiv',
    noData:'Məlumat yoxdur', loading:'Yüklənir...',
    client:'Müştəri', deal:'Sövdələşmə',
    password:'Şifrə', newPassword:'Yeni şifrə (dəyişməmək üçün boş buraxın)',
    position:'Vəzifə',
    docContract:'Müqavilə', docInvoice:'Faktura', docAct:'Akt', docOther:'Digər',
    docContent:'Məzmun / Təsvir',
    won:'Qazanıldı', lost:'Uduludu', winRate:'Qazan dərəcəsi',
    addClient:'Müştəri əlavə et', addDeal:'Sövdələşmə əlavə et', addTask:'Tapşırıq əlavə et',
    addEmployee:'İşçi əlavə et', addDocument:'Sənəd əlavə et',
    editClient:'Müştərini redaktə et', editDeal:'Sövdələşməni redaktə et',
    editTask:'Tapşırığı redaktə et', editEmployee:'İşçini redaktə et',
    taskDone:'Tamamlandı', taskTodo:'Gözləyir', taskInProgress:'İcrada',
    adminSysInfo:'Sistem məlumatı', adminUsers:'İstifadəçilər', adminClients:'Müştərilər',
    adminDeals:'Sövdələşmələr', adminPendingTasks:'Tapşırıqlar (icrada)',
    adminDataMgmt:'Məlumatların idarəsi', adminExport:'JSON İxrac', adminImport:'JSON İdxal',
    adminClear:'Bütün məlumatları sil', adminClearConfirm:'Bütün CRM məlumatlarını silmək istəyirsiniz? Bu geri qaytarıla bilməz!',
    adminUserList:'Qeydiyyatdan keçmiş istifadəçilər', adminChangePass:'Şifrəni dəyiş',
    adminNewPass:'Yeni şifrə', adminPassSaved:'Şifrə dəyişdirildi', adminPassMin:'Minimum 6 simvol',
    adminAccessDenied:'Giriş qadağandır'
  }
};

function t(key) { return (T[_lang] || T.ru)[key] || key; }

/* ══ INIT ══ */
document.addEventListener('DOMContentLoaded', async () => {
  if (window.StorageService?.ready) await StorageService.ready;
  AuthService.init();
  applyLang();
  const user = AuthService.currentUser();
  if (user) { _user = user; showApp(); }
  else showAuth();
});

/* ══ LANG ══ */
function setLang(lang) {
  _lang = lang;
  localStorage.setItem('srcrm_lang', lang);
  applyLang();
  navigate(_page);
}

function applyLang() {
  document.querySelectorAll('[data-i]').forEach(el => {
    const key = el.getAttribute('data-i');
    if (T[_lang] && T[_lang][key]) el.textContent = T[_lang][key];
  });
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === _lang));
  document.querySelectorAll('#nl-main').forEach(el => el.textContent = t('main'));
  document.querySelectorAll('#nl-mgmt').forEach(el => el.textContent = t('management'));
}

/* ══ AUTH SCREENS ══ */
function showAuth() {
  document.getElementById('authScreen').classList.remove('hidden');
  document.getElementById('appScreen').classList.add('hidden');
}

function showApp() {
  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('appScreen').classList.remove('hidden');
  updateSidebar();
  navigate('dashboard');
}

function updateSidebar() {
  if (!_user) return;
  document.getElementById('sbAvatar').textContent = _user.name.charAt(0).toUpperCase();
  document.getElementById('sbName').textContent = _user.name;
  const roleMap = { superadmin: t('superadmin'), head: t('head'), manager: t('manager') };
  document.getElementById('sbRole').textContent = roleMap[_user.role] || _user.role;
  const adminBtn = document.getElementById('navAdmin');
  if (AuthService.isSuperadmin()) adminBtn.classList.remove('hidden');
  else adminBtn.classList.add('hidden');
  updateTaskBadge();
}

function updateTaskBadge() {
  if (!_user) return;
  const count = CRMService.countPendingTasks(_user.id);
  const badge = document.getElementById('taskBadge');
  if (count > 0) { badge.textContent = count; badge.classList.remove('hidden'); }
  else badge.classList.add('hidden');
}

/* ══ AUTH ACTIONS ══ */
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
  document.getElementById('regForm').classList.toggle('hidden', tab !== 'register');
  document.getElementById('authErr').textContent = '';
}

function doLogin(e) {
  e.preventDefault();
  const email = document.getElementById('liEmail').value.trim();
  const pass = document.getElementById('liPass').value;
  const res = AuthService.login(email, pass);
  if (!res.ok) { document.getElementById('authErr').textContent = res.error; return; }
  _user = res.user;
  showApp();
}

function doRegister(e) {
  e.preventDefault();
  const data = {
    name: document.getElementById('reName').value,
    email: document.getElementById('reEmail').value,
    password: document.getElementById('rePass').value,
    dept: document.getElementById('reDept').value,
    company: document.getElementById('reCo').value
  };
  const res = AuthService.register(data);
  if (!res.ok) { document.getElementById('authErr').textContent = res.error; return; }
  _user = res.user;
  showApp();
}

function logout() {
  AuthService.logout();
  _user = null;
  showAuth();
}

/* ══ NAVIGATION ══ */
function navigate(page) {
  _page = page;
  document.querySelectorAll('.nav-item[data-page]').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  document.getElementById('pageTitle').textContent = t(page);
  const content = document.getElementById('pageContent');
  content.innerHTML = `<p style="color:var(--muted);padding:40px;text-align:center">${t('loading')}</p>`;
  document.getElementById('sidebar').classList.remove('open');

  const pages = { dashboard: renderDashboard, clients: renderClients, deals: renderDeals, tasks: renderTasks, employees: renderEmployees, documents: renderDocuments, reports: renderReports, admin: renderAdmin };
  if (pages[page]) pages[page]();
}

/* ══ DASHBOARD ══ */
function renderDashboard() {
  const s = CRMService.getStats();
  const recentClients = CRMService.getClients({}).slice(0, 5);

  const stageRows = CRMService.DEAL_STAGES.map(st => {
    const count = s.dealsByStage[st.value] || 0;
    const max = Math.max(...Object.values(s.dealsByStage), 1);
    const pct = Math.round((count / max) * 100);
    return `<div class="chart-bar-row">
      <span class="chart-bar-label">${st.label[_lang]}</span>
      <div class="chart-bar-bg"><div class="chart-bar-fill" style="width:${pct}%"></div></div>
      <span class="chart-bar-val">${count}</span>
    </div>`;
  }).join('');

  const brandRows = CRMService.COMPANIES.map(co => {
    const count = s.clientsByCompany[co.value] || 0;
    const max = Math.max(...Object.values(s.clientsByCompany), 1);
    const pct = Math.round((count / max) * 100);
    return `<div class="chart-bar-row">
      <span class="chart-bar-label">${co.label}</span>
      <div class="chart-bar-bg"><div class="chart-bar-fill" style="width:${pct}%"></div></div>
      <span class="chart-bar-val">${count}</span>
    </div>`;
  }).join('');

  const clientRows = recentClients.length
    ? recentClients.map(c => `<tr>
        <td>${esc(c.name)}</td>
        <td>${esc(c.phone || '—')}</td>
        <td>${CRMService.companyLabel(c.company)}</td>
        <td>${CRMService.formatDate(c.createdAt)}</td>
      </tr>`).join('')
    : `<tr><td colspan="4" class="table-empty">${t('noData')}</td></tr>`;

  document.getElementById('pageContent').innerHTML = `
    <div class="stats-grid">
      <div class="stat-card stat-blue"><div class="stat-icon">👥</div><div class="stat-value">${s.clients}</div><div class="stat-label">${t('totalClients')}</div></div>
      <div class="stat-card stat-yellow"><div class="stat-icon">💼</div><div class="stat-value">${s.deals}</div><div class="stat-label">${t('totalDeals')}</div></div>
      <div class="stat-card stat-green"><div class="stat-icon">💰</div><div class="stat-value">${CRMService.formatMoney(s.revenue)}</div><div class="stat-label">${t('revenue')}</div></div>
      <div class="stat-card stat-purple"><div class="stat-icon">✅</div><div class="stat-value">${s.pendingTasks}</div><div class="stat-label">${t('pendingTasks')}</div></div>
    </div>
    <div class="dash-grid">
      <div class="section-card">
        <div class="section-title">${t('dealsByStage')}</div>
        <div class="chart-bar-wrap">${stageRows}</div>
      </div>
      <div class="section-card">
        <div class="section-title">${t('clientsByBrand')}</div>
        <div class="chart-bar-wrap">${brandRows}</div>
      </div>
    </div>
    <div class="section-card" style="margin-top:16px">
      <div class="section-title">${t('recentClients')}</div>
      <div class="table-wrap" style="box-shadow:none;border:none">
        <table><thead><tr><th>${t('name')}</th><th>${t('phone')}</th><th>${t('company')}</th><th>Дата</th></tr></thead>
        <tbody>${clientRows}</tbody></table>
      </div>
    </div>`;
}

/* ══ CLIENTS ══ */
function renderClients(search = '', company = '') {
  const clients = CRMService.getClients({ search, company });
  const companyOpts = `<option value="">${t('all')}</option>` + CRMService.COMPANIES.map(c => `<option value="${c.value}"${c.value === company ? ' selected' : ''}>${c.label}</option>`).join('');

  const rows = clients.length
    ? clients.map(c => `<tr>
        <td><strong>${esc(c.name)}</strong></td>
        <td>${esc(c.phone || '—')}</td>
        <td>${esc(c.email || '—')}</td>
        <td>${CRMService.companyLabel(c.company)}</td>
        <td>${CRMService.sourceLabel(c.source, _lang)}</td>
        <td>${CRMService.formatDate(c.createdAt)}</td>
        <td><div class="td-actions">
          <button class="btn btn-ghost btn-sm btn-icon" onclick="openClientDetail('${c.id}')">👁</button>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="openClientForm('${c.id}')">✏️</button>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="confirmDeleteClient('${c.id}')">🗑</button>
        </div></td>
      </tr>`).join('')
    : `<tr><td colspan="7" class="table-empty">${UIService.emptyState('👥', t('noData'))}</td></tr>`;

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <h2>${t('clients')}</h2>
      <button class="btn btn-primary" onclick="openClientForm()">+ ${t('addClient')}</button>
    </div>
    <div class="table-wrap">
      <div class="table-toolbar">
        <input class="search-input" placeholder="${t('search')}" value="${esc(search)}" oninput="renderClients(this.value, document.getElementById('coCo').value)" id="clSearch">
        <select class="filter-select" id="coCo" onchange="renderClients(document.getElementById('clSearch').value, this.value)">${companyOpts}</select>
        <span style="margin-left:auto;font-size:12px;color:var(--muted)">${clients.length} записей</span>
      </div>
      <table><thead><tr><th>${t('name')}</th><th>${t('phone')}</th><th>${t('email')}</th><th>${t('company')}</th><th>${t('source')}</th><th>Дата</th><th></th></tr></thead>
      <tbody>${rows}</tbody></table>
    </div>`;
}

function openClientForm(id) {
  const client = id ? CRMService.getClient(id) : null;
  const users = AuthService.getAllUsers();
  const assignOpts = `<option value="">—</option>` + users.map(u => `<option value="${u.id}"${client && client.assignedTo === u.id ? ' selected' : ''}>${esc(u.name)}</option>`).join('');
  const coSel = UIService.buildSelect(CRMService.COMPANIES, client?.company || 'changan', 'company');
  const srcSel = UIService.buildSelect(CRMService.CLIENT_SOURCES.map(s => ({ value: s.value, label: s.label[_lang] || s.label.ru })), client?.source || 'other', 'source');

  UIService.openModal(client ? t('editClient') : t('addClient'), `
    <form id="clientForm">
      <div class="form-row">
        <div class="form-group"><label>${t('name')} *</label><input class="form-control" name="name" value="${esc(client?.name || '')}" required maxlength="100"></div>
        <div class="form-group"><label>${t('phone')}</label><input class="form-control" name="phone" value="${esc(client?.phone || '')}" placeholder="+994"></div>
      </div>
      <div class="form-group"><label>${t('email')}</label><input class="form-control" type="email" name="email" value="${esc(client?.email || '')}"></div>
      <div class="form-row">
        <div class="form-group"><label>${t('company')}</label>${coSel}</div>
        <div class="form-group"><label>${t('source')}</label>${srcSel}</div>
      </div>
      <div class="form-group"><label>${t('assignTo')}</label><select class="form-control" name="assignedTo">${assignOpts}</select></div>
      <div class="form-group"><label>${t('notes')}</label><textarea class="form-control" name="notes" rows="3">${esc(client?.notes || '')}</textarea></div>
    </form>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="submitClientForm('${id || ''}')">${t('save')}</button>`
  );
}

function submitClientForm(id) {
  const data = UIService.collectForm('#clientForm');
  data.createdBy = _user.id;
  const res = id ? CRMService.updateClient(id, data) : CRMService.addClient(data);
  if (!res.ok) { UIService.toast(res.error, 'error'); return; }
  UIService.closeModal();
  UIService.toast(id ? 'Клиент обновлён' : 'Клиент добавлен', 'success');
  renderClients();
}

function openClientDetail(id) {
  const c = CRMService.getClient(id);
  if (!c) return;
  const deals = CRMService.getDeals({ clientId: id });
  const dealRows = deals.map(d => `<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:13px;display:flex;justify-content:space-between">
    <span>${esc(d.title)}</span><span>${UIService.stageBadge(d.stage, _lang)}</span>
  </div>`).join('') || `<p style="color:var(--muted);font-size:13px">${t('noData')}</p>`;

  UIService.openModal(c.name, `
    <div class="detail-row"><span class="detail-label">${t('phone')}</span><span class="detail-value">${esc(c.phone || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">${t('email')}</span><span class="detail-value">${esc(c.email || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">${t('company')}</span><span class="detail-value">${CRMService.companyLabel(c.company)}</span></div>
    <div class="detail-row"><span class="detail-label">${t('source')}</span><span class="detail-value">${CRMService.sourceLabel(c.source, _lang)}</span></div>
    <div class="detail-row"><span class="detail-label">${t('notes')}</span><span class="detail-value">${esc(c.notes || '—')}</span></div>
    <div class="divider"></div>
    <div class="section-title">${t('deals')} (${deals.length})</div>
    ${dealRows}`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="closeModal();openClientForm('${id}')">✏️ ${t('edit')}</button>`
  );
}

async function confirmDeleteClient(id) {
  const ok = await UIService.confirm(t('confirmDelete'));
  if (!ok) return;
  CRMService.deleteClient(id);
  UIService.toast('Клиент удалён', 'success');
  renderClients();
}

/* ══ DEALS ══ */
function renderDeals(view = 'kanban', search = '', company = '') {
  const deals = CRMService.getDeals({ search, company });
  const clients = CRMService.getClients({});
  const coOpts = `<option value="">${t('all')}</option>` + CRMService.COMPANIES.map(c => `<option value="${c.value}"${c.value === company ? ' selected' : ''}>${c.label}</option>`).join('');

  const toolbar = `
    <div class="page-header">
      <h2>${t('deals')}</h2>
      <button class="btn btn-primary" onclick="openDealForm()">+ ${t('addDeal')}</button>
    </div>
    <div class="table-toolbar" style="background:var(--surface);border-radius:var(--radius-lg);border:1px solid var(--border);margin-bottom:16px">
      <input class="search-input" placeholder="${t('search')}" value="${esc(search)}" oninput="renderDeals('${view}',this.value,document.getElementById('dealCo').value)" id="dealSearch">
      <select class="filter-select" id="dealCo" onchange="renderDeals('${view}',document.getElementById('dealSearch').value,this.value)">${coOpts}</select>
      <div style="margin-left:auto;display:flex;gap:6px">
        <button class="btn btn-sm ${view==='kanban'?'btn-primary':'btn-ghost'}" onclick="renderDeals('kanban',document.getElementById('dealSearch')?.value||'',document.getElementById('dealCo')?.value||'')">Kanban</button>
        <button class="btn btn-sm ${view==='list'?'btn-primary':'btn-ghost'}" onclick="renderDeals('list',document.getElementById('dealSearch')?.value||'',document.getElementById('dealCo')?.value||'')">Список</button>
      </div>
    </div>`;

  let body = '';
  if (view === 'kanban') {
    const cols = CRMService.DEAL_STAGES.map(st => {
      const stagDeals = deals.filter(d => d.stage === st.value);
      const cards = stagDeals.map(d => {
        const cl = clients.find(c => c.id === d.clientId);
        return `<div class="k-card" onclick="openDealDetail('${d.id}')">
          <div class="k-card-title">${esc(d.title)}</div>
          <div class="k-card-sub">${cl ? esc(cl.name) : '—'} · ${CRMService.companyLabel(d.company)}</div>
          <div class="k-card-foot">
            <span class="k-amount">${CRMService.formatMoney(d.amount)}</span>
            <button class="btn btn-ghost btn-sm btn-icon" onclick="event.stopPropagation();openDealForm('${d.id}')">✏️</button>
          </div>
        </div>`;
      }).join('') || '';
      return `<div class="kanban-col">
        <div class="kanban-head">${st.label[_lang]}<span class="kanban-count">${stagDeals.length}</span></div>
        <div class="kanban-cards">${cards}</div>
      </div>`;
    }).join('');
    body = `<div class="kanban">${cols}</div>`;
  } else {
    const rows = deals.map(d => {
      const cl = clients.find(c => c.id === d.clientId);
      return `<tr>
        <td><strong>${esc(d.title)}</strong></td>
        <td>${cl ? esc(cl.name) : '—'}</td>
        <td>${CRMService.companyLabel(d.company)}</td>
        <td>${UIService.stageBadge(d.stage, _lang)}</td>
        <td>${CRMService.formatMoney(d.amount)}</td>
        <td>${d.dueDate || '—'}</td>
        <td><div class="td-actions">
          <button class="btn btn-ghost btn-sm btn-icon" onclick="openDealDetail('${d.id}')">👁</button>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="openDealForm('${d.id}')">✏️</button>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="confirmDeleteDeal('${d.id}')">🗑</button>
        </div></td>
      </tr>`;
    }).join('') || `<tr><td colspan="7" class="table-empty">${t('noData')}</td></tr>`;
    body = `<div class="table-wrap"><table><thead><tr><th>${t('title')}</th><th>${t('client')}</th><th>${t('company')}</th><th>${t('stage')}</th><th>${t('amount')}</th><th>${t('dueDate')}</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  document.getElementById('pageContent').innerHTML = toolbar + body;
}

function openDealForm(id) {
  const deal = id ? CRMService.getDeal(id) : null;
  const clients = CRMService.getClients({});
  const users = AuthService.getAllUsers();
  const clOpts = `<option value="">—</option>` + clients.map(c => `<option value="${c.id}"${deal && deal.clientId === c.id ? ' selected' : ''}>${esc(c.name)}</option>`).join('');
  const coSel = UIService.buildSelect(CRMService.COMPANIES, deal?.company || 'changan', 'company');
  const stSel = UIService.buildSelect(CRMService.DEAL_STAGES.map(s => ({ value: s.value, label: s.label[_lang] })), deal?.stage || 'new', 'stage');
  const assignOpts = `<option value="">—</option>` + users.map(u => `<option value="${u.id}"${deal && deal.assignedTo === u.id ? ' selected' : ''}>${esc(u.name)}</option>`).join('');

  UIService.openModal(deal ? t('editDeal') : t('addDeal'), `
    <form id="dealForm">
      <div class="form-group"><label>${t('title')} *</label><input class="form-control" name="title" value="${esc(deal?.title || '')}" required maxlength="150"></div>
      <div class="form-row">
        <div class="form-group"><label>${t('client')}</label><select class="form-control" name="clientId">${clOpts}</select></div>
        <div class="form-group"><label>${t('company')}</label>${coSel}</div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>${t('stage')}</label>${stSel}</div>
        <div class="form-group"><label>${t('amount')}</label><input class="form-control" type="number" name="amount" value="${deal?.amount || ''}" min="0"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>${t('assignTo')}</label><select class="form-control" name="assignedTo">${assignOpts}</select></div>
        <div class="form-group"><label>${t('dueDate')}</label><input class="form-control" type="date" name="dueDate" value="${deal?.dueDate || ''}"></div>
      </div>
      <div class="form-group"><label>${t('notes')}</label><textarea class="form-control" name="notes" rows="3">${esc(deal?.notes || '')}</textarea></div>
    </form>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="submitDealForm('${id || ''}')">${t('save')}</button>`
  );
}

function submitDealForm(id) {
  const data = UIService.collectForm('#dealForm');
  data.createdBy = _user.id;
  const res = id ? CRMService.updateDeal(id, data) : CRMService.addDeal(data);
  if (!res.ok) { UIService.toast(res.error, 'error'); return; }
  UIService.closeModal();
  UIService.toast(id ? 'Сделка обновлена' : 'Сделка добавлена', 'success');
  renderDeals();
}

function openDealDetail(id) {
  const d = CRMService.getDeal(id);
  if (!d) return;
  const cl = d.clientId ? CRMService.getClient(d.clientId) : null;
  UIService.openModal(d.title, `
    <div class="detail-row"><span class="detail-label">${t('client')}</span><span class="detail-value">${cl ? esc(cl.name) : '—'}</span></div>
    <div class="detail-row"><span class="detail-label">${t('company')}</span><span class="detail-value">${CRMService.companyLabel(d.company)}</span></div>
    <div class="detail-row"><span class="detail-label">${t('stage')}</span><span class="detail-value">${UIService.stageBadge(d.stage, _lang)}</span></div>
    <div class="detail-row"><span class="detail-label">${t('amount')}</span><span class="detail-value">${CRMService.formatMoney(d.amount)}</span></div>
    <div class="detail-row"><span class="detail-label">${t('dueDate')}</span><span class="detail-value">${d.dueDate || '—'}</span></div>
    <div class="detail-row"><span class="detail-label">${t('notes')}</span><span class="detail-value">${esc(d.notes || '—')}</span></div>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="closeModal();openDealForm('${id}')">✏️ ${t('edit')}</button>`
  );
}

async function confirmDeleteDeal(id) {
  const ok = await UIService.confirm(t('confirmDelete'));
  if (!ok) return;
  CRMService.deleteDeal(id);
  UIService.toast('Сделка удалена', 'success');
  renderDeals();
}

/* ══ TASKS ══ */
function renderTasks(filterStatus = '') {
  const tasks = CRMService.getTasks({ userId: _user.id, status: filterStatus || undefined });
  const users = AuthService.getAllUsers();
  const clients = CRMService.getClients({});

  const tabs = ['', 'todo', 'inprogress', 'done'].map(s => {
    const labels = { '': t('all'), todo: t('taskTodo'), inprogress: t('taskInProgress'), done: t('taskDone') };
    return `<button class="tab-btn${filterStatus === s ? ' active' : ''}" onclick="renderTasks('${s}')">${labels[s]}</button>`;
  }).join('');

  const items = tasks.map(task => {
    const assignee = users.find(u => u.id === task.assignedTo);
    const cl = task.relatedClient ? clients.find(c => c.id === task.relatedClient) : null;
    const done = task.status === 'done';
    const priCls = `priority-${task.priority}`;
    return `<div class="task-item">
      <div class="task-check${done ? ' done' : ''}" onclick="toggleTask('${task.id}','${task.status}')">${done ? '✓' : ''}</div>
      <div class="task-body">
        <div class="task-title${done ? ' done' : ''}">${esc(task.title)}</div>
        <div class="task-meta">
          <span class="${priCls}">${CRMService.priorityLabel(task.priority, _lang)}</span>
          ${assignee ? `<span>👤 ${esc(assignee.name)}</span>` : ''}
          ${cl ? `<span>👥 ${esc(cl.name)}</span>` : ''}
          ${task.dueDate ? `<span>📅 ${task.dueDate}</span>` : ''}
        </div>
      </div>
      <div style="display:flex;gap:6px;flex-shrink:0">
        <button class="btn btn-ghost btn-sm btn-icon" onclick="openTaskForm('${task.id}')">✏️</button>
        <button class="btn btn-ghost btn-sm btn-icon" onclick="confirmDeleteTask('${task.id}')">🗑</button>
      </div>
    </div>`;
  }).join('') || UIService.emptyState('✅', t('noData'));

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <h2>${t('tasks')}</h2>
      <button class="btn btn-primary" onclick="openTaskForm()">+ ${t('addTask')}</button>
    </div>
    <div class="tabs">${tabs}</div>
    <div class="task-list">${items}</div>`;

  updateTaskBadge();
}

function openTaskForm(id) {
  const task = id ? StorageService.findById('tasks', id) : null;
  const users = AuthService.getAllUsers();
  const clients = CRMService.getClients({});
  const deals = CRMService.getDeals({});
  const priSel = UIService.buildSelect(CRMService.PRIORITIES.map(p => ({ value: p.value, label: p.label[_lang] })), task?.priority || 'medium', 'priority');
  const assignOpts = users.map(u => `<option value="${u.id}"${task && task.assignedTo === u.id ? ' selected' : (u.id === _user.id && !task ? ' selected' : '')}>${esc(u.name)}</option>`).join('');
  const clOpts = `<option value="">—</option>` + clients.map(c => `<option value="${c.id}"${task && task.relatedClient === c.id ? ' selected' : ''}>${esc(c.name)}</option>`).join('');
  const dealOpts = `<option value="">—</option>` + deals.map(d => `<option value="${d.id}"${task && task.relatedDeal === d.id ? ' selected' : ''}>${esc(d.title)}</option>`).join('');

  UIService.openModal(task ? t('editTask') : t('addTask'), `
    <form id="taskForm">
      <div class="form-group"><label>${t('title')} *</label><input class="form-control" name="title" value="${esc(task?.title || '')}" required maxlength="200"></div>
      <div class="form-group"><label>${t('description')}</label><textarea class="form-control" name="description" rows="2">${esc(task?.description || '')}</textarea></div>
      <div class="form-row">
        <div class="form-group"><label>${t('priority')}</label>${priSel}</div>
        <div class="form-group"><label>${t('dueDate')}</label><input class="form-control" type="date" name="dueDate" value="${task?.dueDate || ''}"></div>
      </div>
      <div class="form-group"><label>${t('assignTo')}</label><select class="form-control" name="assignedTo">${assignOpts}</select></div>
      <div class="form-row">
        <div class="form-group"><label>${t('client')}</label><select class="form-control" name="relatedClient">${clOpts}</select></div>
        <div class="form-group"><label>${t('deal')}</label><select class="form-control" name="relatedDeal">${dealOpts}</select></div>
      </div>
    </form>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="submitTaskForm('${id || ''}')">${t('save')}</button>`
  );
}

function submitTaskForm(id) {
  const data = UIService.collectForm('#taskForm');
  data.createdBy = _user.id;
  const res = id ? CRMService.updateTask(id, data) : CRMService.addTask(data);
  if (!res.ok) { UIService.toast(res.error, 'error'); return; }
  UIService.closeModal();
  UIService.toast(id ? 'Задача обновлена' : 'Задача добавлена', 'success');
  renderTasks();
}

function toggleTask(id, currentStatus) {
  const nextStatus = currentStatus === 'done' ? 'todo' : 'done';
  CRMService.updateTask(id, { status: nextStatus });
  renderTasks();
}

async function confirmDeleteTask(id) {
  const ok = await UIService.confirm(t('confirmDelete'));
  if (!ok) return;
  CRMService.deleteTask(id);
  UIService.toast('Задача удалена', 'success');
  renderTasks();
}

/* ══ EMPLOYEES ══ */
function renderEmployees(search = '') {
  const users = AuthService.getAllUsers().filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );
  const roleMap = { superadmin: t('superadmin'), head: t('head'), manager: t('manager') };
  const roleBadge = { superadmin: 'badge-purple', head: 'badge-blue', manager: 'badge-gray' };

  const rows = users.map(u => `<tr>
    <td><div style="display:flex;align-items:center;gap:9px">
      <div class="sb-avatar" style="width:30px;height:30px;font-size:12px">${u.name.charAt(0).toUpperCase()}</div>
      <div><div style="font-weight:600">${esc(u.name)}</div><div style="font-size:11px;color:var(--muted)">${esc(u.email)}</div></div>
    </div></td>
    <td><span class="badge ${roleBadge[u.role] || 'badge-gray'}">${roleMap[u.role] || u.role}</span></td>
    <td>${CRMService.deptLabel(u.dept, _lang)}</td>
    <td>${CRMService.companyLabel(u.company)}</td>
    <td>${CRMService.formatDate(u.createdAt)}</td>
    <td><div class="td-actions">
      ${AuthService.canAdmin() ? `<button class="btn btn-ghost btn-sm btn-icon" onclick="openEmployeeForm('${u.id}')">✏️</button>` : ''}
      ${AuthService.isSuperadmin() && u.id !== _user.id ? `<button class="btn btn-ghost btn-sm btn-icon" onclick="confirmDeleteEmployee('${u.id}')">🗑</button>` : ''}
    </div></td>
  </tr>`).join('') || `<tr><td colspan="6" class="table-empty">${t('noData')}</td></tr>`;

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <h2>${t('employees')}</h2>
      ${AuthService.canAdmin() ? `<button class="btn btn-primary" onclick="openEmployeeForm()">+ ${t('addEmployee')}</button>` : ''}
    </div>
    <div class="table-wrap">
      <div class="table-toolbar">
        <input class="search-input" placeholder="${t('search')}" value="${esc(search)}" oninput="renderEmployees(this.value)">
        <span style="margin-left:auto;font-size:12px;color:var(--muted)">${users.length} чел.</span>
      </div>
      <table><thead><tr><th>${t('name')}</th><th>${t('role')}</th><th>${t('department')}</th><th>${t('company')}</th><th>Дата</th><th></th></tr></thead>
      <tbody>${rows}</tbody></table>
    </div>`;
}

function openEmployeeForm(id) {
  const u = id ? AuthService.getAllUsers().find(x => x.id === id) : null;
  const roles = [
    { value: 'manager', label: t('manager') },
    { value: 'head', label: t('head') },
    ...(AuthService.isSuperadmin() ? [{ value: 'superadmin', label: t('superadmin') }] : [])
  ];
  const roleSel = UIService.buildSelect(roles, u?.role || 'manager', 'role');
  const deptSel = UIService.buildSelect(CRMService.DEPARTMENTS.map(d => ({ value: d.value, label: d.label[_lang] })), u?.dept || 'sales', 'dept');
  const coSel = UIService.buildSelect(CRMService.COMPANIES, u?.company || 'changan', 'company');

  UIService.openModal(u ? t('editEmployee') : t('addEmployee'), `
    <form id="empForm">
      <div class="form-group"><label>${t('name')} *</label><input class="form-control" name="name" value="${esc(u?.name || '')}" required maxlength="80"></div>
      <div class="form-group"><label>${t('email')} *</label><input class="form-control" type="email" name="email" value="${esc(u?.email || '')}" required ${u ? 'disabled' : ''}></div>
      ${!u ? `<div class="form-group"><label>${t('password')} * (min 6)</label><input class="form-control" type="password" name="password" required minlength="6"></div>` : `<div class="form-group"><label>${t('newPassword')}</label><input class="form-control" type="password" name="password" minlength="6" placeholder="••••••"></div>`}
      <div class="form-row">
        <div class="form-group"><label>${t('role')}</label>${roleSel}</div>
        <div class="form-group"><label>${t('department')}</label>${deptSel}</div>
      </div>
      <div class="form-group"><label>${t('company')}</label>${coSel}</div>
    </form>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="submitEmployeeForm('${id || ''}')">${t('save')}</button>`
  );
}

function submitEmployeeForm(id) {
  const data = UIService.collectForm('#empForm');
  if (!data.password) delete data.password;
  if (id) {
    AuthService.updateUser(id, data);
    UIService.toast('Сотрудник обновлён', 'success');
  } else {
    const res = AuthService.register(data);
    if (!res.ok) { UIService.toast(res.error, 'error'); return; }
    UIService.toast('Сотрудник добавлен', 'success');
  }
  UIService.closeModal();
  renderEmployees();
}

async function confirmDeleteEmployee(id) {
  const ok = await UIService.confirm(t('confirmDelete'));
  if (!ok) return;
  AuthService.deleteUser(id);
  UIService.toast('Сотрудник удалён', 'success');
  renderEmployees();
}

/* ══ DOCUMENTS ══ */
function renderDocuments(search = '') {
  const docs = CRMService.getDocuments({ search });
  const clients = CRMService.getClients({});
  const typeLabels = { contract: t('docContract'), invoice: t('docInvoice'), act: t('docAct'), other: t('docOther') };
  const typeBadge = { contract: 'badge-blue', invoice: 'badge-yellow', act: 'badge-green', other: 'badge-gray' };

  const rows = docs.map(d => {
    const cl = d.clientId ? clients.find(c => c.id === d.clientId) : null;
    return `<tr>
      <td><strong>${esc(d.title)}</strong></td>
      <td><span class="badge ${typeBadge[d.type] || 'badge-gray'}">${typeLabels[d.type] || d.type}</span></td>
      <td>${cl ? esc(cl.name) : '—'}</td>
      <td>${CRMService.formatDate(d.createdAt)}</td>
      <td><div class="td-actions">
        <button class="btn btn-ghost btn-sm btn-icon" onclick="openDocDetail('${d.id}')">👁</button>
        <button class="btn btn-ghost btn-sm btn-icon" onclick="confirmDeleteDoc('${d.id}')">🗑</button>
      </div></td>
    </tr>`;
  }).join('') || `<tr><td colspan="5" class="table-empty">${t('noData')}</td></tr>`;

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <h2>${t('documents')}</h2>
      <button class="btn btn-primary" onclick="openDocForm()">+ ${t('addDocument')}</button>
    </div>
    <div class="table-wrap">
      <div class="table-toolbar">
        <input class="search-input" placeholder="${t('search')}" value="${esc(search)}" oninput="renderDocuments(this.value)">
      </div>
      <table><thead><tr><th>${t('title')}</th><th>${t('type')}</th><th>${t('client')}</th><th>Дата</th><th></th></tr></thead>
      <tbody>${rows}</tbody></table>
    </div>`;
}

function openDocForm() {
  const clients = CRMService.getClients({});
  const deals = CRMService.getDeals({});
  const types = [{ value: 'contract', label: t('docContract') }, { value: 'invoice', label: t('docInvoice') }, { value: 'act', label: t('docAct') }, { value: 'other', label: t('docOther') }];
  const clOpts = `<option value="">—</option>` + clients.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
  const dealOpts = `<option value="">—</option>` + deals.map(d => `<option value="${d.id}">${esc(d.title)}</option>`).join('');

  UIService.openModal(t('addDocument'), `
    <form id="docForm">
      <div class="form-group"><label>${t('title')} *</label><input class="form-control" name="title" required maxlength="200"></div>
      <div class="form-row">
        <div class="form-group"><label>${t('type')}</label>${UIService.buildSelect(types, 'contract', 'type')}</div>
        <div class="form-group"><label>${t('client')}</label><select class="form-control" name="clientId">${clOpts}</select></div>
      </div>
      <div class="form-group"><label>${t('deal')}</label><select class="form-control" name="dealId">${dealOpts}</select></div>
      <div class="form-group"><label>${t('docContent')}</label><textarea class="form-control" name="content" rows="4"></textarea></div>
    </form>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="submitDocForm()">${t('save')}</button>`
  );
}

function submitDocForm() {
  const data = UIService.collectForm('#docForm');
  data.createdBy = _user.id;
  const res = CRMService.addDocument(data);
  if (!res.ok) { UIService.toast(res.error, 'error'); return; }
  UIService.closeModal();
  UIService.toast('Документ добавлен', 'success');
  renderDocuments();
}

function openDocDetail(id) {
  const d = StorageService.findById('documents', id);
  if (!d) return;
  UIService.openModal(d.title, `
    <div class="detail-row"><span class="detail-label">${t('type')}</span><span class="detail-value">${d.type}</span></div>
    <div class="detail-row"><span class="detail-label">${t('docContent')}</span><span class="detail-value" style="white-space:pre-wrap">${esc(d.content || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">Дата</span><span class="detail-value">${CRMService.formatDate(d.createdAt)}</span></div>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>`
  );
}

async function confirmDeleteDoc(id) {
  const ok = await UIService.confirm(t('confirmDelete'));
  if (!ok) return;
  CRMService.deleteDocument(id);
  UIService.toast('Документ удалён', 'success');
  renderDocuments();
}

/* ══ REPORTS ══ */
function renderReports() {
  const s = CRMService.getStats();
  const winRate = s.deals > 0 ? Math.round((s.wonDeals / s.deals) * 100) : 0;

  const stageRows = CRMService.DEAL_STAGES.map(st => {
    const count = s.dealsByStage[st.value] || 0;
    const max = Math.max(...Object.values(s.dealsByStage), 1);
    return `<div class="chart-bar-row">
      <span class="chart-bar-label">${st.label[_lang]}</span>
      <div class="chart-bar-bg"><div class="chart-bar-fill" style="width:${Math.round((count/max)*100)}%"></div></div>
      <span class="chart-bar-val">${count}</span>
    </div>`;
  }).join('');

  const brandRows = CRMService.COMPANIES.map(co => {
    const count = s.clientsByCompany[co.value] || 0;
    const max = Math.max(...Object.values(s.clientsByCompany), 1);
    return `<div class="chart-bar-row">
      <span class="chart-bar-label">${co.label}</span>
      <div class="chart-bar-bg"><div class="chart-bar-fill" style="width:${Math.round((count/max)*100)}%"></div></div>
      <span class="chart-bar-val">${count}</span>
    </div>`;
  }).join('');

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header"><h2>${t('reports')}</h2></div>
    <div class="stats-grid">
      <div class="stat-card stat-blue"><div class="stat-icon">👥</div><div class="stat-value">${s.clients}</div><div class="stat-label">${t('totalClients')}</div></div>
      <div class="stat-card stat-yellow"><div class="stat-icon">💼</div><div class="stat-value">${s.deals}</div><div class="stat-label">${t('totalDeals')}</div></div>
      <div class="stat-card stat-green"><div class="stat-icon">🏆</div><div class="stat-value">${s.wonDeals}</div><div class="stat-label">${t('won')}</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#f0fdf4">📊</div><div class="stat-value">${winRate}%</div><div class="stat-label">${t('winRate')}</div></div>
      <div class="stat-card stat-green"><div class="stat-icon">💰</div><div class="stat-value" style="font-size:18px">${CRMService.formatMoney(s.revenue)}</div><div class="stat-label">${t('revenue')}</div></div>
      <div class="stat-card stat-purple"><div class="stat-icon">✅</div><div class="stat-value">${s.pendingTasks}</div><div class="stat-label">${t('pendingTasks')}</div></div>
    </div>
    <div class="dash-grid">
      <div class="section-card"><div class="section-title">${t('dealsByStage')}</div><div class="chart-bar-wrap">${stageRows}</div></div>
      <div class="section-card"><div class="section-title">${t('clientsByBrand')}</div><div class="chart-bar-wrap">${brandRows}</div></div>
    </div>`;
}

/* ══ ADMIN ══ */
function renderAdmin() {
  if (!AuthService.isSuperadmin()) {
    document.getElementById('pageContent').innerHTML = UIService.emptyState('🔒', t('adminAccessDenied'));
    return;
  }
  const users = AuthService.getAllUsers();
  const stats = CRMService.getStats();
  const roleMap = { superadmin: t('superadmin'), head: t('head'), manager: t('manager') };

  const userRows = users.map(u => `
    <tr>
      <td>${esc(u.name)}</td>
      <td>${esc(u.email)}</td>
      <td>${roleMap[u.role] || u.role}</td>
      <td>${esc(u.dept || '—')}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="adminChangePassword('${u.id}','${esc(u.name)}')">🔑 ${t('adminChangePass')}</button>
      </td>
    </tr>`).join('');

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header"><h2>${t('admin')}</h2></div>
    <div class="section-card" style="margin-bottom:16px">
      <div class="section-title">${t('adminSysInfo')}</div>
      <div class="detail-row"><span class="detail-label">${t('adminUsers')}</span><span class="detail-value">${users.length}</span></div>
      <div class="detail-row"><span class="detail-label">${t('adminClients')}</span><span class="detail-value">${stats.clients}</span></div>
      <div class="detail-row"><span class="detail-label">${t('adminDeals')}</span><span class="detail-value">${stats.deals}</span></div>
      <div class="detail-row"><span class="detail-label">${t('adminPendingTasks')}</span><span class="detail-value">${stats.pendingTasks}</span></div>
    </div>
    <div class="section-card" style="margin-bottom:16px">
      <div class="section-title">${t('adminUserList')}</div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>${t('name')}</th><th>${t('email')}</th><th>${t('role')}</th><th>${t('department')}</th><th></th></tr></thead>
          <tbody>${userRows}</tbody>
        </table>
      </div>
    </div>
    <div class="section-card" style="margin-bottom:16px">
      <div class="section-title">${t('adminDataMgmt')}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-ghost" onclick="exportData()">📤 ${t('adminExport')}</button>
        <button class="btn btn-ghost" onclick="importDataClick()">📥 ${t('adminImport')}</button>
        <button class="btn btn-danger" onclick="confirmClearData()">🗑 ${t('adminClear')}</button>
      </div>
      <input type="file" id="importFile" accept=".json" style="display:none" onchange="importData(event)">
    </div>`;
}

function adminChangePassword(userId, userName) {
  const html = `
    <div class="form-group">
      <label>${t('adminNewPass')} — ${esc(userName)}</label>
      <input class="form-control" type="password" id="adminNewPassInput" minlength="6" placeholder="${t('adminPassMin')}">
    </div>`;
  UIService.openModal(
    t('adminChangePass'),
    html,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="submitAdminChangePassword('${userId}')">${t('save')}</button>`
  );
}

function submitAdminChangePassword(userId) {
  const val = document.getElementById('adminNewPassInput').value;
  if (val.length < 6) { UIService.toast(t('adminPassMin'), 'error'); return; }
  AuthService.updateUser(userId, { password: val });
  UIService.closeModal();
  UIService.toast(t('adminPassSaved'), 'success');
}

function exportData() {
  const data = { clients: StorageService.getList('clients'), deals: StorageService.getList('deals'), tasks: StorageService.getList('tasks'), documents: StorageService.getList('documents'), exported: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `srcrm_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  UIService.toast('Данные экспортированы', 'success');
}

function importDataClick() { document.getElementById('importFile').click(); }

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.clients) StorageService.setList('clients', data.clients);
      if (data.deals) StorageService.setList('deals', data.deals);
      if (data.tasks) StorageService.setList('tasks', data.tasks);
      if (data.documents) StorageService.setList('documents', data.documents);
      UIService.toast('Данные импортированы', 'success');
      navigate('dashboard');
    } catch { UIService.toast('Ошибка чтения файла', 'error'); }
  };
  reader.readAsText(file);
}

async function confirmClearData() {
  const ok = await UIService.confirm(t('adminClearConfirm'), t('adminClear'));
  if (!ok) return;
  ['clients', 'deals', 'tasks', 'documents'].forEach(k => StorageService.setList(k, []));
  UIService.toast('Данные очищены', 'success');
  navigate('dashboard');
}

/* ══ UTILS ══ */
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

window.renderCurrentPageFromLiveUpdate = function(){ if (_user) navigate(_page); };
