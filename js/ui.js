//  JAVASCRIPT — UI HELPERS & INIT  //

// ── Navigation ─────────────────────────────────────
function showTab(tab) {
  document.querySelectorAll('.tab, .sidebar-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.page').forEach(p =>
    p.classList.toggle('active', p.id === 'page-' + tab));
}

// ── Stepper ────────────────────────────────────────
function stepperChange(id, delta) {
  const el  = document.getElementById(id);
  const val = (parseFloat(el.value) || 0) + delta;
  el.value  = Math.max(0, val);
  autoCalc();
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
  autoCalc();

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('SW registered'))
      .catch(e  => console.warn('SW registration failed:', e));
  }
});
