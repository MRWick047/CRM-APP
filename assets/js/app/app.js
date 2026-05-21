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
    '3cx':'3CX',
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
    salesRevenue:'Доход от продаж',
    info:'Информация',
    cdrTime:'Время', cdrCallId:'ID звонка', cdrFrom:'От кого', cdrTo:'Кому',
    cdrDirection:'Направление', cdrWait:'Ожидание', cdrTalk:'Разговор',
    cdrInbound:'Входящий', cdrOutbound:'Исходящий', cdrInternal:'Внутренний',
    cdrAnswered:'Принято', cdrMissed:'Пропущено',
    cdrInbounds:'Входящие', cdrOutbounds:'Исходящие',
    cdrAnswereds:'Принятые', cdrMisseds:'Пропущенные',
    cdrSearchPlh:'🔍 Поиск номер/имя...', cdrExportCsv:'💾 CSV',
    cdrShown:'Показано', cdrOf:'из', cdrPage:'Стр.',
    cdrAnsweredLbl:'Принято:', cdrMissedLbl:'Пропущено:', cdrAvgTalk:'Ср. разговор:',
    cdrPrev:'← Назад', cdrNextBtn:'Вперёд →',
    cdrNoRecords:'Записей нет', cdrRecords:'записей',
    cdrLatestCalls:'Последние звонки', cdrAllCalls:'Всего звонков',
    cdrOffline:'Сервер недоступен — данные из локального кэша',
    roleUser:'Пользователь', accessDenied:'Доступ запрещён'
  },
  az: {
    dashboard:'İdarə paneli', clients:'Müştərilər', deals:'Sövdələşmələr', tasks:'Tapşırıqlar',
    employees:'İşçilər', documents:'Sənədlər', reports:'Hesabatlar', admin:'Administrasiya',
    visits:'Showroom Ziyarətləri', sales:'Satış', calls:'Zənglər',
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
    won:'Qazanıldı', lost:'Uduldu', winRate:'Qazanış nisbəti',
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
    '3cx':'3CX',
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
    salesRevenue:'Satış gəliri',
    info:'Məlumat',
    cdrTime:'Vaxt', cdrCallId:'Zəng ID', cdrFrom:'Kimdən', cdrTo:'Kimə',
    cdrDirection:'İstiqamət', cdrWait:'Gözləmə', cdrTalk:'Danışıq',
    cdrInbound:'Daxil olan', cdrOutbound:'Gedən', cdrInternal:'Daxili',
    cdrAnswered:'Cavablandı', cdrMissed:'Cavabsız',
    cdrInbounds:'Daxil olanlar', cdrOutbounds:'Gedənlər',
    cdrAnswereds:'Cavablandırılmış', cdrMisseds:'Cavabsız',
    cdrSearchPlh:'🔍 Nömrə və ya ad axtar...', cdrExportCsv:'💾 CSV',
    cdrShown:'Göstərilir', cdrOf:'/', cdrPage:'Səh.',
    cdrAnsweredLbl:'Cavablandı:', cdrMissedLbl:'Cavabsız:', cdrAvgTalk:'Ort. danışıq:',
    cdrPrev:'← Əvvəlki', cdrNextBtn:'Növbəti →',
    cdrNoRecords:'Qeyd yoxdur', cdrRecords:'qeyd',
    cdrLatestCalls:'Son zənglər', cdrAllCalls:'Cəmi zənglər',
    cdrOffline:'Server əlçatmazdır — lokal keş məlumatları',
    roleUser:'İstifadəçi', accessDenied:'Giriş qadağandır'
  }
};

function t(key) { return (T[_lang] || T.az)[key] || key; }

/* ══ ROLE NAV RULES ══ */
const NAV_RULES = {
  user:                  ['dashboard', 'tasks', 'info'],
  reception:             ['dashboard', 'visits', 'info'],
  salesperson:           ['dashboard', 'sales', 'info'],
  sales_director:        ['dashboard', 'visits', 'sales', 'employees', 'reports', 'info'],
  callcenter_specialist: ['dashboard', '3cx', 'info'],
  callcenter_manager:    ['dashboard', '3cx', 'employees', 'info'],
  callcenter_admin:      ['3cx'],
  admin:                 ['dashboard', 'visits', 'sales', '3cx', 'clients', 'deals', 'tasks', 'employees', 'documents', 'reports', 'admin', 'info'],
  superadmin:            ['dashboard', 'visits', 'sales', '3cx', 'clients', 'deals', 'tasks', 'employees', 'documents', 'reports', 'admin', 'info']
};

const ALL_NAV_PAGES = ['dashboard', 'visits', 'sales', '3cx', 'clients', 'deals', 'tasks', 'employees', 'documents', 'reports', 'admin', 'info'];

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
  updatePendingBadge();
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

function updatePendingBadge() {
  if (!_user) return;
  if (!AuthService.canAdmin()) return;
  const count = AuthService.getPendingUsers().length;
  const badge = document.getElementById('pendingBadge');
  if (badge) {
    if (count > 0) { badge.textContent = count; badge.classList.remove('hidden'); }
    else badge.classList.add('hidden');
  }
}

/* ══ AUTH ACTIONS ══ */
function showRegister() {
  document.getElementById('loginCard').classList.add('hidden');
  document.getElementById('registerCard').classList.remove('hidden');
  document.getElementById('regErr').textContent = '';
  document.getElementById('regSuccess').classList.add('hidden');
  document.getElementById('registerForm').reset();
}

function showLogin() {
  document.getElementById('registerCard').classList.add('hidden');
  document.getElementById('loginCard').classList.remove('hidden');
  document.getElementById('authErr').textContent = '';
}

function doLogin(e) {
  e.preventDefault();
  const email = document.getElementById('liEmail').value.trim();
  const pass = document.getElementById('liPass').value;
  const res = AuthService.login(email, pass);
  if (!res.ok) {
    const errEl = document.getElementById('authErr');
    errEl.textContent = res.error;
    if (res.isPending) errEl.style.background = 'var(--warning-light)';
    else errEl.style.background = '';
    return;
  }
  _user = res.user;
  showApp();
}

function submitRegister(e) {
  e.preventDefault();
  const errEl = document.getElementById('regErr');
  const successEl = document.getElementById('regSuccess');
  errEl.textContent = '';
  successEl.classList.add('hidden');

  const name    = document.getElementById('regName').value.trim();
  const email   = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPass').value;
  const dept    = document.getElementById('regDept').value;
  const company = document.getElementById('regCompany').value;

  const res = AuthService.registerUser({ name, email, password, dept, company });
  if (!res.ok) { errEl.textContent = res.error; return; }

  document.getElementById('registerForm').style.display = 'none';
  successEl.classList.remove('hidden');
  setTimeout(() => {
    document.getElementById('registerForm').style.display = '';
    successEl.classList.add('hidden');
    showLogin();
  }, 3000);
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

  /* FIX 3 — H-5: Remove CDR live listener when navigating away from 3CX page */
  if (_page === '3cx' && page !== '3cx' && _cdrLiveListener && typeof window._socket !== 'undefined') {
    window._socket.off('cdr_new', _cdrLiveListener);
    _cdrLiveListener = null;
  }

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
    '3cx': render3CX,
    clients: renderClients,
    deals: renderDeals,
    tasks: renderTasks,
    employees: renderEmployees,
    documents: renderDocuments,
    reports: renderReports,
    admin: renderAdmin,
    info: renderInfo
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
      <div class="stat-card stat-yellow"><div class="stat-icon">📞</div><div class="stat-value">${s.calls}</div><div class="stat-label">${t('totalCalls')}</div></div>`;
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
  } else if (role === 'callcenter_specialist' || role === 'callcenter_admin') {
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
  if (!id) { data.receptionId = _user.id; data.receptionName = _user.name; }
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
  const ok = await UIService.confirm(t('confirmDelete'), t('delete'));
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
  ].map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(';'));
  const csv = [headers.join(';'), ...rows].join('\n');
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
  if (!id) { data.salespersonId = _user.id; data.salespersonName = _user.name; }
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
  const ok = await UIService.confirm(t('confirmDelete'), t('delete'));
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
  ].map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(';'));
  const csv = [headers.join(';'), ...rows].join('\n');
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
  if (role === 'callcenter_specialist' || role === 'callcenter_admin') filter.specialistId = _user.id;

  const calls = CRMService.getCalls(filter);
  const canAdd = ['callcenter_specialist', 'callcenter_manager', 'callcenter_admin', 'admin', 'superadmin'].includes(role);
  const canEdit = ['callcenter_specialist', 'callcenter_manager', 'callcenter_admin', 'admin', 'superadmin'].includes(role);

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
  if (!id) { data.specialistId = _user.id; data.specialistName = _user.name; }
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
  const ok = await UIService.confirm(t('confirmDelete'), t('delete'));
  if (!ok) return;
  CRMService.deleteCall(id);
  UIService.toast('Zəng silindi', 'success');
  renderCalls();
}

function exportCallsCSV() {
  const role = _user.role;
  const filter = (role === 'callcenter_specialist' || role === 'callcenter_admin') ? { specialistId: _user.id } : {};
  const calls = CRMService.getCalls(filter);
  const headers = ['Nömrə', 'Ad Soyad', 'Tarix', 'Brend', 'Model', 'Məqsəd', 'Mənbə', 'Şikayət/Qeyd', 'Mütəxəssis'];
  const rows = calls.map(c => [
    c.callerPhone, c.clientName, c.callDate,
    CRMService.companyLabel(c.brand), c.model,
    CRMService.callPurposeLabel(c.purposeType, 'az'),
    CRMService.callSourceLabel(c.source, 'az'),
    c.complaint, c.specialistName
  ].map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(';'));
  const csv = [headers.join(';'), ...rows].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `zengler_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  UIService.toast('CSV ixrac edildi', 'success');
}

