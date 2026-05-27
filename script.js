'use strict';

// ── DATA (all hardcoded constants — no user input rendered) ──────────────────

const INV = [
  { cat:'ยา OTC และของใช้ในบ้าน',          sku:171, cost:15416, avg:99,  priority:'สูงสุด',        strategy:'ทุกรายการ x 1-2 ชิ้น' },
  { cat:'ยาทา / ครีม / สเตียรอยด์',        sku:112, cost:10520, avg:97,  priority:'สูง',            strategy:'80% x 1 ชิ้น' },
  { cat:'ยาระบบทางเดินหายใจ',               sku: 58, cost: 8179, avg:149, priority:'สูง',            strategy:'ทุกรายการ x 1 ชิ้น' },
  { cat:'ยาหัวใจและหลอดเลือด',              sku: 54, cost:15101, avg:321, priority:'สูง',            strategy:'60% x 1 ชิ้น (Rx)' },
  { cat:'วิตามินและอาหารเสริม',             sku: 54, cost:12796, avg:237, priority:'สูง',            strategy:'ทุกรายการ x 1 ชิ้น' },
  { cat:'วิตามิน (บำรุงร่างกาย)',           sku: 64, cost: 3473, avg: 57, priority:'สูง',            strategy:'ทุกรายการ x 1 ชิ้น' },
  { cat:'ยาปฏิชีวนะ',                       sku: 44, cost: 7468, avg:187, priority:'ปานกลาง',       strategy:'60% x 1 ชิ้น (Rx)' },
  { cat:'ยาเบาหวาน',                        sku: 43, cost:15175, avg:353, priority:'สูง',            strategy:'50% x 1 ชิ้น (Rx)' },
  { cat:'ยาแก้ปวด / ลดไข้',                sku: 45, cost:10763, avg:263, priority:'สูง',            strategy:'ทุกรายการ x 1 ชิ้น' },
  { cat:'ยาระบบทางเดินอาหาร',               sku: 42, cost: 4590, avg:115, priority:'สูง',            strategy:'ทุกรายการ x 1 ชิ้น' },
  { cat:'ยาสมุนไพร / ยาแผนโบราณ',          sku: 46, cost: 2519, avg: 55, priority:'ต่ำ-ปานกลาง',   strategy:'70% x 1 ชิ้น' },
  { cat:'ยาตา / หู / จมูก / คอ',           sku: 35, cost: 3858, avg:117, priority:'ปานกลาง',       strategy:'ทุกรายการ x 1 ชิ้น' },
  { cat:'ฮอร์โมน / ยาคุมกำเนิด',           sku: 29, cost: 5196, avg:179, priority:'ปานกลาง',       strategy:'60% x 1 ชิ้น' },
  { cat:'อุปกรณ์การแพทย์',                  sku: 34, cost: 1448, avg: 54, priority:'ปานกลาง',       strategy:'80% x 1 ชิ้น' },
];

const BUDGETS = {
  200: {
    tag: 'ประหยัดสุด',
    kpiSku:'450', kpiRev:'฿50K/เดือน (ปี 1)', kpiPayback:'ปีที่ 2-3 (เจ้าของ)',
    fixed:[
      ['ปรับปรุงร้านตาม GPP (ขั้นต่ำ)',           55000],
      ['ตู้เย็นเก็บยา',                              8000],
      ['เงินมัดจำ (3 เดือน)',                       24000],
      ['ใบอนุญาตร้านยา + จดทะเบียนธุรกิจ',         8000],
      ['POS + เครื่องสแกน + เครื่องพิมพ์ฉลาก',    18000],
      ['คอมพิวเตอร์ + จอ + UPS',                   18000],
    ],
    inv:55000, working:14000, total:200000,
    invScale: 0.5,
  },
  400: {
    tag: 'แนะนำ',
    kpiSku:'700+', kpiRev:'฿50K/เดือน (ปี 1)', kpiPayback:'ปีที่ 2-3 (เจ้าของ)',
    fixed:[
      ['ปรับปรุงร้านตาม GPP (เต็มรูปแบบ)',         120000],
      ['ตู้เย็นเก็บยา 300 ลิตร',                    15000],
      ['เครื่องปรับอากาศ (2 เครื่อง)',              25000],
      ['เงินมัดจำ (3 เดือน)',                        24000],
      ['ใบอนุญาตร้านยา + ค่าดำเนินการกฎหมาย',      12000],
      ['POS + เครื่องสแกนบาร์โค้ด 2 เครื่อง',      20000],
      ['เครื่องพิมพ์ฉลากและใบเสร็จ',                 8000],
      ['คอมพิวเตอร์ + ระบบเครือข่าย + UPS',        22000],
      ['กล้อง CCTV (4 ตัว)',                        12000],
      ['ค่าการตลาดเปิดตัว',                          12000],
    ],
    inv:110000, working:20000, total:400000,
    invScale: 1,
  },
};

