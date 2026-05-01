'use strict';

/* ══ STATE ══ */
let _lang = localStorage.getItem('srcrm_lang') || 'az';
let _user = null;
let _page = 'dashboard';

/* ══ THEME ══ */
function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.textContent = dark ? '☀️' : '🌙';
}
function toggleTheme() {
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
    visits:'Посещения шоурума', sales:'Продажи', calls:'Звонки',
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
    adminUserList:'Пользователи системы', adminChangePass:'Сменить пароль',
    adminNewPass:'Новый пароль', adminPassSaved:'Пароль изменён', adminPassMin:'Минимум 6 символов',
    adminAccessDenied:'Доступ запрещён',
    addVisit:'Добавить посещение', editVisit:'Редактировать посещение',
    addSale:'Добавить продажу', editSale:'Редактировать продажу',
    addCall:'Добавить звонок', editCall:'Редактировать звонок',
    visitDate:'Дата визита', saleDate:'Дата продажи', callDate:'Дата звонка',
    brand:'Бренд', interestedModel:'Интересующая модель',
    satisfied:'Удовлетворён?', yes:'Да', no:'Нет',
    complaint:'Жалоба / Шикайят',
    purchasedModel:'Купленная модель', salePrice:'Цена продажи (AZN)',
    paymentType:'Тип оплаты', cash:'Наличные', credit:'Кредит',
    downPayment:'Первоначальный взнос (AZN)', creditMonths:'Срок кредита (мес.)',
    interestedPrice:'Интересующая цена (AZN)',
    callerPhone:'Номер звонящего', callSource:'Источник обращения',
    callPurpose:'Цель звонка',
    purposeComplaint:'Жалоба', purposeInterest:'Интерес', purposeOffer:'Предложение', purposeInfo:'Информация',
    export:'Экспорт CSV', dateFrom:'Дата от', dateTo:'Дата до',
    receptionLabel:'Ресепшнист', salespersonLabel:'Продавец', specialistLabel:'Специалист',
    totalVisits:'Посещения', totalSales:'Продажи', totalCalls:'Звонки',
    salesRevenue:'Доход от продаж'
  },
  az: {
    dashboard:'İdarə paneli', clients:'Müştərilər', deals:'Sövdələşmələr', tasks:'Tapşırıqlar',
    employees:'İşçilər', documents:'Sənədlər', reports:'Hesabatlar', admin:'Administrasiya',
    visits:'Şoroom Ziyarətləri', sales:'Satış', calls:'Zənglər',
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
    adminUserList:'Sistem istifadəçiləri', adminChangePass:'Şifrəni dəyiş',
    adminNewPass:'Yeni şifrə', adminPassSaved:'Şifrə dəyişdirildi', adminPassMin:'Minimum 6 simvol',
    adminAccessDenied:'Giriş qadağandır',
    addVisit:'Ziyarət əlavə et', editVisit:'Ziyarəti redaktə et',
    addSale:'Satış əlavə et', editSale:'Satışı redaktə et',
    addCall:'Zəng əlavə et', editCall:'Zəngi redaktə et',
    visitDate:'Ziyarət tarixi', saleDate:'Satış tarixi', callDate:'Zəng tarixi',
    brand:'Brend', interestedModel:'Maraqlandığı model',
    satisfied:'Razı qaldı?', yes:'Bəli', no:'Xeyr',
    complaint:'Şikayət',
    purchasedModel:'Aldığı model', salePrice:'Satış qiyməti (AZN)',
    paymentType:'Ödəniş növü', cash:'Nağd', credit:'Kredit',
    downPayment:'İlkin ödəniş (AZN)', creditMonths:'Kredit müddəti (ay)',
    interestedPrice:'Maraqlandığı qiymət (AZN)',
    callerPhone:'Zəng edənin nömrəsi', callSource:'Müraciət mənbəyi',
    callPurpose:'Zəngin məqsədi',
    purposeComplaint:'Şikayət', purposeInterest:'Maraq', purposeOffer:'Təklif', purposeInfo:'Məlumat',
    export:'CSV İxrac', dateFrom:'Tarixdən', dateTo:'Tarixə qədər',
    receptionLabel:'Resepsiyaçı', salespersonLabel:'Satıcı', specialistLabel:'Mütəxəssis',
    totalVisits:'Ziyarətlər', totalSales:'Satışlar', totalCalls:'Zənglər',
    salesRevenue:'Satış gəliri'
  }
};

function t(key) { return (T[_lang] || T.az)[key] || key; }

/* ══ ROLE NAV RULES ══ */
const NAV_RULES = {
  reception:             ['dashboard', 'visits'],
  salesperson:           ['dashboard', 'sales'],
  sales_director:        ['dashboard', 'visits', 'sales', 'employees', 'reports'],
  callcenter_specialist: ['dashboard', 'calls'],
  callcenter_manager:    ['dashboard', 'calls', 'employees'],
  admin:                 ['dashboard', 'visits', 'sales', 'calls', 'clients', 'deals', 'tasks', 'employees', 'documents', 'reports'],
  superadmin:            ['dashboard', 'visits', 'sales', 'calls', 'clients', 'deals', 'tasks', 'employees', 'documents', 'reports', 'admin']
};

const ALL_NAV_PAGES = ['dashboard', 'visits', 'sales', 'calls', 'clients', 'deals', 'tasks', 'employees', 'documents', 'reports', 'admin'];

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
  const role = _user.role;
  const allowed = NAV_RULES[role] || ['dashboard'];
  navigate(allowed[0] || 'dashboard');
}

function updateSidebar() {
  if (!_user) return;
  document.getElementById('sbAvatar').textContent = _user.name.charAt(0).toUpperCase();
  document.getElementById('sbName').textContent = _user.name;
  document.getElementById('sbRole').textContent = AuthService.roleLabel(_user.role, _lang);

  const allowed = NAV_RULES[_user.role] || ['dashboard'];
  ALL_NAV_PAGES.forEach(page => {
    const el = document.getElementById('nav_' + page);
    if (el) el.classList.toggle('hidden', !allowed.includes(page));
  });

  updateTaskBadge();
}

function updateTaskBadge() {
  if (!_user) return;
  const count = CRMService.countPendingTasks(_user.id);
  const badge = document.getElementById('taskBadge');
  if (badge) {
    if (count > 0) { badge.textContent = count; badge.classList.remove('hidden'); }
    else badge.classList.add('hidden');
  }
}

/* ══ AUTH ACTIONS ══ */
function doLogin(e) {
  e.preventDefault();
  const email = document.getElementById('liEmail').value.trim();
  const pass = document.getElementById('liPass').value;
  const res = AuthService.login(email, pass);
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
  const allowed = NAV_RULES[_user?.role] || ['dashboard'];
  if (!allowed.includes(page)) page = allowed[0] || 'dashboard';

  _page = page;
  document.querySelectorAll('.nav-item[data-page]').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  document.getElementById('pageTitle').textContent = t(page);
  const content = document.getElementById('pageContent');
  content.innerHTML = `<p style="color:var(--muted);padding:40px;text-align:center">${t('loading')}</p>`;
  document.getElementById('sidebar').classList.remove('open');

  const pages = {
    dashboard: renderDashboard,
    visits: renderVisits,
    sales: renderSales,
    calls: renderCalls,
    clients: renderClients,
    deals: renderDeals,
    tasks: renderTasks,
    employees: renderEmployees,
    documents: renderDocuments,
    reports: renderReports,
    admin: renderAdmin
  };
  if (pages[page]) pages[page]();
}

