// Clickable areas as SVG paths in slide EMU coordinates, taken from the pptx.
// The picture sits at x = -52681 and is 10111081 x 6858000 EMU.
const PIC = { x: -52681, w: 10111081, h: 6858000 };
const AREAS = [
  ['er', 'M2616941 2672774C2583869 2506435 2715700 1947040 2746639 1707563L4177585 1735024C4129424 1922630 4108545 2192526 4032951 2297840C4032494 2537317 3986315 2630519 3958272 2751089C3770812 2723720 3510196 2623029 3286158 2559045C3063035 2596955 2785198 2708002 2616941 2672774Z'],
  ['cyto', 'M3913632 3600772a577444 725504 0 1 0 1154888 0a577444 725504 0 1 0 -1154888 0Z'],
  ['nucleus', 'M2817110 3259330C2822453 3115706 2782384 3026900 2650602 2901548C2828431 2746107 2932865 2636348 3339278 2636470C3667842 2734291 3795172 2695187 3968168 3204512C3843891 3677291 3874928 3701899 3622685 3854660C3243748 4031419 2938080 3906555 2677951 3726750C2632921 3589216 2816347 3424273 2817110 3259330Z'],
  ['rg', 'M2048156 1048858C2201178 812094 1942565 392378 2415559 292777C3203443 317044 3341783 -24173 3672672 91571C3920180 352812 3783721 540830 4067555 994098C3652533 1215668 3996032 1144555 3151306 1064367L2497622 1283827C2347800 1205539 2079024 1072281 2048156 1048858Z'],
  ['rg', 'M-60795 1953267C58530 1623166 -4932 1338820 297314 962964C490768 1877132 922073 1109305 1289248 1456819C1219653 1582598 1406040 1525729 1080462 1834342C887942 2005876 713687 2003838 694888 2468054C117460 3117141 271316 2742397 59597 2879476C74396 2360428 -20664 2262065 -60795 1953267Z'],
  ['rg', 'M-118815 5888668C-104137 5455913 358448 5599052 382241 5047445C560230 5068696 737909 5062776 952515 5093134C1104238 5172369 1201266 5132903 1407838 5330990C1362723 5876677 1738322 6074612 1492043 6263591L299891 6711677C178605 6675095 57319 6281806 -118815 5888668Z'],
  ['rg', 'M1840607 5982817C1781887 5796764 1860641 5766249 1884128 5580330C2122980 5647411 2370466 5504242 2645758 5461493C2949891 5699167 3217066 5754150 3319998 5982683C3762642 6320912 3821361 6494731 3240036 6778247C2934521 6756872 2848168 6680784 2478579 6778381C2110545 6629028 2190335 6241866 1840607 5982817Z'],
  ['rg', 'M5330824 2437123C5335733 2149113 5267470 2181347 5199089 1929769C5338655 1884042 5469104 1719422 5617788 1792586C5738419 2117178 5520887 2487498 6309075 2656616C6423042 2859168 6335842 2970414 6340167 3127238C5947651 3136233 5865945 3145679 5555720 3282712C5426089 3226489 5735029 2795299 5330824 2437123Z'],
  ['rg', 'M5301965 4207445C5424145 3846249 5400098 3759480 5440014 3526396C5611553 3489987 5691578 3352518 5963782 3672882C5528217 4871991 6180786 4361417 6275512 4966415C6235597 5043997 6140870 5130935 6110106 5181125C5770922 4961651 5559760 5336458 5385106 5199330C5055657 4832179 5549148 4903806 5301965 4207445Z'],
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
const glowLayer = document.getElementById('glow');
const glowGroups = {};
const setClass = (id, cls, on) => {
  groups[id].forEach(b => b.classList.toggle(cls, on));
  if (cls === 'selected') glowGroups[id].forEach(g => g.classList.toggle('on', on));
};
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

const SVG_NS = 'http://www.w3.org/2000/svg';
const areaLayer = document.getElementById('areas');
areaLayer.setAttribute('viewBox', `${PIC.x} 0 ${PIC.w} ${PIC.h}`);
glowLayer.setAttribute('viewBox', `${PIC.x} 0 ${PIC.w} ${PIC.h}`);
const pct = (v, total) => (v / total * 100) + '%';

for (const [id, d] of AREAS) {
  const b = document.createElementNS(SVG_NS, 'path');
  b.setAttribute('d', d);
  b.setAttribute('class', 'hs');
  b.setAttribute('role', 'button');
  b.setAttribute('tabindex', '0');
  b.setAttribute('aria-label', CONTENT[id].title);
  b.addEventListener('click', () => (current === id ? close() : open(id)));
  b.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.dispatchEvent(new Event('click')); }
  });
  // Connected areas share an id and highlight together
  (groups[id] ||= []).push(b);
  b.addEventListener('mouseenter', () => setClass(id, 'hover', true));
  b.addEventListener('mouseleave', () => setClass(id, 'hover', false));
  b.addEventListener('focus', () => setClass(id, 'hover', true));
  b.addEventListener('blur', () => setClass(id, 'hover', false));
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
