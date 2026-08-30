# Design plan — Sahakar Sathi

A premium-minimal visual system. Written to be held to on every screen.

## The product, stated plainly

A guidance desk for cooperative members and small farmers in rural India. The core
interaction: ask a question, get a trustworthy answer with its source. Secondary: find
a scheme, read a rule, file and track a grievance.

**User:** low-to-moderate digital literacy, some cannot read fluently. An inexpensive
Android phone, ~6" screen, slow/intermittent 4G. Often uses English, Hindi *and* Tamil
across a household.

**One job per screen.** People do best when each screen has one obvious thing to do.

## The idea: a calm public institution, online

Not a busy portal and not a marketing site — a quiet, well-made public service. The
feeling to hit: unhurried, spacious, legible, trustworthy. Hierarchy comes from
**space and type**, never from stacking bordered boxes. Colour is used sparingly and
always means something.

## Tokens

### Colour

| Token | Value | Use |
| --- | --- | --- |
| `bg` | `#fbfbf9` | warm paper page ground |
| `panel` | `#ffffff` | raised surface — cards, inputs, the assistant answer |
| `ink` | `#1a2420` | primary text, near-black with a green undertone |
| `ink-2` | `#4a5450` | secondary text, captions, quiet links |
| `line` | `#e5e6e1` | hairline dividers and borders |
| `primary` | `#1f4d3a` | deep forest green — brand, primary actions, active state |
| `primary.tint` | `#eef2ec` | the one soft highlight wash |
| `accent` | `#b23a1e` | burnt sienna — errors and the rare "important" mark only, never decoration |
| `ok` | `#1f7a4d` | resolved / success |
| `focus` | `#3d7a5f` | keyboard focus ring |

One green. One warm red for problems. Everything else is ink on paper.

### Type

- **Display — Source Serif 4.** Headings and the hero statement. Humanist, warm,
  institutional. Set at a confident size but a light-to-medium weight (h1 is 400) so it
  reads as calm, not loud. Indic headings fall back to Noto Serif Devanagari / Tamil.
- **Text — Noto Sans.** Body, labels, buttons, navigation. Clean, highly legible at
  small sizes, and carries Devanagari + Tamil companions already.
- **Mono — system mono.** Tracking IDs only.

Scale (rem): 0.8125 · 0.875 · 1.0625 (base) · 1.1875 · 1.375 · 1.625 · 2 · 2.5 · 3.25 · 4.
Base text is 17px with 1.65 line-height.

### Space, shape, depth

- Wide, quiet layout: content maxes at 1120px with 24–32px gutters; prose at 66ch.
- Major sections are separated by generous vertical space (`py-16`–`py-20`) and a single
  hairline — not by cards.
- Soft radii: 10px default, 14–20px for larger surfaces. Full round for status pills.
- Shadow is used in two or three places only (sticky header, mobile menu). Elevation is
  mostly the hairline border plus the paper/panel contrast.

## Structure

- **Navbar** — one row, 64px, translucent paper with a backdrop blur and a bottom
  hairline. Serif wordmark left, text links centre, language + account + a single solid
  "Ask" button right. Collapses to a full-screen paper menu with large serif links.
- **Signpost** — a quiet index row (icon, label, one line of context, chevron that
  nudges on hover). No box. Used for the home destinations and the knowledge sections.
- **Notice** — a soft white card with a hairline. The assistant's answer, and warnings.
- **Prose** — a 66ch column, generous leading, for reference content.

## Motion

Nearly invisible. A 0.5s fade-up on the home hero and the mobile menu, 150ms colour
transitions on hover, a 3px chevron nudge. `prefers-reduced-motion` removes all of it.

## Quality floor

Responsive to 360px with layouts reorganised, not shrunk. Visible keyboard focus on
every control. Touch targets ≥ 44px. Contrast ≥ 4.5:1 for text. Native `<select>` for
language. All existing routes, APIs and behaviour unchanged.
