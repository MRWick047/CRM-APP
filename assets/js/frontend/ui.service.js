'use strict';

const UIService = (() => {

  /* ── TOAST ── */
  function toast(msg, type = 'info', duration = 3000) {
    const wrap = document.getElementById('toastWrap');
    if (!wrap) return;
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    el.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${msg}</span>`;
    wrap.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(110%)';
      el.style.transition = '.3s';
      setTimeout(() => el.remove(), 300);
    }, duration);
  }

  /* ── MODAL ── */
  let _modalCallback = null;

  function openModal(title, bodyHTML, footHTML) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = bodyHTML;
    document.getElementById('modalFoot').innerHTML = footHTML || '';
    document.getElementById('modalOverlay').classList.add('open');
  }

  function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
    _modalCallback = null;
  }

  function overlayClick(e) {
    if (e.target.id === 'modalOverlay') closeModal();
  }

  /* ── CONFIRM ── */
  let _confirmResolve = null;

  function confirm(text, okLabel = 'Удалить') {
    return new Promise(resolve => {
      _confirmResolve = resolve;
      document.getElementById('confirmText').textContent = text;
      document.getElementById('confirmOkBtn').textContent = okLabel;
      document.getElementById('confirmOverlay').classList.add('open');
    });
  }

  function resolveConfirm(val) {
    document.getElementById('confirmOverlay').classList.remove('open');
    if (_confirmResolve) { _confirmResolve(val); _confirmResolve = null; }
  }

  function confirmOverlayClick(e) {
    if (e.target.id === 'confirmOverlay') resolveConfirm(false);
  }

  /* ── FORM HELPERS ── */
  function buildSelect(options, selectedVal, nameAttr, cls = 'form-control') {
    const opts = options.map(o => {
      const label = typeof o.label === 'object' ? o.label.ru : o.label;
      return `<option value="${o.value}"${o.value === selectedVal ? ' selected' : ''}>${label}</option>`;
    }).join('');
    return `<select class="${cls}" name="${nameAttr}">${opts}</select>`;
  }

  function formData(formEl) {
    const out = {};
    new FormData(formEl).forEach((v, k) => { out[k] = v; });
    return out;
  }

  function collectForm(selector) {
    const form = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!form) return {};
    return formData(form);
  }

  /* ── BADGE ── */
  function stageBadge(stage, lang = 'ru') {
    const info = CRMService.stageInfo(stage);
    return `<span class="badge ${info.color}">${info.label[lang] || stage}</span>`;
  }

  function priorityBadge(p) {
    const map = { high: 'badge-red', medium: 'badge-yellow', low: 'badge-green' };
    return `<span class="badge ${map[p] || 'badge-gray'}">${p}</span>`;
  }

  /* ── EMPTY STATE ── */
  function emptyState(icon, title, sub = '') {
    return `<div class="empty-state"><div class="empty-state-icon">${icon}</div><h3>${title}</h3>${sub ? `<p>${sub}</p>` : ''}</div>`;
  }

  /* ── SIDEBAR ── */
  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
  }

  return {
    toast, openModal, closeModal, overlayClick,
    confirm, resolveConfirm, confirmOverlayClick,
    buildSelect, formData, collectForm,
    stageBadge, priorityBadge, emptyState, toggleSidebar
  };
})();

/* expose globals for inline handlers */
function closeModal() { UIService.closeModal(); }
function overlayClick(e) { UIService.overlayClick(e); }
function closeConfirm() { UIService.resolveConfirm(false); }
function confirmOverlayClick(e) { UIService.confirmOverlayClick(e); }
function toggleSidebar() { UIService.toggleSidebar(); }
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('confirmOkBtn').addEventListener('click', () => UIService.resolveConfirm(true));
});
