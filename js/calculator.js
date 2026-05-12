
 // Motor de cálculo principal. //
 // Replica as fórmulas da folha de Excel original. //
 // @returns {object} resultado completo com todos os valores intermédios //
 
function calculate() {
  const cfg = loadConfig();

  // ── Inputs ──────────────────────────────────────
  const salBase = parseFloat(document.getElementById('salarioBase').value) || 0;
  const subRef  = parseFloat(document.getElementById('subRefeicao').value)  || 0;
  const dias    = parseFloat(document.getElementById('diasTrabalho').value) || 0;
  const h1N     = parseFloat(document.getElementById('h1Normal').value)     || 0;
  const hNR     = parseFloat(document.getElementById('hNormalRest').value)  || 0;
  const hDes    = parseFloat(document.getElementById('hDescanso').value)    || 0;

  // ── Remuneração horária ──────────────────────────
  // Base de cálculo das horas extra é o salário após redução (se ativa)
  const reducaoPct       = cfg.reducaoActive ? (cfg.reducaoPct / 100) : 0;
  const salBaseReduzido  = salBase * (1 - reducaoPct);
  // Fórmula: (base × 12) / (52 × 28)
  const remHoraria       = (salBaseReduzido * 12) / (52 * 28);

  // ── Horas extra (bruto) ──────────────────────────
  const p1h   = cfg.p1h   / 100;
  const pRest = cfg.pRest / 100;
  const pDesc = cfg.pDesc / 100;

  const val1hNormal = h1N  * remHoraria * (1 + p1h);
  const valRestNorm = hNR  * remHoraria * (1 + pRest);
  const valDescanso = hDes * remHoraria * (1 + pDesc);
  const totalHorasExtra = val1hNormal + valRestNorm + valDescanso;
  const totalHoras = h1N + hNR + hDes;

  // ── Ordenado base ────────────────────────────────
  // Sub. refeição isento de SS e IRS (dentro dos limites legais)
  const baseAjustada = salBase * (1 - reducaoPct);
  const subRefTotal  = subRef * dias;
  const baseComSub   = baseAjustada + subRefTotal;

  // ── IRS ──────────────────────────────────────────
  // Ordenado base: taxa calculada APENAS sobre a base ajustada
  const { irsEuros: irsBaseEuros, taxaEfetiva: irsBaseTaxa } =
  calcIrsAT(cfg.irsTabela, baseAjustada, cfg.irsDependentes);

  // Horas extra: 50% da taxa efetiva do ordenado base (art. 99.º-A CIRS)
  const irsHorasTaxa = irsBaseTaxa * 0.5;
  const irsHoras     = totalHorasExtra * irsHorasTaxa;

  // ── Segurança Social ─────────────────────────────
  // SS incide sobre base ajustada e horas extra (não sobre sub. refeição)
  const ssBase_  = baseAjustada  * (cfg.ssBase / 100);
  const ssHoras  = totalHorasExtra * (cfg.ssBase / 100);

  // ── ADSE e outros ────────────────────────────────
  const adseVal   = baseAjustada * (cfg.adse / 100);
  const camaraVal = cfg.camaraActive ? cfg.camaraVal : 0;

  // ── Totais ───────────────────────────────────────
  const totalDescHoras = irsHoras + ssHoras;
  const horasLiquidas  = totalHorasExtra - totalDescHoras;

  const totalDescBase  = irsBaseEuros + ssBase_ + (cfg.adseActive ? adseVal : 0) + camaraVal;
  // Líquido base: sub. refeição não sofre descontos
  const baseLiquida    = baseComSub - totalDescBase;

  const totalDescontos = totalDescHoras + totalDescBase;
  const salarioBruto   = totalHorasExtra + baseComSub;
  const salarioLiquido = horasLiquidas + baseLiquida;

  const res = {
    // inputs
    remHoraria, salBase, salBaseReduzido, reducaoPct, subRef, dias,
    h1N, hNR, hDes, totalHoras,
    // horas extra
    val1hNormal, valRestNorm, valDescanso,
    totalHorasExtra, irsHoras, irsHorasTaxa, ssHoras,
    totalDescHoras, horasLiquidas,
    // base
    baseAjustada, subRefTotal, baseComSub,
    irsBase: irsBaseEuros, irsBaseTaxa, ssBase: ssBase_,
    adseVal: cfg.adseActive ? adseVal : 0,
    camaraVal,
    totalDescBase, baseLiquida,
    // totais
    totalDescontos, salarioBruto, salarioLiquido,
    // meta
    cfg, ts: new Date().toISOString()
  };

  currentResult = res;
  renderResult(res);
  return res;
}

/** Executa o cálculo e atualiza apenas o painel de pré-visualização. */
function autoCalc() {
  const res = calculate();
  document.getElementById('prevBruto').textContent     = fmt(res.salarioBruto);
  document.getElementById('prevLiquido').textContent   = fmt(res.salarioLiquido);
  document.getElementById('prevHorasVal').textContent  = fmt(res.totalHorasExtra);
  document.getElementById('prevDescontos').textContent = fmt(res.totalDescontos);

  document.getElementById('totalHorasChip').innerHTML =
    `<span class="chip green">⏱ ${res.totalHoras} horas extra</span>`;

  const ind = document.getElementById('reducaoIndicator');
  if (res.reducaoPct > 0) {
    ind.innerHTML =
      `<label class="field-label" style="color:var(--danger) !Important;">↓ Redução ${(res.reducaoPct*100).toFixed(1)}% aplicada</label>` +
      `<label class="field-label">Base Cálculo:</label><span style="font-family:'DM Mono',monospace; color:var(--text-primary); margin-bottom: 7px; font-size: 11px;">${fmt(res.salBaseReduzido)}</span>` +
      `<label class="field-label">Remuneração Horária:</label><span style="font-family:'DM Mono',monospace; color:var(--text-primary); margin-bottom: 7px; font-size: 11px;">${fmt(res.remHoraria)}/h</span>`;
  } else {
    ind.innerHTML =
      `<label class="field-label">Remuneração Horária:</label><span style="font-family:'DM Mono',monospace; color:var(--text-primary); margin-bottom: 7px; font-size: 11px;">${fmt(res.remHoraria)}/h</span>`;
  }
}

