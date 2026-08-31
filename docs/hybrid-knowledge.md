# Hybrid Knowledge & Web Search

> Sahakar Sathi combines verified government knowledge with live web search to
> provide reliable official answers as well as broader, up-to-date educational
> information.

## Why

The verified knowledge base is authoritative but narrow — it covers the seeded
schemes, cooperative-law topics, PACS services and PMFBY FAQ. Users also ask
general questions ("what is a cooperative society?", "history of the cooperative
movement") and time-sensitive ones ("latest PMFBY guidelines"). A pure-RAG
assistant answers the first group with "no verified information" and the second
with stale data.

The hybrid design keeps official answers strictly grounded while letting a
secondary tier handle background and recency — clearly labelled, never mixed.

## Flow

```
User question
  → language detection            (ai/language.ts)
  → classify                      (ai/classify.ts)   official | hybrid | current
  → retrieve from knowledge base  (services/retrieval.service.ts, pgvector)
  → maybe web search              (services/websearch.service.ts)
       official → skip
       hybrid   → only if the KB match is weak (top score < 0.85 or no match)
       current  → always; also hits the general web provider
  → LLM combines, citing [n] per source, tiers labelled in the prompt
  → attribute cited sources, score confidence
  → answer in the user's language + grouped source list + disclaimers
```

## Source hierarchy

| Tier | What | Used for |
|---|---|---|
| `OFFICIAL` | Verified KB documents (govt / cooperative) | Anything factual — eligibility, amounts, dates, law, procedure |
| `ENCYCLOPEDIA` | Wikipedia (en / hi / ta) | Definitions, background, history, context |
| `WEB` | General web-search results (Tavily), with publish date | Current-information questions only |

The system prompt (`ai/prompt.ts`) enforces: **never** answer eligibility,
benefits, amounts, deadlines, required documents, or legal provisions from a
`WEB`/`ENCYCLOPEDIA` source. If no `OFFICIAL` source covers such a point, the
assistant says verified information isn't available and points to the official
channel. When official and web sources disagree, the official source wins.

## Classification

Rule-based (`ai/classify.ts`) — deterministic, no extra LLM call, works across
en/hi/ta keyword patterns:

- **sensitive** markers (`eligible`, `documents required`, `deadline`, `premium`,
  `section N`, `by-laws`, `how to apply`, Hindi/Tamil equivalents) → `official`
- **current** markers (`latest`, `new guidelines`, `this year`, a `20xx` year,
  `update`) → `current` (still flagged sensitive if it also matches the above)
- **definitional** markers (`what is`, `explain`, `how does … work`) → `hybrid`
- default → `hybrid`

## Configuration

| Env | Default | Effect |
|---|---|---|
| `WEB_SEARCH_ENABLED` | `true` | Master switch. `false` = knowledge base only. |
| `WEB_SEARCH_PROVIDER` | `tavily` | General web-search provider for the `current` route. |
| `WEB_SEARCH_API_KEY` | *(empty)* | Enables the general provider. Empty = Wikipedia only; `current` questions get Wikipedia + a "check the official portal" note. |
| `WEB_SEARCH_TIMEOUT_MS` | `5000` | Per-request timeout. On timeout/failure the web tier returns nothing and the KB answer is unaffected. |

## Confidence

- `HIGH` / `MEDIUM` — grounded in official KB chunks (top similarity ≥ 0.85 / 0.78)
- `LOW` — answered from web/Wikipedia only, **or** a weak KB match
- `NO_SOURCE` — nothing retrieved from any tier

## Failure behaviour

Web providers fail soft: a network error or timeout logs a warning and returns
an empty list. The knowledge-base answer is never blocked by web search.
