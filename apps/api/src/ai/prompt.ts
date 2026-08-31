import { SUPPORTED_LANGUAGES, type KnowledgeCategory, type LanguageCode } from '@sahakar/shared';
import type { RetrievedChunk } from '../services/retrieval.service.js';
import type { WebResult } from '../services/websearch.service.js';

const LANGUAGE_NAME: Record<LanguageCode, string> = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((l) => [l.code, l.label]),
) as Record<LanguageCode, string>;

/** Categories where a wrong answer can cause real harm — force cautious wording. */
const HIGH_RISK: KnowledgeCategory[] = [
  'COOPERATIVE_LAW',
  'BYLAWS',
  'MINISTRY_SCHEME',
  'PMFBY_AGRICULTURE',
  'FINANCIAL_LITERACY',
];

export const SYSTEM_PROMPT = `You are Sahakar Sathi, a careful assistant for cooperative members, farmers, and rural citizens in India. You explain cooperative governance, cooperative law and by-laws, Ministry of Cooperation schemes, PACS services, PMFBY crop insurance, financial literacy, and grievance redressal.

SOURCE HIERARCHY — the SOURCES list is grouped by trust, most trusted first:
  1. OFFICIAL — verified government / cooperative documents. The authority for anything factual.
  2. WEB — Wikipedia and public web pages. Background and definitions only.

GROUNDING RULES — these override everything else:
- Answer ONLY from the SOURCES provided in the user's message. Do NOT fall back on general knowledge for specific facts.
- For anything about eligibility, benefits, amounts, premium rates, application deadlines, required documents, legal provisions, section numbers, or government procedures: use ONLY OFFICIAL sources. If no OFFICIAL source covers such a point, say you do not have verified information on it and point the user to the appropriate official channel (local cooperative office, Registrar of Cooperative Societies, the Ministry of Cooperation, the PMFBY portal, or a bank). NEVER answer these from WEB sources.
- WEB sources may be used for general definitions, background, history, and context. When you rely on them, make it clear ("As general background…", "Wikipedia describes it as…").
- If OFFICIAL and WEB sources disagree, follow the OFFICIAL source and say so.
- NEVER invent or guess specific numbers, dates, names, phone numbers, or URLs. If a detail is not in the sources, say it must be confirmed from the official source.
- Cite every source you use with bracketed numbers like [1] or [2], matching the numbered SOURCES list.
- For legal, financial, and crop-insurance questions, use cautious wording ("generally", "in most cases", "you should confirm with…") and always name the official source to check.
- If the question is unclear or depends on the user's specific situation (state, land size, crop, membership status), ask one short clarifying question instead of guessing.

STYLE:
- Write in {LANGUAGE} using simple, everyday words. Short sentences. No jargon; if a technical or legal term is unavoidable, explain it in one line.
- Be brief: a direct answer first, then only the details that matter. Use a short bullet list for steps or documents.
- Warm and respectful. Never condescending.
- Do not output JSON or headings like "Answer:". Just reply naturally.`;

export function buildSystemPrompt(language: LanguageCode): string {
  return SYSTEM_PROMPT.replace('{LANGUAGE}', LANGUAGE_NAME[language] ?? 'English');
}

export function buildUserPrompt(
  question: string,
  chunks: RetrievedChunk[],
  web: WebResult[] = [],
): string {
  if (chunks.length === 0 && web.length === 0) {
    return `QUESTION: ${question}\n\nSOURCES:\nNONE FOUND\n\nThere are no matching sources. Tell the user you don't have verified information and direct them to the appropriate official channel.`;
  }

  const lines: string[] = [];
  let n = 0;

  if (chunks.length > 0) {
    lines.push('OFFICIAL SOURCES (verified government / cooperative documents):');
    for (const c of chunks) {
      n += 1;
      const verified = c.verifiedAt ? `, verified ${c.verifiedAt.slice(0, 10)}` : '';
      lines.push(`[${n}] ${c.title} — ${c.authority}${verified}\n${c.content}`);
    }
  }

  if (web.length > 0) {
    lines.push('\nWEB SOURCES (background only — never for eligibility, amounts, dates, or law):');
    for (const w of web) {
      n += 1;
      const published = w.publishedAt ? `, published ${w.publishedAt.slice(0, 10)}` : '';
      lines.push(`[${n}] ${w.title} — ${w.authority}${published}\n${w.snippet}`);
    }
  }

  return `QUESTION: ${question}\n\nSOURCES:\n${lines.join('\n\n')}`;
}

/** Rule-based disclaimers appended regardless of what the model says. */
export function disclaimersFor(
  categories: KnowledgeCategory[],
  language: LanguageCode,
  hasSources: boolean,
  webOnly = false,
): string[] {
  const out: string[] = [];
  const isHighRisk = categories.some((c) => HIGH_RISK.includes(c));

  const T = {
    en: {
      verify: 'Please confirm important details (amounts, dates, eligibility) with the official source before acting.',
      noSource: 'This answer is general guidance only — it is not based on a verified official document for your specific case.',
      webOnly: 'This is general background from public web sources, not a verified official document. Confirm any specifics with the official source.',
    },
    hi: {
      verify: 'कार्रवाई करने से पहले महत्वपूर्ण जानकारी (राशि, तिथियाँ, पात्रता) आधिकारिक स्रोत से पुष्टि करें।',
      noSource: 'यह उत्तर केवल सामान्य मार्गदर्शन है — यह आपके विशेष मामले के लिए सत्यापित आधिकारिक दस्तावेज़ पर आधारित नहीं है।',
      webOnly: 'यह सार्वजनिक वेब स्रोतों से सामान्य पृष्ठभूमि है, सत्यापित आधिकारिक दस्तावेज़ नहीं। किसी भी विवरण की पुष्टि आधिकारिक स्रोत से करें।',
    },
    ta: {
      verify: 'நடவடிக்கை எடுப்பதற்கு முன் முக்கியமான விவரங்களை (தொகை, தேதிகள், தகுதி) அதிகாரப்பூர்வ ஆதாரத்துடன் உறுதிப்படுத்தவும்.',
      noSource: 'இந்தப் பதில் பொதுவான வழிகாட்டுதல் மட்டுமே — இது உங்கள் குறிப்பிட்ட வழக்குக்கான சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ ஆவணத்தை அடிப்படையாகக் கொண்டதல்ல.',
      webOnly: 'இது பொது வலை ஆதாரங்களிலிருந்து பொதுவான பின்னணி, சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ ஆவணம் அல்ல. விவரங்களை அதிகாரப்பூர்வ ஆதாரத்துடன் உறுதிப்படுத்தவும்.',
    },
  }[language];

  if (!hasSources) out.push(T.noSource);
  else if (webOnly) out.push(T.webOnly);
  else if (isHighRisk) out.push(T.verify);

  return out;
}
