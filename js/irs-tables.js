<!-- ═══════════════════════════════════════════════
     JAVASCRIPT — IRS TABLES (AT 2026, Continente)
═══════════════════════════════════════════════ -->

/**
 * Tabelas AT 2026 — Continente.
 * Fórmula: R × taxa − parcela − (parcela_dep × n_deps)
 * Linhas especiais (fe != null): parcela = ta × fa × (th − R)
 *
 * Estrutura de cada escalonamento:
 *   lim  — limite superior do escalão
 *   taxa — taxa marginal
 *   p    — parcela a abater (null se fórmula especial)
 *   fe   — [ta, fa, th] para fórmula especial (null caso contrário)
 */
const IRS_TABELAS = {
  T1: { label:'I', desc:'Não casado s/ dep. / Casado 2 titulares', parcela_dep:21.43, escaloes:[
    {lim:920,     taxa:0,      p:0,       fe:null},
    {lim:1042,    taxa:0.125,  p:null,    fe:[0.125,2.60,1273.85]},
    {lim:1108,    taxa:0.157,  p:null,    fe:[0.157,1.35,1554.83]},
    {lim:1154,    taxa:0.157,  p:94.71,   fe:null},
    {lim:1212,    taxa:0.212,  p:158.18,  fe:null},
    {lim:1819,    taxa:0.241,  p:193.33,  fe:null},
    {lim:2119,    taxa:0.311,  p:320.66,  fe:null},
    {lim:2499,    taxa:0.349,  p:401.19,  fe:null},
    {lim:3305,    taxa:0.3836, p:487.66,  fe:null},
    {lim:5547,    taxa:0.3969, p:531.62,  fe:null},
    {lim:20221,   taxa:0.4495, p:823.40,  fe:null},
    {lim:Infinity,taxa:0.4717, p:1272.31, fe:null},
  ]},
  T2: { label:'II', desc:'Não casado c/ dependentes', parcela_dep:34.29, escaloes:[
    {lim:920,     taxa:0,      p:0,       fe:null},
    {lim:1042,    taxa:0.125,  p:null,    fe:[0.125,2.60,1273.85]},
    {lim:1108,    taxa:0.157,  p:null,    fe:[0.157,1.35,1554.83]},
    {lim:1154,    taxa:0.157,  p:94.71,   fe:null},
    {lim:1212,    taxa:0.212,  p:158.18,  fe:null},
    {lim:1819,    taxa:0.241,  p:193.33,  fe:null},
    {lim:2119,    taxa:0.311,  p:320.66,  fe:null},
    {lim:2499,    taxa:0.349,  p:401.19,  fe:null},
    {lim:3305,    taxa:0.3836, p:487.66,  fe:null},
    {lim:5547,    taxa:0.3969, p:531.62,  fe:null},
    {lim:20221,   taxa:0.4495, p:823.40,  fe:null},
    {lim:Infinity,taxa:0.4717, p:1272.31, fe:null},
  ]},
  T3: { label:'III', desc:'Casado, único titular', parcela_dep:42.86, escaloes:[
    {lim:991,     taxa:0,      p:0,       fe:null},
    {lim:1042,    taxa:0.125,  p:null,    fe:[0.125,2.60,1372.15]},
    {lim:1108,    taxa:0.125,  p:null,    fe:[0.125,1.35,1677.85]},
    {lim:1119,    taxa:0.125,  p:96.17,   fe:null},
    {lim:1432,    taxa:0.1272, p:98.64,   fe:null},
    {lim:1962,    taxa:0.157,  p:141.32,  fe:null},
    {lim:2240,    taxa:0.1938, p:213.53,  fe:null},
    {lim:2773,    taxa:0.2277, p:289.47,  fe:null},
    {lim:3389,    taxa:0.257,  p:370.72,  fe:null},
    {lim:5965,    taxa:0.2881, p:476.12,  fe:null},
    {lim:20265,   taxa:0.3843, p:1049.96, fe:null},
    {lim:Infinity,taxa:0.4717, p:2821.13, fe:null},
  ]},
  T4: { label:'IV', desc:'Não casado/Casado 2 tit. s/ dep. — Deficiência', parcela_dep:0, escaloes:[
    {lim:1694,    taxa:0,      p:0,       fe:null},
    {lim:2063,    taxa:0.212,  p:359.13,  fe:null},
    {lim:2492,    taxa:0.311,  p:563.37,  fe:null},
    {lim:4487,    taxa:0.349,  p:658.07,  fe:null},
    {lim:4753,    taxa:0.3836, p:813.33,  fe:null},
    {lim:6687,    taxa:0.3969, p:876.55,  fe:null},
    {lim:20468,   taxa:0.4495, p:1228.29, fe:null},
    {lim:Infinity,taxa:0.4717, p:1682.68, fe:null},
  ]},
  T5: { label:'V', desc:'Não casado c/ dep. — Deficiência', parcela_dep:42.86, escaloes:[
    {lim:1938,    taxa:0,      p:0,       fe:null},
    {lim:2063,    taxa:0.2132, p:413.19,  fe:null},
    {lim:2854,    taxa:0.311,  p:614.96,  fe:null},
    {lim:4504,    taxa:0.349,  p:723.42,  fe:null},
    {lim:6826,    taxa:0.3836, p:879.26,  fe:null},
    {lim:7048,    taxa:0.3969, p:970.05,  fe:null},
    {lim:20468,   taxa:0.4495, p:1340.78, fe:null},
    {lim:Infinity,taxa:0.4717, p:1795.17, fe:null},
  ]},
  T6: { label:'VI', desc:'Casado 2 tit. c/ dep. — Deficiência', parcela_dep:21.43, escaloes:[
    {lim:1668,    taxa:0,      p:0,       fe:null},
    {lim:2068,    taxa:0.2049, p:341.78,  fe:null},
    {lim:2497,    taxa:0.241,  p:416.44,  fe:null},
    {lim:3107,    taxa:0.311,  p:591.23,  fe:null},
    {lim:4504,    taxa:0.349,  p:709.30,  fe:null},
    {lim:6826,    taxa:0.3836, p:865.14,  fe:null},
    {lim:7048,    taxa:0.3969, p:955.93,  fe:null},
    {lim:20468,   taxa:0.4495, p:1326.66, fe:null},
    {lim:Infinity,taxa:0.4717, p:1781.05, fe:null},
  ]},
  T7: { label:'VII', desc:'Casado único titular — Deficiência', parcela_dep:42.86, escaloes:[
    {lim:2325,    taxa:0,      p:0,       fe:null},
    {lim:3494,    taxa:0.2277, p:529.41,  fe:null},
    {lim:3761,    taxa:0.257,  p:631.79,  fe:null},
    {lim:6687,    taxa:0.2881, p:748.76,  fe:null},
    {lim:20468,   taxa:0.4244, p:1660.20, fe:null},
    {lim:Infinity,taxa:0.4717, p:2628.34, fe:null},
  ]},
};

