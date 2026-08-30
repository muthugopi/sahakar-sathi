# Design plan — Sahakar Sathi

A fresh visual system. Written before the code. Held to on every screen.

## The product, stated plainly

A guidance desk for cooperative members and small farmers in rural India. The core
interaction: ask a question, get a trustworthy answer with its source. Secondary: find
a scheme, read a rule, file and track a grievance.

**User:** low-to-moderate digital literacy, some cannot read fluently. An inexpensive
Android phone, ~6" screen, slow/intermittent 4G. Often uses English, Hindi *and* Tamil
across a household.

**One job per screen.** People do best when each screen has one obvious thing to do.

## The idea: a wayfinding system

Not a website to browse — a set of **clear signs that point you to the answer**, and
answers that arrive as **official notices**. The reference is public wayfinding in
Indian government offices, Jan Seva Kendras and railway stations: high-contrast, flat,
colour-coded, big type, one accent that means "this way / this is done".

## Colour — 6 values

| Token | Hex | Why this, for this product |
|---|---|---|
| `bg` | `#f3f5f4` | pale cool grey — a "public building interior" neutral. Not clinical white, not the cream cliché. |
| `panel` | `#ffffff` | white — used **only** for notices, cards and tables, so a white surface always means "official content". |
| `ink` | `#16211f` | near-black with a faint green cast, so body text sits with the teal. 15:1 on `bg`. |
| `ink-2` | `#4c5754` | captions, metadata, hint text. 7:1 on white. |
| `primary` | `#0b4f4a` | deep pine-teal — agriculture, water, cooperative associations; deliberately **not** navy, **not** the tired gov-green. 8.9:1 on white. Navigation, primary buttons, headings, chevrons. |
| `accent` | `#c2610a` | deep amber — the maximum-visibility "attention / this way / verified" colour, the classic complement to teal in road and station signage. **Reserved** for: the active-page marker, status keylines, focus outlines, the "recommended path" keyline. Never a button, never a large fill. |

Functional only: `line #d3d8d6`, `error #b42318`, `ok #0b7a3b`.

## Type — a deliberate pair

- **Display: Archivo (600 / 700).** A grotesque with a wide, confident, signage
  character. Page and section headings, signpost labels, button text.
- **Body: Noto Sans (400 / 600), with Noto Sans Devanagari and Noto Sans Tamil.**
  Chosen for a specific reason: Noto ("no tofu") was built to solve multilingual
  legibility. Using one Noto family for all three scripts means a Hindi or Tamil reader
  gets the *same* typographic quality as an English reader — which is the point of a
  public service. Body copy, forms, tables, captions.
- Self-hosted (`@fontsource`); the Indic faces load only when that language is active.

Scale (`rem`, so the text-size control scales all of it):

| Role | Mobile | Desktop | Face |
|---|---|---|---|
| Page heading | 2rem | 2.5rem | Archivo 700 |
| Section heading | 1.5rem | 1.75rem | Archivo 600 |
| Sub-heading | 1.1875rem | 1.1875rem | Noto Sans 600 |
| Signpost label | 1.25rem | 1.25rem | Archivo 600 |
| Body | 1.0625rem (17px) | 1.0625rem | Noto Sans 400, line-height 1.6 |
| Caption / meta | 0.9375rem | 0.9375rem | Noto Sans 400, `ink-2` |

## Layout

- **One container:** `max-width 1000px`; padding `20px` mobile / `40px` desktop.
- **One spacing scale:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96.
- **One radius: `2px`.** Crisp, like a printed sign — not pill, not zero.
- **Grid:** single column by default; two columns only for the signpost grid (≥640px)
  and admin tables. Reading measure `62ch`.
- No shadows anywhere. Structure comes from borders, colour rules and space.

## Components — one of each

- **Button.** `min-height 52px` (wayfinding = large targets), Archivo 600, 2px radius.
  Primary = solid teal on white text. Secondary = white with a 2px teal border. Link =
  teal underline. Primary actions go full-width on mobile.
- **Signpost** *(the signature)*. A bordered row (1px `line`, 2px radius, `min-height
  64px`): a 28px teal glyph, an Archivo `signpost-label` in teal, a caption line, and a
  teal chevron at the end. `signpost--primary` adds a **4px amber left keyline** — "this
  is the recommended path". Stacks in a list or a 2-up grid. Used for quick access,
  the services directory, the knowledge hub, "my grievances", "recently updated".
- **Notice.** A white panel, 2px radius, 1px border, with a **4px top rule** — teal for
  information, amber for a caution, `error` for a problem. This is the "official stamped
  notice" motif: the assistant's answer, the grievance-submitted confirmation, source
  blocks, disclaimers, the error summary.
- **Field.** White input, 2px `ink` border, 2px radius, `min-height 52px`. Label above
  (Noto 600), hint below (`ink-2`). On error: the border turns `error`, the message is
  `error` and bold, and the group gets a 4px `error` left keyline.
- **Navigation.** Desktop: a horizontal list under the teal masthead; the active item
  carries a 4px amber underline. Mobile: a **full-screen overlay menu** (not a cramped
  dropdown) opened by a 52px button, rows at 52px, closes on navigate.
- **Table** (admin): one `data-table` — uppercase Archivo header, 1px row rules, 12px
  cells, no zebra, horizontal-scroll wrapper on small screens.
- **Tag / status:** small, 2px radius, `bg`, a 3px left keyline coloured by meaning
  (amber = verified/attention, teal = in progress, `ok` = resolved, `ink-2` = neutral).
  The text label is always shown — never colour alone.

## Signature element

The whole site is a **wayfinding system**: every route to information is a clear,
colour-coded **signpost**, and every answer arrives as an **official notice** (white
panel, teal top-rule, a plain confidence label, footnoted sources). The **amber keyline**
is the one recurring mark — it means "recommended path" or "verified". That is the
single memorable, product-specific decision. Everything else — the type scale, the
spacing, the two button styles — is quiet and identical on every page.

**Self-check.** A generic product would not arrive at wayfinding signposts + official-
notice answer panels + a teal/amber public-signage palette + one Noto family chosen for
tri-lingual legibility parity. Each of those is forced by this product's real
constraints: a semi-literate user on a small screen who needs one obvious action; a
trust requirement that answers cite sources and look official; three languages that
must be served equally.

## Accessibility (held throughout)

WCAG-AA contrast (checked above), semantic landmarks and headings, a visible 3px amber
focus outline with offset, `prefers-reduced-motion` respected, ≥48px targets, the
text-size control, an error-summary that takes focus, breadcrumbs on inner pages,
focus moved to `<main>` on route change, a real (not shrunk) mobile layout.

## States (designed, not defaulted)

- **Loading:** a short "Loading…" line in `ink-2`; page-transition Suspense the same.
- **Empty:** a plain sentence explaining what's missing and the one action to take
  (e.g. "No schemes match these filters. Clear the filters or ask the assistant.").
- **Error:** a `notice` with an `error` top rule — what went wrong, and a retry button.
- **Offline:** a full-width `error`-ruled bar at the very top; on the assistant, a
  notice explaining that reading pages still work but answers need a connection.
- **Success:** the grievance confirmation is a teal-ruled `notice` with the tracking
  number as the largest thing on the screen, then the two next actions.