const MONTHLY_OPS = [
  { item:'ค่าเช่า',                                              owner:8000,  emp:8000  },
  { item:'เงินเดือนเภสัชกร',                                    owner:0,     emp:38000 },
  { item:'ค่าไฟฟ้า (แอร์ 2 เครื่อง + ตู้เย็นยา + แสงสว่าง)', owner:5000, emp:5000  },
  { item:'ค่าน้ำ',                                               owner:400,   emp:400   },
  { item:'อินเทอร์เน็ต / Fiber 100 Mbps',                       owner:700,   emp:700   },
  { item:'LINE OA Premium (รายเดือน)',                            owner:400,   emp:400   },
  { item:'วัสดุสิ้นเปลือง (ถุง, ฉลาก, ทำความสะอาด)',           owner:2000,  emp:2000  },
];
// เจ้าของรวม: 16,500 | จุดคุ้มทุน GM 40%: 41,250
// จ้างเภสัชกรรวม: 54,500 | จุดคุ้มทุน GM 40%: 136,250

const ADVISORY_TIPS = [
  { icon:'⚠️', color:'amber',  title:'เภสัชกรต้องเป็นเจ้าของ — สำคัญมาก',
    desc:'การจ้างเภสัชกร (เงินเดือน ฿38K+/เดือน) ทำให้จุดคุ้มทุนเลื่อนไปปีที่ 4-5 และต้องใช้เงินสำรองเพิ่มกว่า ฿1.1M หากเภสัชกรเป็นหุ้นส่วนผู้ก่อตั้ง จุดคุ้มทุนจะอยู่ที่เดือนที่ 8-10' },
  { icon:'💰', color:'red',    title:'เงินสำรอง: กรณีจ้างเภสัชกรต้องการกว่า ฿1.1M',
    desc:'กรณีเจ้าของ: เงินทุน ฿400K เพียงพอ — ทำกำไรได้ตั้งแต่ปีที่ 2 กรณีจ้าง: ต้องสำรองเงินเพิ่มกว่า ฿1.1M เพื่อรองรับการขาดทุน 4 ปีก่อนถึงจุดคุ้มทุน' },
  { icon:'🤝', color:'blue',   title:'ต่อรองเครดิตจากซัพพลายเออร์ 30-60 วัน',
    desc:'GPO และผู้จัดจำหน่ายที่ได้รับอนุญาตมักให้เครดิตเทอมแก่ร้านยาที่มีใบอนุญาต ใช้ประโยชน์จากช่วงเครดิตเพื่อลดแรงกดดันด้านเงินทุนหมุนเวียน โดยเฉพาะในปีแรกที่รายได้ยังน้อย' },
  { icon:'📦', color:'purple', title:'เริ่มจากสินค้าขายดี 100-150 รายการก่อน',
    desc:'ปีที่ 1 เน้นสินค้า OTC ที่หมุนเวียนเร็ว อย่าเปิดตัว 831 SKUs พร้อมกัน สินค้าหมุนช้าจะดูดเงินสดและเสี่ยงสินค้าหมดอายุ ขยายสต็อกจากกำไรที่ทำได้' },
  { icon:'🏢', color:'green',  title:'สัญญา B2B 1 ฉบับ = ฿10-30K/เดือน',
    desc:'ติดต่อออฟฟิศ โรงเรียน หรือแคมป์ก่อสร้างใกล้เคียงเพื่อเป็นผู้จัดหายาองค์กร บัญชี B2B หนึ่งราย อาจเท่ากับยอดขายปลีก 1-3 สัปดาห์ โดยมีปริมาณที่คาดการณ์ได้' },
  { icon:'📱', color:'indigo', title:'บริการสั่งยา Rx ซ้ำผ่าน LINE OA (เริ่มวันแรกเลย)',
    desc:'ตั้งระบบสั่งยาซ้ำตั้งแต่วันแรก แม้ยังไม่มีคนใช้ เมื่อลูกค้า Rx เริ่มสะสมในปีที่ 2+ คำสั่งซื้อจาก LINE OA ของผู้อยู่อาศัยในคอนโดจะเพิ่มรายรับ ฿8-15K/เดือน โดยแทบไม่มีต้นทุนเพิ่ม' },
];

