// Popup content. Edit the text here.
const CONTENT = {
  er:      { title: 'ER / Work streams', body: '<p>Placeholder text about the ER / work streams.</p>' },
  cyto:    { title: 'Cytoskeleton / Fundamentals', body: '<p>Placeholder text about the cytoskeleton / fundamentals.</p>' },
  nucleus: { title: 'Nucleus', body: '<p>Placeholder text about the nucleus.</p>' },
  rg:      { title: 'Research Groups', body: '<p>Placeholder text about the research groups.</p>' },
};

// Hotspots in slide EMU (x, y, width, height), taken from the pptx.
// The picture sits at x = -52681 and is 10111081 x 6858000 EMU.
const PIC = { x: -52681, w: 10111081, h: 6858000 };
const HOTSPOTS = [
  ['er',      2281311, 1524720, 2153949, 1107462],
  ['cyto',    3913632, 2875268, 1154888, 1451009],
  ['nucleus', 2569464, 2617300, 1353037, 1337934],
  ['rg',      2020813,  114106, 1982557, 1167528],
  ['rg',       -58027, 1028154, 1138452, 1847113],
  ['rg',           -1, 5074919, 1545039, 1517905],
  ['rg',      1813246, 5379173, 1909264, 1517905],
  ['rg',      5074849, 1573164, 1353038, 1746108],
  ['rg',      5128273, 3453223, 1284415, 1746108],
];

// Slide text boxes that sat inside the circles: [html, x, y, w, h, pt, color]
const LABELS = [
  ['Nucleus',                          2864583, 3121223,  857927, 307777, 14, '#3C5E3E'],
  ['ER / Work streams',                2683896, 1695597, 1519968, 276999, 12, '#3C5E3E'],
  ['Research<br>Group',                 113812, 1435176,  872355, 461665, 12, '#3C5E3E'],
  ['Research<br>Group',                2472702,  443380,  872355, 461665, 12, '#3C5E3E'],
  ['Research<br>Group',                 251222, 5619930,  872355, 461665, 12, '#3C5E3E'],
  ['Research<br>Group',                2381973, 5907294,  872355, 461665, 12, '#3C5E3E'],
  ['Cytoskeleton /<br>Fundamentals',   3916224, 3315944, 1239442, 461665, 12, '#3C5E3E'],
  ['Research<br>Group',                5340033, 4679589,  872355, 461665, 12, '#3C5E3E'],
];

// Slide text that is not clickable: [html, x, y, w, h, pt]
const STATIC_LABELS = [
  ['CPDSE',                                                   1479588, 1526319, 1186661, 338554, 16],
  ['People, Ideas, Work',                                     2270725, 5141254, 1967206, 276999, 12],
  ['Pharma Schools',                                          7989178,  273997, 1715534, 338554, 16],
  ['AI',                                                       600388,  689601,  394659, 338554, 16],
  ['Changing<br>world',                                        -52681,   27881, 1138452, 584775, 16],
  ['ECM /<br>PharmaDataScience<br>Research Community',        4477175, 5287756, 1717137, 646331, 12],
];

const popup = document.getElementById('popup');
const title = document.getElementById('popup-title');
const body = document.getElementById('popup-body');

const groups = {};
const setClass = (id, cls, on) => groups[id].forEach(b => b.classList.toggle(cls, on));
let current = null;

function open(id) {
  if (current) setClass(current, 'selected', false);
  current = id;
  setClass(id, 'selected', true);
  title.textContent = CONTENT[id].title;
  body.innerHTML = CONTENT[id].body;
  popup.classList.add('open');
  popup.setAttribute('aria-hidden', 'false');
}
function close() {
  if (current) setClass(current, 'selected', false);
  current = null;
  popup.classList.remove('open');
  popup.setAttribute('aria-hidden', 'true');
}

const pct = (v, total) => (v / total * 100) + '%';
for (const [id, x, y, w, h] of HOTSPOTS) {
  const b = document.createElement('button');
  b.className = 'hs';
  b.setAttribute('aria-label', CONTENT[id].title);
  b.style.left = pct(x - PIC.x, PIC.w);
  b.style.top = pct(y, PIC.h);
  b.style.width = pct(w, PIC.w);
  b.style.height = pct(h, PIC.h);
  b.addEventListener('click', () => (current === id ? close() : open(id)));
  // Connected hotspots share an id and highlight together
  (groups[id] ||= []).push(b);
  b.addEventListener('mouseenter', () => setClass(id, 'hover', true));
  b.addEventListener('mouseleave', () => setClass(id, 'hover', false));
  b.addEventListener('focus', () => setClass(id, 'hover', true));
  b.addEventListener('blur', () => setClass(id, 'hover', false));
  document.getElementById('hotspots').appendChild(b);
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

for (const [html, x, y, w, h, pt] of STATIC_LABELS) {
  const l = document.createElement('div');
  l.className = 'label static';
  l.innerHTML = html;
  l.style.left = pct(x + w / 2 - PIC.x, PIC.w);
  l.style.top = pct(y + h / 2, PIC.h);
  l.style.fontSize = `${pt / 796.1 * 100}cqw`;
  document.getElementById('hotspots').appendChild(l);
}

document.getElementById('close').addEventListener('click', close);
document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
