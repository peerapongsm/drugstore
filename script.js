'use strict';

// ── DATA (all hardcoded constants — no user input rendered) ──────────────────

const INV = [
  { cat:'OTC Household Drugs',      sku:171, cost:15416, avg:99,  priority:'Highest', strategy:'All x 1-2 units' },
  { cat:'Topical / Cream / Steroid',sku:112, cost:10520, avg:97,  priority:'High',    strategy:'80% x 1 unit' },
  { cat:'Respiratory',              sku: 58, cost: 8179, avg:149, priority:'High',    strategy:'All x 1 unit' },
  { cat:'Cardiovascular',           sku: 54, cost:15101, avg:321, priority:'High',    strategy:'60% x 1 (Rx)' },
  { cat:'Vitamin & Supplement',     sku: 54, cost:12796, avg:237, priority:'High',    strategy:'All x 1 unit' },
  { cat:'Vitamins (Tonic)',         sku: 64, cost: 3473, avg: 57, priority:'High',    strategy:'All x 1 unit' },
  { cat:'Antibiotics',              sku: 44, cost: 7468, avg:187, priority:'Medium',  strategy:'60% x 1 (Rx)' },
  { cat:'Diabetes',                 sku: 43, cost:15175, avg:353, priority:'High',    strategy:'50% x 1 (Rx)' },
  { cat:'Pain / Antipyretic',       sku: 45, cost:10763, avg:263, priority:'High',    strategy:'All x 1 unit' },
  { cat:'GI / Digestive',           sku: 42, cost: 4590, avg:115, priority:'High',    strategy:'All x 1 unit' },
  { cat:'Traditional Medicine',     sku: 46, cost: 2519, avg: 55, priority:'Low-Med', strategy:'70% x 1 unit' },
  { cat:'Eye / Ear / Nose / Throat',sku: 35, cost: 3858, avg:117, priority:'Medium',  strategy:'All x 1 unit' },
  { cat:'Hormones / Contraceptive', sku: 29, cost: 5196, avg:179, priority:'Medium',  strategy:'60% x 1 unit' },
  { cat:'Medical Devices',          sku: 34, cost: 1448, avg: 54, priority:'Medium',  strategy:'80% x 1 unit' },
];

const BUDGETS = {
  200: {
    tag: 'Lean MVP',
    kpiSku:'450', kpiRev:'฿50K/mo (Y1)', kpiPayback:'Yr 2-3 (owner)',
    fixed:[
      ['GPP Renovation (Minimal)',       55000],
      ['Pharmaceutical Refrigerator',     8000],
      ['Security Deposit (3 months)',    24000],
      ['Pharmacy License + Biz Reg',     8000],
      ['POS + Scanner + Label Printer',  18000],
      ['Computer + Monitor + UPS',       18000],
    ],
    inv:55000, working:14000, total:200000,
    invScale: 0.5,
  },
  400: {
    tag: 'Recommended',
    kpiSku:'700+', kpiRev:'฿50K/mo (Y1)', kpiPayback:'Yr 2-3 (owner)',
    fixed:[
      ['GPP Renovation (Full)',           120000],
      ['Pharmaceutical Refrigerator 300L', 15000],
      ['Air Conditioning (2 units)',       25000],
      ['Security Deposit (3 months)',      24000],
      ['Pharmacy License + Legal',         12000],
      ['POS + 2x Barcode Scanners',        20000],
      ['Label + Receipt Printers',          8000],
      ['Computer + Network + UPS',         22000],
      ['CCTV (4 cameras)',                 12000],
      ['Marketing Launch',                 12000],
    ],
    inv:110000, working:20000, total:400000,
    invScale: 1,
  },
};

const MONTHLY_OPS = [
  { item:'Rent',                                           owner:8000,  emp:8000  },
  { item:'Pharmacist Salary',                              owner:0,     emp:38000 },
  { item:'Electricity (2×AC + Pharma Fridge + Lights)', owner:5000, emp:5000  },
  { item:'Water',                                          owner:400,   emp:400   },
  { item:'Internet / Fiber 100 Mbps',                      owner:700,   emp:700   },
  { item:'LINE OA Premium (monthly)',                      owner:400,   emp:400   },
  { item:'Consumables (bags, labels, cleaning)',           owner:2000,  emp:2000  },
];
// Owner total: 16,500 | Break-even at 40% GM: 41,250
// Employee total: 54,500 | Break-even at 40% GM: 136,250