/* ══ 3CX CDR DASHBOARD ══ */

/* -- state -- */
let _cdrStats  = null;
let _cdrRows   = [];
let _cdrFilter = { type: 'all', from: '', to: '', agent: '' };
let _cdrOffline = false;
let _cdrLiveListener = null;
let _cdrPage         = 0;
let _cdrSort         = { col: 'time', dir: -1 };
let _cdrSearch       = '';
let _cdrFilterDir    = 'all';
let _cdrFilterStatus = 'all';
const _cdrPageSize   = 50;

/* -- helpers -- */
function _csvParseLine(line, delim) {
  const res = []; let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { if (inQ && line[i+1]==='"') { cur+='"'; i++; } else inQ=!inQ; }
    else if (ch === delim && !inQ) { res.push(cur); cur=''; }
    else cur += ch;
  }
  res.push(cur);
  return res;
}

function cdrHandleFile(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    let text = e.target.result;
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) { UIService.toast('CSV pustoy ili neverno', 'error'); return; }
    const delim = (lines[0].split(';').length > lines[0].split(',').length) ? ';' : ',';
    const hdrs = _csvParseLine(lines[0], delim).map(h => h.trim().replace(/^"|"$/g,'').toLowerCase());
    const fi = names => { for (const n of names) { const i=hdrs.findIndex(h=>h.includes(n)); if(i!==-1) return i; } return -1; };
    const iTime   = fi(['vrem','time','data','врем','дата']);
    const iId     = fi(['id звон','call id','callid','id']);
    const iFromN  = fi(['от кого (им','from name','caller name']);
    const iFromP  = fi(['от кого (тел','from','caller']);
    const iToN    = fi(['кому (им','to name','callee name']);
    const iToP    = fi(['кому (тел','to','callee']);
    const iDir    = fi(['направлен','direction']);
    const iStatus = fi(['статус','status']);
    const iWait   = fi(['ожидан','wait','ring']);
    const iDur    = fi(['разговор','duration','talk']);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cells = _csvParseLine(lines[i], delim).map(c => c.trim().replace(/^"|"$/g,''));
      if (iTime !== -1 && !cells[iTime]) continue;
      let timeVal = iTime !== -1 ? cells[iTime] : '';
      const dm = timeVal.match(/^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})/);
      if (dm) timeVal = `${dm[3]}-${dm[2]}-${dm[1]}T${dm[4]}:${dm[5]}:00+04:00`;
      rows.push({
        time: timeVal, callId: iId!==-1?cells[iId]:'',
        fromName: iFromN!==-1?cells[iFromN]:'', from: iFromP!==-1?cells[iFromP]:'',
        toName: iToN!==-1?cells[iToN]:'', to: iToP!==-1?cells[iToP]:'',
        dir: iDir!==-1?cells[iDir]:'', status: iStatus!==-1?cells[iStatus]:'',
        wait: iWait!==-1?parseInt(cells[iWait])||0:0,
        duration: iDur!==-1?parseInt(cells[iDur])||0:0,
      });
    }
    const answered = rows.filter(r => /answer|принят|qəbul/i.test(r.status));
    const missed   = rows.filter(r => /miss|пропущ/i.test(r.status));
    const durs = answered.map(r => r.duration).filter(d => d > 0);
    const byHour = Array(24).fill(0);
    rows.forEach(r => { const h = new Date(r.time).getHours(); if (!isNaN(h)) byHour[h]++; });
    _cdrStats = {
      calls_today: rows.length, calls_answered: answered.length,
      calls_missed: missed.length,
      avg_duration: durs.length ? Math.round(durs.reduce((a,b)=>a+b,0)/durs.length) : 0,
      calls_by_hour: byHour,
      calls_by_agent: (() => {
        const map = {};
        rows.forEach(r => {
          const name = r.toName || r.fromName || '—';
          if (!name || name === '—') return;
          if (!map[name]) map[name] = { dn: name, calls: 0, answered: 0, missed: 0, total_dur: 0 };
          map[name].calls++;
          if (/answer|принят|qəbul/i.test(r.status)) { map[name].answered++; map[name].total_dur += (r.duration||0); }
          else map[name].missed++;
        });
        return Object.values(map)
          .map(a => ({ ...a, avg_duration: a.answered ? Math.round(a.total_dur/a.answered) : 0 }))
          .sort((a,b) => b.calls - a.calls);
      })()
    };
    _cdrRows = rows; _cdrImported = true; _cdrPage = 0;
    _cdrRender();
    UIService.toast(`Загружено ${rows.length} записей из CSV`, 'success');
  };
  reader.readAsText(file, 'utf-8');
  input.value = '';
}

