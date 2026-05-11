// JAVASCRIPT — STATE & STORAGE //
  
'use strict';

// ── State ──────────────────────────────────────────
let currentResult = null;

// ── Config persistence ─────────────────────────────
function loadConfig() {
  const defaults = {
    irsTabela: 'T1', irsDependentes: 0,
    ssBase: 11.00, adse: 3.50,
    p1h: 25, pRest: 37.5, pDesc: 50,
    adseActive: true, camaraActive: true, camaraVal: 1.00,
    reducaoActive: true, reducaoPct: 20
  };
  try {
    return Object.assign(defaults, JSON.parse(localStorage.getItem('heConfig') || '{}'));
  } catch { return defaults; }
}

function saveConfig() {
  const cfg = {
    irsTabela:      document.getElementById('cfgIrsTabela').value,
    irsDependentes: parseInt(document.getElementById('cfgDependentes').value) || 0,
    ssBase:         parseFloat(document.getElementById('cfgSsBase').value) || 0,
    adse:           parseFloat(document.getElementById('cfgAdse').value) || 0,
    p1h:            parseFloat(document.getElementById('cfgP1h').value) || 25,
    pRest:          parseFloat(document.getElementById('cfgPRest').value) || 37.5,
    pDesc:          parseFloat(document.getElementById('cfgPDesc').value) || 50,
    adseActive:     document.getElementById('cfgAdseActive').checked,
    camaraActive:   document.getElementById('cfgCamaraActive').checked,
    camaraVal:      parseFloat(document.getElementById('cfgCamaraVal').value) || 0,
    reducaoActive:  document.getElementById('cfgReducaoActive').checked,
    reducaoPct:     parseFloat(document.getElementById('cfgReducaoPct').value) || 0
  };
  localStorage.setItem('heConfig', JSON.stringify(cfg));
  autoCalc();
  showToast('Configurações guardadas');
}

function applyConfig(cfg) {
  document.getElementById('cfgIrsTabela').value       = cfg.irsTabela;
  document.getElementById('cfgDependentes').value     = cfg.irsDependentes;
  document.getElementById('cfgSsBase').value          = cfg.ssBase;
  document.getElementById('cfgAdse').value            = cfg.adse;
  document.getElementById('cfgP1h').value             = cfg.p1h;
  document.getElementById('cfgPRest').value           = cfg.pRest;
  document.getElementById('cfgPDesc').value           = cfg.pDesc;
  document.getElementById('cfgAdseActive').checked    = cfg.adseActive;
  document.getElementById('cfgCamaraActive').checked  = cfg.camaraActive;
  document.getElementById('cfgCamaraVal').value       = cfg.camaraVal;
  document.getElementById('cfgReducaoActive').checked = cfg.reducaoActive;
  document.getElementById('cfgReducaoPct').value      = cfg.reducaoPct;
  updateTabelaPreview();
}