const ADVISORY_TIPS = [
  { icon:'⚠️', color:'amber',  title:'Pharmacist as Owner is Critical',
    desc:'Employee pharmacist (฿38K+/mo salary) pushes break-even to Year 4-5 and requires ฿1.1M+ extra capital. As founding partner with equity stake, break-even is achievable by Month 8-10.' },
  { icon:'💰', color:'red',    title:'Cash Reserve: Employee Scenario Needs ฿1.1M+',
    desc:'Owner scenario: ฿400K startup is sufficient — profitable from Year 2. Employee scenario: budget ฿1.1M+ extra cash to survive 4 years of operating losses before any net profit.' },
  { icon:'🤝', color:'blue',   title:'Negotiate 30-60 Day Supplier Credit',
    desc:'GPO and licensed distributors offer payment terms to licensed pharmacies. Use the credit float to reduce working capital pressure, especially when revenue is low in Year 1.' },
  { icon:'📦', color:'purple', title:'Start with Top 100-150 Fast Movers Only',
    desc:'Year 1: focus on high-velocity OTC items. Do not stock all 831 SKUs immediately. Every slow-moving SKU ties up cash and risks expiry losses. Expand from operating cash flow.' },
  { icon:'🏢', color:'green',  title:'One B2B Contract = ฿10-30K/Month',
    desc:'Approach nearby offices, schools, or construction sites for corporate medication supply contracts. One B2B account can equal 1-3 weeks of retail sales with predictable volume.' },
  { icon:'📱', color:'indigo', title:'LINE OA Rx Refill Service (Build from Day 1)',
    desc:'Set up the refill workflow from Day 1 even if unused. Once Rx loyalty builds in Year 2+, LINE OA refill orders from condo residents add ฿8-15K/month with near-zero overhead.' },
];

const GPP_CHECKS = {
  premises:[
    'Dispensing area min 8 sqm, clearly demarcated (Critical Defect)',
    'Floor plan submitted to FDA matches current physical layout (Critical Defect)',
    'Consultation zone clearly separated with privacy screen (visible + recorded)',
    'Premises clean, hygienic, orderly — walls/floor smooth & scrubbable (Critical Defect)',
    'Adequate lighting & ventilation during all operating hours',
    'Pest/animal prevention measures in place',
    'Temperature control: storage area ≤30 °C per Thai FDA GPP (Critical Defect)',
    'Daily temperature + humidity log maintained for storage area (Critical Defect)',
  ],
  equipment:[
    'Pharmaceutical refrigerator 2–8 °C — 1 unit, standard-grade (Critical Defect)',
    'Dispensing scales — min 2 calibrated types, standard-grade (Critical Defect)',
    'Thermometer + hygrometer in storage area — 1 unit, standard-grade (Critical Defect)',
    'Weight measuring equipment — 1 unit, standard-grade',
    'Light-protection containers for photosensitive drugs (Critical Defect)',
    'Dispensing equipment: counting tray, spatula, mortar & pestle (Critical Defect)',
    'Locked steel cabinet for Schedule A/B (controlled) drugs — wall-anchored',
    'CCTV covering dispensing counter and controlled cabinet',
  ],
  legal:[
    'Modern Drug Sales License (FDA)',
    'Current floor plan attached to license application & approved',
    'Commercial Registration (DBD)',
    'Pharmacist license certificate framed & displayed at counter (Critical Defect)',
    'Pharmacist work schedule posted at pharmacy',
    'Landlord written consent letter on file',
    'GPP Self-Assessment form submitted to FDA',
  ],
  docs:[
    'Dispensing labels include: drug name, dose, instructions, warnings, pharmacist sig (Critical Defect)',
    'Dispensing record system for Schedule A/B (controlled) drugs',
    'Purchase invoices and drug procurement records from licensed sources (Critical Defect)',
    'Expired drug disposal / return-to-supplier procedure',
    'ADR (Adverse Drug Reaction) reporting form + submission process',
    'Drug recall & counterfeit drug response plan',
    'Drug abuse prevention procedure for high-risk items',
  ],
};

