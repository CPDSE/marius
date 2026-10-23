// Clickable areas as SVG paths in slide EMU coordinates, taken from the pptx.
// The picture sits at x = -52681 and is 10111081 x 6858000 EMU.
const PIC = { x: -52681, w: 10111081, h: 6858000 };
const AREAS = [
  // The four services, one per red blood cell (ellipses traced from cell.png)
  ['sv01', 'M5943110 881534a323560 236811 0 1 0 647120 0a323560 236811 0 1 0 -647120 0Z'],
  ['sv02', 'M6822791 716795a293227 226514 0 1 0 586454 0a293227 226514 0 1 0 -586454 0Z'],
  ['sv03', 'M7378911 1447820a283116 205922 0 1 0 566232 0a283116 205922 0 1 0 -566232 0Z'],
  ['sv04', 'M9360722 2271509a237615 216218 0 1 0 475230 0a237615 216218 0 1 0 -475230 0Z'],
  ['cyto', 'M4279391 1883664C3883151 2118360 4251959 3989832 3401567 4014216C2551175 4038600 2752343 3621024 2523743 3840480C2295143 4059936 1652015 4187952 1490471 4123944C1328927 4059936 1255775 3977640 1225295 3785616C1194815 3593592 1319783 3364992 1572767 3127248C1798319 2973324 2308939 3023925 2459735 2807208C2610531 2590491 2593985 1698516 2725049 1661940C2856113 1625364 2987040 1671828 3172968 1655064C3368040 1656588 3816095 1703832 3840479 1664208C3864863 1624584 3517391 1421892 3319271 1417320C3002279 1431036 2932175 1502664 2651759 1636776C2426207 1834896 1868424 2004060 1636776 2221992C1405128 2439924 1272540 2741676 1261872 2944368C1251204 3147060 1452371 3023616 1408175 3218688C1182623 3596640 905255 3869436 969263 4114800C1033271 4360164 1190243 4791456 1792223 4690872C2026919 4759452 2188463 4503420 2441447 4562856C2694431 4622292 3009899 4978908 3310127 5047488C3610355 5116068 4000499 5070348 4242815 4974336C4485131 4878324 4799075 4765548 4937759 4599432C5076443 4433316 5093207 4210812 5056631 4032504C5020055 3854196 4774691 3666744 4718303 3529584C4661915 3392424 4642103 3354324 4718303 3209544C4794503 3064764 5212079 2945892 5175503 2660904C5138927 2375916 4675631 1648968 4279391 1883664Z'],
  ['nucleus', 'M2844599 3277599C2950509 3088188 2613847 2907711 2696222 2800901C2778724 2694090 2932857 2636348 3339230 2636477C3667833 2734355 3795105 2695126 3968168 3204450C3843839 3677393 3874921 3701863 3622681 3854634C3243681 4031486 2862506 3859424 2732804 3763360C2603103 3667165 2798039 3543136 2844599 3277599Z'],
  // Research themes, clockwise along the pharma value chain from the upper left
  ['th01', 'M320041 1024127C400813 1037843 271273 1405127 512065 1408175C731521 1408175 1043941 1385315 1170433 1408175C1296925 1431035 1307593 1466087 1271017 1545335C1240537 1621535 1266445 1685543 1179577 1773935C1092709 1862327 771145 1953767 749809 2075687L685801 2441447C632461 2551175 493777 2694431 429769 2734055C365761 2773679 294133 2837687 237745 2852927C181357 2868167 118873 2880359 91441 2825495C76201 2776727 53341 2758439 45721 2679191C38101 2599943 64009 2446019 45721 2350007C27433 2253995 -45719 2177795 -64007 2103119C-82295 2028443 -77723 1964435 -64007 1901951C-50291 1839467 3049 1824227 18289 1728215C33529 1632203 -22859 1443227 27433 1325879C77725 1208531 239269 1010411 320041 1024127Z'],
  ['th02', 'M2898647 274319C3105911 252983 3368039 54863 3529583 64007C3691127 73151 3805427 234695 3867911 329183C3930395 423671 3842004 515112 3904488 630936C3966972 746760 4014215 786383 4023359 859535C4032503 932687 4012691 1037844 3959351 1069848C3906011 1101852 3867911 1156715 3730751 1152143C3593591 1147571 3334511 1078991 3136391 1042415C2950463 1062227 2706623 1304543 2615183 1271015L2340863 1170431C2249423 1126235 2042159 1106423 2066543 1005839L2139695 704087C2174747 592835 2069591 359663 2276855 338327L2898647 274319Z'],
  ['th03', 'M5532121 1773936C5602225 1769364 5626609 1837944 5650993 1911096C5675377 1984248 5669281 2112264 5678425 2212848C5725669 2327148 5843017 2578608 5934457 2596896L6208777 2651760C6280405 2685288 6373369 2712720 6364225 2798064L6336793 3054096C6312409 3108960 6327649 3124200 6217921 3127248L5888737 3136392C5792725 3153156 5681473 3246120 5641849 3227832L5522977 3172968C5498593 3144012 5480305 3139440 5495545 3054096L5541265 2798064C5518405 2682240 5385817 2435352 5358385 2359152C5330953 2282952 5297425 2200656 5276089 2130552C5254753 2060448 5187697 1997964 5230369 1938528C5273041 1879092 5462017 1778508 5532121 1773936Z'],
  ['th04', 'M5422393 3566161C5466589 3505201 5591557 3465577 5678425 3483865C5765293 3502153 5903977 3605785 5943601 3675889C5983225 3745993 5925313 3828289 5916169 3904489C5891785 4012693 5748529 4258057 5797297 4325113L5943601 4526281C6006085 4590289 6150865 4636009 6172201 4709161L6236209 4928617C6237733 4992625 6214873 5081017 6181345 5093209L6080761 5129785C6027421 5129785 5929885 5084065 5861305 5093209C5792725 5102353 5750053 5167885 5669281 5184649C5588509 5201413 5443729 5227321 5376673 5193793C5309617 5160265 5276089 5052061 5266945 4983481C5257801 4914901 5294377 4843273 5321809 4782313L5404105 4599433C5402581 4498849 5303521 4227577 5312665 4178809L5340097 4032505C5356861 3977641 5399533 3927349 5413249 3849625C5426965 3771901 5378197 3627121 5422393 3566161Z'],
  ['th05', 'M2660903 5486399C2788919 5490971 2849879 5635751 2889503 5650991L3008375 5696711C3037331 5716523 3028187 5750051 3063239 5769863C3098291 5789675 3166871 5800343 3218687 5815583C3259835 5855207 3256787 5954267 3310127 6007607C3363467 6060947 3482339 6086855 3538727 6135623C3595115 6184391 3624071 6248399 3648455 6300215C3672839 6352031 3713987 6397751 3685031 6446519C3656075 6495287 3555491 6542531 3474719 6592823C3393947 6643115 3291839 6696455 3200399 6748271C3095243 6768083 2938271 6693407 2843783 6711695L2560319 6766559C2456687 6751319 2246375 6675119 2221991 6620255C2197607 6565391 2176271 6513575 2148839 6455663C2121407 6397751 2151887 6388607 2057399 6272783C1981199 6160007 1863851 6031991 1828799 5934455C1793747 5836919 1822703 5748527 1847087 5687567C1871471 5626607 1929383 5579363 1975103 5568695C2020823 5558027 2007107 5637275 2121407 5623559C2235707 5609843 2532887 5481827 2660903 5486399Z'],
  ['th06', 'M402335 5074919C477011 5023103 609599 5085587 694943 5084063C780287 5082539 841247 5071871 914399 5065775C1024127 5093207 1344167 5215127 1353311 5248655L1380743 5349239C1395983 5419343 1417319 5551931 1444751 5669279C1472183 5786627 1511807 5925311 1545335 6053327C1545335 6156959 1507235 6234683 1444751 6291071C1382267 6347459 1261871 6358127 1170431 6391655C1069847 6420611 964691 6422135 841247 6464807C717803 6507479 566927 6586727 429767 6647687C339851 6676643 353567 6672071 301751 6638543C249935 6605015 179831 6510527 118871 6446519C59435 6339839 -57913 6126479 -54865 5998463C-51817 5870447 -96013 5714999 -45721 5614415C4571 5513831 172211 5484875 246887 5394959C321563 5305043 327659 5126735 402335 5074919Z'],
  // The research community: an ellipse around its ECM label
  ['rg', 'M4235744 5610921a1100000 520000 0 1 0 2200000 0a1100000 520000 0 1 0 -2200000 0Z'],
];

