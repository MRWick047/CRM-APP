'use strict';

const CRMService = (() => {

  /* ── CONSTANTS ── */
  const COMPANIES = [
    { value: 'changan', label: 'Changan' },
    { value: 'lynk', label: 'Lynk & Co' },
    { value: 'skoda', label: 'Škoda' },
    { value: 'avatr', label: 'AVATR' },
    { value: 'mercedes', label: 'Mercedes / Autostar' },
    { value: 'leap', label: 'Leap Motors' }
  ];

  const DEPARTMENTS = [
    { value: 'sales', label: { ru: 'Продажи', az: 'Satış' } },
    { value: 'marketing', label: { ru: 'Маркетинг', az: 'Marketinq' } },
    { value: 'service', label: { ru: 'Сервис', az: 'Servis' } },
    { value: 'it', label: { ru: 'IT', az: 'IT' } },
    { value: 'procurement', label: { ru: 'Закупки', az: 'Tədarük' } },
    { value: 'callcenter', label: { ru: 'Колл-центр', az: 'Zəng Mərkəzi' } }
  ];

  const DEAL_STAGES = [
    { value: 'new', label: { ru: 'Новая', az: 'Yeni' }, color: 'badge-blue' },
    { value: 'negotiation', label: { ru: 'Переговоры', az: 'Danışıqlar' }, color: 'badge-yellow' },
    { value: 'proposal', label: { ru: 'КП отправлено', az: 'Təklif göndərildi' }, color: 'badge-purple' },
    { value: 'won', label: { ru: 'Выиграна', az: 'Qazanıldı' }, color: 'badge-green' },
    { value: 'lost', label: { ru: 'Проиграна', az: 'Uduludu' }, color: 'badge-red' }
  ];

  const PRIORITIES = [
    { value: 'high', label: { ru: 'Высокий', az: 'Yüksək' } },
    { value: 'medium', label: { ru: 'Средний', az: 'Orta' } },
    { value: 'low', label: { ru: 'Низкий', az: 'Aşağı' } }
  ];

  const CLIENT_SOURCES = [
    { value: 'website', label: { ru: 'Сайт', az: 'Sayt' } },
    { value: 'instagram', label: { ru: 'Instagram', az: 'Instagram' } },
    { value: 'referral', label: { ru: 'Рекомендация', az: 'Tövsiyə' } },
    { value: 'showroom', label: { ru: 'Шоурум', az: 'Şoroom' } },
    { value: 'callcenter', label: { ru: 'Колл-центр', az: 'Zəng Mərkəzi' } },
    { value: 'other', label: { ru: 'Другое', az: 'Digər' } }
  ];

  /* ── CLIENTS ── */
  function getClients(filter = {}) {
    let list = StorageService.getList('clients');
    if (filter.company) list = list.filter(c => c.company === filter.company);
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.phone || '').includes(q) ||
        (c.email || '').toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }

  function addClient(data) {
    if (!data.name || !data.name.trim()) return { ok: false, error: 'Введите имя клиента' };
    const client = {
      id: StorageService.uid(),
      name: data.name.trim(),
      phone: (data.phone || '').trim(),
      email: (data.email || '').trim().toLowerCase(),
      company: data.company || 'changan',
      source: data.source || 'other',
      status: data.status || 'active',
      notes: (data.notes || '').trim(),
      assignedTo: data.assignedTo || null,
      createdBy: data.createdBy,
      createdAt: Date.now()
    };
    StorageService.addItem('clients', client);
    return { ok: true, client };
  }

  function updateClient(id, patch) {
    const updated = StorageService.updateItem('clients', id, patch);
    return updated ? { ok: true } : { ok: false, error: 'Клиент не найден' };
  }

  function deleteClient(id) {
    StorageService.deleteItem('clients', id);
    StorageService.setList('deals', StorageService.getList('deals').filter(d => d.clientId !== id));
  }

  function getClient(id) { return StorageService.findById('clients', id); }

  /* ── DEALS ── */
  function getDeals(filter = {}) {
    let list = StorageService.getList('deals');
    if (filter.company) list = list.filter(d => d.company === filter.company);
    if (filter.stage) list = list.filter(d => d.stage === filter.stage);
    if (filter.clientId) list = list.filter(d => d.clientId === filter.clientId);
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(d => d.title.toLowerCase().includes(q));
    }
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }

  function addDeal(data) {
    if (!data.title || !data.title.trim()) return { ok: false, error: 'Введите название сделки' };
    const deal = {
      id: StorageService.uid(),
      title: data.title.trim(),
      clientId: data.clientId || null,
      amount: parseFloat(data.amount) || 0,
      stage: data.stage || 'new',
      company: data.company || 'changan',
      assignedTo: data.assignedTo || null,
      dueDate: data.dueDate || null,
      notes: (data.notes || '').trim(),
      createdBy: data.createdBy,
      createdAt: Date.now()
    };
    StorageService.addItem('deals', deal);
    return { ok: true, deal };
  }

  function updateDeal(id, patch) {
    if (patch.amount !== undefined) patch.amount = parseFloat(patch.amount) || 0;
    const updated = StorageService.updateItem('deals', id, patch);
    return updated ? { ok: true } : { ok: false, error: 'Сделка не найдена' };
  }

  function deleteDeal(id) { StorageService.deleteItem('deals', id); }
  function getDeal(id) { return StorageService.findById('deals', id); }

  /* ── TASKS ── */
  function getTasks(filter = {}) {
    let list = StorageService.getList('tasks');
    const me = filter.userId;
    if (me && !AuthService.canAdmin()) {
      list = list.filter(t => t.assignedTo === me || t.createdBy === me);
    }
    if (filter.status) list = list.filter(t => t.status === filter.status);
    if (filter.priority) list = list.filter(t => t.priority === filter.priority);
    return list.sort((a, b) => {
      const priMap = { high: 0, medium: 1, low: 2 };
      return (priMap[a.priority] || 1) - (priMap[b.priority] || 1) || b.createdAt - a.createdAt;
    });
  }

  function addTask(data) {
    if (!data.title || !data.title.trim()) return { ok: false, error: 'Введите название задачи' };
    const task = {
      id: StorageService.uid(),
      title: data.title.trim(),
      description: (data.description || '').trim(),
      assignedTo: data.assignedTo || data.createdBy,
      relatedClient: data.relatedClient || null,
      relatedDeal: data.relatedDeal || null,
      priority: data.priority || 'medium',
      status: 'todo',
      dueDate: data.dueDate || null,
      createdBy: data.createdBy,
      createdAt: Date.now()
    };
    StorageService.addItem('tasks', task);
    return { ok: true, task };
  }

  function updateTask(id, patch) {
    const updated = StorageService.updateItem('tasks', id, patch);
    return updated ? { ok: true } : { ok: false, error: 'Задача не найдена' };
  }

  function deleteTask(id) { StorageService.deleteItem('tasks', id); }

  function countPendingTasks(userId) {
    return StorageService.getList('tasks').filter(t =>
      t.status !== 'done' && (t.assignedTo === userId || t.createdBy === userId)
    ).length;
  }

  /* ── DOCUMENTS ── */
  function getDocuments(filter = {}) {
    let list = StorageService.getList('documents');
    if (filter.clientId) list = list.filter(d => d.clientId === filter.clientId);
    if (filter.dealId) list = list.filter(d => d.dealId === filter.dealId);
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(d => d.title.toLowerCase().includes(q));
    }
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }

  function addDocument(data) {
    if (!data.title || !data.title.trim()) return { ok: false, error: 'Введите название документа' };
    const doc = {
      id: StorageService.uid(),
      title: data.title.trim(),
      type: data.type || 'contract',
      clientId: data.clientId || null,
      dealId: data.dealId || null,
      content: (data.content || '').trim(),
      createdBy: data.createdBy,
      createdAt: Date.now()
    };
    StorageService.addItem('documents', doc);
    return { ok: true, doc };
  }

  function deleteDocument(id) { StorageService.deleteItem('documents', id); }

  /* ── REPORTS ── */
  function getStats() {
    const clients = StorageService.getList('clients');
    const deals = StorageService.getList('deals');
    const tasks = StorageService.getList('tasks');
    const users = AuthService.getAllUsers();

    const wonDeals = deals.filter(d => d.stage === 'won');
    const revenue = wonDeals.reduce((s, d) => s + (d.amount || 0), 0);
    const pendingTasks = tasks.filter(t => t.status !== 'done').length;

    const dealsByStage = {};
    DEAL_STAGES.forEach(s => { dealsByStage[s.value] = deals.filter(d => d.stage === s.value).length; });

    const clientsByCompany = {};
    COMPANIES.forEach(c => { clientsByCompany[c.value] = clients.filter(cl => cl.company === c.value).length; });

    return { clients: clients.length, deals: deals.length, revenue, pendingTasks, employees: users.length, wonDeals: wonDeals.length, dealsByStage, clientsByCompany };
  }

  /* ── HELPERS ── */
  function companyLabel(val) { return (COMPANIES.find(c => c.value === val) || {}).label || val; }
  function stageInfo(val) { return DEAL_STAGES.find(s => s.value === val) || { label: { ru: val, az: val }, color: 'badge-gray' }; }
  function deptLabel(val, lang = 'ru') { const d = DEPARTMENTS.find(x => x.value === val); return d ? d.label[lang] : val; }
  function priorityLabel(val, lang = 'ru') { const p = PRIORITIES.find(x => x.value === val); return p ? p.label[lang] : val; }
  function sourceLabel(val, lang = 'ru') { const s = CLIENT_SOURCES.find(x => x.value === val); return s ? s.label[lang] : val; }
  function formatMoney(n) { return new Intl.NumberFormat('az-AZ', { style: 'currency', currency: 'AZN', maximumFractionDigits: 0 }).format(n || 0); }
  function formatDate(ts) { if (!ts) return '—'; return new Date(ts).toLocaleDateString('ru-RU'); }

  return {
    COMPANIES, DEPARTMENTS, DEAL_STAGES, PRIORITIES, CLIENT_SOURCES,
    getClients, addClient, updateClient, deleteClient, getClient,
    getDeals, addDeal, updateDeal, deleteDeal, getDeal,
    getTasks, addTask, updateTask, deleteTask, countPendingTasks,
    getDocuments, addDocument, deleteDocument,
    getStats,
    companyLabel, stageInfo, deptLabel, priorityLabel, sourceLabel, formatMoney, formatDate
  };
})();