const ROADMAP_PHASES = [
  {
    period:'Month 1-2', color:'green', label:'Phase 0 — Pre-Launch Prep',
    tasks:[
      'Register business entity (Commercial Registration)',
      'Submit FDA pharmacy license application',
      'Sign lease + collect keys',
      'Design 40 sqm GPP layout + hire renovation contractor',
    ],
  },
  {
    period:'Month 2-3', color:'blue', label:'Phase 1 — Renovation & Build-Out',
    tasks:[
      'Renovation (6 weeks): shelving, counter, lighting, AC',
      'Install pharmaceutical fridge + temperature monitoring',
      'Install CCTV + IT infrastructure (network, POS, printer)',
      'Schedule FDA inspector site visit',
    ],
  },
  {
    period:'Month 3-4', color:'purple', label:'Phase 2 — Procurement & Setup',
    tasks:[
      'Source opening inventory from GPO + licensed distributors',
      'Load all SKUs into POS with barcodes and reorder points',
      'Set up LINE Official Account + social profiles',
      'Staff GPP training (dispensing, ADR reporting, documentation)',
    ],
  },
  {
    period:'Month 4', color:'yellow', label:'Phase 3 — Soft Launch',
    tasks:[
      'Receive pharmacy license — open OTC + Vitamin sales',
      'Deliver flyers to all 500 units + post in condo LINE group',
      'Host first Health Check event (free BP screening)',
    ],
  },
  {
    period:'Month 4+', color:'green', label:'Phase 4 — Full Operations',
    tasks:[
      'Full Rx (prescription) dispensing activated',
      'Launch Loyalty Card program',
      'Target 25 transactions/day by Month 6',
      'Monthly inventory review: add fast-movers, cut slow-movers',
    ],
  },
];

const MILESTONES = [
  { period:'Y1 M1-3 (Opening)',  rev:'฿10-25K',  txn:'3-8',  note:'Discovery phase',           accent:'text-red-600' },
  { period:'Y1 M12',             rev:'฿50K',      txn:'16',   note:'Year 1 realistic max',      accent:'text-yellow-600' },
  { period:'Y2 avg',             rev:'฿62K',      txn:'20',   note:'Word-of-mouth builds',      accent:'text-yellow-600' },
  { period:'Y3 M12 ★',      rev:'฿105K',     txn:'35',   note:'Near break-even (owner)',   accent:'text-blue-600', bold:true },
  { period:'Y4 M12 ★★',rev:'฿140K',     txn:'46',   note:'Break-even (if employee)',  accent:'text-green-600', bold:true },
  { period:'Y5 M12',             rev:'฿170K',     txn:'55',   note:'Profitable',                accent:'text-green-600' },
];

const RISKS = [
  { level:'red',  title:'FDA License Delay',       fix:'Pre-consult FDA; use OTC soft-open period' },
  { level:'yel',  title:'Renovation Overrun',      fix:'Fixed-price contract with contractor' },
  { level:'yel',  title:'Low Year-1 Foot Traffic', fix:'LINE group marketing + health events' },
  { level:'blue', title:'Drug Expiry Losses',      fix:'90-day tracking; minimum 1-unit orders' },
];

const TECH = [
  { icon:'🖥️', title:'POS System',             desc:'PharmaSys SaaS or custom Supabase + React' },
  { icon:'💚',       title:'LINE Official Account',  desc:'Refills, pharmacist Q&A, loyalty points' },
  { icon:'📊',       title:'Analytics Dashboard',    desc:'Expiry alerts, sales velocity, reorder' },
];

// ── STATE ────────────────────────────────────────────────────────────────────
let currentBudget  = 200;
let currentOpsMode = 'owner';
let chartFixed, chartInvBar, chartRevLine, chartCat, chartPrice, chartDemo;

// ── DOM HELPERS ───────────────────────────────────────────────────────────────
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls)            e.className   = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}
function append(parent) {
  for (let i = 1; i < arguments.length; i++) parent.appendChild(arguments[i]);
  return parent;
}
function clearEl(id) {
  const e = document.getElementById(id);
  while (e.firstChild) e.removeChild(e.firstChild);
  return e;
}

