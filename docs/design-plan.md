# Design plan — Sahakar Sathi

One set of decisions, applied everywhere. Written before the code.

## Who this is for

- **Primary user:** a cooperative member or small farmer in rural India. Low-to-moderate
  digital literacy; some cannot read fluently (voice matters). On an inexpensive Android
  phone, ~6" screen, slow/intermittent 4G. Often hands the phone to a literate family
  member to read aloud.
- **The one thing they come to do:** get a plain-language answer to a specific question —
  *"Am I eligible for PMFBY?"*, *"How do I become a cooperative member?"*, *"What is a
  PACS?"* — by typing or speaking.
- **Content that anchors the design:** this platform's real vocabulary — *PACS*, *PMFBY*,
  *by-laws*, *grievance tracking ID (GRV-…)*, *सहकार*. The hero shows **actual questions
  from the knowledge base** as tappable prompts, not "ask me anything."

## The anchor idea

**Navy ink on paper.** In rural India an official cooperative record — a passbook, a
membership certificate, a Registrar's notification — is navy/blue ink on cream-white
paper, set in a serif, stamped and dated. That is the visual language people already
trust for "this is official cooperative information." The site is built to feel like a
clear, current, readable version of that record — not a tech product, not a marketing
site.

## Colour

| Token | Hex | Use |
|---|---|---|
| `ink` | `#1b1b1f` | body text, near-black, faintly warm |
| `paper` | `#fbfbf8` | page background — paper-white, **not** the #F4F1EA cream cliché |
| `surface` | `#f1f1ec` | inset blocks, secondary surfaces, table zebra |
| `primary` | `#17324d` | deep navy — header band, primary buttons, links, heading accents |
| `primary-hover` | `#0f2338` | pressed / hover navy |
| `accent` | `#c9772a` | **marigold-ochre**, one restrained accent — status "verified/new", the phase tag, the civic mark. Never a background wash, never decoration. |

Functional: `line #d3d3ca` (hairlines), `focus #ffdd00` (accessibility focus block —
utility, not brand), `error #b3261e`, `resolved #1f6f43`.

The marigold accent nods to the tricolour's saffron as a small, deliberate civic mark
(a 3px rule under the header) — never as the palette's identity.

## Type

Deliberately chosen — a **gazette voice**, because that is how cooperative law and scheme
information is actually published in India.

- **Headings:** IBM Plex Serif (400 / 600) — an institutional serif; reads as an official
  notification, not a blog.
- **Body / UI:** IBM Plex Sans (variable) — designed as a civic-institutional face, not a
  trend face.
- **Hindi:** IBM Plex Sans Devanagari, loaded only when the language is Hindi.
- **Tamil:** Noto Sans Tamil, loaded only when the language is Tamil.
- All self-hosted (`@fontsource`), `font-display: swap`, Latin subset for the base, the
  two critical files preloaded, all precached by the service worker.

Scale (`rem`, so the text-size control scales everything):

| Role | Mobile | Desktop | Face / weight |
|---|---|---|---|
| Page heading | 2rem | 2.5rem | serif 600 |
| Section heading | 1.5rem | 1.75rem | serif 600 |
| Sub-heading | 1.1875rem | 1.25rem | sans 600 |
| Body | 1.125rem (18px) | 1.125rem | sans 400, line-height 1.6 |
| Metadata | 0.9375rem | 0.9375rem | sans 400 |

No gradient text, no oversized filler headings.

## Layout

- **One container:** `max-width 1080px`; padding `20px` mobile / `32px` desktop.
- **Reading width** for prose: `64ch` (~620px).
- **Spacing scale:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96.
- **One border-radius: `4px`.** Buttons, inputs, cards, tags — all 4px. Not zero, not
  pill.
- Borders: `1px line` for dividers; `2px ink` for inputs and their focus.
- **No default shadows.** One subtle shadow (`0 2px 6px rgba(23,50,77,.12)`) is reserved
  for genuinely floating layers (a menu), nothing else.

## Components

- **Card:** white, `1px line` border, 4px radius, **flat**. Used only where grouping aids
  scanning: the quick-access grid, the scheme grid, the assistant intro. Never a wrapper
  for a lone paragraph.
- **Buttons — one system:**
  - Primary: solid navy, white, 4px, weight 600, `min-height 48px`, `12px 20px`.
  - Secondary: white, `2px navy` border, navy text.
  - Tertiary: navy text, underline (link-style).
- **Icons — one style:** a small hand-drawn outline set (`stroke 1.6`, 24px), used only
  on the quick-access tiles and the mobile menu toggle. Not beside headings.
- **Status tags:** 4px radius, `surface` background, coloured text + a coloured left
  keyline. Marigold for verified/new; navy for in-progress; green for resolved.

## Signature element

The **serif gazette voice**, paired with the navy identity, is the one real risk — a
serif on a digital public-service site is uncommon and reads as "official cooperative
notification," which is exactly right for this subject. It is reinforced by the **hero
carrying real knowledge-base questions** as its content (not placeholder copy) and a
single **3px marigold rule** under the header as a civic mark. Everything else stays
quiet: hairline dividers, a flat bordered grid, a typography-led updates list.

**Self-check:** would a generic government/SaaS brief produce navy + IBM Plex *Serif*
headings + a hero built from live KB questions + a marigold gazette rule? No — the
serif, the "navy ink on paper" framing, and the live-content hero are specific to this
platform's subject (cooperative records) and its one job (answering questions).

## Information architecture

**Header:** one horizontal bar. Logo left; `Home · Services · Schemes · Knowledge ·
Grievances · About` centre; language selector + text-size control + **"Ask the
assistant"** button right. Plain links, no pills. Mobile: a real disclosure menu.

**Homepage:**
1. **Hero** — serif headline, one supporting line, the question field, 3–4 real KB
   questions as prompts, `Ask` + `Speak your question`. Open on the paper, no cards.
2. **Quick access** — a 4-tile grid (icon + title + one line): *Find a scheme · Ask the
   assistant · Cooperative & PACS services · Submit a grievance*. Flat bordered cards.
3. **The assistant** — a real section: what it does, the three languages, the kinds of
   guidance, how it cites sources. Framed as a public-service assistant. No robot art.
4. **Services directory** — grouped by real category: Cooperative & PACS · Government
   schemes · Financial guidance · Crop insurance · Cooperative law · Grievance support.
   Scannable lists, not paragraphs.
5. **Recently updated** — a plain dated list (date · title · category) built from the
   real `verifiedAt` dates of schemes and knowledge topics. No invented numbers.
6. **About** — brief and factual: what it is, who it's for, how information is sourced
   (official documents → plain-language summaries; AI explanations are marked as such).
   No invented statistics, partners, or awards.

New pages: `/services` (full directory), `/knowledge` (hub linking the four topic
sections), `/about`. All existing routes preserved.

## Voice

Plain language. Banned: "revolutionising", "next-generation", "cutting-edge",
"seamless", "AI-powered intelligence". Name things by what the user does. Buttons say
the outcome ("Submit grievance", "Track a grievance"). Error and empty states say what
happened and what to do next, in the interface's voice.

## Accessibility

Kept from the previous pass and extended: 18px base + text-size control, `focus`
yellow-block focus states, ≥48px targets, semantic landmarks, error-summary boxes,
breadcrumbs, focus-to-`<main>` on route change, `prefers-reduced-motion`, a real mobile
menu, no horizontal overflow.