/* ══ DASHBOARD ══ */
function renderDashboard() {
  const s = CRMService.getStats();
  const role = _user.role;

  let statsHTML = '';
  if (['admin', 'superadmin'].includes(role)) {
    statsHTML = `
      <div class="stat-card stat-blue"><div class="stat-icon">🚗</div><div class="stat-value">${s.visits}</div><div class="stat-label">${t('totalVisits')}</div></div>
      <div class="stat-card stat-green"><div class="stat-icon">💰</div><div class="stat-value">${s.sales}</div><div class="stat-label">${t('totalSales')}</div></div>
      <div class="stat-card stat-yellow"><div class="stat-icon">📞</div><div class="stat-value">${s.calls}</div><div class="stat-label">${t('totalCalls')}</div></div>
      <div class="stat-card stat-purple"><div class="stat-icon">💵</div><div class="stat-value" style="font-size:16px">${CRMService.formatMoney(s.salesRevenue)}</div><div class="stat-label">${t('salesRevenue')}</div></div>`;
  } else if (role === 'sales_director') {
    const myVisits = CRMService.getVisits({});
    const mySales = CRMService.getSales({});
    const myRevenue = mySales.reduce((a, s) => a + (s.salePrice || 0), 0);
    statsHTML = `
      <div class="stat-card stat-blue"><div class="stat-icon">🚗</div><div class="stat-value">${myVisits.length}</div><div class="stat-label">${t('totalVisits')}</div></div>
      <div class="stat-card stat-green"><div class="stat-icon">💰</div><div class="stat-value">${mySales.length}</div><div class="stat-label">${t('totalSales')}</div></div>
      <div class="stat-card stat-purple"><div class="stat-icon">💵</div><div class="stat-value" style="font-size:16px">${CRMService.formatMoney(myRevenue)}</div><div class="stat-label">${t('salesRevenue')}</div></div>`;
  } else if (role === 'reception') {
    const myVisits = CRMService.getVisits({});
    const todayStr = new Date().toISOString().split('T')[0];
    const todayVisits = myVisits.filter(v => v.visitDate === todayStr);
    statsHTML = `
      <div class="stat-card stat-blue"><div class="stat-icon">🚗</div><div class="stat-value">${myVisits.length}</div><div class="stat-label">${t('totalVisits')}</div></div>
      <div class="stat-card stat-green"><div class="stat-icon">📅</div><div class="stat-value">${todayVisits.length}</div><div class="stat-label">Bu gün / Сегодня</div></div>`;
  } else if (role === 'salesperson') {
    const mySales = CRMService.getSales({ salespersonId: _user.id });
    const myRevenue = mySales.reduce((a, s) => a + (s.salePrice || 0), 0);
    statsHTML = `
      <div class="stat-card stat-blue"><div class="stat-icon">💰</div><div class="stat-value">${mySales.length}</div><div class="stat-label">${t('totalSales')}</div></div>
      <div class="stat-card stat-green"><div class="stat-icon">💵</div><div class="stat-value" style="font-size:16px">${CRMService.formatMoney(myRevenue)}</div><div class="stat-label">${t('salesRevenue')}</div></div>`;
  } else if (role === 'callcenter_specialist') {
    const myCalls = CRMService.getCalls({ specialistId: _user.id });
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCalls = myCalls.filter(c => c.callDate === todayStr);
    statsHTML = `
      <div class="stat-card stat-blue"><div class="stat-icon">📞</div><div class="stat-value">${myCalls.length}</div><div class="stat-label">${t('totalCalls')}</div></div>
      <div class="stat-card stat-green"><div class="stat-icon">📅</div><div class="stat-value">${todayCalls.length}</div><div class="stat-label">Bu gün / Сегодня</div></div>`;
  } else if (role === 'callcenter_manager') {
    const allCalls = CRMService.getCalls({});
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCalls = allCalls.filter(c => c.callDate === todayStr);
    statsHTML = `
      <div class="stat-card stat-blue"><div class="stat-icon">📞</div><div class="stat-value">${allCalls.length}</div><div class="stat-label">${t('totalCalls')}</div></div>
      <div class="stat-card stat-green"><div class="stat-icon">📅</div><div class="stat-value">${todayCalls.length}</div><div class="stat-label">Bu gün / Сегодня</div></div>`;
  }

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

  document.getElementById('pageContent').innerHTML = `
    <div class="stats-grid">${statsHTML}</div>
    ${['admin', 'superadmin', 'sales_director'].includes(role) ? `
    <div class="dash-grid" style="margin-top:16px">
      <div class="section-card">
        <div class="section-title">${t('clientsByBrand')}</div>
        <div class="chart-bar-wrap">${brandRows}</div>
      </div>
    </div>` : ''}`;
}