function cdrExportCSV() {
  if (!_cdrRows || !_cdrRows.length) { UIService.toast('Нет данных', 'warning'); return; }
  const hdrs = ['Время','ID звонка','От кого (Имя)','От кого (Телефон)','Кому (Имя)','Кому (Телефон)','Направление','Статус','Ожидание sec','Разговор sec'];
  const rows = _cdrRows.map(r => [
    r.time, r.callId, r.fromName, r.from, r.toName, r.to, r.dir, r.status, r.wait, r.duration
  ].map(cell => `"${String(cell||'').replace(/"/g,'""')}"`).join(';'));
  const csv = '﻿' + [hdrs.join(';'), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `cdr_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  UIService.toast('CDR CSV экспортирован', 'success');
}


function _fmtPhone(num) {
  if (!num) return '—';
  if (String(num).startsWith('Ext.')) return String(num).replace('Ext.', '');
  let d = String(num).replace(/\D/g, '');
  if (!d) return String(num);
  // Strip Azerbaijan billing prefix '11' → '0XXXXXXXXX' (10 digits)
  if (d.length === 12 && d.startsWith('11') && !d.startsWith('994')) d = d.slice(2);
  if (d.length === 12 && d.startsWith('994')) {
    return '+994 ' + d.slice(3,5) + ' ' + d.slice(5,8) + ' ' + d.slice(8,10) + ' ' + d.slice(10);
  }
  if (d.length === 10 && d.startsWith('0')) {
    d = '994' + d.slice(1);
    return '+994 ' + d.slice(3,5) + ' ' + d.slice(5,8) + ' ' + d.slice(8,10) + ' ' + d.slice(10);
  }
  if (d.length === 9) {
    d = '994' + d;
    return '+994 ' + d.slice(3,5) + ' ' + d.slice(5,8) + ' ' + d.slice(8,10) + ' ' + d.slice(10);
  }
  if (d.length <= 5) return d;
  return String(num);
}

function _cdrFmtDateTime(iso) {
  if (!iso) return '—';
  const dt = new Date(iso);
  if (isNaN(dt)) return '—';
  const dd   = String(dt.getDate()).padStart(2,'0');
  const mm   = String(dt.getMonth()+1).padStart(2,'0');
  const yyyy = dt.getFullYear();
  const hh   = String(dt.getHours()).padStart(2,'0');
  const mi   = String(dt.getMinutes()).padStart(2,'0');
  return `${dd}.${mm}.${yyyy} ${hh}:${mi}`;
}

function _cdrMinsec(sec) {
  if (!sec || sec <= 0) return '—';
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2,'0')}`;
}
function _cdrFmtDuration(sec) { return _cdrMinsec(sec); }

function _cdrWaitSec(row) {
  if (!row.time_answered || !row.time_start) return 0;
  return Math.max(0, Math.round((new Date(row.time_answered) - new Date(row.time_start)) / 1000));
}
function _cdrTalkSec(row) {
  if (!row.time_answered || !row.time_end) return 0;
  return Math.max(0, Math.round((new Date(row.time_end) - new Date(row.time_answered)) / 1000));
}

function _cdrDirection(row) {
  const fn = (row.from_no || '');
  const tn = (row.to_no || '');
  const fromIsExt = fn.startsWith('Ext.');
  const toIsExt   = tn.startsWith('Ext.');
  if (fromIsExt && toIsExt) return { code: 'internal', label: t('cdrInternal'), icon: '🔄', color: '#64748b' };
  if (fromIsExt)             return { code: 'outbound', label: t('cdrOutbound'), icon: '📤', color: '#8b5cf6' };
  return                            { code: 'inbound',  label: t('cdrInbound'),  icon: '📥', color: '#3b82f6' };
}

function _cdrCallStatus(row) {
  if (row.time_answered) return { label: t('cdrAnswered'), icon: '🟢', color: '#22c55e', cls: 'cdr-status-answered' };
  return                        { label: t('cdrMissed'),   icon: '🔴', color: '#ef4444', cls: 'cdr-status-missed' };
}

const _CDR_QUEUES = ['telesatish','cfd','sales','support','queue'];
/* DNs that represent 3CX queues or DID routing channels (not real callers) */
const _CDR_QUEUE_DNS = new Set([
  '10003','10004','10005','10006','10008','10011','10012','10013', // 3CX queue IDs
  '8001','8006','8008','8009','8014','8024','8027','8038','8040', // DID lines
  '8043','8044','8048','8049','8050','8052','8053','8056','8057', // DID lines
  '9696'                                                           // DID line
]);
function _isCdrQueueDN(dn) {
  const d = String(dn || '').trim();
  return _CDR_QUEUE_DNS.has(d) || /^10\d{3}$/.test(d); // also catches future 100xx
}
function _cdrFromLabel(row) {
  const dn = (row.from_dn || '').trim();
  const no = (row.from_no || '').trim();

  // Queue/DID routing DN — real caller is in from_no
  if (_isCdrQueueDN(dn)) {
    const fmt = _fmtPhone(no);
    return fmt !== '—' ? fmt : esc(no || '—');
  }

  // Agent extension — show display name from dn
  if (no.startsWith('Ext.')) return esc(dn || no.replace('Ext.', ''));

  // External caller with a display name (e.g. saved contact)
  const fmt = _fmtPhone(no);
  if (dn && dn !== no && dn !== fmt) {
    return `${esc(dn)} <span style="color:var(--muted);font-size:0.78em">(${fmt})</span>`;
  }

  return fmt !== '—' ? fmt : esc(dn || '—');
}
function _cdrToLabel(row) {
  const dn = (row.to_dn || '').trim();
  const no = (row.to_no || '').trim();
  if (dn && _CDR_QUEUES.some(q => dn.toLowerCase().includes(q))) {
    return `<span style="color:#f59e0b;font-weight:600">📋 ${esc(dn)}</span>`;
  }
  if (no.startsWith('Ext.')) return esc(dn || no.replace('Ext.',''));
  const fmt = _fmtPhone(no);
  if (dn && dn !== no && dn !== fmt) return `${esc(dn)} <span style="color:var(--muted);font-size:0.78em">(${fmt})</span>`;
  return fmt !== '—' ? fmt : esc(dn || '—');
}

/* -- localStorage fallback -- */
function _cdrLocalStats() {
  try {
    const calls = JSON.parse(localStorage.getItem('srcrm_calls') || '[]');
    const today = new Date().toDateString();
    const todayCalls = calls.filter(c => c.date && new Date(c.date).toDateString() === today);
    return {
      total_calls: calls.length,
      answered_calls: calls.filter(c => c.status === 'answered' || c.status === 'принят').length,
      missed_calls: calls.filter(c => c.status === 'missed' || c.status === 'пропущен').length,
      avg_duration: 0,
      calls_by_hour: Array.from({length:24},(_,h)=>({hour:h,count:0})),
      calls_by_agent: [],
      calls_today: todayCalls.length,
      calls_this_week: calls.length
    };
  } catch(e) { return null; }
}
function _cdrLocalRows() {
  try {
    const calls = JSON.parse(localStorage.getItem('srcrm_calls') || '[]');
    return calls.slice(0, 50).map(c => ({
      id: c.id, callid: c.id || '',
      time_start: c.date || c.callDate || null,
      time_answered: c.status === 'answered' ? c.date : null,
      time_end: null,
      from_no: c.callerPhone || c.phone || '—',
      to_no: c.to || '—',
      from_dn: c.agent || c.assignTo || '—',
      to_dn: c.agent || '—',
      duration: c.duration || 0,
      reason_terminated: c.status || '',
      _local: true
    }));
  } catch(e) { return []; }
}

/* -- main render -- */
async function render3CX() {
  document.getElementById('pageContent').innerHTML = `
    <div class="cdr-dashboard">
      <div class="cdr-kpi-grid">
        ${[1,2,3,4].map(()=>`<div class="cdr-kpi" style="min-height:90px;background:var(--surface2)"></div>`).join('')}
      </div>
      <div style="text-align:center;color:var(--muted);padding:40px;font-size:13px">${t('loading')}</div>
    </div>`;

  let stats = null, rows = [];
  try {
    const _apiHdr = StorageService._authHdr || {};
    const _fq = new URLSearchParams();
    if (_cdrFilter.from) _fq.set('from', _cdrFilter.from);
    if (_cdrFilter.to)   _fq.set('to',   _cdrFilter.to);
    const _fqStr = _fq.toString();
    const _cq = new URLSearchParams({ limit: '500' });
    if (_cdrFilter.from)  _cq.set('from',  _cdrFilter.from);
    if (_cdrFilter.to)    _cq.set('to',    _cdrFilter.to);
    if (_cdrFilter.agent) _cq.set('agent', _cdrFilter.agent);
    const [sRes, rRes] = await Promise.all([
      fetch('/api/cdr/stats' + (_fqStr ? '?' + _fqStr : ''), { headers: _apiHdr }),
      fetch('/api/cdr?' + _cq.toString(), { headers: _apiHdr })
    ]);
    if (!sRes.ok || !rRes.ok) throw new Error('api error');
    stats = await sRes.json();
    rows  = await rRes.json();
    _cdrOffline = false;
  } catch (_) {
    _cdrOffline = true;
    stats = _cdrLocalStats();
    rows  = _cdrLocalRows();
  }
  _cdrStats = stats;
  _cdrRows  = rows;
  _cdrPage  = 0;
  _cdrRender();

  /* FIX 3 — H-5: Remove CDR live listener when navigating away from 3CX page */
  if (typeof io !== 'undefined' && !_cdrLiveListener) {
    const sock = typeof window._socket !== 'undefined' ? window._socket : (window._socket = io());
    _cdrLiveListener = (rec) => {
      _cdrRows.unshift(rec);
      if (_cdrRows.length > 500) _cdrRows.pop();
      if (_cdrStats) _cdrStats.calls_today = (_cdrStats.calls_today || 0) + 1;
      _cdrRender();
    };
    sock.on('cdr_new', _cdrLiveListener);
  }
}

function _cdrRender() {
  const stats  = _cdrStats;
  const rows   = _cdrRows;
  const filter = _cdrFilter;

  // KPI cards
  const kpiHtml = `
    <div class="cdr-kpi-grid">
      <div class="cdr-kpi kpi-blue">
        <div class="cdr-kpi-icon">📞</div>
        <div class="cdr-kpi-value">${stats ? stats.calls_today : '—'}</div>
        <div class="cdr-kpi-label">${t('cdrAllCalls')}</div>
      </div>
      <div class="cdr-kpi kpi-green">
        <div class="cdr-kpi-icon">✅</div>
        <div class="cdr-kpi-value">${stats ? stats.answered_calls : '—'}</div>
        <div class="cdr-kpi-label">${t('cdrAnswered')}</div>
      </div>
      <div class="cdr-kpi kpi-red">
        <div class="cdr-kpi-icon">❌</div>
        <div class="cdr-kpi-value">${stats ? stats.missed_calls : '—'}</div>
        <div class="cdr-kpi-label">${t('cdrMissed')}</div>
      </div>
      <div class="cdr-kpi kpi-amber">
        <div class="cdr-kpi-icon">⏱️</div>
        <div class="cdr-kpi-value">${stats ? _cdrMinsec(stats.avg_duration) : '—'}</div>
        <div class="cdr-kpi-label">${t('cdrAvgTalk')}</div>
      </div>
    </div>`;

  // Hour bar chart
  const _nowHour = new Date().getHours();
  let maxHour = 1;
  if (stats) stats.calls_by_hour.forEach(h => { if (h.count > maxHour) maxHour = h.count; });
  const _barH = 190, _lblH = 24;
  const _gridLines = [0.25, 0.5, 0.75, 1.0].map(f => {
    const gv = Math.round(maxHour * f);
    const gb = Math.round(f * _barH) + _lblH;
    return `<div class="cdr-grid-line" style="bottom:${gb}px"><span class="cdr-grid-val">${gv}</span></div>`;
  }).join('');
  const barsHtml = stats ? (stats.calls_by_hour.map(h => {
    const bpx = maxHour > 0 ? Math.round((h.count / maxHour) * _barH) : 0;
    const isCur = h.hour === _nowHour;
    return `<div class="cdr-bar-wrap" title="${h.hour}:00 — ${h.count} зв.">` +
      `<div class="cdr-bar-top">${h.count > 0 ? h.count : ''}</div>` +
      `<div class="cdr-bar${isCur ? ' cdr-bar-active' : ''}" style="height:${bpx}px"></div>` +
      `<div class="cdr-bar-lbl${isCur ? ' cdr-bar-lbl-cur' : ''}">${h.hour}</div></div>`;
  }).join('') + _gridLines)
    : `<div style="color:var(--muted);font-size:12px">${t('noData')}</div>`;

  // Agents
  const agents = stats ? stats.calls_by_agent : [];
  const maxAgentCalls = agents.length ? agents[0].calls : 1;
  const agentsHtml = agents.length ? agents.map(a => `
    <div class="cdr-agent-row" style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-radius:6px;background:rgba(255,255,255,0.05);margin-bottom:4px;"><span style="font-weight:600;min-width:60px;">${a.name && a.name !== a.dn ? a.dn + ' · ' + a.name : a.dn}</span><span style="color:#aaa;font-size:13px;">${a.calls} calls</span><span style="background:#22c55e22;color:#22c55e;padding:2px 8px;border-radius:12px;font-size:12px;">${a.answered} ans</span><span style="background:#ef444422;color:#ef4444;padding:2px 8px;border-radius:12px;font-size:12px;">${a.missed} mis</span><span style="color:#94a3b8;font-size:12px;">${a.avg_duration}s avg</span></div>`).join('')
    : `<div style="color:var(--muted);font-size:12px;padding:8px 0">${t('noData')}</div>`;

  // ── FILTERING ──
  let filtered = rows.slice();
  if      (_cdrFilterDir === 'inbound')  filtered = filtered.filter(r => _cdrDirection(r).code === 'inbound');
  else if (_cdrFilterDir === 'outbound') filtered = filtered.filter(r => _cdrDirection(r).code === 'outbound');
  else if (_cdrFilterDir === 'internal') filtered = filtered.filter(r => _cdrDirection(r).code === 'internal');
  if      (_cdrFilterStatus === 'answered') filtered = filtered.filter(r => r.time_answered);
  else if (_cdrFilterStatus === 'missed')   filtered = filtered.filter(r => !r.time_answered);
  if (filter.from) filtered = filtered.filter(r => r.time_start && r.time_start >= filter.from);
  if (filter.to)   filtered = filtered.filter(r => r.time_start && r.time_start <= filter.to + 'T23:59:59');
  const _q = (_cdrSearch || '').toLowerCase().trim();
  if (_q) filtered = filtered.filter(r =>
    (r.from_no||'').toLowerCase().includes(_q) ||
    (r.from_dn||'').toLowerCase().includes(_q) ||
    (r.to_no||'').toLowerCase().includes(_q) ||
    (r.to_dn||'').toLowerCase().includes(_q) ||
    (r.callid||'').toLowerCase().startsWith(_q)
  );

  // ── SORTING ──
  const sd = _cdrSort.dir;
  filtered.sort((a, b) => {
    let av, bv;
    if      (_cdrSort.col==='time')   { av=a.time_start||'';  bv=b.time_start||''; }
    else if (_cdrSort.col==='from')   { av=(a.from_dn||a.from_no||'').toLowerCase(); bv=(b.from_dn||b.from_no||'').toLowerCase(); }
    else if (_cdrSort.col==='to')     { av=(a.to_dn||a.to_no||'').toLowerCase();    bv=(b.to_dn||b.to_no||'').toLowerCase(); }
    else if (_cdrSort.col==='wait')   { av=_cdrWaitSec(a); bv=_cdrWaitSec(b); }
    else if (_cdrSort.col==='talk')   { av=_cdrTalkSec(a); bv=_cdrTalkSec(b); }
    else if (_cdrSort.col==='status') { av=a.time_answered?1:0; bv=b.time_answered?1:0; }
    else { av=a.time_start||''; bv=b.time_start||''; }
    return av < bv ? -sd : av > bv ? sd : 0;
  });

  // ── STATS ──
  const totalAns  = filtered.filter(r => r.time_answered).length;
  const totalMiss = filtered.length - totalAns;
  const talkSecs  = filtered.filter(r => r.time_answered && r.time_end).map(_cdrTalkSec);
  const avgTalk   = talkSecs.length ? Math.round(talkSecs.reduce((s,v)=>s+v,0)/talkSecs.length) : 0;

  // ── PAGINATION ──
  const totalPages = Math.ceil(filtered.length / _cdrPageSize) || 1;
  const page       = Math.max(0, Math.min(_cdrPage, totalPages - 1));
  const pageRows   = filtered.slice(page * _cdrPageSize, (page + 1) * _cdrPageSize);

  // ── SORT HEADER HELPER ──
  function _sTh(col, lbl) {
    const active = _cdrSort.col === col;
    const arr    = active ? (_cdrSort.dir === 1 ? ' ↑' : ' ↓') : '';
    return `<th style="${active?'color:#60a5fa;':''}cursor:pointer;user-select:none;white-space:nowrap" onclick="cdrSetSort('${col}')">${lbl}${arr}</th>`;
  }

  // ── TABLE ROWS ──
  const tableRows = pageRows.length ? pageRows.map((r, i) => {
    const rid  = (r.id || r.historyid || String(i)).replace(/[^a-zA-Z0-9_-]/g, '_');
    const st   = _cdrCallStatus(r);
    const dir  = _cdrDirection(r);
    const cid8 = (r.callid || '').slice(0, 8) || '—';
    return `<tr class="cdr-tr" onclick="cdrToggleRow('${rid}')" style="cursor:pointer;font-size:0.82rem">
      <td style="white-space:nowrap;color:var(--muted);font-size:0.78rem">${_cdrFmtDateTime(r.time_start)}</td>
      <td><code style="font-size:0.75rem;opacity:0.7;background:rgba(255,255,255,0.06);padding:2px 5px;border-radius:4px">${esc(cid8)}</code></td>
      <td>${_cdrFromLabel(r)}</td>
      <td>${_cdrToLabel(r)}</td>
      <td><span class="cdr-badge" style="background:${dir.color}22;color:${dir.color};border:1px solid ${dir.color}44">${dir.icon} ${dir.label}</span></td>
      <td><span class="cdr-badge" style="background:${st.color}22;color:${st.color};border:1px solid ${st.color}44">${st.icon} ${st.label}</span></td>
      <td style="text-align:right;font-variant-numeric:tabular-nums;color:var(--muted)">${_cdrMinsec(_cdrWaitSec(r))}</td>
      <td style="text-align:right;font-variant-numeric:tabular-nums">${_cdrMinsec(_cdrTalkSec(r))}</td>
    </tr>
    <tr id="cdr-detail-${rid}" style="display:none">
      <td colspan="8" style="padding:0">
        <div class="cdr-detail-box">
          <span><b>Call ID:</b> <code>${esc(r.callid||'—')}</code></span>
          <span><b>History ID:</b> ${esc(r.historyid||'—')}</span>
          <span><b>От:</b> ${esc(r.from_no||'—')} / ${esc(r.from_dn||'—')}</span>
          <span><b>Кому:</b> ${esc(r.to_no||'—')} / ${esc(r.to_dn||'—')}</span>
          <span><b>Dial → Final:</b> ${esc(r.dial_no||'—')} → ${esc(r.final_number||'—')} (${esc(r.final_dn||'—')})</span>
          <span><b>Начало:</b> ${_cdrFmtDateTime(r.time_start)} &nbsp; <b>Ответ:</b> ${_cdrFmtDateTime(r.time_answered)} &nbsp; <b>Конец:</b> ${_cdrFmtDateTime(r.time_end)}</span>
          <span><b>Причина:</b> ${esc(r.reason_terminated||'—')} / ${esc(r.reason_changed||'—')}</span>
        </div>
      </td>
    </tr>`;
  }).join('') : `<tr><td colspan="8" class="table-empty" style="padding:32px;text-align:center;color:var(--muted)">${t('cdrNoRecords')}</td></tr>`;

  const offlineBanner = _cdrOffline ? `<div class="cdr-offline">⚠️ ${t('cdrOffline')}</div>` : '';

  document.getElementById('pageContent').innerHTML = `
    <div class="cdr-dashboard">
      ${offlineBanner}
      ${kpiHtml}

      <div class="cdr-row">
        <div class="cdr-card">
          <div class="cdr-card-header">
            <span class="cdr-card-title">📊 Звонки по часам (последние 24ч)</span>
            <span style="font-size:11px;color:var(--muted)">${stats ? stats.calls_today + ' сегодня' : ''}</span>
          </div>
          <div class="cdr-card-body"><div class="cdr-hour-bars">${barsHtml}</div><div class="cdr-donut-wrap"><div class="cdr-donut-title">📞 Сегодня: отвечено / пропущено</div><div style="display:flex;align-items:center;justify-content:center;gap:24px;flex:1"><canvas id="cdrDonutChart" style="max-width:140px;max-height:140px"></canvas><div class="cdr-donut-legend"><div class="cdr-donut-item"><span class="cdr-dot cdr-dot-green"></span><span>${stats ? stats.answered_calls : 0} отвечено</span></div><div class="cdr-donut-item"><span class="cdr-dot cdr-dot-red"></span><span>${stats ? stats.missed_calls : 0} пропущено</span></div><div class="cdr-donut-item cdr-donut-avg"><span>⏱ ${stats ? _cdrMinsec(stats.avg_duration) : "—"} среднее</span></div></div></div></div></div>
        </div>
        <div class="cdr-card">
          <div class="cdr-card-header">
            <span class="cdr-card-title">🏆 Топ агентов</span>
            <span style="font-size:11px;color:var(--muted)">${stats ? 'Неделя: ' + stats.calls_this_week : ''}</span>
          </div>
          <div class="cdr-card-body"><canvas id="agentChart" style="width:100%;max-height:220px;margin-bottom:12px;display:${agents.length?'block':'none'}"></canvas><div class="cdr-agent-list">${agentsHtml}</div></div>
        </div>
      </div>

      <div class="cdr-table-wrap">
        <div class="cdr-card-header" style="border-radius:0;flex-wrap:wrap;gap:8px">
          <div style="display:flex;align-items:center;gap:8px">
            ${!_cdrOffline ? '<div class="cdr-live-dot"></div>' : ''}
            <span class="cdr-card-title">${t('cdrLatestCalls')}</span>
            <span style="font-size:11px;color:var(--muted)">${filtered.length} ${t('cdrRecords')}</span>
          </div>
          <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-left:auto">
            <div class="cdr-filter-group">
              <button class="cdr-flt-btn${_cdrFilterDir==='all'?' cdr-flt-active':''}" onclick="cdrSetFilterDir('all')">${t('all')}</button>
              <button class="cdr-flt-btn${_cdrFilterDir==='inbound'?' cdr-flt-active':''}" onclick="cdrSetFilterDir('inbound')">📥 ${t('cdrInbounds')}</button>
              <button class="cdr-flt-btn${_cdrFilterDir==='outbound'?' cdr-flt-active':''}" onclick="cdrSetFilterDir('outbound')">📤 ${t('cdrOutbounds')}</button>
            </div>
            <div class="cdr-filter-group">
              <button class="cdr-flt-btn${_cdrFilterStatus==='all'?' cdr-flt-active':''}" onclick="cdrSetFilterStatus('all')">${t('all')}</button>
              <button class="cdr-flt-btn${_cdrFilterStatus==='answered'?' cdr-flt-active':''}" onclick="cdrSetFilterStatus('answered')">🟢 ${t('cdrAnswereds')}</button>
              <button class="cdr-flt-btn${_cdrFilterStatus==='missed'?' cdr-flt-active':''}" onclick="cdrSetFilterStatus('missed')">🔴 ${t('cdrMisseds')}</button>
            </div>
            <input class="search-input" value="${esc(_cdrSearch)}" placeholder="${t('cdrSearchPlh')}"
              oninput="cdrSetSearch(this.value)" style="width:170px">
            <input class="search-input" type="date" value="${esc(filter.from)}" title="${t('dateFrom')}"
              onchange="cdrSetFilter('from',this.value)" style="width:130px">
            <input class="search-input" type="date" value="${esc(filter.to)}" title="${t('dateTo')}"
              onchange="cdrSetFilter('to',this.value)" style="width:130px">
            <button class="btn btn-ghost btn-sm" onclick="cdrExportCSV()" title="${t('cdrExportCsv')}">${t('cdrExportCsv')}</button>
            <button class="btn btn-ghost btn-sm" onclick="cdrReload()" title="Обновить">🔄</button>
              <button class="btn btn-ghost btn-sm" onclick="cdrExportCSV()" title="Export CSV">&#128190; CSV</button>
              <label class="btn btn-ghost btn-sm" style="cursor:pointer" title="Import 3CX CSV">&#128194; CSV<input type="file" accept=".csv" style="display:none" onchange="cdrHandleFile(this)"></label>
          </div>
        </div>
        <div class="table-wrap" style="border-radius:0;border:none;box-shadow:none">
          <table>
            <thead><tr>
              ${_sTh('time',t('cdrTime'))}
              <th>${t('cdrCallId')}</th>
              ${_sTh('from',t('cdrFrom'))}
              ${_sTh('to',t('cdrTo'))}
              <th>${t('cdrDirection')}</th>
              ${_sTh('status',t('status'))}
              ${_sTh('wait',t('cdrWait'))}
              ${_sTh('talk',t('cdrTalk'))}
            </tr></thead>
            <tbody id="cdrTableBody">${tableRows}</tbody>
          </table>
        </div>
        <div class="cdr-pagination">
          <button class="btn btn-ghost btn-sm" onclick="cdrSetPage(${page-1})"${page===0?' disabled':''}>${t('cdrPrev')}</button>
          <span style="font-size:12px;color:var(--muted)">${t('cdrPage')} ${page+1} / ${totalPages}</span>
          <button class="btn btn-ghost btn-sm" onclick="cdrSetPage(${page+1})"${page>=totalPages-1?' disabled':''}>${t('cdrNextBtn')}</button>
        </div>
        <div class="cdr-summary">
          ${t('cdrShown')} <b>${pageRows.length}</b> ${t('cdrOf')} <b>${filtered.length}</b> &nbsp;|&nbsp;
          🟢 ${t('cdrAnsweredLbl')} <b>${totalAns}</b> &nbsp;|&nbsp;
          🔴 ${t('cdrMissedLbl')} <b>${totalMiss}</b> &nbsp;|&nbsp;
          ⏱ ${t('cdrAvgTalk')} <b>${_cdrMinsec(avgTalk)}</b>
        </div>
      </div>
    </div>`;
  if (window.Chart && agents.length) {
    if (window._agentChartInst) { window._agentChartInst.destroy(); window._agentChartInst = null; }
    var ctx = document.getElementById('agentChart');
    if (ctx) {
      window._agentChartInst = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: agents.map(function(a){ return (a.name && a.name !== a.dn) ? a.dn + ' · ' + a.name : a.dn; }),
          datasets: [
            { label: 'Всего', data: agents.map(function(a){ return a.calls; }), backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 4 },
            { label: 'Отвеченные', data: agents.map(function(a){ return a.answered; }), backgroundColor: 'rgba(34,197,94,0.7)', borderRadius: 4 },
            { label: 'Пропущенные', data: agents.map(function(a){ return a.missed; }), backgroundColor: 'rgba(239,68,68,0.7)', borderRadius: 4 }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          plugins: { legend: { labels: { color: '#94a3b8' } } },
          scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#e2e8f0' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }
  }
  requestAnimationFrame(function() {
    var barsEl = document.querySelector('.cdr-hour-bars');
    if (!barsEl) return;
    var availH = barsEl.clientHeight - 36;
    if (availH < 190) return;
    var scale = availH / 190;
    barsEl.querySelectorAll('.cdr-bar').forEach(function(b) {
      var h = parseInt(b.style.height) || 0;
      if (h > 0) b.style.height = Math.round(h * scale) + 'px';
    });
    barsEl.querySelectorAll('.cdr-grid-line').forEach(function(gl) {
      var bot = parseInt(gl.style.bottom) || 0;
      gl.style.bottom = Math.round((bot - 24) * scale + 24) + 'px';
    });
  });
  if (window.Chart && stats) {
    if (window._cdrDonutInst) { window._cdrDonutInst.destroy(); window._cdrDonutInst = null; }
    var dctx = document.getElementById("cdrDonutChart");
    if (dctx) {
      window._cdrDonutInst = new Chart(dctx, {
        type: "doughnut",
        data: {
          labels: ["Отвечено", "Пропущено"],
          datasets: [{ data: [stats.answered_calls, stats.missed_calls],
            backgroundColor: ["rgba(34,197,94,0.8)", "rgba(239,68,68,0.8)"],
            borderColor: ["#22c55e", "#ef4444"],
            borderWidth: 2, hoverOffset: 6 }]
        },
        options: {
          cutout: "68%", responsive: true, maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: function(c) { return c.label + ": " + c.raw; } } }
          }
        }
      });
    }
  }
}

