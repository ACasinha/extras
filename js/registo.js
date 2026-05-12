/// JAVASCRIPT — REGISTO DIÁRIO DE HORAS EXTRA ///

'use strict';

// ── Storage helpers ────────────────────────────────
function getRegistoKey() {
  const now = new Date();
  return `heRegisto_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getRegistoKeyForMonth(year, month) {
  return `heRegisto_${year}_${String(month).padStart(2, '0')}`;
}

function loadRegisto(key) {
  try {
    return JSON.parse(localStorage.getItem(key || getRegistoKey()) || '[]');
  } catch { return []; }
}

function saveRegisto(entries, key) {
  localStorage.setItem(key || getRegistoKey(), JSON.stringify(entries));
}

// ── State ──────────────────────────────────────────
let registoEditId = null;
let registoCurrentMonth = null;

function getRegistoMonth() {
  if (registoCurrentMonth) return registoCurrentMonth;
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

// ── Time helpers ───────────────────────────────────
/**
 * Parse "HH:MM" → total minutes from midnight.
 * Returns null if invalid.
 */
function parseTime(str) {
  if (!str || !str.includes(':')) return null;
  const [h, m] = str.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
}

/**
 * Given start and end times (HH:MM strings) and the day tipo,
 * calculate { horas, h1Normal, hNormalRest, hDescanso }.
 * Returns null if inputs are invalid or end <= start.
 */
function calcHorasFromTime(startStr, endStr, tipo) {
  const start = parseTime(startStr);
  const end   = parseTime(endStr);
  if (start === null || end === null) return null;

  // Support overnight (end < start means next day)
  let diffMin = end - start;
  if (diffMin <= 0) diffMin += 24 * 60;
  if (diffMin <= 0) return null;

  const horas = Math.round((diffMin / 60) * 10) / 10; // rounded to 0.1h

  let h1Normal = 0, hNormalRest = 0, hDescanso = 0;
  if (tipo === 'descanso') {
    hDescanso = horas;
  } else {
    h1Normal   = Math.min(horas, 1);
    hNormalRest = Math.max(0, Math.round((horas - 1) * 10) / 10);
  }

  return { horas, h1Normal, hNormalRest, hDescanso };
}

/** Format minutes-from-midnight back to "HH:MM" */
function minsToTime(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

// ── Auto-calculate horas from time inputs ──────────
function onTimeOrTipoChange() {
  const start = document.getElementById('regHoraInicio').value;
  const end   = document.getElementById('regHoraFim').value;
  const tipo  = document.getElementById('regTipo').value;
  const res   = document.getElementById('timeCalcResult');
  const horasInput = document.getElementById('regHoras');

  toggleRegistoTipoInfo(tipo);

  if (!start || !end) {
    res.className = 'time-calc-result empty';
    res.innerHTML = '<span>Seleccione hora de início e fim para calcular automaticamente</span>';
    return;
  }

  const calc = calcHorasFromTime(start, end, tipo);
  if (!calc) {
    res.className = 'time-calc-result empty';
    res.innerHTML = '<span style="color:var(--danger)">⚠️ Hora de fim igual à de início</span>';
    return;
  }

  // Update the horas field automatically
  horasInput.value = calc.horas;

  // Build breakdown label
  const cfg = loadConfig();
  let breakdown = '';
  if (tipo === 'descanso') {
    breakdown = `${calc.horas}h × <strong style="color:var(--brand)">+${cfg.pDesc}%</strong>`;
  } else {
    const parts = [];
    if (calc.h1Normal > 0)   parts.push(`${calc.h1Normal}h × <strong style="color:var(--accent)">+${cfg.p1h}%</strong>`);
    if (calc.hNormalRest > 0) parts.push(`${calc.hNormalRest}h × <strong style="color:var(--accent)">+${cfg.pRest}%</strong>`);
    breakdown = parts.join(' + ');
  }

  // Overnight notice
  const startMins = parseTime(start);
  const endMins   = parseTime(end);
  const overnight = endMins <= startMins ? ' · <span style="color:var(--accent)">↪ dia seguinte</span>' : '';

  res.className = 'time-calc-result';
  res.innerHTML = `⏱ <strong style="color:var(--text-primary)">${calc.horas}h</strong> &nbsp;·&nbsp; ${breakdown}${overnight}`;
}

// ── Add / Edit Entry ───────────────────────────────
function openRegistoModal(editId) {
  registoEditId = editId || null;
  const modal = document.getElementById('registoModal');
  const title = document.getElementById('registoModalTitle');

  if (editId) {
    const { year, month } = getRegistoMonth();
    const entries = loadRegisto(getRegistoKeyForMonth(year, month));
    const entry   = entries.find(e => e.id === editId);
    if (!entry) return;
    title.textContent = 'Editar Registo';
    document.getElementById('regData').value       = entry.data;
    document.getElementById('regTipo').value        = entry.tipo;
    document.getElementById('regHoraInicio').value  = entry.horaInicio || '';
    document.getElementById('regHoraFim').value     = entry.horaFim    || '';
    document.getElementById('regHoras').value       = entry.horas;
    document.getElementById('regNota').value        = entry.nota || '';
  } else {
    title.textContent = 'Novo Registo de Horas Extra';
    const now = new Date();
    const { year, month } = getRegistoMonth();
    const isCurrentMonth  = now.getFullYear() === year && now.getMonth() + 1 === month;
    const defaultDay      = isCurrentMonth ? String(now.getDate()).padStart(2, '0') : '01';
    document.getElementById('regData').value       = `${year}-${String(month).padStart(2,'0')}-${defaultDay}`;
    document.getElementById('regTipo').value        = 'normal';
    document.getElementById('regHoraInicio').value  = '';
    document.getElementById('regHoraFim').value     = '';
    document.getElementById('regHoras').value       = '1';
    document.getElementById('regNota').value        = '';
  }

  onTimeOrTipoChange();
  modal.classList.add('open');
}

function closeRegistoModal() {
  document.getElementById('registoModal').classList.remove('open');
  registoEditId = null;
}

function toggleRegistoTipoInfo(tipo) {
  const cfg  = loadConfig();
  const info = document.getElementById('regTipoInfo');
  if (!info) return;
  if (tipo === 'descanso') {
    info.innerHTML = `<span style="color:var(--brand)">Descanso/Feriado:</span> todas as horas a <strong>+${cfg.pDesc}%</strong>`;
  } else {
    info.innerHTML = `<span style="color:var(--accent)">Dia normal:</span> 1ª hora a <strong>+${cfg.p1h}%</strong>, restantes a <strong>+${cfg.pRest}%</strong>`;
  }
}

function saveRegistoEntry() {
  const data       = document.getElementById('regData').value;
  const tipo       = document.getElementById('regTipo').value;
  const horaInicio = document.getElementById('regHoraInicio').value;
  const horaFim    = document.getElementById('regHoraFim').value;
  const horas      = parseFloat(document.getElementById('regHoras').value) || 0;
  const nota       = document.getElementById('regNota').value.trim();

  if (!data || horas <= 0) {
    showToast('⚠️ Preencha data e horas válidas');
    return;
  }

  const d = new Date(data);
  const { year, month } = getRegistoMonth();
  if (d.getFullYear() !== year || d.getMonth() + 1 !== month) {
    showToast('⚠️ Data fora do mês seleccionado');
    return;
  }

  const key     = getRegistoKeyForMonth(year, month);
  const entries = loadRegisto(key);

  const entryData = { data, tipo, horaInicio, horaFim, horas, nota };

  if (registoEditId) {
    const idx = entries.findIndex(e => e.id === registoEditId);
    if (idx !== -1) entries[idx] = { ...entries[idx], ...entryData };
  } else {
    entries.push({ id: Date.now(), ...entryData });
  }

  entries.sort((a, b) => {
    if (a.data !== b.data) return a.data.localeCompare(b.data);
    return (a.horaInicio || '').localeCompare(b.horaInicio || '');
  });

  saveRegisto(entries, key);
  closeRegistoModal();
  renderRegisto();
  showToast(registoEditId ? '✓ Registo actualizado' : '✓ Registo adicionado');
}

function deleteRegistoEntry(id) {
  const { year, month } = getRegistoMonth();
  const key     = getRegistoKeyForMonth(year, month);
  const entries = loadRegisto(key).filter(e => e.id !== id);
  saveRegisto(entries, key);
  renderRegisto();
  showToast('Registo eliminado');
}

function confirmDeleteRegisto(id) {
  if (confirm('Eliminar este registo?')) deleteRegistoEntry(id);
}

// ── Compute summary from entries ───────────────────
function computeRegistoSummary(entries) {
  let h1Normal = 0, hNormalRest = 0, hDescanso = 0;
  for (const e of entries) {
    if (e.tipo === 'descanso') {
      hDescanso += e.horas;
    } else {
      h1Normal    += Math.min(e.horas, 1);
      hNormalRest += Math.max(0, Math.round((e.horas - 1) * 10) / 10);
    }
  }
  h1Normal    = Math.round(h1Normal    * 10) / 10;
  hNormalRest = Math.round(hNormalRest * 10) / 10;
  hDescanso   = Math.round(hDescanso   * 10) / 10;
  return { h1Normal, hNormalRest, hDescanso };
}

// ── Transition to calculator ───────────────────────
function registoToCalc() {
  const { year, month } = getRegistoMonth();
  const entries = loadRegisto(getRegistoKeyForMonth(year, month));
  if (!entries.length) { showToast('Sem registos para transferir'); return; }

  const { h1Normal, hNormalRest, hDescanso } = computeRegistoSummary(entries);
  document.getElementById('h1Normal').value    = h1Normal;
  document.getElementById('hNormalRest').value = hNormalRest;
  document.getElementById('hDescanso').value   = hDescanso;

  autoCalc();
  showTab('calc');
  showToast('✓ Horas transferidas para a calculadora');
}

// ── Month navigation ───────────────────────────────
function registoNavMonth(delta) {
  const { year, month } = getRegistoMonth();
  let newMonth = month + delta;
  let newYear  = year;
  if (newMonth > 12) { newMonth = 1;  newYear++; }
  if (newMonth < 1)  { newMonth = 12; newYear--; }
  registoCurrentMonth = { year: newYear, month: newMonth };
  renderRegisto();
}

// ── Render ─────────────────────────────────────────
function renderRegisto() {
  const { year, month } = getRegistoMonth();
  const key     = getRegistoKeyForMonth(year, month);
  const entries = loadRegisto(key);
  const cfg     = loadConfig();

  const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                      'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  document.getElementById('registoMonthLabel').textContent = `${monthNames[month - 1]} ${year}`;

  const { h1Normal, hNormalRest, hDescanso } = computeRegistoSummary(entries);
  const totalHoras = entries.reduce((s, e) => s + e.horas, 0);

  document.getElementById('regSummary').innerHTML = totalHoras === 0
    ? `<span class="chip amber">Sem horas registadas</span>`
    : `<span class="chip green">⏱ ${totalHoras.toLocaleString('pt-PT',{maximumFractionDigits:1})}h total</span>
       ${h1Normal    > 0 ? `<span class="chip amber">${h1Normal.toLocaleString('pt-PT',{maximumFractionDigits:1})}h 1ª (+${cfg.p1h}%)</span>`    : ''}
       ${hNormalRest > 0 ? `<span class="chip amber">${hNormalRest.toLocaleString('pt-PT',{maximumFractionDigits:1})}h rest. (+${cfg.pRest}%)</span>` : ''}
       ${hDescanso   > 0 ? `<span class="chip green">${hDescanso.toLocaleString('pt-PT',{maximumFractionDigits:1})}h desc. (+${cfg.pDesc}%)</span>`   : ''}`;

  document.getElementById('btnRegistoToCalc').style.display = entries.length ? 'flex' : 'none';

  const list = document.getElementById('registoList');
  if (!entries.length) {
    list.innerHTML = `
      <div class="empty-state">
        <span class="emoji">📅</span>
        <p>Sem horas registadas em ${monthNames[month - 1]}.<br>
           Toque em <strong>+</strong> para começar.</p>
      </div>`;
    return;
  }

  // Read salary for value estimate
  const reducaoPct = cfg.reducaoActive ? (cfg.reducaoPct / 100) : 0;
  const salBase    = parseFloat(document.getElementById('salarioBase')?.value) || cfg.salarioBase || 0;
  const salBaseRed = salBase * (1 - reducaoPct);
  const remH       = (salBaseRed * 12) / (52 * 28);

  list.innerHTML = entries.map(e => {
    const dateObj  = new Date(e.data + 'T00:00:00');
    const dayName  = dateObj.toLocaleDateString('pt-PT', { weekday: 'short' });
    const dayNum   = dateObj.getDate();
    const isDesc   = e.tipo === 'descanso';

    let entryBruto = 0;
    if (isDesc) {
      entryBruto = e.horas * remH * (1 + cfg.pDesc / 100);
    } else {
      const h1 = Math.min(e.horas, 1);
      const hR = Math.max(0, e.horas - 1);
      entryBruto = h1 * remH * (1 + cfg.p1h / 100) + hR * remH * (1 + cfg.pRest / 100);
    }

    const colorDot  = isDesc ? 'var(--brand)' : 'var(--accent)';
    const chipCls   = isDesc ? 'green' : 'amber';
    const tipoLabel = isDesc ? 'Descanso/Feriado' : 'Dia Normal';

    const timeRange = (e.horaInicio && e.horaFim)
      ? `<span style="font-size:11px; color:var(--text-muted); font-family:'DM Mono',monospace;">${e.horaInicio}–${e.horaFim}</span>`
      : '';

    return `
      <div class="registo-entry" data-id="${e.id}">
        <div class="registo-date-col">
          <div class="registo-day-num">${dayNum}</div>
          <div class="registo-day-name">${dayName}</div>
        </div>
        <div class="registo-dot" style="background:${colorDot}"></div>
        <div class="registo-body">
          <div class="registo-top">
            <span class="registo-horas">${e.horas.toLocaleString('pt-PT',{maximumFractionDigits:1})}h</span>
            <span class="chip ${chipCls}" style="font-size:9px;">${tipoLabel}</span>
            ${timeRange}
          </div>
          ${e.nota ? `<div class="registo-nota-text">📝 ${e.nota}</div>` : ''}
          <div class="registo-valor">≈ ${entryBruto.toLocaleString('pt-PT',{minimumFractionDigits:2,maximumFractionDigits:2})} € bruto</div>
        </div>
        <div class="registo-actions">
          <button class="registo-btn-edit" onclick="openRegistoModal(${e.id})" title="Editar">
            <span class="material-icons" style="font-size:18px;">edit</span>
          </button>
          <button class="registo-btn-del" onclick="confirmDeleteRegisto(${e.id})" title="Eliminar">
            <span class="material-icons" style="font-size:18px;">delete_outline</span>
          </button>
        </div>
      </div>`;
  }).join('');
}