const GPP_CHECKS = {
  premises:[
    'พื้นที่ขายให้คำปรึกษาและแนะนำการใช้ยา ต่อเนื่องกันไม่น้อยกว่า 8 ตร.ม. ด้านที่สั้นที่สุดไม่น้อยกว่า 2 เมตร (ข้อบกพร่องร้ายแรง)',
    'สถานที่มีทะเบียนบ้านถูกต้อง กรณีอาคารชุดต้องได้รับอนุญาตประกอบกิจการ ไม่ใช่พื้นที่พักอาศัย (ข้อบกพร่องร้ายแรง)',
    'บริเวณให้คำปรึกษาและแนะนำการใช้ยา แยกเป็นสัดส่วนจากส่วนบริการอื่นอย่างชัดเจน มีโต๊ะ-เก้าอี้และป้ายแสดง',
    'สถานที่ถูกสุขลักษณะ สะอาด เป็นระเบียบเรียบร้อย มีการควบคุมป้องกันสัตว์แมลง ไม่มีสัตว์เลี้ยงในบริเวณขายยา (ข้อบกพร่องร้ายแรง)',
    'มีแสงสว่างเพียงพอในการอ่านเอกสาร อ่านฉลากผลิตภัณฑ์ยาและป้ายแสดงต่างๆ ได้อย่างชัดเจน',
    'มีการควบคุมป้องกันสัตว์และแมลงรบกวน อากาศถ่ายเทสะดวก',
    'สามารถควบคุมอุณหภูมิในพื้นที่ขายและเก็บยาไม่เกิน 30 องศาเซลเซียส ป้องกันแสงแดดส่องถึงผลิตภัณฑ์ยาโดยตรง (ข้อบกพร่องร้ายแรง)',
    'บันทึกอุณหภูมิและความชื้นในพื้นที่เก็บยาทุกวัน (ข้อบกพร่องร้ายแรง)',
  ],
  equipment:[
    'ตู้เย็นเก็บยาที่ต้องอุณหภูมิต่ำกว่าห้อง 1 เครื่อง ใช้งานได้ตามมาตรฐาน มีพื้นที่เพียงพอและแยกเก็บเป็นสัดส่วน (ข้อบกพร่องร้ายแรง)',
    'ถาดนับเม็ดยาอย่างน้อย 2 ถาด ใช้งานได้ดี และแยกถาดสำหรับยา Penicillin/Sulfonamide/NSAID อย่างเด็ดขาด (ข้อบกพร่องร้ายแรง)',
    'เครื่องวัดความดันโลหิตชนิดอัตโนมัติ 1 เครื่อง ใช้งานได้ตามมาตรฐาน (ข้อบกพร่องร้ายแรง)',
    'เครื่องชั่งน้ำหนักสำหรับผู้มารับบริการ 1 เครื่อง ใช้งานได้ดี',
    'เลือกภาชนะบรรจุที่เหมาะสมเพื่อป้องกันยาเสื่อมสภาพ รวมถึงภาชนะทึบแสงสำหรับยาที่ไวต่อแสง (ข้อบกพร่องร้ายแรง)',
    'อุปกรณ์นับเม็ดยา ไม้พาย โกร่งบด ครบตามมาตรฐาน (ข้อบกพร่องร้ายแรง)',
    'มีวัสดุทึบปิดบังบริเวณยาอันตรายและยาควบคุมพิเศษเมื่อเภสัชกรไม่อยู่ปฏิบัติหน้าที่ พร้อมป้ายแจ้ง (ข้อบกพร่องร้ายแรง)',
    'ติดตั้ง CCTV ครอบคลุมเคาน์เตอร์จ่ายยาและตู้เก็บยาควบคุม',
  ],
  legal:[
    'ใบอนุญาตขายยาแผนปัจจุบัน (อย.) ยังอยู่ในอายุและติดตั้งถูกต้อง',
    'ผังพื้นที่ร้านยาปัจจุบันตรงกับที่ยื่นขออนุญาตและได้รับอนุมัติ',
    'จดทะเบียนพาณิชย์ (กรมพัฒนาธุรกิจการค้า)',
    'ติดใบประกอบวิชาชีพเภสัชกรรมของเภสัชกรผู้มีหน้าที่ปฏิบัติการไว้ที่เคาน์เตอร์อย่างชัดเจน (ข้อบกพร่องร้ายแรง)',
    'ติดตารางเวลาปฏิบัติงานของเภสัชกรไว้ที่ร้านขายยา',
    'มีหนังสือยินยอมเป็นลายลักษณ์อักษรจากเจ้าของสถานที่',
    'ส่งแบบประเมินตนเอง GPP ให้ อย. แล้ว',
  ],
  docs:[
    'ฉลากยาที่ส่งมอบระบุ: ชื่อยา ขนาดและวิธีใช้ คำเตือน ลายมือชื่อเภสัชกร (ข้อบกพร่องร้ายแรง)',
    'มีระบบบัญชียาอันตรายและยาควบคุมพิเศษ (ขย.5, ขย.11) บันทึกถูกต้อง (ข้อบกพร่องร้ายแรง)',
    'มีใบกำกับภาษีและบันทึกการจัดซื้อยาจากแหล่งที่ได้รับอนุญาตตามกฎหมาย (ข้อบกพร่องร้ายแรง)',
    'มีระบบการส่งคืนหรือทำลายยาหมดอายุหรือยาเสื่อมคุณภาพที่ถูกต้องตามหลักวิชาการ',
    'มีแบบฟอร์มรายงานอาการไม่พึงประสงค์จากยา (ADR) และกระบวนการส่งรายงาน',
    'มีแผนรับมือการเรียกคืนยาและยาปลอม',
    'มีกระบวนการเฝ้าระวังพฤติกรรมการใช้ยาไม่เหมาะสมและยาที่มีความเสี่ยงสูง',
  ],
};

