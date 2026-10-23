"""Build content.js (the popup text) from gateway-content.md.

Run after editing the markdown:  python3 build_content.py

Each "## Circle (`ID`)" becomes a popup; its "### Item (`ID`)" sections become
expandable entries inside it. Items whose id starts with a prefix in
SPLIT_PREFIXES get a popup of their own instead: each service (one per red
blood cell), each research theme (one per research-group shape) and each
recipient of the services (in the diagram). A
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
PEOPLE = ROOT / 'people.json'
PROFILE_URL = 'https://3.basecamp.com/6021648/people/{}'
TARGET = ROOT / 'content.js'

# Spreadsheet circle id -> clickable area id in script.js.
# None: the circle's items each get their own popup, keyed by lowercased id (e.g. sv01).
AREA_IDS = {
    'CIR_SERVICES': None,
    'CIR_FUNDAMENTAL': 'cyto',
    'CIR_NUCLEUS': 'nucleus',
    'CIR_RESEARCH': 'rg',
    'CIR_MISSION': 'mission',  # only in the diagram
    'CIR_RECIPIENTS': None,  # who the services reach; only in the diagram
}
# Items with these id prefixes get their own popup, keyed by lowercased id (e.g. th01)
SPLIT_PREFIXES = ('SV', 'TH', 'RC')
# Left out of the "all the ways to help" popup: the themes share one generic invitation,
# and the Fundamental circle's own just points at its areas
OVERVIEW_SKIP = ('TH', 'CIR_FUNDAMENTAL')
# Heading shown above a circle's expandable entries, by child id prefix
CHILD_HEADINGS = {'SV': 'Our services', 'FU': 'Areas'}

# Tags on help asks, e.g. "{skill: coding, writing; interest: education; time: hours}"
CATEGORIES = {
    'skill': {
        'coding': 'Coding & data', 'teaching': 'Teaching & training',
        'writing': 'Writing & research', 'design': 'Design & media',
        'organising': 'Organising & people', 'curious': 'No special skills',
    },
    'interest': {
        'education': 'Education', 'research': 'Research', 'community': 'Community',
        'tech': 'Tech & AI', 'outreach': 'Outreach',
    },
    'time': {'hours': 'An hour or two', 'days': 'A few days', 'ongoing': 'Ongoing'},
}
TAG = re.compile(r'\s*\{([^}]*)\}\s*$')

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
    """Return impact, responsibilities, meta text, Basecamp link, group names, help and lists of a section.

    help is (intro text, [asks]) from a "**Wanna help?**" paragraph, or None.
    lists are (heading, [items]) from any other "**Heading**" paragraph followed by bullets.
    """
    impact, resp, meta, basecamp, members, help_, lists = '', [], [], None, [], None, []
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
        elif re.fullmatch(r'\*\*[^*]+\*\*', first.strip()) and first.strip() not in (
                '**Groups**', '**Responsibilities**'):
            items = []
            for line in para[1:]:
                if line.startswith('- '):
                    items.append(line[2:].strip())
                elif items:
                    items[-1] += ' ' + line.strip()
            lists.append((first.strip()[2:-2], items))
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
    return impact, resp, ' '.join(meta), basecamp, members, help_, lists


def research_group_items():
    """Researcher name -> its <li> in research-groups.html."""
    if not RESEARCH_GROUPS.exists():
        return {}
    items = re.findall(r'<li>.*?</li>', RESEARCH_GROUPS.read_text(encoding='utf-8'), re.S)
    return {re.sub(r'<[^>]+>', '', re.search(r'<strong>(.*?)</strong>', li).group(1)): li
            for li in items}


PERSON_ICON = ('<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5" r="3"/>'
               '<path d="M2 15c0-3.3 2.7-6 6-6s6 2.7 6 6z"/></svg>')


def link_people(body, people):
    """Add a Basecamp-profile icon after every person named in the popup html.

    Text outside links is searched for the names in people.json, longest first. A first
    name alone is skipped when a capitalised word follows (someone else's surname).
    A link whose whole text is a known name gets the icon after it.
    """
    if not people:
        return body
    full = {}  # id -> longest name, for the tooltip
    for name, pid in people.items():
        if len(name) > len(full.get(pid, '')):
            full[pid] = name

    def icon(pid):
        label = html.escape(f'{full[pid]} on Basecamp')
        return (f'<span class="bcp" title="{label}" aria-label="{label}">{PERSON_ICON}</span>')

    names = re.compile(r'(?<![\w-])(' + '|'.join(re.escape(n) for n in sorted(people, key=len, reverse=True))
                       + r')(?![\w-])')

    def in_text(text):
        def sub(m):
            name = m.group(1)
            if ' ' not in name and re.match(r'\s+[A-ZÆØÅÉ]', text[m.end():]):
                return name
            return name + icon(people[name])
        return names.sub(sub, text)

    out, depth = [], 0
    parts = re.split(r'(<[^>]+>)', body)
    for i, part in enumerate(parts):
        if part.startswith('<a ') or part == '<a>':
            depth += 1
        elif part == '</a>':
            depth -= 1
            # A link that is just a name, e.g. a researcher card: icon after the link
            text = parts[i - 1] if i and not parts[i - 1].startswith('<') else ''
            out.append(part)
            if depth == 0 and text.strip() in people:
                out.append(icon(people[text.strip()]))
            continue
        out.append(part if part.startswith('<') or depth else in_text(part))
    return ''.join(out)


def render_details(resp, meta, lists=()):
    parts = []
    if resp:
        parts.append('<ul class="resp">' + ''.join(f'<li>{inline(r)}</li>' for r in resp) + '</ul>')
    for heading, items in lists:
        parts.append(f'<h3>{inline(heading)}</h3><ul class="resp">'
                     + ''.join(f'<li>{inline(i)}</li>' for i in items) + '</ul>')
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


def render_ask(ask):
    """One help ask; its "{skill: …; interest: …; time: …}" tag becomes labels and data attributes."""
    m = TAG.search(ask)
    if not m:
        raise SystemExit(f'Help ask without a {{skill; interest; time}} tag: {ask}')
    text, attrs, labels = ask[:m.start()], [], []
    for part in m.group(1).split(';'):
        dim, _, values = part.partition(':')
        dim, values = dim.strip(), [v.strip() for v in values.split(',')]
        vocab = CATEGORIES.get(dim)
        if vocab is None or any(v not in vocab for v in values):
            raise SystemExit(f'Unknown tag "{part.strip()}" in: {ask}')
        attrs.append(f'data-{dim}="{" ".join(values)}"')
        labels += [f'<span class="tag {dim}">{vocab[v]}</span>' for v in values]
    return f'<li {" ".join(attrs)}>{inline(text)}<span class="tags">{"".join(labels)}</span></li>'


def render_help(help_, basecamp):
    """The "Wanna help?" box ending with the Basecamp link, or just the link without help text."""
    if not help_:
        return render_basecamp(basecamp)
    intro, asks = help_
    box = f'<div class="help"><h3>Wanna help?</h3><p>{inline(intro)}</p>'
    if asks:
        box += '<ul>' + ''.join(render_ask(a) for a in asks) + '</ul>'
    return box + render_basecamp(basecamp) + '</div>'


def render_filters():
    """Chips that filter the help overview; script.js does the filtering."""
    rows = ''.join(
        f'<div class="frow"><span>{label}</span>'
        + ''.join(f'<button class="chip" data-dim="{dim}" data-val="{k}" aria-pressed="false">{v}</button>'
                  for k, v in CATEGORIES[dim].items()) + '</div>'
        for dim, label in (('skill', 'I can'), ('interest', 'I care about'), ('time', 'I have')))
    return f'<div class="filters">{rows}<p class="fcount" aria-live="polite"></p></div>'


def build():
    lines = SOURCE.read_text(encoding='utf-8').splitlines()
    content, circle, circle_title, circle_area = {}, None, '', None
    researchers = research_group_items()
    # For the "all the ways to help" popup: circle title -> [entry html]
    overview = {}
    for level, title, sid, body in split_sections(lines):
        impact, resp, meta, basecamp, members, help_, lists = parse_block(body)
        if level == 2:
            circle_title, circle_area = title, AREA_IDS.get(sid)
        if help_ and not sid.startswith(OVERVIEW_SKIP):
            # The popup to open: its own, or its circle's with the entry expanded (area#item)
            target = (circle_area if level == 2 else
                      sid.lower() if sid.startswith(SPLIT_PREFIXES) else f'{circle_area}#{sid.lower()}')
            intro, asks = help_
            entry = (f'<li><button class="goto" data-open="{target}">{inline(title)}</button>'
                     f'<p>{inline(intro)}</p>')
            if asks:
                entry += '<ul>' + ''.join(render_ask(a) for a in asks) + '</ul>'
            overview.setdefault(circle_title, []).append(entry + render_basecamp(basecamp) + '</li>')
        popup = {'title': title, 'lead': f'<p class="lead">{inline(impact)}</p>',
                 'details': render_details(resp, meta, lists), 'help': render_help(help_, basecamp),
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
                f'<li><details id="{sid.lower()}"><summary>'
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

    out['help'] = {
        'title': 'All the ways to help',
        'body': '<p class="lead">Everything CPDSE could use a hand with right now, from every part '
                'of the tissue. Pick what fits you, or click a name to read more about it.</p>'
                + render_filters()
                + ''.join(f'<h3>{inline(t)}</h3><ul class="items overview">{"".join(e)}</ul>'
                          for t, e in overview.items())}

    people = json.loads(PEOPLE.read_text(encoding='utf-8'))['people'] if PEOPLE.exists() else {}
    for popup in out.values():
        popup['body'] = link_people(popup['body'], people)

    TARGET.write_text(
        '// Popup content. Generated from gateway-content.md by build_content.py: edit those, not this file.\n'
        f'const CONTENT = {json.dumps(out, ensure_ascii=False, indent=2)};\n',
        encoding='utf-8')
    print(f'Wrote {TARGET.name}: ' + ', '.join(f'{k} ({v["title"]})' for k, v in out.items()))


if __name__ == '__main__':
    build()
