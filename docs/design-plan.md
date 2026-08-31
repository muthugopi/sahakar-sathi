# Design plan — Sahakar Sathi

An editorial, scroll-driven public-service design system. Content first, UI second.

## The product

A guidance desk for cooperative members and small farmers in rural India. Core
interaction: ask a question, get a trustworthy answer with its source. Secondary:
find a scheme, read a rule, file and track a grievance. Users have low-to-moderate
digital literacy, an inexpensive Android phone, and a slow connection, and move
between English, Hindi and Tamil.

## Principles

- **Content breathes.** Generous section gaps (`.section` = py-20/28/36), a wide
  container (1360px) for landing sections, a narrow measure (~38rem) for reading.
- **Type creates hierarchy.** Source Serif 4 display at large sizes (hero up to
  8xl), Noto Sans for text. Weight is light-to-medium — confident, not loud.
- **Every page is its own composition.** A shared `PageHero` opens inner pages
  (its job — orient the reader — is the same everywhere); what follows differs:
  discovery (schemes), reference book (content pages), step journey (PMFBY),
  workflow (grievance), conversation (assistant), article (about).
- **Reuse function, not layout.** `TopicList`, `SchemeCard`, the chat components
  are shared because their behaviour is shared — not to save markup.
- **Motion is nearly invisible.** `useReveal` / `<Reveal>` — an IntersectionObserver
  fade + 20px rise, once, on entering view. Already-visible elements show at mount;
  a 1s safety timer guarantees content is never stuck hidden;
  `prefers-reduced-motion` disables it entirely. No parallax, no scroll-jacking.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `bg` | `#fbfbf9` | warm paper page ground |
| `panel` | `#ffffff` | raised surface — inputs, the assistant answer |
| `ink` | `#1a2420` | near-black text with a green undertone |
| `ink-2` | `#4a5450` | secondary text |
| `line` | `#e5e6e1` | hairline dividers |
| `primary` | `#1f4d3a` | deep forest green — brand, actions, active state |
| `primary.tint` | `#eef2ec` | the one soft wash |
| `accent` | `#b23a1e` | burnt sienna — errors / the rare "important" mark only |

One green, one warn-red, ink on paper. Soft radii (10–20px). Shadow in two or
three places only (sticky header, mobile menu).

## Navigation

One 64px row: serif wordmark left; Schemes · Cooperative · PACS · PMFBY · Money ·
Grievance centre; language + a solid "Ask Sathi" action right. Transparent at the
top of the page, elevates (background + hairline + soft shadow) on scroll. Mobile
collapses to a full-screen paper menu with large serif links. The prototype
disclaimer sits in the footer.

## Quality floor

Responsive to 360px with layouts reorganised (split grids use `grid-cols-1` +
`min-w-0`; section rails become horizontally-scrollable tab bars). Visible keyboard
focus, ≥44px touch targets, ≥4.5:1 text contrast, native `<select>` for language.
All routes, APIs and behaviour unchanged from before the redesign.