const ROADMAP_PHASES = [
  {
    period:'เดือน 1-2', color:'green', label:'Phase 0 — เตรียมความพร้อมก่อนเปิด',
    tasks:[
      'จดทะเบียนธุรกิจ (จดทะเบียนพาณิชย์)',
      'ยื่นขอใบอนุญาตร้านยาต่อ อย.',
      'เซ็นสัญญาเช่าและรับกุญแจ',
      'ออกแบบผัง GPP 40 ตร.ม. + จ้างผู้รับเหมาปรับปรุง',
    ],
  },
  {
    period:'เดือน 2-3', color:'blue', label:'Phase 1 — ปรับปรุงและก่อสร้าง',
    tasks:[
      'ปรับปรุงร้าน (6 สัปดาห์): ชั้นวาง เคาน์เตอร์ แสงสว่าง แอร์',
      'ติดตั้งตู้เย็นยา + ระบบตรวจสอบอุณหภูมิ',
      'ติดตั้ง CCTV + โครงสร้างพื้นฐาน IT (เครือข่าย POS เครื่องพิมพ์)',
      'นัดเจ้าหน้าที่ อย. ตรวจสถานที่',
    ],
  },
  {
    period:'เดือน 3-4', color:'purple', label:'Phase 2 — จัดซื้อสินค้าและเตรียมระบบ',
    tasks:[
      'สั่งสินค้าเปิดตัวจาก GPO + ผู้จัดจำหน่ายที่ได้รับอนุญาต',
      'นำ SKU ทั้งหมดเข้าระบบ POS พร้อมบาร์โค้ดและจุดสั่งซื้อซ้ำ',
      'เปิด LINE Official Account + โซเชียลมีเดีย',
      'อบรม GPP พนักงาน (การจ่ายยา รายงาน ADR เอกสาร)',
    ],
  },
  {
    period:'เดือน 4', color:'yellow', label:'Phase 3 — Soft Launch',
    tasks:[
      'รับใบอนุญาตร้านยา — เปิดขาย OTC + วิตามิน',
      'แจกใบปลิวทุก 500 ยูนิต + โพสต์ในกลุ่ม LINE คอนโด',
      'จัดกิจกรรมตรวจสุขภาพครั้งแรก (วัดความดันฟรี)',
    ],
  },
  {
    period:'เดือน 4+', color:'green', label:'Phase 4 — เปิดเต็มรูปแบบ',
    tasks:[
      'เปิดให้บริการจ่ายยาตามใบสั่งแพทย์ (Rx) เต็มรูปแบบ',
      'เปิดตัวโปรแกรมบัตรสะสมแต้ม',
      'ตั้งเป้า 25 ธุรกรรม/วัน ภายในเดือนที่ 6',
      'ทบทวนสินค้าคงคลังรายเดือน: เพิ่มสินค้าขายดี ตัดสินค้าขายช้า',
    ],
  },
];

