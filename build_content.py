"""Build content.js (the popup text) from gateway-content.md.

Run after editing the markdown:  python3 build_content.py

Each "## Circle (`ID`)" becomes a popup; its "### Item (`ID`)" sections become
expandable entries inside it. Items whose id starts with a prefix in
SPLIT_PREFIXES get a popup of their own instead: each service (one per red
blood cell) and each research theme (one per research-group shape). A
"**Wanna help?**" paragraph becomes a box at the end of the popup or entry, holding
the Basecamp link. Editorial notes in the markdown (italic lines, "> " blockquotes,
"(inferred)" markers, the "Open points" section) are left out.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).parent
SOURCE = ROOT / 'gateway-content.md'
RESEARCH_GROUPS = ROOT / 'research-groups.html'
TARGET = ROOT / 'content.js'

# Spreadsheet circle id -> clickable area id in script.js.
# None: the circle's items each get their own popup, keyed by lowercased id (e.g. sv01).
AREA_IDS = {
    'CIR_SERVICES': None,
    'CIR_FUNDAMENTAL': 'cyto',
    'CIR_NUCLEUS': 'nucleus',
    'CIR_RESEARCH': 'rg',
    'CIR_MISSION': 'mission',  # no area in the figure yet
}
# Items with these id prefixes get their own popup, keyed by lowercased id (e.g. th01)
SPLIT_PREFIXES = ('SV', 'TH')
# Heading shown above a circle's expandable entries, by child id prefix
CHILD_HEADINGS = {'SV': 'Our services', 'FU': 'Areas'}

HEADING = re.compile(r'^(#{2,3}) (.+?) \(`(\w+)`\)\s*$')
LINK = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')


def inline(text):
    """Markdown inline syntax -> HTML, with the text escaped first."""
    text = re.sub(r'\s*\*\(inferred\)\*', '', text)
    text = html.escape(text, quote=False)
    text = LINK.sub(r'<a href="\2" target="_blank" rel="noopener">\1</a>', text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'\*(.+?)\*', r'<em>\1</em>', text)
    return re.sub(r'`(.+?)`', r'\1', text)


def split_sections(lines):
    """Yield (level, title, id, body_lines) for every ID'd heading."""
    current = None
    for line in lines:
        m = HEADING.match(line)
        if m or line.startswith('## '):
            if current:
                yield current
            current = (len(m.group(1)), m.group(2), m.group(3), []) if m else None
        elif current:
            current[3].append(line)
    if current:
        yield current


def parse_block(lines):
    """Return impact, responsibilities, meta text, Basecamp link, group names and help of a section.

    help is (intro text, [asks]) from a "**Wanna help?**" paragraph, or None.
    """
    impact, resp, meta, basecamp, members, help_ = '', [], [], None, [], None
    paragraphs, para = [], []
    for line in lines + ['']:
        if line.strip() in ('', '---'):
            if para:
                paragraphs.append(para)
            para = []
        else:
            para.append(line)
    for para in paragraphs:
        first = para[0]
        if first.startswith(('**Impact:**', '**About:**')):
            impact = ' '.join(l.strip() for l in para).split(':**', 1)[1].strip()
        elif first.startswith('**Wanna help?**'):
            intro, asks = [first[len('**Wanna help?**'):].strip()], []
            for line in para[1:]:
                if line.startswith('- '):
                    asks.append(line[2:].strip())
                elif asks:
                    asks[-1] += ' ' + line.strip()
                else:
                    intro.append(line.strip())
            help_ = (' '.join(intro), asks)
        elif first.startswith('**Groups**'):
            members = [l[2:].strip() for l in para[1:] if l.startswith('- ')]
        elif first.startswith('**Responsibilities**'):
            for line in para[1:]:
                if line.startswith('- '):
                    resp.append(line[2:].strip())
                elif resp:
                    resp[-1] += ' ' + line.strip()
        elif first.startswith(('*', '>')):
            continue  # editorial note
        else:
            text = ' '.join(l.strip() for l in para)
            text, _, bc = text.partition('Basecamp:')
            if text.strip():
                meta.append(text.strip())
            link = LINK.search(bc)
            if link:
                label = 'Basecamp project' if bc.strip().startswith('[') else 'Related Basecamp project'
                basecamp = (label, link.group(2))
    return impact, resp, ' '.join(meta), basecamp, members, help_


