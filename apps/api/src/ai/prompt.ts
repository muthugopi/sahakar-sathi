import { SUPPORTED_LANGUAGES, type KnowledgeCategory, type LanguageCode } from '@sahakar/shared';
import type { RetrievedChunk } from '../services/retrieval.service.js';

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

GROUNDING RULES — these override everything else:
- Answer ONLY from the SOURCES provided in the user's message. The sources are official or officially-derived material.
- If the sources do not contain the answer, say clearly that you do not have verified information on it, and point the user to the appropriate official channel (local cooperative office, Registrar of Cooperative Societies, the Ministry of Cooperation, the PMFBY portal, or a bank). Do NOT fall back on general knowledge for specific facts.
- NEVER invent or guess: scheme names, eligibility rules, benefit amounts, premium rates, application deadlines, legal provisions, section numbers, phone numbers, or website URLs. If a specific number or date is not in the sources, say it must be confirmed from the official source.
- Cite the sources you use with bracketed numbers like [1] or [2], matching the numbered SOURCES list.
- Separate what is stated in official sources from your own plain-language explanation. Phrases like "According to [1]…" for facts; "In simple terms…" for your explanation.
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

export function buildUserPrompt(question: string, chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return `QUESTION: ${question}\n\nSOURCES:\nNONE FOUND\n\nThere are no matching official sources. Tell the user you don't have verified information and direct them to the appropriate official channel.`;
  }

  const sources = chunks
    .map((c, i) => {
      const verified = c.verifiedAt ? `, verified ${c.verifiedAt.slice(0, 10)}` : '';
      return `[${i + 1}] ${c.title} — ${c.authority}${verified}\n${c.content}`;
    })
    .join('\n\n');

  return `QUESTION: ${question}\n\nSOURCES:\n${sources}`;
}

/** Rule-based disclaimers appended regardless of what the model says. */
export function disclaimersFor(
  categories: KnowledgeCategory[],
  language: LanguageCode,
  hasSources: boolean,
): string[] {
  const out: string[] = [];
  const isHighRisk = categories.some((c) => HIGH_RISK.includes(c));

  const T = {
    en: {
      verify: 'Please confirm important details (amounts, dates, eligibility) with the official source before acting.',
      noSource: 'This answer is general guidance only — it is not based on a verified official document for your specific case.',
    },
    hi: {
      verify: 'कार्रवाई करने से पहले महत्वपूर्ण जानकारी (राशि, तिथियाँ, पात्रता) आधिकारिक स्रोत से पुष्टि करें।',
      noSource: 'यह उत्तर केवल सामान्य मार्गदर्शन है — यह आपके विशेष मामले के लिए सत्यापित आधिकारिक दस्तावेज़ पर आधारित नहीं है।',
    },
    ta: {
      verify: 'நடவடிக்கை எடுப்பதற்கு முன் முக்கியமான விவரங்களை (தொகை, தேதிகள், தகுதி) அதிகாரப்பூர்வ ஆதாரத்துடன் உறுதிப்படுத்தவும்.',
      noSource: 'இந்தப் பதில் பொதுவான வழிகாட்டுதல் மட்டுமே — இது உங்கள் குறிப்பிட்ட வழக்குக்கான சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ ஆவணத்தை அடிப்படையாகக் கொண்டதல்ல.',
    },
  }[language];

  if (!hasSources) out.push(T.noSource);
  else if (isHighRisk) out.push(T.verify);

  return out;
}