const MILESTONES = [
  { period:'ปีที่ 1 เดือน 1-3 (เปิดตัว)', rev:'฿10-25K',  txn:'3-8',  note:'ช่วงสำรวจตลาด',              accent:'text-red-600' },
  { period:'ปีที่ 1 เดือน 12',             rev:'฿50K',      txn:'16',   note:'สูงสุดที่เป็นจริงปีที่ 1',   accent:'text-yellow-600' },
  { period:'ปีที่ 2 เฉลี่ย',               rev:'฿62K',      txn:'20',   note:'บอกต่อเริ่มทำงาน',           accent:'text-yellow-600' },
  { period:'ปีที่ 3 เดือน 12 ★',      rev:'฿105K',     txn:'35',   note:'ใกล้จุดคุ้มทุน (เจ้าของ)',   accent:'text-blue-600', bold:true },
  { period:'ปีที่ 4 เดือน 12 ★★',rev:'฿140K',     txn:'46',   note:'จุดคุ้มทุน (กรณีจ้างเภสัชกร)', accent:'text-green-600', bold:true },
  { period:'ปีที่ 5 เดือน 12',             rev:'฿170K',     txn:'55',   note:'ทำกำไรได้',                  accent:'text-green-600' },
];

const RISKS = [
  { level:'red',  title:'ใบอนุญาต อย. ล่าช้า',          fix:'ปรึกษา อย. ล่วงหน้า; ใช้ช่วง Soft Open ขาย OTC ก่อน' },
  { level:'yel',  title:'งานปรับปรุงร้านบานปลาย',        fix:'ทำสัญญาราคาคงที่กับผู้รับเหมา' },
  { level:'yel',  title:'ลูกค้าน้อยในปีแรก',             fix:'การตลาดผ่านกลุ่ม LINE + จัดกิจกรรมสุขภาพ' },
  { level:'blue', title:'ยาหมดอายุสร้างความเสียหาย',     fix:'ติดตามอายุยา 90 วัน; สั่งขั้นต่ำ 1 หน่วย' },
];

const TECH = [
  { icon:'🖥️', title:'ระบบ POS',                    desc:'PharmaSys SaaS หรือพัฒนาเองด้วย Supabase + React' },
  { icon:'💚',       title:'LINE Official Account',  desc:'สั่งยาซ้ำ ถามเภสัชกร สะสมแต้ม' },
  { icon:'📊',       title:'แดชบอร์ดวิเคราะห์ข้อมูล', desc:'แจ้งเตือนยาหมดอายุ ความเร็วขาย สั่งซื้อซ้ำ' },
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
  document.getElementById('fin-label').textContent   = 'งบ ฿' + b.toLocaleString() + ',000 — ' + d.tag;
  animateNum('kpi-budget', b * 1000, '฿', '');
  renderFinance();
}