/* ══ VISITS (Reception) ══ */
function renderVisits(search = '', dateFrom = '', dateTo = '', brand = '') {
  const role = _user.role;
  const filter = { search, brand };
  if (dateFrom) filter.dateFrom = dateFrom;
  if (dateTo) filter.dateTo = dateTo;

  const visits = CRMService.getVisits(filter);
  const canAdd = ['reception', 'admin', 'superadmin'].includes(role);
  const canEdit = ['reception', 'admin', 'superadmin'].includes(role);

  const brandOpts = `<option value="">${t('all')}</option>` + CRMService.COMPANIES.map(c =>
    `<option value="${c.value}"${c.value === brand ? ' selected' : ''}>${c.label}</option>`).join('');

  const rows = visits.length ? visits.map(v => {
    const satBadge = v.satisfied === 'yes'
      ? `<span class="badge badge-green">${t('yes')}</span>`
      : `<span class="badge badge-red">${t('no')}</span>`;
    return `<tr>
      <td><strong>${esc(v.clientName)}</strong></td>
      <td>${esc(v.phone || '—')}</td>
      <td>${v.visitDate || '—'}</td>
      <td>${CRMService.companyLabel(v.brand) || '—'}</td>
      <td>${esc(v.interestedModel || '—')}</td>
      <td>${satBadge}</td>
      <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(v.complaint || '—')}</td>
      <td>${esc(v.receptionName || '—')}</td>
      <td><div class="td-actions">
        <button class="btn btn-ghost btn-sm btn-icon" onclick="openVisitDetail('${v.id}')">👁</button>
        ${canEdit ? `<button class="btn btn-ghost btn-sm btn-icon" onclick="openVisitForm('${v.id}')">✏️</button>
        <button class="btn btn-ghost btn-sm btn-icon" onclick="confirmDeleteVisit('${v.id}')">🗑</button>` : ''}
      </div></td>
    </tr>`;
  }).join('') : `<tr><td colspan="9" class="table-empty">${t('noData')}</td></tr>`;

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <h2>${t('visits')}</h2>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost" onclick="exportVisitsCSV()">📤 ${t('export')}</button>
        ${canAdd ? `<button class="btn btn-primary" onclick="openVisitForm()">+ ${t('addVisit')}</button>` : ''}
      </div>
    </div>
    <div class="table-wrap">
      <div class="table-toolbar" style="flex-wrap:wrap;gap:8px">
        <input class="search-input" id="vSearch" placeholder="${t('search')}" value="${esc(search)}"
          oninput="renderVisits(this.value, document.getElementById('vDateFrom').value, document.getElementById('vDateTo').value, document.getElementById('vBrand').value)">
        <select class="filter-select" id="vBrand" onchange="renderVisits(document.getElementById('vSearch').value, document.getElementById('vDateFrom').value, document.getElementById('vDateTo').value, this.value)">${brandOpts}</select>
        <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted)">
          ${t('dateFrom')}: <input type="date" class="form-control" id="vDateFrom" style="width:140px;padding:5px 8px" value="${dateFrom}"
            onchange="renderVisits(document.getElementById('vSearch').value, this.value, document.getElementById('vDateTo').value, document.getElementById('vBrand').value)">
          ${t('dateTo')}: <input type="date" class="form-control" id="vDateTo" style="width:140px;padding:5px 8px" value="${dateTo}"
            onchange="renderVisits(document.getElementById('vSearch').value, document.getElementById('vDateFrom').value, this.value, document.getElementById('vBrand').value)">
        </div>
        <span style="margin-left:auto;font-size:12px;color:var(--muted)">${visits.length} qeyd</span>
      </div>
      <table><thead><tr>
        <th>${t('name')}</th><th>${t('phone')}</th><th>${t('visitDate')}</th><th>${t('brand')}</th>
        <th>${t('interestedModel')}</th><th>${t('satisfied')}</th><th>${t('complaint')}</th>
        <th>${t('receptionLabel')}</th><th></th>
      </tr></thead>
      <tbody>${rows}</tbody></table>
    </div>`;
}

function openVisitForm(id) {
  const visit = id ? CRMService.getVisit(id) : null;
  const brandSel = UIService.buildSelect(CRMService.COMPANIES, visit?.brand || '', 'brand');
  const satOpts = [
    { value: 'yes', label: t('yes') },
    { value: 'no',  label: t('no') }
  ];
  const satSel = UIService.buildSelect(satOpts, visit?.satisfied || 'yes', 'satisfied');
  const today = new Date().toISOString().split('T')[0];

  UIService.openModal(visit ? t('editVisit') : t('addVisit'), `
    <form id="visitForm">
      <div class="form-row">
        <div class="form-group"><label>${t('name')} *</label><input class="form-control" name="clientName" value="${esc(visit?.clientName || '')}" required maxlength="100"></div>
        <div class="form-group"><label>${t('phone')}</label><input class="form-control" name="phone" value="${esc(visit?.phone || '')}" placeholder="+994"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>${t('visitDate')}</label><input class="form-control" type="date" name="visitDate" value="${visit?.visitDate || today}"></div>
        <div class="form-group"><label>${t('brand')}</label>${brandSel}</div>
      </div>
      <div class="form-group"><label>${t('interestedModel')}</label><input class="form-control" name="interestedModel" value="${esc(visit?.interestedModel || '')}" maxlength="100" placeholder="Məs: Changan CS75 Plus"></div>
      <div class="form-group"><label>${t('satisfied')}</label>${satSel}</div>
      <div class="form-group"><label>${t('complaint')}</label><textarea class="form-control" name="complaint" rows="2">${esc(visit?.complaint || '')}</textarea></div>
      <div class="form-group"><label>${t('notes')}</label><textarea class="form-control" name="notes" rows="2">${esc(visit?.notes || '')}</textarea></div>
    </form>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="submitVisitForm('${id || ''}')">${t('save')}</button>`
  );
}

function submitVisitForm(id) {
  const data = UIService.collectForm('#visitForm');
  data.receptionId = _user.id;
  data.receptionName = _user.name;
  const res = id ? CRMService.updateVisit(id, data) : CRMService.addVisit(data);
  if (!res.ok) { UIService.toast(res.error, 'error'); return; }
  UIService.closeModal();
  UIService.toast(id ? 'Ziyarət yeniləndi' : 'Ziyarət əlavə edildi', 'success');
  renderVisits();
}

function openVisitDetail(id) {
  const v = CRMService.getVisit(id);
  if (!v) return;
  const satBadge = v.satisfied === 'yes'
    ? `<span class="badge badge-green">${t('yes')}</span>`
    : `<span class="badge badge-red">${t('no')}</span>`;
  UIService.openModal(esc(v.clientName), `
    <div class="detail-row"><span class="detail-label">${t('phone')}</span><span class="detail-value">${esc(v.phone || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">${t('visitDate')}</span><span class="detail-value">${v.visitDate || '—'}</span></div>
    <div class="detail-row"><span class="detail-label">${t('brand')}</span><span class="detail-value">${CRMService.companyLabel(v.brand) || '—'}</span></div>
    <div class="detail-row"><span class="detail-label">${t('interestedModel')}</span><span class="detail-value">${esc(v.interestedModel || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">${t('satisfied')}</span><span class="detail-value">${satBadge}</span></div>
    <div class="detail-row"><span class="detail-label">${t('complaint')}</span><span class="detail-value" style="white-space:pre-wrap">${esc(v.complaint || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">${t('notes')}</span><span class="detail-value" style="white-space:pre-wrap">${esc(v.notes || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">${t('receptionLabel')}</span><span class="detail-value">${esc(v.receptionName || '—')}</span></div>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="closeModal();openVisitForm('${id}')">✏️ ${t('edit')}</button>`
  );
}

async function confirmDeleteVisit(id) {
  const ok = await UIService.confirm(t('confirmDelete'));
  if (!ok) return;
  CRMService.deleteVisit(id);
  UIService.toast('Ziyarət silindi', 'success');
  renderVisits();
}

function exportVisitsCSV() {
  const visits = CRMService.getVisits({});
  const headers = ['Ad Soyad', 'Telefon', 'Tarix', 'Brend', 'Model', 'Razı?', 'Şikayət', 'Resepsiyaçı'];
  const rows = visits.map(v => [
    v.clientName, v.phone, v.visitDate,
    CRMService.companyLabel(v.brand), v.interestedModel,
    v.satisfied === 'yes' ? 'Bəli' : 'Xeyr',
    v.complaint, v.receptionName
  ].map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ziyaretler_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  UIService.toast('CSV ixrac edildi', 'success');
}

/* ══ SALES (Salesperson) ══ */
function renderSales(search = '', dateFrom = '', dateTo = '', brand = '') {
  const role = _user.role;
  const filter = { search, brand };
  if (dateFrom) filter.dateFrom = dateFrom;
  if (dateTo) filter.dateTo = dateTo;
  if (role === 'salesperson') filter.salespersonId = _user.id;

  const sales = CRMService.getSales(filter);
  const canAdd = ['salesperson', 'admin', 'superadmin'].includes(role);
  const canEdit = ['salesperson', 'admin', 'superadmin'].includes(role);
  const showPrices = ['salesperson', 'sales_director', 'admin', 'superadmin'].includes(role);

  const brandOpts = `<option value="">${t('all')}</option>` + CRMService.COMPANIES.map(c =>
    `<option value="${c.value}"${c.value === brand ? ' selected' : ''}>${c.label}</option>`).join('');

  const totalRevenue = sales.reduce((a, s) => a + (s.salePrice || 0), 0);

  const rows = sales.length ? sales.map(s => {
    const satBadge = s.satisfied === 'yes'
      ? `<span class="badge badge-green">${t('yes')}</span>`
      : `<span class="badge badge-red">${t('no')}</span>`;
    const pmtBadge = s.paymentType === 'cash'
      ? `<span class="badge badge-blue">${t('cash')}</span>`
      : `<span class="badge badge-yellow">${t('credit')}</span>`;
    return `<tr>
      <td><strong>${esc(s.clientName)}</strong></td>
      <td>${esc(s.phone || '—')}</td>
      <td>${s.saleDate || '—'}</td>
      <td>${CRMService.companyLabel(s.brand) || '—'}</td>
      <td>${esc(s.purchasedModel || esc(s.interestedModel) || '—')}</td>
      ${showPrices ? `<td>${s.salePrice ? CRMService.formatMoney(s.salePrice) : '—'}</td>
      <td>${pmtBadge}</td>
      ${s.paymentType === 'credit' ? `<td>${s.downPayment ? CRMService.formatMoney(s.downPayment) : '—'} / ${s.creditMonths ? s.creditMonths + ' ay' : '—'}</td>` : '<td>—</td>'}` : ''}
      <td>${satBadge}</td>
      <td>${esc(s.salespersonName || '—')}</td>
      <td><div class="td-actions">
        <button class="btn btn-ghost btn-sm btn-icon" onclick="openSaleDetail('${s.id}')">👁</button>
        ${canEdit ? `<button class="btn btn-ghost btn-sm btn-icon" onclick="openSaleForm('${s.id}')">✏️</button>
        <button class="btn btn-ghost btn-sm btn-icon" onclick="confirmDeleteSale('${s.id}')">🗑</button>` : ''}
      </div></td>
    </tr>`;
  }).join('') : `<tr><td colspan="${showPrices ? 11 : 8}" class="table-empty">${t('noData')}</td></tr>`;

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <h2>${t('sales')}</h2>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost" onclick="exportSalesCSV()">📤 ${t('export')}</button>
        ${canAdd ? `<button class="btn btn-primary" onclick="openSaleForm()">+ ${t('addSale')}</button>` : ''}
      </div>
    </div>
    ${showPrices && sales.length ? `<div class="stats-grid" style="margin-bottom:16px">
      <div class="stat-card stat-green"><div class="stat-icon">💰</div><div class="stat-value">${sales.length}</div><div class="stat-label">${t('totalSales')}</div></div>
      <div class="stat-card stat-purple"><div class="stat-icon">💵</div><div class="stat-value" style="font-size:16px">${CRMService.formatMoney(totalRevenue)}</div><div class="stat-label">${t('salesRevenue')}</div></div>
    </div>` : ''}
    <div class="table-wrap">
      <div class="table-toolbar" style="flex-wrap:wrap;gap:8px">
        <input class="search-input" id="sSearch" placeholder="${t('search')}" value="${esc(search)}"
          oninput="renderSales(this.value, document.getElementById('sDateFrom').value, document.getElementById('sDateTo').value, document.getElementById('sBrand').value)">
        <select class="filter-select" id="sBrand" onchange="renderSales(document.getElementById('sSearch').value, document.getElementById('sDateFrom').value, document.getElementById('sDateTo').value, this.value)">${brandOpts}</select>
        <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted)">
          ${t('dateFrom')}: <input type="date" class="form-control" id="sDateFrom" style="width:140px;padding:5px 8px" value="${dateFrom}"
            onchange="renderSales(document.getElementById('sSearch').value, this.value, document.getElementById('sDateTo').value, document.getElementById('sBrand').value)">
          ${t('dateTo')}: <input type="date" class="form-control" id="sDateTo" style="width:140px;padding:5px 8px" value="${dateTo}"
            onchange="renderSales(document.getElementById('sSearch').value, document.getElementById('sDateFrom').value, this.value, document.getElementById('sBrand').value)">
        </div>
        <span style="margin-left:auto;font-size:12px;color:var(--muted)">${sales.length} qeyd</span>
      </div>
      <table><thead><tr>
        <th>${t('name')}</th><th>${t('phone')}</th><th>${t('saleDate')}</th><th>${t('brand')}</th><th>Model</th>
        ${showPrices ? `<th>${t('salePrice')}</th><th>${t('paymentType')}</th><th>İlkin / Müddət</th>` : ''}
        <th>${t('satisfied')}</th><th>${t('salespersonLabel')}</th><th></th>
      </tr></thead>
      <tbody>${rows}</tbody></table>
    </div>`;
}

function openSaleForm(id) {
  const sale = id ? CRMService.getSale(id) : null;
  const brandSel = UIService.buildSelect(CRMService.COMPANIES, sale?.brand || '', 'brand');
  const satSel = UIService.buildSelect([{ value: 'yes', label: t('yes') }, { value: 'no', label: t('no') }], sale?.satisfied || 'yes', 'satisfied');
  const pmtSel = UIService.buildSelect(CRMService.PAYMENT_TYPES.map(p => ({ value: p.value, label: p.label[_lang] })), sale?.paymentType || 'cash', 'paymentType');
  const today = new Date().toISOString().split('T')[0];
  const showCredit = sale?.paymentType === 'credit';

  UIService.openModal(sale ? t('editSale') : t('addSale'), `
    <form id="saleForm">
      <div class="form-row">
        <div class="form-group"><label>${t('name')} *</label><input class="form-control" name="clientName" value="${esc(sale?.clientName || '')}" required maxlength="100"></div>
        <div class="form-group"><label>${t('phone')}</label><input class="form-control" name="phone" value="${esc(sale?.phone || '')}" placeholder="+994"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>${t('saleDate')}</label><input class="form-control" type="date" name="saleDate" value="${sale?.saleDate || today}"></div>
        <div class="form-group"><label>${t('brand')}</label>${brandSel}</div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>${t('interestedModel')}</label><input class="form-control" name="interestedModel" value="${esc(sale?.interestedModel || '')}" maxlength="100"></div>
        <div class="form-group"><label>${t('interestedPrice')}</label><input class="form-control" type="number" name="interestedPrice" value="${sale?.interestedPrice || ''}" min="0"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>${t('purchasedModel')}</label><input class="form-control" name="purchasedModel" value="${esc(sale?.purchasedModel || '')}" maxlength="100" placeholder="Satılmayıbsa boş buraxın"></div>
        <div class="form-group"><label>${t('salePrice')}</label><input class="form-control" type="number" name="salePrice" value="${sale?.salePrice || ''}" min="0"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>${t('paymentType')}</label>${pmtSel}</div>
        <div class="form-group"><label>${t('satisfied')}</label>${satSel}</div>
      </div>
      <div id="creditFields" style="${showCredit ? '' : 'display:none'}">
        <div class="form-row">
          <div class="form-group"><label>${t('downPayment')}</label><input class="form-control" type="number" name="downPayment" value="${sale?.downPayment || ''}" min="0"></div>
          <div class="form-group"><label>${t('creditMonths')}</label><input class="form-control" type="number" name="creditMonths" value="${sale?.creditMonths || ''}" min="0" max="120"></div>
        </div>
      </div>
      <div class="form-group"><label>${t('complaint')}</label><textarea class="form-control" name="complaint" rows="2">${esc(sale?.complaint || '')}</textarea></div>
    </form>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="submitSaleForm('${id || ''}')">${t('save')}</button>`
  );

  setTimeout(() => {
    const pmtEl = document.querySelector('#saleForm select[name="paymentType"]');
    const creditDiv = document.getElementById('creditFields');
    if (pmtEl && creditDiv) {
      pmtEl.addEventListener('change', () => {
        creditDiv.style.display = pmtEl.value === 'credit' ? '' : 'none';
      });
    }
  }, 50);
}

function submitSaleForm(id) {
  const data = UIService.collectForm('#saleForm');
  data.salespersonId = _user.id;
  data.salespersonName = _user.name;
  const res = id ? CRMService.updateSale(id, data) : CRMService.addSale(data);
  if (!res.ok) { UIService.toast(res.error, 'error'); return; }
  UIService.closeModal();
  UIService.toast(id ? 'Satış yeniləndi' : 'Satış əlavə edildi', 'success');
  renderSales();
}

function openSaleDetail(id) {
  const s = CRMService.getSale(id);
  if (!s) return;
  const satBadge = s.satisfied === 'yes'
    ? `<span class="badge badge-green">${t('yes')}</span>`
    : `<span class="badge badge-red">${t('no')}</span>`;
  const role = _user.role;
  const showPrices = ['salesperson', 'sales_director', 'admin', 'superadmin'].includes(role);

  UIService.openModal(esc(s.clientName), `
    <div class="detail-row"><span class="detail-label">${t('phone')}</span><span class="detail-value">${esc(s.phone || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">${t('saleDate')}</span><span class="detail-value">${s.saleDate || '—'}</span></div>
    <div class="detail-row"><span class="detail-label">${t('brand')}</span><span class="detail-value">${CRMService.companyLabel(s.brand) || '—'}</span></div>
    <div class="detail-row"><span class="detail-label">${t('interestedModel')}</span><span class="detail-value">${esc(s.interestedModel || '—')}</span></div>
    ${showPrices ? `
    <div class="detail-row"><span class="detail-label">${t('interestedPrice')}</span><span class="detail-value">${s.interestedPrice ? CRMService.formatMoney(s.interestedPrice) : '—'}</span></div>
    <div class="divider"></div>
    <div class="detail-row"><span class="detail-label">${t('purchasedModel')}</span><span class="detail-value">${esc(s.purchasedModel || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">${t('salePrice')}</span><span class="detail-value"><strong>${s.salePrice ? CRMService.formatMoney(s.salePrice) : '—'}</strong></span></div>
    <div class="detail-row"><span class="detail-label">${t('paymentType')}</span><span class="detail-value">${CRMService.paymentTypeLabel(s.paymentType, _lang)}</span></div>
    ${s.paymentType === 'credit' ? `
    <div class="detail-row"><span class="detail-label">${t('downPayment')}</span><span class="detail-value">${s.downPayment ? CRMService.formatMoney(s.downPayment) : '—'}</span></div>
    <div class="detail-row"><span class="detail-label">${t('creditMonths')}</span><span class="detail-value">${s.creditMonths ? s.creditMonths + ' ay' : '—'}</span></div>` : ''}` : ''}
    <div class="divider"></div>
    <div class="detail-row"><span class="detail-label">${t('satisfied')}</span><span class="detail-value">${satBadge}</span></div>
    <div class="detail-row"><span class="detail-label">${t('complaint')}</span><span class="detail-value" style="white-space:pre-wrap">${esc(s.complaint || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">${t('salespersonLabel')}</span><span class="detail-value">${esc(s.salespersonName || '—')}</span></div>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="closeModal();openSaleForm('${id}')">✏️ ${t('edit')}</button>`
  );
}

async function confirmDeleteSale(id) {
  const ok = await UIService.confirm(t('confirmDelete'));
  if (!ok) return;
  CRMService.deleteSale(id);
  UIService.toast('Satış silindi', 'success');
  renderSales();
}

function exportSalesCSV() {
  const role = _user.role;
  const filter = role === 'salesperson' ? { salespersonId: _user.id } : {};
  const sales = CRMService.getSales(filter);
  const headers = ['Ad Soyad', 'Telefon', 'Tarix', 'Brend', 'Maraqlandığı model', 'Maraqlandığı qiymət', 'Aldığı model', 'Satış qiyməti', 'Ödəniş növü', 'İlkin ödəniş', 'Kredit müddəti', 'Razı?', 'Şikayət', 'Satıcı'];
  const rows = sales.map(s => [
    s.clientName, s.phone, s.saleDate,
    CRMService.companyLabel(s.brand), s.interestedModel, s.interestedPrice,
    s.purchasedModel, s.salePrice,
    s.paymentType === 'cash' ? 'Nağd' : 'Kredit',
    s.downPayment, s.creditMonths,
    s.satisfied === 'yes' ? 'Bəli' : 'Xeyr',
    s.complaint, s.salespersonName
  ].map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `satislar_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  UIService.toast('CSV ixrac edildi', 'success');
}

/* ══ CALLS (Call Center) ══ */
function renderCalls(search = '', dateFrom = '', dateTo = '', brand = '') {
  const role = _user.role;
  const filter = { search, brand };
  if (dateFrom) filter.dateFrom = dateFrom;
  if (dateTo) filter.dateTo = dateTo;
  if (role === 'callcenter_specialist') filter.specialistId = _user.id;

  const calls = CRMService.getCalls(filter);
  const canAdd = ['callcenter_specialist', 'admin', 'superadmin'].includes(role);
  const canEdit = ['callcenter_specialist', 'admin', 'superadmin'].includes(role);

  const brandOpts = `<option value="">${t('all')}</option>` + CRMService.COMPANIES.map(c =>
    `<option value="${c.value}"${c.value === brand ? ' selected' : ''}>${c.label}</option>`).join('');

  const rows = calls.length ? calls.map(c => {
    const purposeLabel = CRMService.callPurposeLabel(c.purposeType, _lang);
    const purposeClass = c.purposeType === 'complaint' ? 'badge-red' : c.purposeType === 'interest' ? 'badge-blue' : 'badge-gray';
    const sourceLabel = CRMService.callSourceLabel(c.source, _lang);
    return `<tr>
      <td>${esc(c.callerPhone || '—')}</td>
      <td><strong>${esc(c.clientName || '—')}</strong></td>
      <td>${c.callDate || '—'}</td>
      <td>${CRMService.companyLabel(c.brand) || '—'}</td>
      <td>${esc(c.model || '—')}</td>
      <td><span class="badge ${purposeClass}">${purposeLabel}</span></td>
      <td>${esc(sourceLabel)}</td>
      <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.complaint || c.notes || '—')}</td>
      <td>${esc(c.specialistName || '—')}</td>
      <td><div class="td-actions">
        <button class="btn btn-ghost btn-sm btn-icon" onclick="openCallDetail('${c.id}')">👁</button>
        ${canEdit ? `<button class="btn btn-ghost btn-sm btn-icon" onclick="openCallForm('${c.id}')">✏️</button>
        <button class="btn btn-ghost btn-sm btn-icon" onclick="confirmDeleteCall('${c.id}')">🗑</button>` : ''}
      </div></td>
    </tr>`;
  }).join('') : `<tr><td colspan="10" class="table-empty">${t('noData')}</td></tr>`;

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <h2>${t('calls')}</h2>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost" onclick="exportCallsCSV()">📤 ${t('export')}</button>
        ${canAdd ? `<button class="btn btn-primary" onclick="openCallForm()">+ ${t('addCall')}</button>` : ''}
      </div>
    </div>
    <div class="table-wrap">
      <div class="table-toolbar" style="flex-wrap:wrap;gap:8px">
        <input class="search-input" id="cSearch" placeholder="${t('search')}" value="${esc(search)}"
          oninput="renderCalls(this.value, document.getElementById('cDateFrom').value, document.getElementById('cDateTo').value, document.getElementById('cBrand').value)">
        <select class="filter-select" id="cBrand" onchange="renderCalls(document.getElementById('cSearch').value, document.getElementById('cDateFrom').value, document.getElementById('cDateTo').value, this.value)">${brandOpts}</select>
        <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted)">
          ${t('dateFrom')}: <input type="date" class="form-control" id="cDateFrom" style="width:140px;padding:5px 8px" value="${dateFrom}"
            onchange="renderCalls(document.getElementById('cSearch').value, this.value, document.getElementById('cDateTo').value, document.getElementById('cBrand').value)">
          ${t('dateTo')}: <input type="date" class="form-control" id="cDateTo" style="width:140px;padding:5px 8px" value="${dateTo}"
            onchange="renderCalls(document.getElementById('cSearch').value, document.getElementById('cDateFrom').value, this.value, document.getElementById('cBrand').value)">
        </div>
        <span style="margin-left:auto;font-size:12px;color:var(--muted)">${calls.length} zəng</span>
      </div>
      <table><thead><tr>
        <th>${t('callerPhone')}</th><th>${t('name')}</th><th>${t('callDate')}</th>
        <th>${t('brand')}</th><th>Model</th><th>${t('callPurpose')}</th>
        <th>${t('callSource')}</th><th>Qeyd</th><th>${t('specialistLabel')}</th><th></th>
      </tr></thead>
      <tbody>${rows}</tbody></table>
    </div>`;
}

function openCallForm(id) {
  const call = id ? CRMService.getCall(id) : null;
  const brandSel = UIService.buildSelect(CRMService.COMPANIES, call?.brand || '', 'brand');
  const purposeSel = UIService.buildSelect(
    CRMService.CALL_PURPOSES.map(p => ({ value: p.value, label: p.label[_lang] })),
    call?.purposeType || 'interest', 'purposeType'
  );
  const sourceSel = UIService.buildSelect(
    CRMService.CALL_SOURCES.map(s => ({ value: s.value, label: s.label[_lang] })),
    call?.source || 'other', 'source'
  );
  const today = new Date().toISOString().split('T')[0];

  UIService.openModal(call ? t('editCall') : t('addCall'), `
    <form id="callForm">
      <div class="form-row">
        <div class="form-group"><label>${t('callerPhone')}</label><input class="form-control" name="callerPhone" value="${esc(call?.callerPhone || '')}" placeholder="+994"></div>
        <div class="form-group"><label>${t('name')}</label><input class="form-control" name="clientName" value="${esc(call?.clientName || '')}" maxlength="100"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>${t('callDate')}</label><input class="form-control" type="date" name="callDate" value="${call?.callDate || today}"></div>
        <div class="form-group"><label>${t('brand')}</label>${brandSel}</div>
      </div>
      <div class="form-group"><label>Model</label><input class="form-control" name="model" value="${esc(call?.model || '')}" maxlength="100" placeholder="Məs: Changan CS75 Plus"></div>
      <div class="form-row">
        <div class="form-group"><label>${t('callPurpose')}</label>${purposeSel}</div>
        <div class="form-group"><label>${t('callSource')}</label>${sourceSel}</div>
      </div>
      <div class="form-group"><label>${t('complaint')} / Qeyd</label><textarea class="form-control" name="complaint" rows="2">${esc(call?.complaint || '')}</textarea></div>
      <div class="form-group"><label>${t('notes')}</label><textarea class="form-control" name="notes" rows="2">${esc(call?.notes || '')}</textarea></div>
    </form>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="submitCallForm('${id || ''}')">${t('save')}</button>`
  );
}

function submitCallForm(id) {
  const data = UIService.collectForm('#callForm');
  data.specialistId = _user.id;
  data.specialistName = _user.name;
  const res = id ? CRMService.updateCall(id, data) : CRMService.addCall(data);
  if (!res.ok) { UIService.toast(res.error, 'error'); return; }
  UIService.closeModal();
  UIService.toast(id ? 'Zəng yeniləndi' : 'Zəng əlavə edildi', 'success');
  renderCalls();
}

function openCallDetail(id) {
  const c = CRMService.getCall(id);
  if (!c) return;
  UIService.openModal(esc(c.clientName || c.callerPhone || 'Zəng'), `
    <div class="detail-row"><span class="detail-label">${t('callerPhone')}</span><span class="detail-value">${esc(c.callerPhone || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">${t('name')}</span><span class="detail-value">${esc(c.clientName || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">${t('callDate')}</span><span class="detail-value">${c.callDate || '—'}</span></div>
    <div class="detail-row"><span class="detail-label">${t('brand')}</span><span class="detail-value">${CRMService.companyLabel(c.brand) || '—'}</span></div>
    <div class="detail-row"><span class="detail-label">Model</span><span class="detail-value">${esc(c.model || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">${t('callPurpose')}</span><span class="detail-value">${CRMService.callPurposeLabel(c.purposeType, _lang)}</span></div>
    <div class="detail-row"><span class="detail-label">${t('callSource')}</span><span class="detail-value">${CRMService.callSourceLabel(c.source, _lang)}</span></div>
    <div class="detail-row"><span class="detail-label">${t('complaint')}</span><span class="detail-value" style="white-space:pre-wrap">${esc(c.complaint || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">${t('notes')}</span><span class="detail-value" style="white-space:pre-wrap">${esc(c.notes || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">${t('specialistLabel')}</span><span class="detail-value">${esc(c.specialistName || '—')}</span></div>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="closeModal();openCallForm('${id}')">✏️ ${t('edit')}</button>`
  );
}

async function confirmDeleteCall(id) {
  const ok = await UIService.confirm(t('confirmDelete'));
  if (!ok) return;
  CRMService.deleteCall(id);
  UIService.toast('Zəng silindi', 'success');
  renderCalls();
}

function exportCallsCSV() {
  const role = _user.role;
  const filter = role === 'callcenter_specialist' ? { specialistId: _user.id } : {};
  const calls = CRMService.getCalls(filter);
  const headers = ['Nömrə', 'Ad Soyad', 'Tarix', 'Brend', 'Model', 'Məqsəd', 'Mənbə', 'Şikayət/Qeyd', 'Mütəxəssis'];
  const rows = calls.map(c => [
    c.callerPhone, c.clientName, c.callDate,
    CRMService.companyLabel(c.brand), c.model,
    CRMService.callPurposeLabel(c.purposeType, 'az'),
    CRMService.callSourceLabel(c.source, 'az'),
    c.complaint, c.specialistName
  ].map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `zengler_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  UIService.toast('CSV ixrac edildi', 'success');
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
        <input class="search-input" id="clSearch" placeholder="${t('search')}" value="${esc(search)}" oninput="renderClients(this.value, document.getElementById('coCo').value)">
        <select class="filter-select" id="coCo" onchange="renderClients(document.getElementById('clSearch').value, this.value)">${companyOpts}</select>
        <span style="margin-left:auto;font-size:12px;color:var(--muted)">${clients.length} qeyd</span>
      </div>
      <table><thead><tr><th>${t('name')}</th><th>${t('phone')}</th><th>${t('email')}</th><th>${t('company')}</th><th>${t('source')}</th><th>Tarix</th><th></th></tr></thead>
      <tbody>${rows}</tbody></table>
    </div>`;
}

function openClientForm(id) {
  const client = id ? CRMService.getClient(id) : null;
  const users = AuthService.getAllUsers();
  const assignOpts = `<option value="">—</option>` + users.map(u => `<option value="${u.id}"${client && client.assignedTo === u.id ? ' selected' : ''}>${esc(u.name)}</option>`).join('');
  const coSel = UIService.buildSelect(CRMService.COMPANIES, client?.company || 'changan', 'company');
  const srcSel = UIService.buildSelect(CRMService.CLIENT_SOURCES.map(s => ({ value: s.value, label: s.label[_lang] || s.label.az })), client?.source || 'other', 'source');

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
  UIService.toast(id ? 'Müştəri yeniləndi' : 'Müştəri əlavə edildi', 'success');
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
  UIService.toast('Müştəri silindi', 'success');
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
        <button class="btn btn-sm ${view === 'kanban' ? 'btn-primary' : 'btn-ghost'}" onclick="renderDeals('kanban',document.getElementById('dealSearch')?.value||'',document.getElementById('dealCo')?.value||'')">Kanban</button>
        <button class="btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-ghost'}" onclick="renderDeals('list',document.getElementById('dealSearch')?.value||'',document.getElementById('dealCo')?.value||'')">Siyahı</button>
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
  UIService.toast(id ? 'Sövdələşmə yeniləndi' : 'Sövdələşmə əlavə edildi', 'success');
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
  UIService.toast('Sövdələşmə silindi', 'success');
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
  UIService.toast(id ? 'Tapşırıq yeniləndi' : 'Tapşırıq əlavə edildi', 'success');
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
  UIService.toast('Tapşırıq silindi', 'success');
  renderTasks();
}

/* ══ EMPLOYEES ══ */
function renderEmployees(search = '') {
  let users = AuthService.getAllUsers();
  const role = _user.role;

  if (role === 'callcenter_manager') {
    users = users.filter(u => u.dept === 'callcenter');
  } else if (role === 'sales_director') {
    users = users.filter(u => u.dept === 'sales' || u.dept === 'procurement');
  }

  if (search) {
    users = users.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }

  const rows = users.map(u => {
    const roleLabel = AuthService.roleLabel(u.role, _lang);
    const roleBadgeClass = { superadmin: 'badge-purple', admin: 'badge-purple', sales_director: 'badge-blue', callcenter_manager: 'badge-blue', salesperson: 'badge-green', reception: 'badge-yellow', callcenter_specialist: 'badge-yellow' }[u.role] || 'badge-gray';
    return `<tr>
      <td><div style="display:flex;align-items:center;gap:9px">
        <div class="sb-avatar" style="width:30px;height:30px;font-size:12px">${u.name.charAt(0).toUpperCase()}</div>
        <div><div style="font-weight:600">${esc(u.name)}</div><div style="font-size:11px;color:var(--muted)">${esc(u.email)}</div></div>
      </div></td>
      <td><span class="badge ${roleBadgeClass}">${roleLabel}</span></td>
      <td>${CRMService.deptLabel(u.dept, _lang)}</td>
      <td>${CRMService.companyLabel(u.company)}</td>
      <td>${CRMService.formatDate(u.createdAt)}</td>
      <td><div class="td-actions">
        ${AuthService.canAdmin() ? `<button class="btn btn-ghost btn-sm btn-icon" onclick="openEmployeeForm('${u.id}')">✏️</button>` : ''}
        ${AuthService.isSuperadmin() && u.id !== _user.id ? `<button class="btn btn-ghost btn-sm btn-icon" onclick="confirmDeleteEmployee('${u.id}')">🗑</button>` : ''}
      </div></td>
    </tr>`;
  }).join('') || `<tr><td colspan="6" class="table-empty">${t('noData')}</td></tr>`;

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <h2>${t('employees')}</h2>
      ${AuthService.canAdmin() ? `<button class="btn btn-primary" onclick="openEmployeeForm()">+ ${t('addEmployee')}</button>` : ''}
    </div>
    <div class="table-wrap">
      <div class="table-toolbar">
        <input class="search-input" placeholder="${t('search')}" value="${esc(search)}" oninput="renderEmployees(this.value)">
        <span style="margin-left:auto;font-size:12px;color:var(--muted)">${users.length} nəfər</span>
      </div>
      <table><thead><tr><th>${t('name')}</th><th>${t('role')}</th><th>${t('department')}</th><th>${t('company')}</th><th>Tarix</th><th></th></tr></thead>
      <tbody>${rows}</tbody></table>
    </div>`;
}

function openEmployeeForm(id) {
  const u = id ? AuthService.getAllUsers().find(x => x.id === id) : null;
  const currentDept = u?.dept || 'sales';

  const deptOptions = CRMService.DEPARTMENTS.map(d => ({ value: d.value, label: d.label[_lang] }));
  const deptSel = UIService.buildSelect(deptOptions, currentDept, 'dept');
  const coSel = UIService.buildSelect(CRMService.COMPANIES, u?.company || 'changan', 'company');

  const rolesForDept = AuthService.getRolesForDept(currentDept);
  const roleSel = UIService.buildSelect(rolesForDept.map(r => ({ value: r.value, label: r.label[_lang] })), u?.role || rolesForDept[0]?.value || 'salesperson', 'role');

  UIService.openModal(u ? t('editEmployee') : t('addEmployee'), `
    <form id="empForm">
      <div class="form-group"><label>${t('name')} *</label><input class="form-control" name="name" value="${esc(u?.name || '')}" required maxlength="80"></div>
      <div class="form-group"><label>${t('email')} *</label><input class="form-control" type="email" name="email" value="${esc(u?.email || '')}" required ${u ? 'disabled' : ''}></div>
      ${!u
        ? `<div class="form-group"><label>${t('password')} * (min 6)</label><input class="form-control" type="password" name="password" required minlength="6"></div>`
        : `<div class="form-group"><label>${t('newPassword')}</label><input class="form-control" type="password" name="password" minlength="6" placeholder="••••••"></div>`
      }
      <div class="form-row">
        <div class="form-group">
          <label>${t('department')}</label>
          <select class="form-control" name="dept" id="empDeptSel" onchange="updateEmpRoles(this.value, '${u?.role || ''}')">${deptOptions.map(d => `<option value="${d.value}"${d.value === currentDept ? ' selected' : ''}>${d.label}</option>`).join('')}</select>
        </div>
        <div class="form-group" id="empRoleGroup">
          <label>${t('role')}</label>
          ${roleSel}
        </div>
      </div>
      <div class="form-group"><label>${t('company')}</label>${coSel}</div>
    </form>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="submitEmployeeForm('${id || ''}')">${t('save')}</button>`
  );
}

function updateEmpRoles(dept, currentRole) {
  const roles = AuthService.getRolesForDept(dept);
  const group = document.getElementById('empRoleGroup');
  if (!group) return;
  const sel = `<select class="form-control" name="role">${roles.map(r => `<option value="${r.value}"${r.value === currentRole ? ' selected' : ''}>${r.label[_lang]}</option>`).join('')}</select>`;
  group.innerHTML = `<label>${t('role')}</label>${sel}`;
}

function submitEmployeeForm(id) {
  const data = UIService.collectForm('#empForm');
  if (!data.password) delete data.password;
  if (id) {
    AuthService.updateUser(id, data);
    UIService.toast('İşçi yeniləndi', 'success');
  } else {
    const res = AuthService.createUser(data);
    if (!res.ok) { UIService.toast(res.error, 'error'); return; }
    UIService.toast('İşçi əlavə edildi', 'success');
  }
  UIService.closeModal();
  renderEmployees();
}

async function confirmDeleteEmployee(id) {
  const ok = await UIService.confirm(t('confirmDelete'));
  if (!ok) return;
  AuthService.deleteUser(id);
  UIService.toast('İşçi silindi', 'success');
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
      <table><thead><tr><th>${t('title')}</th><th>${t('type')}</th><th>${t('client')}</th><th>Tarix</th><th></th></tr></thead>
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
  UIService.toast('Sənəd əlavə edildi', 'success');
  renderDocuments();
}

function openDocDetail(id) {
  const d = StorageService.findById('documents', id);
  if (!d) return;
  UIService.openModal(d.title, `
    <div class="detail-row"><span class="detail-label">${t('type')}</span><span class="detail-value">${d.type}</span></div>
    <div class="detail-row"><span class="detail-label">${t('docContent')}</span><span class="detail-value" style="white-space:pre-wrap">${esc(d.content || '—')}</span></div>
    <div class="detail-row"><span class="detail-label">Tarix</span><span class="detail-value">${CRMService.formatDate(d.createdAt)}</span></div>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>`
  );
}

async function confirmDeleteDoc(id) {
  const ok = await UIService.confirm(t('confirmDelete'));
  if (!ok) return;
  CRMService.deleteDocument(id);
  UIService.toast('Sənəd silindi', 'success');
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
      <div class="chart-bar-bg"><div class="chart-bar-fill" style="width:${Math.round((count / max) * 100)}%"></div></div>
      <span class="chart-bar-val">${count}</span>
    </div>`;
  }).join('');

  const brandRows = CRMService.COMPANIES.map(co => {
    const count = s.clientsByCompany[co.value] || 0;
    const max = Math.max(...Object.values(s.clientsByCompany), 1);
    return `<div class="chart-bar-row">
      <span class="chart-bar-label">${co.label}</span>
      <div class="chart-bar-bg"><div class="chart-bar-fill" style="width:${Math.round((count / max) * 100)}%"></div></div>
      <span class="chart-bar-val">${count}</span>
    </div>`;
  }).join('');

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header"><h2>${t('reports')}</h2></div>
    <div class="stats-grid">
      <div class="stat-card stat-blue"><div class="stat-icon">🚗</div><div class="stat-value">${s.visits}</div><div class="stat-label">${t('totalVisits')}</div></div>
      <div class="stat-card stat-green"><div class="stat-icon">💰</div><div class="stat-value">${s.sales}</div><div class="stat-label">${t('totalSales')}</div></div>
      <div class="stat-card stat-yellow"><div class="stat-icon">📞</div><div class="stat-value">${s.calls}</div><div class="stat-label">${t('totalCalls')}</div></div>
      <div class="stat-card stat-purple"><div class="stat-icon">💵</div><div class="stat-value" style="font-size:16px">${CRMService.formatMoney(s.salesRevenue)}</div><div class="stat-label">${t('salesRevenue')}</div></div>
      <div class="stat-card stat-blue"><div class="stat-icon">👥</div><div class="stat-value">${s.clients}</div><div class="stat-label">${t('totalClients')}</div></div>
      <div class="stat-card stat-green"><div class="stat-icon">🏆</div><div class="stat-value">${s.wonDeals}</div><div class="stat-label">${t('won')}</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#f0fdf4">📊</div><div class="stat-value">${winRate}%</div><div class="stat-label">${t('winRate')}</div></div>
      <div class="stat-card stat-green"><div class="stat-icon">💰</div><div class="stat-value" style="font-size:16px">${CRMService.formatMoney(s.revenue)}</div><div class="stat-label">${t('revenue')}</div></div>
    </div>
    <div class="dash-grid" style="margin-top:16px">
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

  const userRows = users.map(u => `
    <tr>
      <td>${esc(u.name)}</td>
      <td>${esc(u.email)}</td>
      <td>${AuthService.roleLabel(u.role, _lang)}</td>
      <td>${CRMService.deptLabel(u.dept, _lang)}</td>
      <td>${CRMService.companyLabel(u.company)}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="adminChangePassword('${u.id}','${esc(u.name)}')">🔑 ${t('adminChangePass')}</button>
      </td>
    </tr>`).join('');

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header"><h2>${t('admin')}</h2></div>
    <div class="section-card" style="margin-bottom:16px">
      <div class="section-title">${t('adminSysInfo')}</div>
      <div class="detail-row"><span class="detail-label">${t('adminUsers')}</span><span class="detail-value">${users.length}</span></div>
      <div class="detail-row"><span class="detail-label">${t('totalVisits')}</span><span class="detail-value">${stats.visits}</span></div>
      <div class="detail-row"><span class="detail-label">${t('totalSales')}</span><span class="detail-value">${stats.sales}</span></div>
      <div class="detail-row"><span class="detail-label">${t('totalCalls')}</span><span class="detail-value">${stats.calls}</span></div>
      <div class="detail-row"><span class="detail-label">${t('salesRevenue')}</span><span class="detail-value">${CRMService.formatMoney(stats.salesRevenue)}</span></div>
    </div>
    <div class="section-card" style="margin-bottom:16px">
      <div class="section-title">${t('adminUserList')}</div>
      <div class="table-wrap" style="box-shadow:none;border:none">
        <table class="table">
          <thead><tr><th>${t('name')}</th><th>${t('email')}</th><th>${t('role')}</th><th>${t('department')}</th><th>${t('company')}</th><th></th></tr></thead>
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
  UIService.openModal(
    t('adminChangePass'),
    `<div class="form-group">
      <label>${t('adminNewPass')} — ${esc(userName)}</label>
      <input class="form-control" type="password" id="adminNewPassInput" minlength="6" placeholder="${t('adminPassMin')}">
    </div>`,
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
  const data = {
    clients: StorageService.getList('clients'),
    deals: StorageService.getList('deals'),
    tasks: StorageService.getList('tasks'),
    documents: StorageService.getList('documents'),
    visits: StorageService.getList('visits'),
    sales: StorageService.getList('sales'),
    calls: StorageService.getList('calls'),
    exported: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `srcrm_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  UIService.toast('Məlumatlar ixrac edildi', 'success');
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
      if (data.visits) StorageService.setList('visits', data.visits);
      if (data.sales) StorageService.setList('sales', data.sales);
      if (data.calls) StorageService.setList('calls', data.calls);
      UIService.toast('Məlumatlar idxal edildi', 'success');
      navigate('dashboard');
    } catch { UIService.toast('Fayl oxunma xətası', 'error'); }
  };
  reader.readAsText(file);
}

async function confirmClearData() {
  const ok = await UIService.confirm(t('adminClearConfirm'), t('adminClear'));
  if (!ok) return;
  ['clients', 'deals', 'tasks', 'documents', 'visits', 'sales', 'calls'].forEach(k => StorageService.setList(k, []));
  UIService.toast('Məlumatlar silindi', 'success');
  navigate('dashboard');
}

/* ══ UTILS ══ */
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

window.renderCurrentPageFromLiveUpdate = function () { if (_user) navigate(_page); };