// Slide text boxes that sat inside the circles: [html, x, y, w, h, pt, color]
const LABELS = [
  ['Nucleus',                          2864583, 3121223,  857927, 307777, 14, '#3C5E3E'],
  ['Cytoskeleton /<br>Fundamentals',   3916224, 3315944, 1239442, 461665, 12, '#3C5E3E'],
  // Research themes, centred where the slide's "Research Group" boxes sat (w = h = 0)
  ['Disease &amp;<br>Target Biology',                 549989, 1666008, 0, 0, 11, '#3C5E3E'],
  ['Molecular Design<br>&amp; Modalities',           2908879,  674212, 0, 0, 11, '#3C5E3E'],
  ['Formulation<br>&amp; Materials',                 5770000, 2540000, 0, 0, 10, '#3C5E3E'],
  ['Pharmacometrics<br>&amp; Clinical<br>Pharmacology', 5776210, 4910421, 0, 0, 10, '#3C5E3E'],
  ['Real-World<br>Evidence &amp;<br>Drug Safety',    2818150, 6138126, 0, 0, 11, '#3C5E3E'],
  ['Pharma Data<br>Science<br>Education',             687399, 5850762, 0, 0, 11, '#3C5E3E'],
];

// Clickable text that opens a popup: [id, html, centre x, centre y, pt, extra class]
// Service names sit beside their blood cells; the ECM label opens the research community.
const LINK_LABELS = [
  ['sv01', 'Curriculum<br>Upgrade',                   6266670, 1290000, 10, 'svc'],
  ['sv02', 'Research Project<br>Consulting',          7116018,  330000, 10, 'svc'],
  ['sv03', 'Research Group<br>Strategy Consulting',   7662027, 1830000, 10, 'svc'],
  ['sv04', 'People<br>Development',                   9598337, 2660000, 10, 'svc'],
  ['rg', 'ECM /<br>PharmaDataScience<br>Research Community', 5335744, 5610921, 12, 'rgl'],
];

