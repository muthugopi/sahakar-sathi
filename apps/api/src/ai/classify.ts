/**
 * Lightweight, rule-based routing for a question. No LLM call — deterministic,
 * zero-latency, and easy to reason about in a demo.
 *
 *   official  — eligibility / benefits / deadlines / legal / procedure. Answer
 *               ONLY from the verified knowledge base; never from the web.
 *   hybrid    — definitions, background, "how does X work". Knowledge base first,
 *               Wikipedia to fill gaps and add context.
 *   current   — asks for the latest / newest / recent information. Knowledge base
 *               plus a live web search, with dates and sources shown.
 */
export type QuestionRoute = 'official' | 'hybrid' | 'current';

export interface Classification {
  route: QuestionRoute;
  /** True when a wrong answer could cause real harm — forces official grounding. */
  sensitive: boolean;
}

const CURRENT = [
  /\blatest\b/i,
  /\bcurrent(ly)?\b/i,
  /\bnewest\b/i,
  /\brecent(ly)?\b/i,
  /\bnew (rules?|guidelines?|circular|notification|update)\b/i,
  /\bthis (year|month|season)\b/i,
  /\bupdate[ds]?\b/i,
  /\b20\d{2}\b/,
  /\bnow\b.*\?/i,
  /अभी|नया|ताज़ा|हाल/,
  /சமீபத்திய|புதிய|இப்போது/,
];

const SENSITIVE = [
  /\beligib/i,
  /\bqualify\b/i,
  /\bam i (eligible|entitled)\b/i,
  /\bdocuments?\b.*\b(need|required|require|for)\b/i,
  /\brequired documents?\b/i,
  /\bhow (do|to) (i )?apply\b/i,
  /\bapplication process\b/i,
  /\bdeadline\b/i,
  /\blast date\b/i,
  /\bcut[- ]?off\b/i,
  /\bpremium (rate|amount)\b/i,
  /\bbenefit (amount|is)\b/i,
  /\bhow much (will|do) i (get|pay|receive)\b/i,
  /\bsubsidy\b/i,
  /\bsection \d+/i,
  /\bby[- ]?laws?\b/i,
  /\blegal(ly)?\b/i,
  /\bpenalty\b/i,
  /\bclaim (process|amount|settlement)\b/i,
  /पात्र|दस्तावेज़|आवेदन|अंतिम तिथि|उपनियम|कानून/,
  /தகுதி|ஆவணங்கள்|விண்ணப்ப|இறுதி தேதி|விதிமுறை|சட்டம்/,
];

const DEFINITIONAL = [
  /\bwhat (is|are|does)\b/i,
  /\bexplain\b/i,
  /\bmeaning of\b/i,
  /\bdefine\b/i,
  /\bhow does .* work\b/i,
  /\bdifference between\b/i,
  /\bwhy (is|are|do)\b/i,
  /क्या (है|होता|होती)|समझाइए|मतलब/,
  /என்ன|என்றால்|விளக்க/,
];

const any = (patterns: RegExp[], text: string) => patterns.some((p) => p.test(text));

export function classifyQuestion(text: string): Classification {
  const q = text.trim();
  const sensitive = any(SENSITIVE, q);
  const current = any(CURRENT, q);

  if (current) return { route: 'current', sensitive };
  // Eligibility / legal / procedural questions must stay on verified sources.
  if (sensitive) return { route: 'official', sensitive };
  if (any(DEFINITIONAL, q)) return { route: 'hybrid', sensitive };
  // Default: try the knowledge base first, allow Wikipedia to add context.
  return { route: 'hybrid', sensitive };
}
