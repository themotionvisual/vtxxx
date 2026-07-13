---
name: viewtube-neo-ui
description: Neo-brutalist VIEWTUBE design system for building UI components. Use whenever creating or restyling any ViewTube interface — dashboard widgets, data tables, stat tiles, nav pills, toolbars, toggles, hero strips — in the React app or standalone HTML tools, so every surface shares the same palette, borders, shadows, and typography.
---

# VIEWTUBE Neo-Brutalist UI System

Every ViewTube surface follows one visual language: flat neon fills, thick black
borders, hard offset shadows, condensed black-weight uppercase type. Nothing is
soft — no gradients on components, no blurs, no gray borders, no thin fonts.

## Tokens

### Palette
Two palettes exist; pick per context and don't mix arbitrarily.

App palette (Tailwind theme tokens in `src/index.css`):
- `neo-cyan #00FFFF` · `neo-lime #00FF00` · `neo-yellow #FFFF00` · `neo-orange #FF9933`
- `neo-pink #FF3399` · `neo-purple #CC00FF` · `neo-red #FF0000` · `neo-green #00CC66` · `neo-blue #6699FF`
- Grounds: `neo-off #F8F9FA` (page), `neo-white #FFFFFF` (cards), `neo-gray #E0E0E0` (muted), ink `neo-black #000000`

Toolbox palette (data-tables tool, softer neons for dense data UI):
`#40C6E9 #4FFF5B #FFFF61 #FFB570 #FF3B30 #FF8AAF #FF83EA #CC00FF #579AFF`

Rules: black text on light/neon fills; white text only on pink, purple, blue,
red. Assign colors by cycling the palette per item (`palette[i % palette.length]`),
not by hand-picking per component.

### Borders, radius, shadows
- Border: 2px (`neo-border`) for inner elements, 3px (`neo-border-thick`) for cards/modules, 4px for page-level frames. Always `#0A0A0A`/black, always solid.
- Radius: 4–8px inner elements, 10–14px cards, 999px pills. Never fully square, never blob-round (except pills).
- Shadow: hard offset only, zero blur — `box-shadow: 4px 4px 0 rgba(10,10,10,.9)` (small), `6px 6px 0` (cards). Hover lift: translate(-2px,-2px) + grow shadow to 6px (`neo-shadow-hover`).
- NEVER `filter: drop-shadow(...)` on containers with text — it silhouettes the text and creates a ghost/echo copy. Use `box-shadow` on the card instead.

### Typography
- Faces: Barlow (body), Barlow Condensed (`font-head`, display), Space Mono (data/labels). Standalone tools may use Inter with weight 900–1000.
- Everything structural is UPPERCASE: headings, labels, buttons, table headers.
- Weight is the hierarchy tool: 900–1000 for headings/values, 600–700 for supporting prose. Tracking: tight (-0.03em to -0.06em) on big display text, wide (+0.08em to +0.16em) on tiny labels.
- Numbers: `font-variant-numeric: tabular-nums`; truncate with ellipsis + `title` tooltip, never wrap a metric.
- Long-form/description text: sentence case, weight 600, `#3f3f3f` — the one place uppercase is NOT used.

## Component recipes

### Module header strip
Colored bar atop every module/tile: full-bleed neon fill, `border-bottom: 3px solid black`,
height 22–25px, leading icon box (square, contrasting neon fill, `border-right: 3px solid black`,
centered 12–14px black icon), then the uppercase label at 11–14px/weight 999, padding-left 6px.

### Stat tile / KPI card
White card, 3px border, radius 10px, min-height ~78px. Shadow is the module's
accent at half opacity, hard offset: `box-shadow: 4px 4px 0 var(--vt-summary-shadow,
rgba(64,198,233,.5))` — KPI/summary cards get colored translucent shadows, not black.
Header strip (above) + body: value at 23–34px/weight 1000/tracking -0.06em,
note below at 8–9px/weight 900/uppercase/60% opacity. Tiles sit in a `grid` with
`gap: 10px` and `grid-auto-rows: 1fr` so rows stay equal height.

