// The abstract diagram view: the same elements as the tissue picture, drawn as vector
// shapes in a 1474 x 1000 frame (the picture's aspect ratio). Every node carries the
// popup id it opens in data-id; script.js makes them clickable like the picture's areas.
(function () {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('diagram');
  const el = (tag, attrs, parent = svg) => {
    const e = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    parent.appendChild(e);
    return e;
  };
  // Centred lines of text; lines[0] sits at y, the rest below it
  const text = (lines, x, y, cls, parent, gap = 28) => {
    const t = el('text', { x, y: y - (lines.length - 1) * gap / 2, class: cls }, parent);
    lines.forEach((line, i) => {
      const s = el('tspan', { x, dy: i ? gap : 0 }, t);
      s.textContent = line;
    });
    return t;
  };
  const node = (id, cls) => el('g', { class: `dn ${cls}`, 'data-id': id });
  const arrow = (d) => el('path', { d, class: 'flow', 'marker-end': 'url(#head)' });

  el('defs', {}).innerHTML =
    '<marker id="head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
    '<path d="M0 0L10 5L0 10z" class="flow-head"/></marker>';

  // Column headings
  text(['THE SCIENCE'], 230, 62, 'd-col');
  text(['THE CENTER'], 730, 62, 'd-col');
  text(['SERVICES'], 1120, 62, 'd-col');
  text(['WHO WE SERVE'], 1365, 62, 'd-col');

  // Research community holding the six research themes, in value-chain order
  const rg = node('rg', 'community');
  el('rect', { x: 40, y: 100, width: 380, height: 840, rx: 28, class: 'shape' }, rg);
  text(['PharmaDataScience', 'Research Community'], 230, 895, 'd-label small', rg);
  const themes = [
    ['th01', ['Disease &', 'target biology']],
    ['th02', ['Molecular design', '& modalities']],
    ['th03', ['Formulation', '& materials']],
    ['th04', ['Pharmacometrics &', 'clinical pharmacology']],
    ['th05', ['Real-world evidence', '& drug safety']],
    ['th06', ['Pharma data-science', 'education']],
  ];
  themes.forEach(([id, lines], i) => {
    const g = node(id, 'theme');
    el('rect', { x: 70, y: 125 + i * 118, width: 320, height: 98, rx: 18, class: 'shape' }, g);
    text(lines, 230, 174 + i * 118, 'd-label', g);
  });

  // The center: fundamentals around the coordinating nucleus
  arrow('M420 510 H482');
  text(['science', '& people'], 451, 455, 'd-note', svg, 22);
  // Mission sets the direction of the center from above
  const mission = node('mission', 'mission');
  el('rect', { x: 600, y: 92, width: 260, height: 84, rx: 42, class: 'shape' }, mission);
  text(['Mission'], 730, 122, 'd-label strong', mission);
  text(['direction & partners'], 730, 152, 'd-note', mission);
  arrow('M730 176 V212');
  text(['CPDSE'], 730, 240, 'd-title');
  const cyto = node('cyto', 'fundamental');
  el('circle', { cx: 730, cy: 510, r: 240, class: 'shape' }, cyto);
  text(['Fundamentals'], 730, 335, 'd-label strong', cyto);
  text(['people · tools · spaces', 'ways of working'], 730, 690, 'd-note', cyto, 24);
  const nucleus = node('nucleus', 'nucleus');
  el('circle', { cx: 730, cy: 510, r: 118, class: 'shape' }, nucleus);
  text(['Nucleus'], 730, 498, 'd-label strong light', nucleus);
  text(['coordinates'], 730, 534, 'd-note light', nucleus);

  // Services and who they reach: Curriculum Upgrade the pharma schools,
  // the other three the university departments
  const recipients = {
    rc01: { y: 225, h: 150, title: ['Pharma', 'Schools'], note: ['SDU + UCPH'] },
    rc02: { y: 400, h: 400, title: ['University', 'departments'],
            note: ['Pharmacy', 'Drug Design &', 'Pharmacology', '(UCPH)', '\u00a0', 'Physics, Chemistry', '& Pharmacy', '(SDU)'] },
  };
  const services = [
    ['sv01', ['Curriculum', 'Upgrade'], 'rc01'],
    ['sv02', ['Research Project', 'Consulting'], 'rc02'],
    ['sv03', ['Research Group', 'Strategy Consulting'], 'rc02'],
    ['sv04', ['People', 'Development'], 'rc02'],
  ];
  services.forEach(([id, lines, to], i) => {
    const cy = 300 + i * 140;
    arrow(`M968 510 C985 510 985 ${cy} 997 ${cy}`);
    const g = node(id, 'service');
    el('rect', { x: 1000, y: cy - 52, width: 240, height: 104, rx: 52, class: 'shape' }, g);
    text(lines, 1120, cy, 'd-label', g);
    arrow(`M1240 ${cy} H1272`);
  });
  for (const [id, r] of Object.entries(recipients)) {
    const g = node(id, 'recipient');
    el('rect', { x: 1276, y: r.y, width: 178, height: r.h, rx: 22, class: 'shape' }, g);
    const top = r.y + (r.title.length > 1 ? 50 : 42);
    text(r.title, 1365, top, 'd-label strong', g);
    text(r.note, 1365, top + 26 * r.title.length + 12 * r.note.length + 4, 'd-note', g, 24);
  }
})();