// Slide text that is not clickable: [html, x, y, w, h, pt]
const STATIC_LABELS = [
  ['CPDSE',                                                   1479588, 1526319, 1186661, 338554, 16],
  ['People, Ideas, Work',                                     2270725, 5141254, 1967206, 276999, 12],
  ['Pharma Schools',                                          7989178,  273997, 1715534, 338554, 16],
];

const popup = document.getElementById('popup');
const title = document.getElementById('popup-title');
const body = document.getElementById('popup-body');

const groups = {};
const glowLayer = document.getElementById('glow');
const glowGroups = {};
// Caption words that stand for an area: id -> the words that mention it
const conceptLinks = {};
const setClass = (id, cls, on) => {
  (groups[id] || []).forEach(b => b.classList.toggle(cls, on));
  if (cls === 'selected') (glowGroups[id] || []).forEach(g => g.classList.toggle('on', on));
  (conceptLinks[id] || []).forEach(c => c.classList.toggle(cls, on));
};
let current = null;

// The popup starts below the header so the header controls stay reachable
const header = document.getElementById('title');
const syncHeader = () => document.documentElement.style.setProperty('--head-h', header.offsetHeight + 'px');
new ResizeObserver(syncHeader).observe(header);
syncHeader();
const cycleBtns = document.querySelectorAll('.cycle');
cycleBtns.forEach(b => b.disabled = true);
// Centre the enlarged caption and the start button as one group over the blurred picture
function layoutIntro() {
  if (!document.body.classList.contains('intro')) return;
  const row = document.getElementById('caption-row'), cyc = document.getElementById('cycle-row');
  const fig = document.getElementById('figure'), btn = document.getElementById('start');
  const S = 1.5, GAP = 40;
  const capH = row.offsetHeight * S, groupH = capH + GAP + btn.offsetHeight;
  const head = document.getElementById('title'), figH = fig.offsetHeight;
  // Lift the picture to just under the header; it slides back down when the intro ends
  const up = Math.max(0, fig.offsetTop - (head.offsetTop + head.offsetHeight + 12));
  const groupTop = fig.offsetTop - up + (figH - groupH) / 2;
  document.body.style.setProperty('--fig-up', up + 'px');
  document.body.style.setProperty('--intro-y', (groupTop - row.offsetTop) + 'px');
  document.body.style.setProperty('--start-y', ((figH - groupH) / 2 + capH + GAP) + 'px');
}
window.addEventListener('resize', layoutIntro);
window.addEventListener('load', layoutIntro);
new ResizeObserver(layoutIntro).observe(document.getElementById('caption-row'));
layoutIntro();
function start() {
  document.body.classList.remove('intro');
  cycleBtns.forEach(b => b.disabled = false);
}
document.getElementById('start').addEventListener('click', start);
// Pressing any button or link on the page ends the intro blur
document.addEventListener('click', e => { if (e.target.closest('button, a, .hs, .dn, .link') && !e.target.closest('#restart')) start(); }, true);
document.getElementById('restart').addEventListener('click', () => {
  close();
  cycleBtns.forEach(b => b.disabled = true);
  document.body.classList.add('intro');
  layoutIntro();
  requestAnimationFrame(layoutIntro);
  setTimeout(layoutIntro, 900);
});