### Identity / hero card
Same anatomy as a KPI card, scaled up: header strip (icon box + module label like
"Selected Video" or the active category), then a body grid of media (16:9 framed
thumbnail or glyph rail) beside title + sentence-case description. Same colored
translucent shadow as the tiles so the whole summary row reads as one family.

### Nav pill / action button
Pill (`rounded-full`) or 8–14px radius block, neon fill, `neo-border-thick`,
uppercase 10–12px weight 900 tracking-widest, `neo-shadow-hover`. Active state:
darker ring (`ring-2 ring-black`) or fill swap — never opacity alone.

### Data table
- Group header row: colored group strips (one palette color per column group), black text, 30px tall.
- Column header row: black background, header text takes the group's color, 62px tall in normal view.
- Compact view: header row grows to ~118px and titles rotate vertical —
  `writing-mode: vertical-rl; transform: rotate(180deg)` on each word-span
  (letter bottoms face RIGHT, reading bottom→top), spans in a `flex-direction: row`
  container so the second word/line stacks to the RIGHT of the first.
- Zebra rows via translucent black overlay (`rgba(10,10,10,.07)`), selected row via translucent accent.
- Fixed viewport: cap the scroll shell at N visible rows (`maxHeight = headHeight + N * rowHeight`,
  `overflow-y: auto`) with sticky headers; compact mode keeps the same pixel height and simply fits
  more rows. Style the vertical scrollbar via `::-webkit-scrollbar*` (white track, black-bordered
  neon thumb) — and never set `scrollbar-width`/`scrollbar-color` alongside it: Chromium then
  ignores the `::-webkit-scrollbar` styling entirely.
- Column drag: build the drag image as a transparent (opacity ~.72) render of the whole column
  (header chip + first ~12 formatted values) via `setDragImage`; highlight the drop target with one
  absolutely-positioned full-column overlay rectangle inside the scroll shell (accent border +
  translucent fill, `pointer-events: none`), repositioned on `dragover` — not per-cell classes.
- Heatmap cells: `hexToRgba(groupColor, pct)` — intensity maps to value, still flat color.
- Image cells (thumbnails, flags): background is the standard cell color (`var(--vt-table-bg)`), never black — a black fill just looks like a broken/empty cell when the image fails. Add `onError` to hide the broken `<img>` so the plain cell shows through.
- Late-patch CSS with `!important` must be scoped `table:not(.is-compact-table)` vs `table.is-compact-table` — never unscoped.

### Toggle / checkbox
White block with 3–4px border and radius ~14px; label tiny uppercase inside;
state shown by a filled black square/knob, not by color alone.

### Search bar
Pill or rounded rect, white field, 3–4px border, leading icon in a neon square box,
trailing clear "×" button in matching neon. Placeholder uppercase, letterspaced, 40% ink.

### Patching React DOM from outside scripts
A post-render fixup script (MutationObserver etc.) must never `remove()` or reparent
React-owned nodes — React's next reconcile throws `Failed to execute 'removeChild'`
and unmounts the whole tree (blank page). Hide with `display:none` + a `data-*` marker,
store originals (e.g. colSpan) in `data-*`, and reset markers at the start of each pass
so the fixup stays idempotent. Also scope any inline `style.transform` writes away from
elements whose transform is CSS-driven (compact rotated headers), and clear stale ones.

## Anti-patterns (reject on sight)
- Soft/blurred shadows, gradients on components, glassmorphism, thin gray `1px #ddd` borders.
- `filter: drop-shadow` around text-bearing blocks (ghost-text bug).
- Mixed-case buttons/labels, font weights below 600 for structural text.
- Unscoped `!important` overrides appended at file end.
- Hand-picked one-off colors — always use a palette token.
