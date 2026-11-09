"""Build hierarchy.html, a layered picture of CPDSE's hierarchy of purpose,
from hierarchy_of_purpose_levels.xlsx.

Run after editing the workbook:  python3 build_hierarchy.py   (needs openpyxl)

Each level is a horizontal band, top to bottom. Below the center, every portfolio
is a column, and programs, research groups and projects sit in the column of the
portfolio they belong to. Boxes link to their Basecamp match; the naming note
shows on hover.
"""
import html
from pathlib import Path

import openpyxl

ROOT = Path(__file__).parent
SOURCE = ROOT / 'hierarchy_of_purpose_levels.xlsx'
TARGET = ROOT / 'hierarchy.html'

LEVELS = ['CenterGrant', 'Center', 'Portfolio', 'Program', 'Research group', 'Project']
# Colour per portfolio column, matching the site
COLOURS = {
    'Services': ('#F2DCDC', '#7A1F1F'),
    'Fundamental': ('#DDE5DD', '#3C5E3E'),
    'PharmaDataScience Research Community': ('#E9EFE3', '#5F7D61'),
    'Nucleus': ('#3C5E3E', '#F9F9F9'),
}
MATCH_MARK = {'Exact': '●', 'Name differs': '◐', 'Possible': '○'}


def read_rows():
    ws = openpyxl.load_workbook(SOURCE).active
    header = [c.value for c in ws[1]]
    col = {name: i for i, name in enumerate(header)}
    rows = []
    for r in ws.iter_rows(min_row=2):
        if not r[col['Name']].value:
            continue
        link = r[col['Basecamp link']] if 'Basecamp link' in col else None
        rows.append({
            'level': (r[col['Level']].value or '').strip(),
            'name': r[col['Name']].value.strip(),
            'parent': (r[col['Parent']].value or '').strip(),
            'rhythm': r[col['Rhythm for update']].value or '',
            'url': link.hyperlink.target if link is not None and link.hyperlink else None,
            'bc_name': link.value if link is not None else None,
            'match': r[col['Basecamp match']].value if 'Basecamp match' in col else None,
            'note': r[col['Naming note']].value if 'Naming note' in col else None,
        })
    return rows


def portfolio_of(row, by_name):
    """Walk up the parents to the portfolio this row belongs to (None above the portfolios)."""
    seen = set()
    while row and row['level'] != 'Portfolio' and row['name'] not in seen:
        seen.add(row['name'])
        row = by_name.get(row['parent'])
    return row['name'] if row else None


def box(row, by_name):
    p = portfolio_of(row, by_name)
    bg, fg = COLOURS.get(p, ('#F6F1DC', '#3C5E3E'))
    tip = [f"{row['level']} · updated per {row['rhythm'].lower()}" if row['rhythm'] else row['level']]
    if row['level'] in ('Project', 'Research group', 'Program') and row['parent']:
        tip.append(f"Part of: {row['parent']}")
    if row['bc_name']:
        tip.append(f"Basecamp: {row['bc_name']}")
    if row['note']:
        tip.append(row['note'])
    mark = MATCH_MARK.get(row['match'], '')
    badge = f'<span class="bc" title="Basecamp: {html.escape(row["match"] or "")}">{mark}</span>' if mark else ''
    inner = f'<span class="name">{html.escape(row["name"])}</span>{badge}'
    sub = ''
    if row['level'] in ('Project', 'Research group'):
        sub = f'<span class="parent">↳ {html.escape(row["parent"])}</span>'
    attrs = f'class="box" style="--bg:{bg};--fg:{fg}" title="{html.escape(chr(10).join(tip))}"'
    if row['url']:
        return f'<a {attrs} href="{html.escape(row["url"])}" target="_blank" rel="noopener">{inner}{sub}</a>'
    return f'<div {attrs}>{inner}{sub}</div>'