function open(id) {
  start();
  if (current) setClass(current, 'selected', false);
  current = id;
  setClass(id, 'selected', true);
  title.textContent = CONTENT[id].title;
  body.innerHTML = CONTENT[id].body;
  popup.scrollTop = 0;
  // Open on the side that covers less of the element, so it stays visible.
  // Popups without an element in the picture (the help overview) open on the right.
  // Elements of the hidden view (tissue or diagram) have empty boxes and are left out.
  let boxes = (groups[id] || []).map(b => b.getBoundingClientRect()).filter(r => r.width || r.height);
  if (!boxes.length) boxes = [{ left: 0, right: 0 }];
  const l = Math.min(...boxes.map(r => r.left)), r = Math.max(...boxes.map(r => r.right));
  const w = popup.offsetWidth, vw = window.innerWidth;
  const coverLeft = Math.max(0, Math.min(r, w) - l);
  const coverRight = Math.max(0, r - Math.max(l, vw - w));
  popup.classList.toggle('left', coverLeft < coverRight);
  document.body.classList.toggle('pop-left', coverLeft < coverRight);
  document.body.classList.toggle('pop-right', !(coverLeft < coverRight));
  popup.classList.add('open');
  popup.setAttribute('aria-hidden', 'false');
}
function close() {
  if (current) setClass(current, 'selected', false);
  current = null;
  popup.classList.remove('open');
  document.body.classList.remove('pop-left', 'pop-right');
  popup.setAttribute('aria-hidden', 'true');
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const areaLayer = document.getElementById('areas');
areaLayer.setAttribute('viewBox', `${PIC.x} 0 ${PIC.w} ${PIC.h}`);
glowLayer.setAttribute('viewBox', `${PIC.x} 0 ${PIC.w} ${PIC.h}`);
const pct = (v, total) => (v / total * 100) + '%';

// A clickable element of the picture or the diagram that opens popup `id`.
// Elements sharing an id (connected areas, or the same thing in both views) highlight together.
function makeClickable(b, id) {
  b.setAttribute('role', 'button');
  b.setAttribute('tabindex', '0');
  b.setAttribute('aria-label', CONTENT[id].title);
  b.addEventListener('click', () => (current === id ? close() : open(id)));
  b.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.dispatchEvent(new Event('click')); }
  });
  (groups[id] ||= []).push(b);
  b.addEventListener('mouseenter', () => setClass(id, 'hover', true));
  b.addEventListener('mouseleave', () => setClass(id, 'hover', false));
  b.addEventListener('focus', () => setClass(id, 'hover', true));
  b.addEventListener('blur', () => setClass(id, 'hover', false));
}

