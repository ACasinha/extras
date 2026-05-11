///  JAVASCRIPT — UI HELPERS & INIT  ///

// ── Navigation ─────────────────────────────────────
function showTab(tab) {
  document.querySelectorAll('.tab, .sidebar-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.page').forEach(p =>
    p.classList.toggle('active', p.id === 'page-' + tab));
  if (tab === 'registo') renderRegisto();
}

// ── Stepper (integer) ──────────────────────────────
function stepperChange(id, delta) {
  const el  = document.getElementById(id);
  const val = (parseFloat(el.value) || 0) + delta;
  el.value  = Math.max(0, val);
  autoCalc();
}

// ── Stepper (float, for registo hours) ────────────
function stepperChangeFloat(id, delta) {
  const el  = document.getElementById(id);
  const val = Math.round(((parseFloat(el.value) || 0) + delta) * 10) / 10;
  el.value  = Math.max(0.5, val);
}

// ── Formatting ─────────────────────────────────────
function fmt(n) {
  if (typeof n !== 'number' || isNaN(n)) return '—';
  return n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString('pt-PT', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch { return iso; }
}

// ── Toast ──────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── Calc display (mirrors config values into calc page) ──
function updateCalcDisplay() {
  const cfg = loadConfig();

  // Keep hidden inputs in sync so calculator.js can read them
  const salEl = document.getElementById('salarioBase');
  const subEl = document.getElementById('subRefeicao');
  if (salEl) salEl.value = cfg.salarioBase;
  if (subEl) subEl.value = cfg.subRefeicao;

  // Update the info banner on the calc page
  const bd = document.getElementById('calcBaseDisplay');
  const sd = document.getElementById('calcSubRefDisplay');
  if (bd) bd.textContent = cfg.salarioBase.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) + ' €';
  if (sd) sd.textContent = cfg.subRefeicao.toLocaleString('pt-PT',  { minimumFractionDigits: 2 }) + ' €';
}

// ── Online/Offline ─────────────────────────────────
function updateOnlineStatus() {
  document.getElementById('offlineBar').classList.toggle('show', !navigator.onLine);
}
window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// ── Init ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const cfg = loadConfig();
  applyConfig(cfg);
  updateOnlineStatus();
  renderHistory();
  renderRegisto();
  autoCalc();

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('SW registered'))
      .catch(e  => console.warn('SW registration failed:', e));
  }
});