/** Preenche todos os elementos da página Resumo com os dados calculados. */
function renderResult(r) {
  // Hero
  document.getElementById('resLiquido').textContent        = fmt(r.salarioLiquido);
  document.getElementById('resBrutoChip').textContent      = 'Bruto: ' + fmt(r.salarioBruto);
  document.getElementById('resDescontosChip').textContent  = 'Desc.: ' + fmt(r.totalDescontos);

  // Progress bar
  const pct    = r.salarioBruto > 0 ? Math.round(r.totalDescontos / r.salarioBruto * 100) : 0;
  const liqPct = 100 - pct;
  document.getElementById('progressLiquido').style.width = liqPct + '%';
  document.getElementById('progressPct').textContent     = pct + '% descontado';

  // Horas extra breakdown
  document.getElementById('bk1hDesc').textContent    = `${r.h1N}h × +${r.cfg.p1h}%`;
  document.getElementById('bkRestDesc').textContent  = `${r.hNR}h × +${r.cfg.pRest}%`;
  document.getElementById('bkDescDesc').textContent  = `${r.hDes}h × +${r.cfg.pDesc}%`;
  document.getElementById('bk1hVal').textContent     = fmt(r.val1hNormal);
  document.getElementById('bkRestVal').textContent   = fmt(r.valRestNorm);
  document.getElementById('bkDescVal').textContent   = fmt(r.valDescanso);
  document.getElementById('bkTotalHoras').textContent    = fmt(r.totalHorasExtra);
  document.getElementById('bkTotalHorasLiq').textContent = fmt(r.horasLiquidas);

  // Ordenado base breakdown
  document.getElementById('bkBaseNormVal').textContent = fmt(r.salBase);
  document.getElementById('bkBaseNorm').textContent    = '';
  document.getElementById('bkBaseAjVal').textContent   = fmt(r.baseAjustada);
  document.getElementById('bkBaseAjDesc').textContent  = r.reducaoPct > 0
    ? `${fmt(r.salBase)} × ${(100 - r.reducaoPct*100).toFixed(1)}% (redução ${(r.reducaoPct*100).toFixed(1)}%)`
    : 'Sem redução aplicada';
  document.getElementById('bkSubRefDesc').textContent  = `${r.dias} dias × ${fmt(r.subRef)}`;
  document.getElementById('bkSubRefVal').textContent   = fmt(r.subRefTotal);
  document.getElementById('bkBaseLiq').textContent     = fmt(r.baseLiquida);

  // Descontos
  const tabelaInfo = IRS_TABELAS[r.cfg.irsTabela] || IRS_TABELAS['T1'];
  document.getElementById('bkIrsHDesc').textContent =
    `Tab.${tabelaInfo.label} · ${(r.irsHorasTaxa*100).toFixed(2)}% (50% × ${(r.irsBaseTaxa*100).toFixed(2)}%)`;
  document.getElementById('bkSsHDesc').textContent  = `${r.cfg.ssBase}% (taxa normal)`;
  document.getElementById('bkIrsBDesc').textContent =
    `Tab.${tabelaInfo.label} · ${(r.irsBaseTaxa*100).toFixed(2)}% efetivo`;
  document.getElementById('bkSsBDesc').textContent  = `${r.cfg.ssBase}% sobre base aj. (excl. sub. refeição)`;
  document.getElementById('bkAdseDesc').textContent = `${r.cfg.adse}% sobre base aj.`;
  document.getElementById('bkIrsHVal').textContent   = '−' + fmt(r.irsHoras);
  document.getElementById('bkSsHVal').textContent    = '−' + fmt(r.ssHoras);
  document.getElementById('bkIrsBVal').textContent   = '−' + fmt(r.irsBase);
  document.getElementById('bkSsBVal').textContent    = '−' + fmt(r.ssBase);
  document.getElementById('bkAdseVal').textContent   = '−' + fmt(r.adseVal);
  document.getElementById('bkCamaraClube').textContent = '−' + fmt(r.camaraVal);
  document.getElementById('rowAdse').style.opacity        = r.cfg.adseActive   ? '1' : '0.4';
  document.getElementById('rowCamaraClube').style.opacity = r.cfg.camaraActive ? '1' : '0.4';
  document.getElementById('bkTotalDesc').textContent = '−' + fmt(r.totalDescontos);

  // Summary grid
  document.getElementById('resSalBruto').textContent       = fmt(r.salarioBruto);
  document.getElementById('resSalLiquidoGrid').textContent = fmt(r.salarioLiquido);
  document.getElementById('resRemHoraria').textContent     = fmt(r.remHoraria);
  document.getElementById('resTotalDesc').textContent      = '−' + fmt(r.totalDescontos);
}