for (const n of document.querySelectorAll('#diagram [data-id]')) makeClickable(n, n.dataset.id);

for (const [id, d] of AREAS) {
  const b = document.createElementNS(SVG_NS, 'path');
  b.setAttribute('d', d);
  b.setAttribute('class', 'hs');
  makeClickable(b, id);
  areaLayer.appendChild(b);
  // Separate layer so the glow only affects selected shapes, never hover
  const g = document.createElementNS(SVG_NS, 'path');
  g.setAttribute('d', d);
  g.setAttribute('class', 'gl');
  glowLayer.appendChild(g);
  (glowGroups[id] ||= []).push(g);
}

for (const [html, x, y, w, h, pt, color] of LABELS) {
  const l = document.createElement('div');
  l.className = 'label';
  l.innerHTML = html;
  l.style.left = pct(x + w / 2 - PIC.x, PIC.w);
  l.style.top = pct(y + h / 2, PIC.h);
  l.style.fontSize = `${pt / 796.1 * 100}cqw`;
  l.style.color = color;
  document.getElementById('hotspots').appendChild(l);
}

for (const [id, html, x, y, pt, cls] of LINK_LABELS) {
  const l = document.createElement('div');
  l.className = `label link ${cls}`;
  l.innerHTML = html;
  l.style.left = pct(x - PIC.x, PIC.w);
  l.style.top = pct(y, PIC.h);
  l.style.fontSize = `${pt / 796.1 * 100}cqw`;
  // The cells are small, so the name opens the service too; it is not focusable
  // because the cell itself already is (the ECM is reachable from the caption).
  // Joining the group makes it highlight together with its area.
  (groups[id] ||= []).push(l);
  l.addEventListener('click', () => (current === id ? close() : open(id)));
  l.addEventListener('mouseenter', () => setClass(id, 'hover', true));
  l.addEventListener('mouseleave', () => setClass(id, 'hover', false));
  document.getElementById('hotspots').appendChild(l);
}

for (const [html, x, y, w, h, pt] of STATIC_LABELS) {
  const l = document.createElement('div');
  l.className = 'label static';
  l.innerHTML = html;
  l.style.left = pct(x + w / 2 - PIC.x, PIC.w);
  l.style.top = pct(y + h / 2, PIC.h);
  l.style.fontSize = `${pt / 796.1 * 100}cqw`;
  document.getElementById('hotspots').appendChild(l);
}

// Caption words open the same popups as the picture, and highlight their areas
for (const c of document.querySelectorAll('.concept')) {
  const ids = c.dataset.ids.split(' ');
  ids.forEach(id => (conceptLinks[id] ||= []).push(c));
  const hover = on => ids.forEach(id => setClass(id, 'hover', on));
  c.addEventListener('mouseenter', () => hover(true));
  c.addEventListener('mouseleave', () => hover(false));
  c.addEventListener('focus', () => hover(true));
  c.addEventListener('blur', () => hover(false));
  c.addEventListener('click', () => (ids.includes(current) ? close() : open(ids[0])));
}

// Tissue picture or abstract diagram: chosen with the header switch or ?view=diagram,
// and remembered in this browser
const viewButtons = document.querySelectorAll('#view-switch button');
function setView(view) {
  document.body.classList.toggle('view-diagram', view === 'diagram');
  viewButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
  try { localStorage.setItem('pds-view', view); } catch {}
  layoutIntro();
}
viewButtons.forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
let savedView = null;
try { savedView = localStorage.getItem('pds-view'); } catch {}
setView(new URLSearchParams(location.search).get('view') || savedView || 'tissue');

// The help overview: opened from the header; its names jump to their popups.
// "area#item" opens the area's popup with that entry expanded and in view.
document.getElementById('help-all').addEventListener('click', () => (current === 'help' ? close() : open('help')));