function cdrToggleRow(id) {
  const el = document.getElementById('cdr-detail-' + id);
  if (el) el.style.display = el.style.display === 'none' ? 'table-row' : 'none';
}
function cdrSetSort(col) {
  _cdrSort.dir = _cdrSort.col === col ? _cdrSort.dir * -1 : -1;
  _cdrSort.col = col;
  _cdrRender();
}
function cdrSetPage(p)         { _cdrPage = p;         _cdrRender(); }
function cdrSetFilterDir(v)    { _cdrFilterDir = v;    _cdrPage = 0; _cdrRender(); }
function cdrSetFilterStatus(v) { _cdrFilterStatus = v; _cdrPage = 0; _cdrRender(); }
function cdrSetSearch(q)       { _cdrSearch = q;       _cdrPage = 0; _cdrRender(); }
function cdrSetFilter(key, val) {
  _cdrFilter[key] = val;
  if (key === 'from' || key === 'to') cdrReload();
  else _cdrRender();
}
function cdrExportCSV() {
  if (!_cdrRows.length) return;
  const hdrs = [t('cdrTime'),t('cdrCallId'),t('cdrFrom')+' ('+t('name')+')',t('cdrFrom')+' ('+t('phone')+')',t('cdrTo')+' ('+t('name')+')',t('cdrTo')+' ('+t('phone')+')',t('cdrDirection'),t('status'),t('cdrWait')+' sec',t('cdrTalk')+' sec'];
  const body = _cdrRows.map(r => {
    const dir = _cdrDirection(r), st = _cdrCallStatus(r);
    return [_cdrFmtDateTime(r.time_start),(r.callid||'').slice(0,8),r.from_dn||'',_fmtPhone(r.from_no),r.to_dn||'',_fmtPhone(r.to_no),dir.label,st.label,_cdrWaitSec(r),_cdrTalkSec(r)]
      .map(v => '"'+String(v).replace(/"/g,'""')+'"').join(',');
  });
  const csv = '﻿' + [hdrs.join(','), ...body].join('\r\n');
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),
    download: `zvonki_${new Date().toISOString().slice(0,10)}.csv`
  });
  a.click();
}
async function cdrReload() {
  _cdrStats = null; _cdrRows = []; _cdrPage = 0; _cdrImported = false;
  await render3CX();
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
  const ok = await UIService.confirm(t('confirmDelete'), t('delete'));
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
  const ok = await UIService.confirm(t('confirmDelete'), t('delete'));
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
    const inprog = task.status === 'inprogress';
    const priCls = `priority-${task.priority}`;
    const checkIcon = done ? '✓' : inprog ? '…' : '';
    const checkCls = done ? ' done' : inprog ? ' inprogress' : '';
    return `<div class="task-item">
      <div class="task-check${checkCls}" onclick="toggleTask('${task.id}','${task.status}')" title="${done ? t('taskDone') : inprog ? t('taskInProgress') : t('taskTodo')}">${checkIcon}</div>
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
  const next = { todo: 'inprogress', inprogress: 'done', done: 'todo' };
  CRMService.updateTask(id, { status: next[currentStatus] || 'todo' });
  renderTasks();
}

async function confirmDeleteTask(id) {
  const ok = await UIService.confirm(t('confirmDelete'), t('delete'));
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
        : AuthService.isSuperadmin() || AuthService.hasRole('admin')
          ? `<div class="form-group"><label>${t('newPassword')}</label><input class="form-control" type="password" name="password" minlength="6" placeholder="••••••"></div>`
          : ''
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
  if (!AuthService.canAdmin()) { UIService.toast(t('adminAccessDenied'), 'error'); return; }
  const data = UIService.collectForm('#empForm');
  if (!data.password) delete data.password;
  // role=user cannot change passwords
  if (AuthService.hasRole('user')) delete data.password;
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
  const ok = await UIService.confirm(t('confirmDelete'), t('delete'));
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
  const ok = await UIService.confirm(t('confirmDelete'), t('delete'));
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
  if (!AuthService.canAdmin()) {
    document.getElementById('pageContent').innerHTML = UIService.emptyState('🔒', t('adminAccessDenied'));
    return;
  }
  const isSA = AuthService.isSuperadmin();
  const isAdmin = AuthService.hasRole('admin');
  const users = AuthService.getAllUsers();
  const stats = CRMService.getStats();
  const pendingUsers = AuthService.getPendingUsers();
  let pendingCards = '';
  if (pendingUsers.length) {
    pendingUsers.forEach(function(u) {
      const deptLabel = CRMService.deptLabel(u.dept, _lang);
      const compLabel = CRMService.companyLabel(u.company);
      const date = u.createdAt ? new Date(u.createdAt).toLocaleDateString(_lang === 'ru' ? 'ru-RU' : 'az-AZ') : '—';
      pendingCards += '<div class="pending-user-card">'
        + '<div class="pending-user-avatar">' + esc(u.name.charAt(0).toUpperCase()) + '</div>'
        + '<div class="pending-user-info">'
        +   '<div class="pending-user-name">' + esc(u.name) + '</div>'
        +   '<div class="pending-user-email">' + esc(u.email) + '</div>'
        +   '<div class="pending-user-meta">'
        +     '<span>🏢 ' + deptLabel + '</span><span>🚗 ' + compLabel + '</span><span>📅 ' + date + '</span>'
        +   '</div>'
        + '</div>'
        + '<div class="pending-user-actions">'
        +   '<button class="btn btn-success btn-sm" onclick="approvePendingUser(\'' + u.id + '\',\'' + esc(u.name) + '\')">✓ Təsdiq</button>'
        +   '<button class="btn btn-danger btn-sm" onclick="rejectPendingUser(\'' + u.id + '\',\'' + esc(u.name) + '\')">✕ Rədd</button>'
        + '</div></div>';
    });
  }
  const pendingSection = pendingUsers.length ? `
    <div class="section-card" style="margin-bottom:16px">
      <div class="section-title" style="color:var(--warning);display:flex;align-items:center;gap:8px">
        ⏳ ${_lang==='ru'?'Ожидают подтверждения':'Təsdiq gözləyir'} (${pendingUsers.length})
      </div>
      <div class="pending-users-list">${pendingCards}</div>
    </div>` : '';
  const RS = {
    superadmin:'background:#fee2e2;color:#dc2626',admin:'background:#fef3c7;color:#d97706',
    callcenter_admin:'background:#ede9fe;color:#7c3aed',
    callcenter_manager:'background:#dbeafe;color:#2563eb',callcenter_specialist:'background:#e0f2fe;color:#0284c7',
    sales_director:'background:#dcfce7;color:#16a34a',salesperson:'background:#d1fae5;color:#059669',
    reception:'background:#fce7f3;color:#db2777',user:'background:#f1f5f9;color:#64748b'
  };
  const userRows = users.map(u => `<tr>
    <td><strong>${esc(u.name)}</strong></td>
    <td style="font-size:12px;color:var(--muted)">${esc(u.email)}</td>
    <td><span class="badge" style="${RS[u.role]||'background:#e2e8f0;color:#475569'}">${AuthService.roleLabel(u.role,_lang)}</span></td>
    <td>${esc(CRMService.deptLabel(u.dept,_lang))}</td>
    <td>${esc(CRMService.companyLabel(u.company))}</td>
    <td><div class="td-actions">
      ${(isSA||isAdmin)&&u.role!=='superadmin'?`<button class="btn btn-ghost btn-sm" onclick="openEditUserRole('${u.id}')">✏️ ${_lang==='ru'?'Роль':'Rol'}</button>`:''}
      ${isSA?`<button class="btn btn-ghost btn-sm" onclick="openChangePass('${u.id}')">🔑 ${t('adminChangePass')}</button>`:''}
      ${isSA&&u.role!=='superadmin'?`<button class="btn btn-danger btn-sm" style="padding:4px 8px" onclick="adminDeleteUser('${u.id}','${esc(u.name)}')">🗑</button>`:''}
    </div></td>
  </tr>`).join('');
  document.getElementById('pageContent').innerHTML = `
    <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <h2>${t('admin')}</h2>
      ${isSA||isAdmin?`<button class="btn btn-primary btn-sm" onclick="openCreateUser()">➕ ${_lang==='ru'?'Создать пользователя':'İstifadəçi yarat'}</button>`:''}
    </div>
    ${pendingSection}
    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-card stat-blue"><div class="stat-icon">👥</div><div class="stat-value">${stats.clients}</div><div class="stat-label">${t('adminClients')}</div></div>
      <div class="stat-card stat-green"><div class="stat-icon">🤝</div><div class="stat-value">${stats.deals}</div><div class="stat-label">${t('adminDeals')}</div></div>
      <div class="stat-card stat-yellow"><div class="stat-icon">⏰</div><div class="stat-value">${stats.pendingTasks}</div><div class="stat-label">${t('adminPendingTasks')}</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#f3e8ff">👤</div><div class="stat-value">${users.length}</div><div class="stat-label">${t('adminUsers')}</div></div>
    </div>
    <div class="section-card" style="margin-bottom:20px">
      <div class="section-title">${t('adminUserList')}</div>
      <div class="table-wrap" style="border:none;box-shadow:none;border-radius:0">
        <table><thead><tr>
          <th>${t('name')}</th><th>${t('email')}</th><th>${t('role')}</th>
          <th>${t('department')}</th><th>${t('company')}</th><th></th>
        </tr></thead><tbody>${userRows}</tbody></table>
      </div>
    </div>
    ${isSA?`<div class="section-card">
      <div class="section-title">${t('adminDataMgmt')}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;padding-top:4px">
        <button class="btn btn-ghost" onclick="adminExport()">📤 ${t('adminExport')}</button>
        <label class="btn btn-ghost" style="cursor:pointer">📥 ${t('adminImport')}<input type="file" accept=".json" style="display:none" onchange="adminImport(this)"></label>
        <button class="btn btn-danger" onclick="confirmClearData()">🗑️ ${t('adminClear')}</button>
      </div>
    </div>`:''}`;
}

function openCreateUser() {
  const isSA = AuthService.isSuperadmin();
  const roleOpts = AuthService.ROLES
    .filter(r => isSA ? r.value !== 'superadmin' : !['superadmin','admin','callcenter_admin'].includes(r.value))
    .map(r => `<option value="${r.value}">${r.label[_lang]||r.label.az}</option>`).join('');
  const deptOpts = (CRMService.DEPARTMENTS||[])
    .map(d => `<option value="${d.value}">${d.label[_lang]||d.label.az||d.value}</option>`).join('');
  const compOpts = (CRMService.COMPANIES||[])
    .map(c => `<option value="${c.value}">${c.label}</option>`).join('');
  UIService.openModal(
    _lang==='ru' ? 'Создать пользователя' : 'İstifadəçi yarat',
    `<form id="createUserForm">
      <div class="form-group"><label>${t('name')}</label>
        <input class="form-control" name="name" placeholder="${t('name')}"></div>
      <div class="form-group"><label>Email</label>
        <input class="form-control" name="email" type="email" placeholder="email@example.com"></div>
      <div class="form-group"><label>${_lang==='ru' ? 'Пароль' : 'Şifrə'}</label>
        <input class="form-control" name="password" type="password"></div>
      <div class="form-group"><label>${t('role')}</label>
        <select class="form-control" name="role">${roleOpts}</select></div>
      <div class="form-group"><label>${t('department')}</label>
        <select class="form-control" name="dept">${deptOpts}</select></div>
      <div class="form-group"><label>${t('company')}</label>
        <select class="form-control" name="company">${compOpts}</select></div>
    </form>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="submitCreateUserForm()">${t('save')}</button>`
  );
}

function submitCreateUserForm() {
  const data = UIService.collectForm('#createUserForm');
  if (!data.name || !data.email || !data.password) {
    UIService.toast(_lang==='ru' ? 'Заполните все поля' : 'Bütün sahələri doldurun', 'error'); return;
  }
  if (data.password.length < 6) {
    UIService.toast(_lang==='ru' ? 'Минимум 6 символов' : 'Min 6 simvol', 'error'); return;
  }
  const res = AuthService.createUser({
    name: data.name, email: data.email, password: data.password,
    role: data.role, dept: data.dept, company: data.company
  });
  if (!res.ok) { UIService.toast(res.error, 'error'); return; }
  UIService.closeModal();
  UIService.toast(_lang==='ru' ? 'Пользователь создан' : 'İstifadəçi yaradıldı', 'success');
  navigate('admin');
}

let _editRoleUserId = null;

function openEditUserRole(userId) {
  _editRoleUserId = userId;
  const u = AuthService.getAllUsers().find(x => x.id === userId);
  if (!u) return;
  const isSA = AuthService.isSuperadmin();
  const roleOpts = AuthService.ROLES
    .filter(r => isSA ? r.value !== 'superadmin' : !['superadmin','admin','callcenter_admin'].includes(r.value))
    .map(r => `<option value="${r.value}"${r.value===u.role ? ' selected' : ''}>${r.label[_lang]||r.label.az}</option>`).join('');
  UIService.openModal(
    (_lang==='ru' ? 'Изменить роль: ' : 'Rolu dəyiş: ') + esc(u.name),
    `<form id="editRoleForm">
      <div class="form-group"><label>${t('role')}</label>
        <select class="form-control" name="role">${roleOpts}</select></div>
    </form>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="submitEditRoleForm()">${t('save')}</button>`
  );
}

function submitEditRoleForm() {
  const data = UIService.collectForm('#editRoleForm');
  AuthService.updateUser(_editRoleUserId, { role: data.role });
  UIService.closeModal();
  UIService.toast(_lang==='ru' ? 'Роль обновлена' : 'Rol yeniləndi', 'success');
  navigate('admin');
}

async function adminDeleteUser(userId, name) {
  const ok=await UIService.confirm(
    _lang==='ru'?`Удалить пользователя "${name}"?`:`"${name}" silinsin?`,
    _lang==='ru'?'Удалить':'Sil'
  );
  if(!ok) return;
  const res=AuthService.deleteUser(userId);
  UIService.toast(res?(_lang==='ru'?'Удалён':'Silindi'):(_lang==='ru'?'Нельзя удалить себя':'Özünüzü silə bilməzsiniz'),res?'success':'error');
  navigate('admin');
}


let _changePassUserId = null;

function openChangePass(userId) {
  _changePassUserId = userId;
  UIService.openModal(
    t('adminChangePass'),
    `<form id="changePassForm">
      <div class="form-group">
        <label>${t('adminNewPass')}</label>
        <input class="form-control" name="password" type="password" minlength="6" placeholder="${t('adminPassMin')}">
      </div>
    </form>`,
    `<button class="btn btn-ghost" onclick="closeModal()">${t('cancel')}</button>
     <button class="btn btn-primary" onclick="submitChangePassForm()">${t('save')}</button>`
  );
}

function submitChangePassForm() {
  const data = UIService.collectForm('#changePassForm');
  if (data.password.length < 6) { UIService.toast(t('adminPassMin'), 'error'); return; }
  const users = AuthService.getAllUsers();
  const idx = users.findIndex(u => u.id === _changePassUserId);
  if (idx < 0) return;
  users[idx].password = data.password;
  StorageService.setList('users', users);
  UIService.closeModal();
  UIService.toast(t('adminPassSaved'), 'success');
}

function adminExport() {
  const data = {};
  ['clients','deals','tasks','documents','visits','sales','calls'].forEach(k => {
    data[k] = StorageService.getList(k);
  });
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'srcrm_backup_' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
}

function adminImport(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async e => {
    try {
      const data = JSON.parse(e.target.result);
      const ok = await UIService.confirm(t('adminImport') + '?', t('adminImport'));
      if (!ok) return;
      Object.entries(data).forEach(([k, v]) => { if (Array.isArray(v)) StorageService.setList(k, v); });
      UIService.toast(t('adminImport') + ' OK', 'success');
      navigate('admin');
    } catch (err) { UIService.toast('JSON parse error', 'error'); }
  };
  reader.readAsText(file);
}

async function approvePendingUser(id, name) {
  const ok = await UIService.confirm(`${name} təsdiq edilsin?`, 'Təsdiq et / Одобрить');
  if (!ok) return;
  AuthService.approvePendingUser(id);
  UIService.toast(`${name} təsdiq edildi`, 'success');
  navigate('admin');
}

async function rejectPendingUser(id, name) {
  const ok = await UIService.confirm(`${name} rədd edilsin?`, 'Rədd et / Отклонить');
  if (!ok) return;
  AuthService.rejectPendingUser(id);
  UIService.toast(`${name} rədd edildi`, 'error');
  navigate('admin');
}

async function confirmClearData() {
  const ok = await UIService.confirm(t('adminClearConfirm'), t('adminClear'));
  if (!ok) return;
  ['clients', 'deals', 'tasks', 'documents', 'visits', 'sales', 'calls'].forEach(k => StorageService.setList(k, []));
  UIService.toast('Məlumatlar silindi', 'success');
  navigate('dashboard');
}

/* ══ INFO DASHBOARD ══ */
function renderInfo() {
  const sites = [
    { name: 'Changan Azerbaijan',       url: 'https://changan.az',                    domain: 'changan.az',              color: '#c0392b' },
    { name: 'Lynk & Co Azerbaijan',     url: 'https://lynkco.az',                     domain: 'lynkco.az',               color: '#1a1a2e' },
    { name: 'Skoda Azerbaijan',         url: 'https://skoda.az',                      domain: 'skoda.az',                color: '#4ac14a' },
    { name: 'Leapmotor Azerbaijan',     url: 'https://leapmotors.az',                 domain: 'leapmotors.az',           color: '#e67e22' },
    { name: 'AVATR Azerbaijan',         url: 'https://avatr.az',                      domain: 'avatr.az',                color: '#8e44ad' },
    { name: 'Mercedes-Benz Autostar',   url: 'https://mercedes-benz-autostar.az',     domain: 'mercedes-benz-autostar.az', color: '#2c3e50' },
    { name: 'XPENG Azerbaijan',         url: 'https://xpengauto.az',                  domain: 'xpengauto.az',            color: '#2980b9' }
  ];

  const cards = sites.map(s => `
    <a class="info-site-card" href="${s.url}" target="_blank" rel="noopener">
      <div class="info-site-icon" style="background:${s.color}22;border-color:${s.color}44">
        <img src="https://www.google.com/s2/favicons?domain=${s.domain}&sz=64" alt="${esc(s.name)}" width="40" height="40" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <span class="info-site-icon-fallback" style="display:none;color:${s.color}">🌐</span>
      </div>
      <div class="info-site-name">${esc(s.name)}</div>
      <div class="info-site-url">${s.domain}</div>
      <div class="info-site-arrow">→</div>
    </a>`).join('');

  document.getElementById('pageContent').innerHTML = `
    <div class="info-dashboard">
      <div class="info-phone-block">
        <div class="info-phone-icon">📞</div>
        <div>
          <div class="info-phone-label">${_lang === 'ru' ? 'Контактный номер SR Group' : 'SR Group əlaqə nömrəsi'}</div>
          <div class="info-phone-number">*5544</div>
        </div>
      </div>
      <div class="info-section-title">${_lang === 'ru' ? 'Сайты холдинга SR Group' : 'SR Group holdinqinin saytları'}</div>
      <div class="info-sites-grid">${cards}</div>
    </div>`;
}

/* ══ UTILS ══ */
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

window.renderCurrentPageFromLiveUpdate = function () {
  if (!_user) return;
  const fresh = AuthService.currentUser();
  if (!fresh) {
    _user = null;
    UIService.toast('Hesabınıza başqa cihazdan giriş edildi. / Выполнен вход с другого устройства.', 'error');
    setTimeout(() => showAuth(), 1500);
    return;
  }
  navigate(_page);
};

// Periodic session check every 30 seconds
setInterval(() => {
  if (!_user) return;
  const fresh = AuthService.currentUser();
  if (!fresh) {
    _user = null;
    UIService.toast('Hesabınıza başqa cihazdan giriş edildi. / Выполнен вход с другого устройства.', 'error');
    setTimeout(() => showAuth(), 1500);
  }
}, 30000);