function handleFloorPlanClick() {
  window.open('floorplan-th.html', '_blank');
}

// ── FINANCE TAB ───────────────────────────────────────────────────────────────
function renderFinance() {
  var d = BUDGETS[currentBudget];
  var COLORS = ['#16a34a','#15803d','#1a7a3c','#2d9e3f','#4bc057','#60c96b','#77d17e','#22c55e','#dc2626','#ea580c','#d97706','#7c3aed'];

  // Fixed cost donut
  var fLabels = d.fixed.map(function(x) { return x[0]; }).concat(['สินค้าคงคลัง', 'เงินทุนหมุนเวียน']);
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
  append(total, el('span',null,'รวมทั้งหมด'), el('span',null,'฿' + d.total.toLocaleString()));
  rows.appendChild(total);

  // Inventory bar
  var invAlloc = [22000,8400,8200,9100,16300,3473,4500,7600,10800,4600,1800,3900,3100,1200];
  var invVals  = invAlloc.map(function(v) { return Math.round(v * d.invScale); });
  var totalInv = invVals.reduce(function(a,b) { return a+b; }, 0);
  if (chartInvBar) chartInvBar.destroy();
  chartInvBar = new Chart(document.getElementById('invBarChart'), {
    type:'bar',
    data:{ labels: INV.map(function(x) { return x.cat; }), datasets:[{ label:'งบขายส่ง (บาท)', data: invVals, backgroundColor:'#4ade80', borderRadius:3 }] },
    options:{
      responsive:true, maintainAspectRatio:false, indexAxis:'y',
      plugins:{ legend:{display:false} },
      scales:{ x:{ grid:{display:false}, ticks:{font:{size:9}} }, y:{ ticks:{font:{size:9}} } },
    },
  });
  document.getElementById('inv-total-line').textContent = 'รวมงบสินค้าคงคลัง: ฿' + totalInv.toLocaleString();

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
    if (m===1)  return 'ปี1 ด.1';
    if (m===12) return 'ปี1 ด.12';
    if (m===24) return 'ปี2 ด.12';
    if (m===36) return 'ปี3 ด.12';
    if (m===48) return 'ปี4 ด.12';
    if (m===60) return 'ปี5 ด.12';
    return '';
  });
  if (chartRevLine) chartRevLine.destroy();
  chartRevLine = new Chart(document.getElementById('revenueLineChart'), {
    type:'line',
    data:{
      labels: MONTHS5,
      datasets:[
        { label:'รายรับรายเดือน (฿K)', data:REV5, borderColor:'#16a34a', backgroundColor:'rgba(22,163,74,0.07)', fill:true, tension:0.4, pointRadius:0, borderWidth:2 },
        { label:'จุดคุ้มทุน (เจ้าของ) ฿41K', data:Array(60).fill(41), borderColor:'#f59e0b', borderDash:[4,4], pointRadius:0, fill:false, borderWidth:1.5 },
        { label:'จุดคุ้มทุน (จ้างเภสัชกร) ฿136K', data:Array(60).fill(136), borderColor:'#dc2626', borderDash:[4,4], pointRadius:0, fill:false, borderWidth:1.5 },
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
      val === 0 ? '฿0 (หุ้นส่วน)' : '฿' + val.toLocaleString()));
    rows.appendChild(row);
  });
  var totalRow = el('div','flex justify-between items-center text-sm py-2 font-bold text-green-700');
  totalRow.appendChild(el('span',null,'รวม / เดือน'));
  totalRow.appendChild(el('span',null,'฿' + total.toLocaleString()));
  rows.appendChild(totalRow);

  var breakEven = Math.round(total / 0.40);
  var summary   = clearEl('monthly-ops-summary');
  var isOwner   = mode === 'owner';
  var s1 = el('div', (isOwner ? 'bg-green-50' : 'bg-red-50') + ' rounded-lg p-3');
  s1.appendChild(el('p','text-xs text-gray-500','ต้นทุนคงที่รายเดือน'));
  s1.appendChild(el('p','text-xl font-bold ' + (isOwner ? 'text-green-700' : 'text-red-700'), '฿' + total.toLocaleString()));
  var s2 = el('div', (isOwner ? 'bg-blue-50' : 'bg-orange-50') + ' rounded-lg p-3');
  s2.appendChild(el('p','text-xs text-gray-500','รายรับจุดคุ้มทุน (GM 40%)'));
  s2.appendChild(el('p','text-xl font-bold ' + (isOwner ? 'text-blue-700' : 'text-orange-700'), '฿' + breakEven.toLocaleString() + '/เดือน'));
  s2.appendChild(el('p','text-xs text-gray-400 mt-1', isOwner ? 'ทำได้ภายในเดือนที่ 8-10' : 'ทำได้ภายในเดือนที่ 45-50 (ปีที่ 4)'));
  summary.appendChild(s1);
  summary.appendChild(s2);
}