// Feedback form, delivered by Formspree. Paste your form's endpoint (https://formspree.io/f/xxxxxxxx) here.
const FEEDBACK_URL = '';
const fbDialog = document.getElementById('fb-dialog'), fbForm = document.getElementById('fb-form');
const fbStatus = document.getElementById('fb-status'), fbSend = document.getElementById('fb-send');
document.getElementById('feedback').addEventListener('click', () => {
  fbStatus.textContent = ''; fbSend.disabled = false; fbForm.reset(); fbDialog.showModal();
});
document.getElementById('fb-cancel').addEventListener('click', () => fbDialog.close());
fbDialog.addEventListener('click', e => { if (e.target === fbDialog) fbDialog.close(); });
fbForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!FEEDBACK_URL) { fbStatus.textContent = 'Feedback is not set up yet.'; return; }
  fbSend.disabled = true; fbStatus.textContent = 'Sending…';
  try {
    const r = await fetch(FEEDBACK_URL, { method: 'POST', body: new FormData(fbForm), headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error(r.status);
    fbStatus.textContent = 'Thank you for your feedback!';
    fbForm.reset();
  } catch {
    fbStatus.textContent = 'Something went wrong. Please try again later.';
    fbSend.disabled = false;
  }
});
// Filter chips in the help overview: any value within a row, all rows together
function filterHelp() {
  const active = {};
  for (const c of body.querySelectorAll('.chip[aria-pressed="true"]')) {
    (active[c.dataset.dim] ||= []).push(c.dataset.val);
  }
  const asks = [...body.querySelectorAll('.overview li[data-time]')];
  let shown = 0;
  for (const a of asks) {
    a.hidden = !Object.entries(active).every(([dim, vals]) =>
      a.dataset[dim].split(' ').some(v => vals.includes(v)));
    if (!a.hidden) shown++;
  }
  // Hide areas, and circle headings, left without a matching ask
  for (const list of body.querySelectorAll('ul.overview')) {
    for (const area of list.children) {
      area.hidden = !area.querySelector('li[data-time]:not([hidden])');
    }
    list.previousElementSibling.hidden = ![...list.children].some(area => !area.hidden);
  }
  body.querySelector('.fcount').textContent = Object.keys(active).length
    ? `${shown} of ${asks.length} asks match` + (shown ? '' : ', try fewer filters') : '';
}

body.addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (chip) {
    chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    filterHelp();
    return;
  }
  const link = e.target.closest('.goto');
  if (!link) return;
  const [area, item] = link.dataset.open.split('#');
  open(area);
  if (item) {
    const entry = document.getElementById(item);
    entry.open = true;
    popup.scrollTop = entry.offsetTop - document.getElementById('popup-head').offsetHeight - 8;
  }
});

document.getElementById('close').addEventListener('click', close);
// Picture order first, then anything only in the diagram (the mission)
const ORDER = [...new Set([...AREAS, ...LINK_LABELS].map(a => a[0])
  .concat([...document.querySelectorAll('#diagram [data-id]')].map(n => n.dataset.id)))];
function step(dir) {
  const i = ORDER.indexOf(current);
  if (i < 0) return open(ORDER[dir > 0 ? 0 : ORDER.length - 1]);
  open(ORDER[(i + dir + ORDER.length) % ORDER.length]);
}
document.getElementById('prev').addEventListener('click', () => step(-1));
document.getElementById('next').addEventListener('click', () => step(1));
document.getElementById('cap-prev').addEventListener('click', () => step(-1));
document.getElementById('cap-next').addEventListener('click', () => step(1));
document.addEventListener('keydown', e => {
  if (!current) return;
  if (e.key === 'ArrowLeft') step(-1);
  else if (e.key === 'ArrowRight') step(1);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
// Any click outside the popup closes it; clicks on clickable areas are handled by their own toggle.
// A link in the popup that opened another popup has been replaced by then (not connected).
document.addEventListener('click', e => {
  if (current && e.target.isConnected && !popup.contains(e.target)
      && !e.target.closest('.hs, .dn, .link, .concept, .cycle, #help-all, #feedback, #view-switch')) close();
});
