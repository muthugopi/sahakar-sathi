import type { KnowledgeCategory } from '@sahakar/shared';

export interface SeedScheme {
  slug: string;
  title: string;
  category: KnowledgeCategory;
  summary: string;
  purpose: string;
  targetUsers: string[];
  eligibility: string;
  benefits: string;
  requiredDocuments: string[];
  applicationProcess: string;
  officialSource: string;
  officialUrl: string;
  state: string | null;
}

const CONFIRM =
  'Amounts, instalment dates, premium rates and cut-off dates change over time — always confirm the current position on the official portal or with the local office.';

export const SEED_SCHEMES: SeedScheme[] = [
  {
    slug: 'pm-kisan',
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'MINISTRY_SCHEME',
    summary:
      'Central income-support scheme that pays eligible landholding farmer families a fixed amount each year in equal instalments, directly into their bank account.',
    purpose:
      'To supplement the financial needs of landholding farmer families for farm inputs and household needs.',
    targetUsers: ['Farmer', 'Cooperative member'],
    eligibility:
      'Landholding farmer families whose names appear in the land records, subject to the scheme’s exclusion criteria (for example income-tax payers, serving or retired government employees above a certain level, and professionals such as doctors and lawyers are generally excluded). Eligibility is verified against land records and, in most states, requires Aadhaar linking and eKYC.',
    benefits:
      'A fixed annual income-support amount paid in three equal instalments through Direct Benefit Transfer to the farmer’s Aadhaar-seeded bank account. ' +
      CONFIRM,
    requiredDocuments: [
      'Aadhaar card',
      'Land records / ownership document',
      'Bank account passbook (Aadhaar-seeded)',
      'Mobile number for eKYC and status updates',
    ],
    applicationProcess:
      'Register through the PM-KISAN portal (self-registration), a Common Service Centre, or the local agriculture / revenue office. Complete eKYC (Aadhaar OTP or biometric). Track application and instalment status on the portal using the registered number.',
    officialSource: 'Ministry of Agriculture & Farmers Welfare, Government of India',
    officialUrl: 'https://pmkisan.gov.in/',
    state: null,
  },
  {
    slug: 'pmfby',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'PMFBY_AGRICULTURE',
    summary:
      'National crop insurance scheme covering notified crops in notified areas against non-preventable natural risks, from sowing to post-harvest.',
    purpose:
      'To provide financial support to farmers suffering crop loss or damage from natural calamities, pests and diseases, and to stabilise farm income.',
    targetUsers: ['Farmer', 'Sharecropper', 'Tenant farmer'],
    eligibility:
      'All farmers growing notified crops in notified areas, including sharecroppers and tenant farmers with the required documentation. Since Kharif 2020 the scheme is voluntary for all farmers, including those with a crop loan.',
    benefits:
      'Insurance payout for the shortfall in yield of a notified crop in the notified area, and for certain individual losses (hail, inundation, landslide, cloudburst, natural fire) and post-harvest losses. The farmer pays only a capped share of the premium; the government subsidises the rest. ' +
      CONFIRM,
    requiredDocuments: [
      'Aadhaar card',
      'Bank account passbook',
      'Land records (Record of Rights / Khasra) or a tenancy / sowing declaration',
      'Sowing certificate or self-declaration of sown crop where required',
    ],
    applicationProcess:
      'Enrol before the cut-off date for the season through a bank, a Common Service Centre, an authorised insurance intermediary, or directly on the National Crop Insurance Portal. Keep the enrolment receipt / policy reference. Report an individual crop loss within about 72 hours through the crop insurance app, the insurance company, the bank or the agriculture office.',
    officialSource: 'Ministry of Agriculture & Farmers Welfare, Government of India',
    officialUrl: 'https://pmfby.gov.in/',
    state: null,
  },
  {
    slug: 'kisan-credit-card',
    title: 'Kisan Credit Card (KCC)',
    category: 'PACS_SERVICE',
    summary:
      'A running credit facility that gives farmers timely, low-cost short-term credit for cultivation and allied activities, issued by banks and by PACS.',
    purpose:
      'To meet the short-term credit needs of farmers for crop cultivation, post-harvest expenses, working capital for allied activities, and a portion for household consumption.',
    targetUsers: ['Farmer', 'Tenant farmer', 'Sharecropper', 'Cooperative member'],
    eligibility:
      'Farmers who own and cultivate land; tenant farmers, oral lessees and sharecroppers; and members of joint liability groups or self-help groups engaged in agriculture, subject to the lending institution’s rules.',
    benefits:
      'A sanctioned credit limit that can be drawn and repaid flexibly as a running account, at concessional interest for crop loans up to the government-notified limit, often with an interest subvention and a prompt-repayment incentive. Also covers allied activities such as dairy and fisheries. ' +
      CONFIRM,
    requiredDocuments: [
      'Identity proof (Aadhaar / voter ID)',
      'Address proof',
      'Land records or a cultivation certificate',
      'Passport-size photograph',
      'Existing bank account details',
    ],
    applicationProcess:
      'Apply at a bank branch or the local PACS with the documents above. Many banks also accept applications through their website or the PM-KISAN portal’s KCC facility. The lender assesses the scale of finance for your crops and area and sanctions a limit.',
    officialSource: 'NABARD / Reserve Bank of India',
    officialUrl: 'https://www.nabard.org/',
    state: null,
  },
  {
    slug: 'pm-jan-dhan-yojana',
    title: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
    category: 'FINANCIAL_LITERACY',
    summary:
      'National financial-inclusion scheme to give every household a basic bank account with no minimum balance requirement, plus a RuPay debit card and basic insurance cover.',
    purpose:
      'To ensure access to a bank account, credit, insurance and pension for people who do not have a bank account.',
    targetUsers: ['General', 'Farmer', 'Cooperative member'],
    eligibility:
      'Any resident individual aged 10 years or above who does not already have a bank account can open a Basic Savings Bank Deposit Account. A minor’s account is operated by a guardian.',
    benefits:
      'A zero-balance Basic Savings Bank Deposit Account, a RuPay debit card, an accident insurance cover linked to the card, and an overdraft facility for eligible account holders after satisfactory operation of the account. ' +
      CONFIRM,
    requiredDocuments: [
      'Aadhaar card (or another officially valid document if Aadhaar is not available)',
      'One passport-size photograph',
      'If no officially valid document is available, a small-account can be opened with a self-attested photograph and signature/thumb impression',
    ],
    applicationProcess:
      'Visit any bank branch or a Bank Mitra (business correspondent) with the documents, fill the account-opening form, and complete KYC. The account and RuPay card are issued by the bank.',
    officialSource: 'Department of Financial Services, Ministry of Finance, Government of India',
    officialUrl: 'https://pmjdy.gov.in/',
    state: null,
  },
  {
    slug: 'pacs-computerisation',
    title: 'Computerisation of PACS',
    category: 'PACS_SERVICE',
    summary:
      'A Ministry of Cooperation programme to bring Primary Agricultural Credit Societies onto a common national software platform linked with the district and state cooperative banks.',
    purpose:
      'To make PACS more efficient, transparent and accountable, speed up loan processing, standardise accounting and audit, and enable PACS to offer more services to members.',
    targetUsers: ['Cooperative member', 'Farmer'],
    eligibility:
      'This is an institutional programme for functional PACS selected by the State Cooperative Bank and NABARD. Individual members benefit indirectly through faster service; there is no individual application.',
    benefits:
      'For members: quicker loan sanction and disbursement, digital passbooks and receipts, clearer records, and access to a wider set of services as PACS are enabled as multi-service centres. ' +
      CONFIRM,
    requiredDocuments: [
      'Not applicable for individuals — this is an institutional programme',
    ],
    applicationProcess:
      'Managed by the Ministry of Cooperation with NABARD, the State Cooperative Banks and the District Central Cooperative Banks. Members can ask their PACS whether it has been computerised and what new services are available.',
    officialSource: 'Ministry of Cooperation, Government of India',
    officialUrl: 'https://cooperation.gov.in/',
    state: null,
  },
];