function renderAdvisory() {
  var ICON_BG  = { amber:'bg-amber-50',  red:'bg-red-50',  blue:'bg-blue-50',  purple:'bg-purple-50',  green:'bg-green-50',  indigo:'bg-indigo-50'  };
  var ICON_TXT = { amber:'text-amber-800',red:'text-red-700',blue:'text-blue-700',purple:'text-purple-700',green:'text-green-700',indigo:'text-indigo-700' };

  var cf = clearEl('cashflow-reality');
  [
    { label:'กรณีเจ้าของ/หุ้นส่วน',          value:'จุดคุ้มทุนเดือนที่ 8-10', detail:'เงินทุน ฿400K เพียงพอ ทำกำไรตั้งแต่ปีที่ 2 ต้นทุนคงที่ ~฿16.5K/เดือน', cls:'text-green-700', bg:'bg-green-50' },
    { label:'กรณีจ้างเภสัชกร',                value:'จุดคุ้มทุนเดือนที่ 45-50', detail:'ต้องใช้เงินสำรองเพิ่มกว่า ฿1.1M ทำกำไรได้ตั้งแต่ปีที่ 5 ต้นทุนคงที่ ~฿54.5K/เดือน', cls:'text-red-700', bg:'bg-red-50' },
    { label:'ยอดขายวันเปิดจริง (ข้อมูล Pantip)', value:'฿300-600/วัน', detail:'3-6 ราย ใน 1-2 วันแรก รายรับเดือน 1: ~฿10-18K วางแผนเงินสำรองให้พอ', cls:'text-gray-700', bg:'bg-gray-50' },
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
      datasets:[{ label:'จำนวน SKU', data:INV.map(function(x){ return x.sku; }), backgroundColor:'#4ade80', borderRadius:3 }],
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
    data:{ labels:pLabels, datasets:[{ label:'จำนวน SKU', data:pCounts, backgroundColor:pColors, borderRadius:4 }] },
    options:{
      responsive:true, maintainAspectRatio:false,
      animation:{ duration:600 },
      plugins:{ legend:{display:false}, title:{display:true,text:'ราคาขายส่งต่อกล่อง/ขวด',font:{size:12}} },
      scales:{ y:{ title:{display:true,text:'จำนวน SKU'} } },
    },
  });

  var PRIORITY_CLS = { 'สูงสุด':'bg-red-100 text-red-700', 'สูง':'bg-green-100 text-green-700', 'ปานกลาง':'bg-blue-100 text-blue-700', 'ต่ำ-ปานกลาง':'bg-yellow-100 text-yellow-700' };
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
    right.appendChild(el('p','text-xs text-gray-400', m.txn + ' ธุรกรรม/วัน · ' + m.note));
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
      labels:['วัยทำงาน 30-59 ปี','เด็กอายุต่ำกว่า 18 ปี','ผู้สูงอายุ 60+ ปี','เจ้าของสัตว์เลี้ยง'],
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