/**
 * Calcula a retenção IRS segundo as tabelas AT 2026.
 * @param {string} tabelaKey — chave da tabela (T1..T7)
 * @param {number} R         — remuneração mensal de referência (€)
 * @param {number} nDeps     — número de dependentes
 * @returns {{ irsEuros: number, taxaEfetiva: number }}
 */
function calcIrsAT(tabelaKey, R, nDeps) {
  const t = IRS_TABELAS[tabelaKey] || IRS_TABELAS['T1'];
  for (const e of t.escaloes) {
    if (R <= e.lim) {
      if (e.taxa === 0) return { irsEuros: 0, taxaEfetiva: 0 };
      const parcela = e.fe
        ? e.fe[0] * e.fe[1] * (e.fe[2] - R)   // fórmula especial
        : e.p;                                   // parcela fixa
      const euros = Math.max(0, R * e.taxa - parcela - (t.parcela_dep * nDeps));
      return { irsEuros: euros, taxaEfetiva: R > 0 ? euros / R : 0 };
    }
  }
  return { irsEuros: 0, taxaEfetiva: 0 };
}

/** Gera preview dos escalões da tabela IRS selecionada. */
function updateTabelaPreview() {
  const sel = document.getElementById('cfgIrsTabela');
  if (!sel) return;
  const t = IRS_TABELAS[sel.value];
  if (!t) return;
  const deps = parseInt(document.getElementById('cfgDependentes').value) || 0;
  const hasDeps = ['T1','T2','T3','T5','T6','T7'].includes(sel.value);
  document.getElementById('fieldDependentes').style.display = hasDeps ? '' : 'none';
  const rows = t.escaloes.map(e => {
    if (e.taxa === 0) return `<div>≤ ${e.lim === Infinity ? '∞' : e.lim.toLocaleString('pt-PT')}€ → <strong>0%</strong></div>`;
    const limLabel = e.lim === Infinity ? '> anterior' : `≤ ${e.lim.toLocaleString('pt-PT')}€`;
    return `<div>${limLabel} → <strong style="color:var(--text-primary)">${(e.taxa*100).toFixed(4).replace(/\.?0+$/,'')}%</strong></div>`;
  });
  const sample = [1000, 1500, 2000, 3000].map(r => {
    const res = calcIrsAT(sel.value, r, deps);
    return `${r.toLocaleString('pt-PT')}€ → ${(res.taxaEfetiva*100).toFixed(2)}%`;
  }).join(' · ');
  document.getElementById('tabelaPreview').innerHTML =
    `<div style="margin-bottom:6px; color:var(--text-primary); font-weight:600;">Tabela ${t.label} · ${t.desc}</div>` +
    rows.slice(0, 6).join('') +
    `<div style="margin-top:6px; color:var(--brand); font-size:11px;">Exemplos (${deps} dep.): ${sample}</div>`;
}