// ── ANIMATION HELPERS ─────────────────────────────────────────────────────────

// Intersection-observer scroll reveal
function initAnimations() {
  var cards = document.querySelectorAll('.anim-card:not(.in-view)');
  if (!cards.length || !window.IntersectionObserver) {
    // Fallback: just show all cards immediately
    document.querySelectorAll('.anim-card').forEach(function(c) { c.classList.add('in-view'); });
    return;
  }
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });
  cards.forEach(function(card) { observer.observe(card); });
}

// Count-up animation for a numeric element
function animateNum(elId, endVal, prefix, suffix, duration) {
  var target = document.getElementById(elId);
  if (!target) return;
  prefix   = prefix   || '';
  suffix   = suffix   || '';
  duration = duration || 750;
  var startTime = null;
  function tick(now) {
    if (!startTime) startTime = now;
    var t    = Math.min((now - startTime) / duration, 1);
    var ease = 1 - Math.pow(1 - t, 3);
    target.textContent = prefix + Math.round(endVal * ease).toLocaleString() + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ── TABS ──────────────────────────────────────────────────────────────────────
function showTab(name, btn) {
  document.querySelectorAll('.tab-pane').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.tab-btn').forEach(function(b)  { b.classList.remove('active'); });
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
  if (name === 'finance')   renderFinance();
  if (name === 'inventory') renderInventoryTab();
  setTimeout(initAnimations, 60);
}

// ── BUDGET SWITCH ─────────────────────────────────────────────────────────────
function switchBudget(b) {
  currentBudget = b;
  var d = BUDGETS[b];
  document.querySelectorAll('.badge-toggle').forEach(function(bt) { bt.classList.remove('active'); });
  document.getElementById('btn' + b).classList.add('active');
  document.getElementById('budget-tag').textContent  = d.tag;
  document.getElementById('kpi-sku').textContent     = d.kpiSku;
  document.getElementById('kpi-revenue').textContent = d.kpiRev;
  document.getElementById('kpi-payback').textContent = d.kpiPayback;
  document.getElementById('fin-label').textContent   = 'Budget ฿' + b.toLocaleString() + ',000 — ' + d.tag;
  animateNum('kpi-budget', b * 1000, '฿', '');
  renderFinance();
}

// ── FINANCE TAB ───────────────────────────────────────────────────────────────
function renderFinance() {
  var d = BUDGETS[currentBudget];
  var COLORS = ['#16a34a','#15803d','#1a7a3c','#2d9e3f','#4bc057','#60c96b','#77d17e','#22c55e','#dc2626','#ea580c','#d97706','#7c3aed'];

  // Fixed cost donut
  var fLabels = d.fixed.map(function(x) { return x[0]; }).concat(['Inventory', 'Working Capital']);
  var fVals   = d.fixed.map(function(x) { return x[1]; }).concat([d.inv, d.working]);
  if (chartFixed) chartFixed.destroy();
  chartFixed = new Chart(document.getElementById('fixedPieChart'), {
    type: 'doughnut',
    data: { labels: fLabels, datasets: [{ data: fVals, backgroundColor: COLORS, borderWidth: 2, borderColor: '#fff' }] },
    options: { responsive:true, maintainAspectRatio:false, cutout:'58%', plugins:{ legend:{ position:'bottom', labels:{ font:{size:10}, boxWidth:12, padding:8 } } } },
  });

  // Fixed cost rows
  var rows = clearEl('fixed-rows');
  fLabels.forEach(function(lbl, i) {
    var row = el('div', 'flex justify-between items-center text-xs py-1 border-b border-gray-100 ops-row');
    append(row, el('span','text-gray-600', lbl), el('span','font-semibold text-gray-800', '฿' + fVals[i].toLocaleString()));
    rows.appendChild(row);
  });
  var total = el('div','flex justify-between items-center text-sm py-2 font-bold text-green-700');
  append(total, el('span',null,'TOTAL'), el('span',null,'฿' + d.total.toLocaleString()));
  rows.appendChild(total);

  // Inventory bar
  var invAlloc = [22000,8400,8200,9100,16300,3473,4500,7600,10800,4600,1800,3900,3100,1200];
  var invVals  = invAlloc.map(function(v) { return Math.round(v * d.invScale); });
  var totalInv = invVals.reduce(function(a,b) { return a+b; }, 0);
  if (chartInvBar) chartInvBar.destroy();
  chartInvBar = new Chart(document.getElementById('invBarChart'), {
    type:'bar',
    data:{ labels: INV.map(function(x) { return x.cat; }), datasets:[{ label:'Wholesale Budget (THB)', data: invVals, backgroundColor:'#4ade80', borderRadius:3 }] },
    options:{
      responsive:true, maintainAspectRatio:false, indexAxis:'y',
      plugins:{ legend:{display:false} },
      scales:{ x:{ grid:{display:false}, ticks:{font:{size:9}} }, y:{ ticks:{font:{size:9}} } },
    },
  });
  document.getElementById('inv-total-line').textContent = 'Total inventory budget: ฿' + totalInv.toLocaleString();

  // 5-Year Revenue line chart (60 months, conservative)
  var REV5 = [
    10,15,20,25,30,35,38,40,42,44,47,50,
    52,54,56,58,60,62,63,65,67,68,70,72,
    75,78,80,83,86,88,91,93,96,99,102,105,
    108,111,114,117,120,123,126,129,131,134,137,140,
    143,146,148,150,152,154,156,158,160,162,165,170,
  ];
  var MONTHS5 = Array.from({length:60}, function(_,i) {
    var m = i + 1;
    if (m===1)  return 'Y1 M1';
    if (m===12) return 'Y1 M12';
    if (m===24) return 'Y2 M12';
    if (m===36) return 'Y3 M12';
    if (m===48) return 'Y4 M12';
    if (m===60) return 'Y5 M12';
    return '';
  });
  if (chartRevLine) chartRevLine.destroy();
  chartRevLine = new Chart(document.getElementById('revenueLineChart'), {
    type:'line',
    data:{
      labels: MONTHS5,
      datasets:[
        { label:'Monthly Revenue (฿K)', data:REV5, borderColor:'#16a34a', backgroundColor:'rgba(22,163,74,0.07)', fill:true, tension:0.4, pointRadius:0, borderWidth:2 },
        { label:'Owner break-even ฿41K', data:Array(60).fill(41), borderColor:'#f59e0b', borderDash:[4,4], pointRadius:0, fill:false, borderWidth:1.5 },
        { label:'Employee break-even ฿136K', data:Array(60).fill(136), borderColor:'#dc2626', borderDash:[4,4], pointRadius:0, fill:false, borderWidth:1.5 },
      ],
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      animation:{ duration:800, easing:'easeInOutQuart' },
      plugins:{ legend:{ position:'top', labels:{ font:{size:10}, boxWidth:12 } } },
      scales:{
        y:{ beginAtZero:true, max:200, ticks:{ callback: function(v) { return '฿'+v+'K'; } } },
        x:{ ticks:{ font:{size:9}, maxRotation:0 } },
      },
    },
  });
  renderMonthlyOps(currentOpsMode);
  renderAdvisory();
}

// ── MONTHLY OPS + ADVISORY ────────────────────────────────────────────────────
function switchOpsMode(mode) {
  currentOpsMode = mode;
  document.getElementById('ops-owner').classList.toggle('active', mode === 'owner');
  document.getElementById('ops-employee').classList.toggle('active', mode === 'employee');
  renderMonthlyOps(mode);
}

function renderMonthlyOps(mode) {
  var rows = clearEl('monthly-ops-rows');
  var total = 0;
  MONTHLY_OPS.forEach(function(r) {
    var val = mode === 'owner' ? r.owner : r.emp;
    total += val;
    var row = el('div','flex justify-between items-center text-xs py-1.5 border-b border-gray-100 ops-row');
    row.appendChild(el('span','text-gray-600', r.item));
    row.appendChild(el('span', val === 0 ? 'font-semibold text-green-600' : 'font-semibold text-gray-800',
      val === 0 ? '฿0 (equity partner)' : '฿' + val.toLocaleString()));
    rows.appendChild(row);
  });
  var totalRow = el('div','flex justify-between items-center text-sm py-2 font-bold text-green-700');
  totalRow.appendChild(el('span',null,'TOTAL / month'));
  totalRow.appendChild(el('span',null,'฿' + total.toLocaleString()));
  rows.appendChild(totalRow);

  var breakEven = Math.round(total / 0.40);
  var summary   = clearEl('monthly-ops-summary');
  var isOwner   = mode === 'owner';
  var s1 = el('div', (isOwner ? 'bg-green-50' : 'bg-red-50') + ' rounded-lg p-3');
  s1.appendChild(el('p','text-xs text-gray-500','Monthly Fixed Cost'));
  s1.appendChild(el('p','text-xl font-bold ' + (isOwner ? 'text-green-700' : 'text-red-700'), '฿' + total.toLocaleString()));
  var s2 = el('div', (isOwner ? 'bg-blue-50' : 'bg-orange-50') + ' rounded-lg p-3');
  s2.appendChild(el('p','text-xs text-gray-500','Break-even Revenue (at 40% GM)'));
  s2.appendChild(el('p','text-xl font-bold ' + (isOwner ? 'text-blue-700' : 'text-orange-700'), '฿' + breakEven.toLocaleString() + '/mo'));
  s2.appendChild(el('p','text-xs text-gray-400 mt-1', isOwner ? 'Achievable by Month 8-10' : 'Achievable by Month 45-50 (Year 4)'));
  summary.appendChild(s1);
  summary.appendChild(s2);
}

function renderAdvisory() {
  var ICON_BG  = { amber:'bg-amber-50',  red:'bg-red-50',  blue:'bg-blue-50',  purple:'bg-purple-50',  green:'bg-green-50',  indigo:'bg-indigo-50'  };
  var ICON_TXT = { amber:'text-amber-800',red:'text-red-700',blue:'text-blue-700',purple:'text-purple-700',green:'text-green-700',indigo:'text-indigo-700' };

  var cf = clearEl('cashflow-reality');
  [
    { label:'Owner / Partner Scenario',     value:'Break-even M8-10', detail:'฿400K startup sufficient. Profitable from Year 2. ~฿16.5K/mo fixed costs.', cls:'text-green-700', bg:'bg-green-50' },
    { label:'Employed Pharmacist Scenario', value:'Break-even M45-50', detail:'Need ฿1.1M+ extra capital. Only profitable from Year 5. ~฿54.5K/mo fixed costs.', cls:'text-red-700', bg:'bg-red-50' },
    { label:'Real Opening Days (Pantip data)', value:'฿300-600/day', detail:'3-6 customers on Day 1-2. Month 1 revenue: ~฿10-18K. Plan cash reserves accordingly.', cls:'text-gray-700', bg:'bg-gray-50' },
  ].forEach(function(item) {
    var card = el('div', item.bg + ' rounded-lg p-4 anim-card');
    card.appendChild(el('p','text-xs text-gray-500 font-semibold uppercase mb-1', item.label));
    card.appendChild(el('p','text-xl font-bold ' + item.cls + ' mb-1', item.value));
    card.appendChild(el('p','text-xs text-gray-600', item.detail));
    cf.appendChild(card);
  });

  var tips = clearEl('advisory-tips');
  ADVISORY_TIPS.forEach(function(t) {
    var card = el('div', (ICON_BG[t.color]||'bg-gray-50') + ' rounded-lg p-4 flex gap-3 items-start anim-card content-card');
    card.appendChild(el('span','text-2xl flex-shrink-0', t.icon));
    var body = el('div');
    body.appendChild(el('p','font-semibold text-sm ' + (ICON_TXT[t.color]||'text-gray-800'), t.title));
    body.appendChild(el('p','text-xs text-gray-600 mt-1', t.desc));
    card.appendChild(body);
    tips.appendChild(card);
  });

  setTimeout(initAnimations, 30);
}

// ── INVENTORY TAB ─────────────────────────────────────────────────────────────
function renderInventoryTab() {
  if (chartCat) chartCat.destroy();
  chartCat = new Chart(document.getElementById('catBarChart'), {
    type:'bar',
    data:{
      labels: INV.map(function(x) { return x.cat; }),
      datasets:[{ label:'SKU Count', data:INV.map(function(x){ return x.sku; }), backgroundColor:'#4ade80', borderRadius:3 }],
    },
    options:{
      responsive:true, maintainAspectRatio:false, indexAxis:'y',
      animation:{ duration:600 },
      plugins:{ legend:{display:false} },
      scales:{ y:{ ticks:{font:{size:9}} } },
    },
  });

  var pLabels = ['฿0-50','฿51-100','฿101-200','฿201-400','฿401-700','฿700+'];
  var pCounts = [168,214,191,123,85,50];
  var pColors = ['#86efac','#4ade80','#22c55e','#16a34a','#15803d','#166534'];
  if (chartPrice) chartPrice.destroy();
  chartPrice = new Chart(document.getElementById('priceBucketChart'), {
    type:'bar',
    data:{ labels:pLabels, datasets:[{ label:'SKU Count', data:pCounts, backgroundColor:pColors, borderRadius:4 }] },
    options:{
      responsive:true, maintainAspectRatio:false,
      animation:{ duration:600 },
      plugins:{ legend:{display:false}, title:{display:true,text:'Wholesale Price per Box/Bottle',font:{size:12}} },
      scales:{ y:{ title:{display:true,text:'# of SKUs'} } },
    },
  });

  var PRIORITY_CLS = { Highest:'bg-red-100 text-red-700', High:'bg-green-100 text-green-700', Medium:'bg-blue-100 text-blue-700', 'Low-Med':'bg-yellow-100 text-yellow-700' };
  var tbody = clearEl('inv-tbody');
  INV.forEach(function(row) {
    var tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-50 transition-colors duration-100';
    [
      el('td','px-4 py-2.5 text-gray-800', row.cat),
      el('td','px-4 py-2.5 text-right font-medium', String(row.sku)),
      el('td','px-4 py-2.5 text-right font-medium text-green-700', '฿' + row.cost.toLocaleString()),
      el('td','px-4 py-2.5 text-right text-gray-600', '฿' + row.avg),
    ].forEach(function(td) { tr.appendChild(td); });
    var tdP = el('td','px-4 py-2.5');
    tdP.appendChild(el('span','text-xs px-2 py-0.5 rounded-full font-semibold ' + (PRIORITY_CLS[row.priority]||'bg-gray-100 text-gray-600'), row.priority));
    tr.appendChild(tdP);
    tr.appendChild(el('td','px-4 py-2.5 text-gray-500 text-xs', row.strategy));
    tbody.appendChild(tr);
  });
}

// ── GPP CHECKLIST ─────────────────────────────────────────────────────────────
function buildChecklist() {
  var totalItems = 0;
  Object.entries(GPP_CHECKS).forEach(function(entry) {
    var key = entry[0], items = entry[1];
    var container = clearEl('cl-' + key);
    items.forEach(function(text, i) {
      totalItems++;
      var wrapper = el('div','flex items-start gap-2 text-sm');
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'mt-0.5 accent-green-600 flex-shrink-0';
      cb.id = 'gpp-' + key + '-' + i;
      cb.addEventListener('change', updateGPP);
      var lbl = el('label','text-gray-700 cursor-pointer leading-snug', text);
      lbl.htmlFor = cb.id;
      append(wrapper, cb, lbl);
      container.appendChild(wrapper);
    });
  });
  document.getElementById('gpp-count').textContent = '0 / ' + totalItems;
}

function updateGPP() {
  var all   = document.querySelectorAll('[id^="gpp-"]');
  var done  = Array.from(all).filter(function(c) { return c.checked; }).length;
  var total = all.length;
  document.getElementById('gpp-count').textContent = done + ' / ' + total;
  document.getElementById('gpp-bar').style.width = (done / total * 100) + '%';
  all.forEach(function(cb) {
    var wrapper = cb.closest('div');
    if (cb.checked) wrapper.classList.add('done-item');
    else            wrapper.classList.remove('done-item');
  });
}

// ── ROADMAP ───────────────────────────────────────────────────────────────────
function buildRoadmap() {
  var BADGE_CLS = {
    green:'bg-green-100 text-green-700',  blue:'bg-blue-100 text-blue-700',
    purple:'bg-purple-100 text-purple-700', yellow:'bg-yellow-100 text-yellow-700',
  };
  var container = clearEl('roadmap-phases');
  ROADMAP_PHASES.forEach(function(phase) {
    var item   = el('div','tl-dot relative phase-enter anim-card');
    var header = el('div','flex items-center gap-3 mb-2');
    header.appendChild(el('span','text-xs font-bold px-2 py-1 rounded ' + (BADGE_CLS[phase.color]||'bg-gray-100'), phase.period));
    header.appendChild(el('h3','font-bold text-gray-800', phase.label));
    item.appendChild(header);
    var ul = el('ul','text-sm text-gray-600 space-y-1 ml-2');
    phase.tasks.forEach(function(task) {
      var li = el('li','flex items-start gap-2');
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'mt-1 accent-green-600 flex-shrink-0';
      li.appendChild(cb);
      li.appendChild(el('span',null, task));
      ul.appendChild(li);
    });
    item.appendChild(ul);
    container.appendChild(item);
  });

  // Milestones
  var mlist = clearEl('milestones-list');
  MILESTONES.forEach(function(m, i) {
    var row  = el('div','flex items-center justify-between ' + (i < MILESTONES.length-1 ? 'border-b pb-2' : ''));
    var left = el('span', m.bold ? 'font-medium ' + m.accent : 'text-gray-500', m.period);
    var right = el('div','text-right');
    right.appendChild(el('p','font-bold ' + m.accent, m.rev));
    right.appendChild(el('p','text-xs text-gray-400', m.txn + ' txn/day · ' + m.note));
    append(row, left, right);
    mlist.appendChild(row);
  });

  // Risks
  var RISK_CLS = { red:'bg-red-50', yel:'bg-yellow-50', blue:'bg-blue-50' };
  var RISK_TC  = { red:'text-red-700', yel:'text-yellow-700', blue:'text-blue-700' };
  var RISK_SC  = { red:'text-red-500', yel:'text-yellow-600', blue:'text-blue-600' };
  var rlist = clearEl('risk-list');
  RISKS.forEach(function(r) {
    var row = el('div','flex items-start gap-2 rounded-lg p-2 ' + (RISK_CLS[r.level]||'bg-gray-50'));
    row.appendChild(el('span','mt-0.5 flex-shrink-0', r.level === 'blue' ? 'ℹ️' : '⚠️'));
    var info = el('div');
    info.appendChild(el('p','font-medium ' + (RISK_TC[r.level]||'text-gray-700'), r.title));
    info.appendChild(el('p','text-xs '     + (RISK_SC[r.level]||'text-gray-500'), r.fix));
    row.appendChild(info);
    rlist.appendChild(row);
  });

  // Tech
  var tlist = clearEl('tech-list');
  TECH.forEach(function(t) {
    var row = el('div','flex items-center gap-2 bg-gray-50 rounded px-3 py-2');
    row.appendChild(el('span','flex-shrink-0', t.icon));
    var info = el('div');
    info.appendChild(el('p','font-medium', t.title));
    info.appendChild(el('p','text-xs text-gray-500', t.desc));
    row.appendChild(info);
    tlist.appendChild(row);
  });
}

// ── DEMOGRAPHICS CHART ────────────────────────────────────────────────────────
function buildDemoChart() {
  chartDemo = new Chart(document.getElementById('demoChart'), {
    type:'doughnut',
    data:{
      labels:['Working Adults 30-59','Children under 18','Seniors 60+','Pet Owners'],
      datasets:[{ data:[500,250,200,250], backgroundColor:['#4ade80','#60a5fa','#f59e0b','#a78bfa'], borderWidth:2, borderColor:'#fff' }],
    },
    options:{ responsive:true, maintainAspectRatio:false, cutout:'55%', plugins:{ legend:{ position:'bottom', labels:{ font:{size:9}, boxWidth:10, padding:6 } } } },
  });
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  buildDemoChart();
  buildChecklist();
  buildRoadmap();
  switchBudget(200);
  setTimeout(initAnimations, 100);
});