def build():
    rows = read_rows()
    by_name = {r['name']: r for r in rows}
    portfolios = [r['name'] for r in rows if r['level'] == 'Portfolio']
    bands = []
    for level in LEVELS:
        items = [r for r in rows if r['level'] == level]
        if not items:
            continue
        rhythms = sorted({r['rhythm'] for r in items if r['rhythm']})
        label = (f'<div class="level"><strong>{html.escape(level)}</strong>'
                 f'<small>{html.escape(" · ".join(rhythms))}</small></div>')
        if level in ('CenterGrant', 'Center'):
            cells = f'<div class="span">{"".join(box(r, by_name) for r in items)}</div>'
        else:
            cells = ''.join(
                f'<div class="col">{"".join(box(r, by_name) for r in items if portfolio_of(r, by_name) == p)}</div>'
                for p in portfolios)
        bands.append(f'<section class="band">{label}<div class="cells">{cells}</div></section>')

    legend = ' · '.join(f'{m} {k.lower()}' for k, m in MATCH_MARK.items())
    TARGET.write_text(f'''<!DOCTYPE html>
<!-- Generated from hierarchy_of_purpose_levels.xlsx by build_hierarchy.py: edit those, not this file. -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Hierarchy of purpose</title>
<style>
  :root {{ --forest: #3C5E3E; --sage: #5F7D61; --mint: #A9BBAA; --gold: #D6C17C; --ivory: #F6F1DC; --cols: {len(portfolios)}; }}
  * {{ box-sizing: border-box; }}
  body {{ margin: 0; padding: 1.5rem 16px 2rem; background: var(--ivory); color: #333; font-family: Verdana, Geneva, sans-serif; }}
  h1 {{ margin: 0 auto .3rem; max-width: 72rem; color: var(--forest); font-size: 1.4rem; letter-spacing: .04em; }}
  .intro {{ margin: 0 auto 1.2rem; max-width: 72rem; font-size: .85rem; color: var(--sage); }}
  .stack {{ max-width: 72rem; margin: 0 auto; }}
  .band {{ display: grid; grid-template-columns: 9rem 1fr; gap: .8rem; align-items: stretch;
          padding: .7rem 0; border-top: 2px solid var(--mint); }}
  .band:first-child {{ border-top: 0; }}
  .level {{ display: flex; flex-direction: column; justify-content: center; color: var(--forest); font-size: .85rem; }}
  .level small {{ color: var(--sage); font-size: .7rem; margin-top: .2rem; }}
  .cells {{ display: grid; grid-template-columns: repeat(var(--cols), 1fr); gap: .6rem; }}
  .span {{ grid-column: 1 / -1; display: flex; justify-content: center; flex-wrap: wrap; gap: .6rem; }}
  .col {{ display: flex; flex-direction: column; gap: .4rem; }}
  .box {{ display: block; padding: .5rem .7rem; border-radius: .6rem; background: var(--bg); color: var(--fg);
         border: 2px solid color-mix(in srgb, var(--fg) 35%, transparent); text-decoration: none; font-size: .8rem;
         line-height: 1.3; position: relative; }}
  .span .box {{ min-width: 16rem; text-align: center; font-weight: bold; }}
  a.box:hover, a.box:focus-visible {{ border-color: var(--gold); outline: none; box-shadow: 0 0 0 2px var(--gold); }}
  .box .bc {{ position: absolute; top: .25rem; right: .4rem; font-size: .7rem; opacity: .8; }}
  .box .name {{ display: block; padding-right: .8rem; }}
  .box .parent {{ display: block; margin-top: .2rem; font-size: .68rem; opacity: .75; font-style: italic; }}
  .heads {{ display: grid; grid-template-columns: 9rem 1fr; gap: .8rem; position: sticky; top: 0; background: var(--ivory);
           padding: .4rem 0; z-index: 1; }}
  .heads .cells div {{ font-size: .7rem; font-weight: bold; letter-spacing: .08em; text-transform: uppercase; color: var(--sage); }}
  .legend {{ max-width: 72rem; margin: 1rem auto 0; font-size: .75rem; color: var(--sage); }}
  @media (max-width: 760px) {{
    .band, .heads {{ grid-template-columns: 1fr; }}
    .cells {{ grid-template-columns: 1fr; }}
    .heads {{ display: none; }}
  }}
</style>
</head>
<body>
<h1>Hierarchy of purpose</h1>
<p class="intro">From the grant's purpose down to concrete projects. Each layer is updated on its own rhythm;
below the center, each column is one portfolio. Click a box to open it in Basecamp; hover for notes.</p>
<div class="stack">
<div class="heads"><div></div><div class="cells">{"".join(f"<div>{html.escape(p)}</div>" for p in portfolios)}</div></div>
{"".join(bands)}
</div>
<p class="legend">Basecamp match: {legend}. Boxes without a mark have no Basecamp home yet.</p>
</body>
</html>
''', encoding='utf-8')
    print(f'Wrote {TARGET.name}: {len(rows)} items in {len(bands)} layers, {len(portfolios)} portfolio columns')


if __name__ == '__main__':
    build()