def research_group_items():
    """Researcher name -> its <li> in research-groups.html."""
    if not RESEARCH_GROUPS.exists():
        return {}
    items = re.findall(r'<li>.*?</li>', RESEARCH_GROUPS.read_text(encoding='utf-8'), re.S)
    return {re.sub(r'<[^>]+>', '', re.search(r'<strong>(.*?)</strong>', li).group(1)): li
            for li in items}


def render_details(resp, meta):
    parts = []
    if resp:
        parts.append('<ul class="resp">' + ''.join(f'<li>{inline(r)}</li>' for r in resp) + '</ul>')
    if meta:
        parts.append(f'<p class="meta">{inline(meta)}</p>')
    return ''.join(parts)


def render_basecamp(basecamp):
    if not basecamp:
        return ''
    label, url = basecamp
    link = f'<a href="{html.escape(url)}" target="_blank" rel="noopener">{label} ↗</a>'
    # Only a project or to-do list of its own holds tasks to pick up
    note = ' Go here for concrete tasks you can pick up.' if label == 'Basecamp project' else ''
    return f'<p class="bc">{link}{note}</p>'


def render_help(help_, basecamp):
    """The "Wanna help?" box ending with the Basecamp link, or just the link without help text."""
    if not help_:
        return render_basecamp(basecamp)
    intro, asks = help_
    box = f'<div class="help"><h3>Wanna help?</h3><p>{inline(intro)}</p>'
    if asks:
        box += '<ul>' + ''.join(f'<li>{inline(a)}</li>' for a in asks) + '</ul>'
    return box + render_basecamp(basecamp) + '</div>'


def build():
    lines = SOURCE.read_text(encoding='utf-8').splitlines()
    content, circle = {}, None
    researchers = research_group_items()
    for level, title, sid, body in split_sections(lines):
        impact, resp, meta, basecamp, members, help_ = parse_block(body)
        popup = {'title': title, 'lead': f'<p class="lead">{inline(impact)}</p>',
                 'details': render_details(resp, meta), 'help': render_help(help_, basecamp),
                 'children': [], 'prefix': None, 'has_resp': bool(resp)}
        if members:
            missing = [m for m in members if m not in researchers]
            if missing:
                raise SystemExit(f'{sid}: not in {RESEARCH_GROUPS.name}: {", ".join(missing)}')
            popup['details'] += ('<h3>Research groups</h3><ul class="items">'
                                 + ''.join(researchers[m] for m in members) + '</ul>')
        if level == 2:
            circle = None
            if AREA_IDS.get(sid):
                circle = content[AREA_IDS[sid]] = popup
        elif sid.startswith(SPLIT_PREFIXES):
            content[sid.lower()] = popup
        elif circle is not None:
            circle['prefix'] = circle['prefix'] or sid[:2]
            circle['children'].append(
                '<li><details><summary>'
                f'<strong>{inline(title)}</strong><span>{inline(impact)}</span>'
                '</summary>'
                f'<div class="more">{popup["details"]}{popup["help"]}</div>'
                '</details></li>')

    out = {}
    for area, c in content.items():
        body = c['lead']
        if c['children']:
            # Lead with the services/areas; the circle's own responsibilities fold away below
            heading = CHILD_HEADINGS.get(c['prefix'], 'Areas')
            body += f'<h3>{heading}</h3><ul class="items expand">' + ''.join(c['children']) + '</ul>'
            body += c['help']
            body += f'<details class="circle"><summary>The circle\'s responsibilities</summary>{c["details"]}</details>'
        else:
            body += ('<h3>Responsibilities</h3>' if c['has_resp'] else '') + c['details'] + c['help']
        if area == 'rg' and RESEARCH_GROUPS.exists():
            body += RESEARCH_GROUPS.read_text(encoding='utf-8').replace('\n', '')
        out[area] = {'title': c['title'], 'body': body}

    TARGET.write_text(
        '// Popup content. Generated from gateway-content.md by build_content.py: edit those, not this file.\n'
        f'const CONTENT = {json.dumps(out, ensure_ascii=False, indent=2)};\n',
        encoding='utf-8')
    print(f'Wrote {TARGET.name}: ' + ', '.join(f'{k} ({v["title"]})' for k, v in out.items()))


if __name__ == '__main__':
    build()
