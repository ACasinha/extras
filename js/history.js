<!-- ═══════════════════════════════════════════════
     JAVASCRIPT — HISTORY
═══════════════════════════════════════════════ -->

function saveToHistory() {
  if (!currentResult) { showToast('Calcule primeiro!'); return; }
  const history = getHistory();
  history.unshift({ ...currentResult, id: Date.now() });
  if (history.length > 50) history.pop();
  localStorage.setItem('heHistory', JSON.stringify(history));
  renderHistory();
  showToast('✓ Guardado no histórico');
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem('heHistory') || '[]'); } catch { return []; }
}

function renderHistory() {
  const list    = document.getElementById('historyList');
  const history = getHistory();
  if (!history.length) {
    list.innerHTML = `
      <div class="empty-state">
        <span class="emoji">📋</span>
        <p>Sem cálculos guardados.<br>Efectue um cálculo e guarde-o no Resumo.</p>
      </div>`;
    return;
  }
  list.innerHTML = `<div class="history-grid">` +
    history.map(h => `
      <div class="history-item" onclick="showHistoryDetail(${h.id})">
        <div>
          <div style="font-size:14px; font-weight:700;">${fmtDate(h.ts)}</div>
          <div class="history-date">${h.totalHoras}h extra · ${fmt(h.totalHorasExtra)} bruto</div>
        </div>
        <div>
          <div class="history-net">${fmt(h.salarioLiquido)}</div>
          <div style="font-size:11px; color:var(--text-muted); text-align:right">líquido</div>
        </div>
      </div>`).join('') +
    `</div>`;
}

function showHistoryDetail(id) {
  const h = getHistory().find(x => x.id === id);
  if (!h) return;
  document.getElementById('modalTitle').textContent = fmtDate(h.ts);
  document.getElementById('modalContent').innerHTML = `
    <div class="stat-grid" style="margin-bottom:16px;">
      <div class="stat-cell hl">
        <div class="val pos">${fmt(h.salarioLiquido)}</div>
        <div class="lbl">Líquido Total</div>
      </div>
      <div class="stat-cell">
        <div class="val">${fmt(h.salarioBruto)}</div>
        <div class="lbl">Bruto Total</div>
      </div>
      <div class="stat-cell">
        <div class="val">${fmt(h.totalHorasExtra)}</div>
        <div class="lbl">Val. Horas Extra</div>
      </div>
      <div class="stat-cell">
        <div class="val neg">−${fmt(h.totalDescontos)}</div>
        <div class="lbl">Total Descontos</div>
      </div>
    </div>
    <div style="font-size:12px; color:var(--text-muted); line-height:1.8;">
      ${h.h1N}h 1ª normal + ${h.hNR}h restantes + ${h.hDes}h descanso<br>
      Base: ${fmt(h.salBase)} · SS: ${h.cfg?.ssBase}% · Tabela IRS: ${h.cfg?.irsTabela || 'T1'}
    </div>
    <button class="btn-danger" onclick="deleteHistory(${h.id})">
      🗑 Eliminar registo
    </button>`;
  document.getElementById('detailModal').classList.add('open');
}

function deleteHistory(id) {
  const history = getHistory().filter(x => x.id !== id);
  localStorage.setItem('heHistory', JSON.stringify(history));
  renderHistory();
  closeModal();
  showToast('Registo eliminado');
}

function closeModal() {
  document.getElementById('detailModal').classList.remove('open');
}
