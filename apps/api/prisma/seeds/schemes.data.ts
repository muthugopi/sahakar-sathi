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
  {
    slug: 'pm-kisan-maandhan',
    title: 'Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)',
    category: 'MINISTRY_SCHEME',
    summary:
      'Voluntary, contributory pension scheme for small and marginal farmers that pays a fixed monthly pension after the age of 60.',
    purpose:
      'To give old-age income security to small and marginal farmers, who usually have no pension of their own.',
    targetUsers: ['Farmer', 'Cooperative member'],
    eligibility:
      'Small and marginal farmers who, as per land records, cultivate up to 2 hectares, and who are aged 18 to 40 at the time of joining. Farmers already covered by another statutory social-security scheme (such as EPFO, ESIC or the National Pension System) or by PM-SYM, income-tax payers, and institutional landholders are generally excluded.',
    benefits:
      'An assured monthly pension of ₹3,000 after the member turns 60, with a family pension of half that amount to the spouse on the member’s death. The Government contributes an equal matching amount to the pension fund during the contribution years. ' +
      CONFIRM,
    requiredDocuments: [
      'Aadhaar card',
      'Savings or Jan Dhan bank account passbook',
      'Land records showing the holding',
      'Mobile number',
    ],
    applicationProcess:
      'Enrol at a Common Service Centre with the Aadhaar card and bank passbook, or self-register on the maandhan portal. A monthly contribution (about ₹55 to ₹200 depending on the age at entry) is auto-debited from the bank account; a PM-KISAN beneficiary can choose to have it deducted from the PM-KISAN benefit. The fund is managed by LIC.',
    officialSource: 'Ministry of Agriculture & Farmers Welfare, Government of India',
    officialUrl: 'https://maandhan.in/',
    state: null,
  },
  {
    slug: 'pmjjby',
    title: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
    category: 'FINANCIAL_LITERACY',
    summary:
      'A low-cost one-year renewable term life-insurance cover that pays the nominee a lump sum if the member dies from any cause.',
    purpose:
      'To give affordable life-insurance protection to ordinary bank and post-office account holders.',
    targetUsers: ['General', 'Farmer', 'Cooperative member'],
    eligibility:
      'Individuals aged 18 to 50 who hold a savings bank or post-office account and give consent to auto-debit of the premium. Cover can continue up to age 55 if the member joined in time and keeps paying the premium. One person can be covered through only one account.',
    benefits:
      'A lump-sum payout to the nominee on the death of the member from any cause. A single small premium is auto-debited once a year (the amount is revised by the Government from time to time — confirm the current figure). ' +
      CONFIRM,
    requiredDocuments: [
      'Savings bank or post-office account',
      'Aadhaar (primary KYC)',
      'Nominee details',
      'Signed consent-cum-declaration form',
    ],
    applicationProcess:
      'Enrol through your bank or post office — at the branch, or through net-banking / the bank’s app — by giving the consent-cum-declaration. The premium is auto-debited once a year in the enrolment month. Fresh enrolments have a short waiting period before non-accidental death claims are payable. Keep the nominee informed so a claim can be filed quickly.',
    officialSource: 'Department of Financial Services, Ministry of Finance, Government of India',
    officialUrl: 'https://jansuraksha.gov.in/',
    state: null,
  },
  {
    slug: 'pmsby',
    title: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
    category: 'FINANCIAL_LITERACY',
    summary:
      'A very low-cost one-year renewable accident-insurance cover for accidental death and disability.',
    purpose:
      'To give affordable accident-insurance protection to ordinary bank and post-office account holders.',
    targetUsers: ['General', 'Farmer', 'Cooperative member'],
    eligibility:
      'Individuals aged 18 to 70 who hold a savings bank or post-office account and give consent to auto-debit of the premium. One person can be covered through only one account.',
    benefits:
      'A lump sum to the nominee on accidental death, the same amount to the member for total permanent disability, and a smaller amount for partial permanent disability. The annual premium is very small and is auto-debited once a year (confirm the current figure). ' +
      CONFIRM,
    requiredDocuments: [
      'Savings bank or post-office account',
      'Aadhaar (primary KYC)',
      'Nominee details',
      'Signed consent-cum-declaration form',
    ],
    applicationProcess:
      'Enrol through your bank or post office by giving the consent-cum-declaration; the premium is auto-debited once a year. For a claim, the nominee (or the member, for disability) reports to the bank with the FIR / post-mortem or the disability certificate as applicable, within the time the scheme allows.',
    officialSource: 'Department of Financial Services, Ministry of Finance, Government of India',
    officialUrl: 'https://jansuraksha.gov.in/',
    state: null,
  },
  {
    slug: 'atal-pension-yojana',
    title: 'Atal Pension Yojana (APY)',
    category: 'FINANCIAL_LITERACY',
    summary:
      'A guaranteed-pension scheme for workers in the unorganised sector, giving a fixed monthly pension from the age of 60.',
    purpose:
      'To help people without a formal pension build one through small regular contributions during their working years.',
    targetUsers: ['General', 'Farmer', 'Cooperative member'],
    eligibility:
      'Any citizen aged 18 to 40 with a savings bank or post-office account. Since 1 October 2022, anyone who is or has been an income-tax payer is not eligible to join.',
    benefits:
      'A guaranteed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000 or ₹5,000 from the age of 60, chosen at joining. The same pension continues to the spouse after the subscriber’s death, and the accumulated corpus is returned to the nominee. The monthly contribution depends on the age at joining and the pension chosen. ' +
      CONFIRM,
    requiredDocuments: [
      'Savings bank or post-office account',
      'Aadhaar card',
      'Mobile number',
      'Nominee details',
    ],
    applicationProcess:
      'Enrol through your bank or post office (branch or app) by filling the APY form and giving auto-debit consent. Contributions are auto-debited monthly, quarterly or half-yearly. You can increase or decrease the pension level once a year.',
    officialSource: 'Pension Fund Regulatory and Development Authority (PFRDA)',
    officialUrl: 'https://www.pfrda.org.in/',
    state: null,
  },
  {
    slug: 'interest-subvention-crop-loans',
    title: 'Interest Subvention on Short-Term Crop Loans (Modified Interest Subvention Scheme)',
    category: 'PACS_SERVICE',
    summary:
      'A government subsidy that makes short-term crop loans, including through the Kisan Credit Card, cheaper — and cheaper still for farmers who repay on time.',
    purpose:
      'To ensure farmers get adequate crop credit at an affordable interest rate and to reward prompt repayment.',
    targetUsers: ['Farmer', 'Tenant farmer', 'Sharecropper', 'Cooperative member'],
    eligibility:
      'Farmers who take short-term production credit through a Kisan Credit Card from a cooperative bank / PACS, a regional rural bank or a scheduled commercial bank, up to the loan limit notified by the Government. A separate sub-limit applies for KCC taken for animal husbandry and fisheries.',
    benefits:
      'The Government pays part of the interest to the lender so the farmer gets crop loans up to the notified limit at a concessional rate, and a further prompt-repayment incentive lowers the effective rate for farmers who repay by the due date. The exact rate, the loan-limit ceiling and the incentive are revised by the Government from year to year. ' +
      CONFIRM,
    requiredDocuments: [
      'Existing Kisan Credit Card / crop-loan account',
      'The documents required for the KCC itself (identity, land or cultivation proof)',
    ],
    applicationProcess:
      'There is no separate application — the benefit applies automatically when you take a crop loan through a KCC within the notified limit. Repay on or before the due date to also get the prompt-repayment incentive. Ask your bank or PACS whether the subvention and incentive apply for the current year.',
    officialSource: 'Reserve Bank of India / NABARD / Department of Agriculture & Farmers Welfare',
    officialUrl: 'https://www.nabard.org/',
    state: null,
  },
  {
    slug: 'pm-kusum',
    title: 'PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)',
    category: 'MINISTRY_SCHEME',
    summary:
      'Support for solar-powered irrigation — standalone solar pumps, solarising existing electric pumps, and small solar plants on unproductive land.',
    purpose:
      'To cut diesel use and power costs for irrigation, give farmers a reliable day-time water supply, and let them earn from surplus solar power.',
    targetUsers: ['Farmer', 'Cooperative member', 'FPO member'],
    eligibility:
      'Individual farmers, groups of farmers, panchayats, cooperatives, Farmer Producer Organisations and water-user associations, under the component and rules notified by your State. Land ownership or a long lease is usually required for the solar-plant component.',
    benefits:
      'Central and State subsidy on the cost of a solar pump or the solarisation of an existing pump, with the balance paid by the farmer or taken as a loan; and, under some components, income from selling surplus electricity to the distribution company. The subsidy share and the farmer’s share vary by State and component. ' +
      CONFIRM,
    requiredDocuments: [
      'Aadhaar card',
      'Bank account passbook',
      'Land records / lease document',
      'Existing electricity connection details (for solarising an electric pump)',
    ],
    applicationProcess:
      'Apply through your State’s nodal agency or electricity distribution company — most States have an online portal — when applications for the year open. After approval and payment of the farmer share, an empanelled vendor installs the system.',
    officialSource: 'Ministry of New & Renewable Energy, Government of India',
    officialUrl: 'https://pmkusum.mnre.gov.in/',
    state: null,
  },
  {
    slug: 'e-nam',
    title: 'National Agriculture Market (e-NAM)',
    category: 'MINISTRY_SCHEME',
    summary:
      'An online trading platform that links regulated wholesale markets (mandis) across the country so produce can be sold by transparent electronic auction.',
    purpose:
      'To give farmers access to more buyers and better price discovery than a single local market, with direct online payment.',
    targetUsers: ['Farmer', 'FPO member', 'Cooperative member'],
    eligibility:
      'Farmers, Farmer Producer Organisations, traders and commission agents registered with a mandi that is linked to e-NAM. Farmers register with Aadhaar / mobile and bank details.',
    benefits:
      'Exposure to buyers beyond the local mandi, transparent online bidding, quality assaying of the lot at the mandi, and payment made directly into the farmer’s bank account. Charges and the exact process depend on the State mandi rules. ' +
      CONFIRM,
    requiredDocuments: [
      'Aadhaar card',
      'Bank account passbook',
      'Mobile number',
      'Produce brought to a linked mandi for assaying',
    ],
    applicationProcess:
      'Register on the e-NAM portal or at the e-NAM help desk of a linked mandi with your ID and bank details. Bring the produce to the mandi, get it assayed, and it is put up for electronic auction; on sale, payment is transferred to your account.',
    officialSource: 'Ministry of Agriculture & Farmers Welfare / Small Farmers’ Agri-Business Consortium',
    officialUrl: 'https://enam.gov.in/',
    state: null,
  },
  {
    slug: 'fpo-formation-promotion',
    title: 'Formation and Promotion of Farmer Producer Organisations (10,000 FPOs)',
    category: 'MINISTRY_SCHEME',
    summary:
      'A central scheme that helps groups of farmers form new Farmer Producer Organisations and supports them with professional handholding for five years.',
    purpose:
      'To let small farmers gain from collective buying of inputs, aggregation of produce, better bargaining power and access to credit and markets.',
    targetUsers: ['Farmer', 'FPO member', 'Cooperative member', 'Woman'],
    eligibility:
      'Groups of farmers who come together to register an FPO as a producer company or a cooperative society. The minimum number of members differs for plains and for hilly / North-Eastern areas.',
    benefits:
      'Support for forming and running the FPO, a matching equity grant per FPO up to a ceiling, access to a dedicated credit-guarantee cover for loans to the FPO, and five years of handholding by a Cluster-Based Business Organisation covering training, book-keeping, licences and market linkage. ' +
      CONFIRM,
    requiredDocuments: [
      'Aadhaar and land records of the founding farmer-members',
      'A resolution / list of members willing to form the FPO',
      'A business plan for the FPO (prepared with the support agency)',
    ],
    applicationProcess:
      'FPOs are promoted through implementing agencies such as NABARD, NCDC and SFAC and their Cluster-Based Business Organisations. An interested farmer group approaches the nearest NABARD / NCDC office or an existing Cluster-Based Business Organisation, which guides the registration and the support that follows.',
    officialSource: 'Ministry of Agriculture & Farmers Welfare, Government of India',
    officialUrl: 'https://www.nabard.org/',
    state: null,
  },
  {
    slug: 'pmmsy',
    title: 'Pradhan Mantri Matsya Sampada Yojana (PMMSY)',
    category: 'MINISTRY_SCHEME',
    summary:
      'The flagship scheme for developing fisheries and aquaculture, with back-ended subsidy on approved units and support for fishers.',
    purpose:
      'To raise fish production and productivity, modernise the value chain, and improve the livelihoods and safety of fishers and fish farmers.',
    targetUsers: ['Fisher', 'Farmer', 'Cooperative member', 'Woman', 'Rural entrepreneur'],
    eligibility:
      'Fishers, fish farmers, fish workers and vendors, fisheries cooperative societies and federations, Fish Farmer Producer Organisations, self-help groups, and entrepreneurs, subject to the State project rules.',
    benefits:
      'A back-ended subsidy on approved units — new ponds, re-circulatory aquaculture, hatcheries, feed plants, cold chain, boats and nets, ornamental-fish units and more — with a higher subsidy share for members of Scheduled Castes / Scheduled Tribes and for women, and a lower share for the general category. Also includes accident insurance for enrolled fishers and a livelihood-support allowance during the fishing-ban / lean period. ' +
      CONFIRM,
    requiredDocuments: [
      'Aadhaar card',
      'Bank account passbook',
      'Ownership or lease document for the site / pond',
      'Caste certificate if claiming the higher subsidy share',
      'A detailed project report for larger units',
    ],
    applicationProcess:
      'Apply through your State / UT Fisheries Department (many States have an online portal) with a project proposal. The department appraises and sanctions it; the subsidy is released after the unit is set up and physically verified.',
    officialSource: 'Department of Fisheries, Ministry of Fisheries, Animal Husbandry & Dairying, Government of India',
    officialUrl: 'https://pmmsy.dof.gov.in/',
    state: null,
  },
  {
    slug: 'soil-health-card',
    title: 'Soil Health Card Scheme',
    category: 'MINISTRY_SCHEME',
    summary:
      'Free soil testing that gives each farmer a card showing the nutrient status of the soil and crop-wise fertiliser recommendations.',
    purpose:
      'To promote balanced, need-based use of fertiliser — lowering input cost and protecting soil health and yield over the long term.',
    targetUsers: ['Farmer', 'Cooperative member'],
    eligibility:
      'All farmers. There is no fee — soil samples are drawn from fields on a grid and tested at a soil-testing laboratory, and a card is issued for the holding.',
    benefits:
      'A soil health card with the levels of the main nutrients and important micro-nutrients, the soil pH and organic carbon, and specific recommendations on how much of each fertiliser and amendment to apply for your chosen crops. The card is refreshed on a testing cycle. ' +
      CONFIRM,
    requiredDocuments: [
      'Land / holding details',
      'Details of the crops usually grown',
    ],
    applicationProcess:
      'The agriculture department or the Krishi Vigyan Kendra collects soil samples in your area on a schedule; you can also request a test through the department or the KVK. Collect the card from the agriculture office, or download it from the Soil Health Card portal using your details.',
    officialSource: 'Department of Agriculture & Farmers Welfare, Government of India',
    officialUrl: 'https://soilhealth.dac.gov.in/',
    state: null,
  },
  {
    slug: 'agri-infrastructure-fund',
    title: 'Agriculture Infrastructure Fund (AIF)',
    category: 'MINISTRY_SCHEME',
    summary:
      'Medium- to long-term loans, with an interest subsidy and a credit guarantee, for post-harvest infrastructure and community farming assets.',
    purpose:
      'To build storage, processing and other infrastructure close to the farm so that farmers lose less produce and get a better price.',
    targetUsers: ['Farmer', 'FPO member', 'Cooperative member', 'Rural entrepreneur'],
    eligibility:
      'Primary Agricultural Credit Societies, marketing cooperative societies, Farmer Producer Organisations, self-help groups, joint liability groups, individual farmers, agri-entrepreneurs and start-ups, and certain public agencies. The asset must be for post-harvest management (warehouse, cold store, grading / sorting, primary processing) or a community farming asset.',
    benefits:
      'An interest subvention (commonly 3%) on loans up to a ceiling (commonly ₹2 crore per project) for several years, plus eligibility for a credit-guarantee cover. It can usually be combined with other central or State subsidies for the same project. ' +
      CONFIRM,
    requiredDocuments: [
      'Identity and address proof of the borrower / office-bearers',
      'A detailed project report',
      'Land / site documents',
      'Registration documents of the society, FPO or firm',
    ],
    applicationProcess:
      'Register the project on the Agri Infra Fund portal and choose a lending bank. Submit the project report; the bank appraises and sanctions the loan, and the interest subvention and guarantee are routed through it.',
    officialSource: 'Department of Agriculture & Farmers Welfare, Government of India',
    officialUrl: 'https://agriinfra.dac.gov.in/',
    state: null,
  },
  {
    slug: 'ncdc-assistance-to-cooperatives',
    title: 'NCDC Financial Assistance to Cooperatives',
    category: 'MEMBER_SERVICE',
    summary:
      'Loans and, in some programmes, subsidy from the National Cooperative Development Corporation to help cooperatives set up and expand activities.',
    purpose:
      'To strengthen cooperatives across agriculture, credit, storage, processing, dairy, fisheries and services so they can serve members better.',
    targetUsers: ['Cooperative member', 'Farmer', 'FPO member', 'Youth'],
    eligibility:
      'Cooperative societies at every level — primary, district, State and national federations — and, in some programmes, Farmer Producer Organisations. Individual members benefit through their society; there is no individual application.',
    benefits:
      'Term loans, working capital and in some cases margin money / subsidy for agricultural credit, storage and cold chain, processing, marketing, dairy, fisheries, handloom, weaker-section programmes, and services such as hospitals and education run by cooperatives. Dedicated windows include Yuva Sahakar for new cooperatives of young members and the Sahakar Mitra internship scheme. ' +
      CONFIRM,
    requiredDocuments: [
      'Not applicable for individuals — this is an institutional programme',
      'For the society: registration and by-laws, audited accounts, a project report, and the required State Government recommendation',
    ],
    applicationProcess:
      'The society prepares a scheme or project and applies to NCDC directly or through the State Government / State Cooperative Bank, as the programme requires. NCDC appraises and sanctions the assistance. Members can ask their society whether it has taken or plans NCDC assistance.',
    officialSource: 'National Cooperative Development Corporation, Ministry of Cooperation',
    officialUrl: 'https://www.ncdc.in/',
    state: null,
  },
  {
    slug: 'rwbcis',
    title: 'Restructured Weather Based Crop Insurance Scheme (RWBCIS)',
    category: 'PMFBY_AGRICULTURE',
    summary:
      'Crop insurance that pays out when recorded weather crosses pre-set damaging levels, without needing a field-by-field loss assessment.',
    purpose:
      'To give farmers a faster, more predictable payout for weather-driven crop loss, as an alternative to yield-based insurance for chosen crops and areas.',
    targetUsers: ['Farmer', 'Sharecropper', 'Tenant farmer'],
    eligibility:
      'Farmers growing crops notified under RWBCIS in notified areas for the season. For a given crop and area the State chooses either PMFBY or RWBCIS. Voluntary for all farmers since Kharif 2020.',
    benefits:
      'An automatic payout based on the weather recorded at a reference weather station — rainfall, temperature, humidity or wind — measured against the "term sheet" for the crop. The farmer pays the same capped premium share as under PMFBY and the government subsidises the rest. Because the payout follows the weather data and not your own field, it may not exactly match your actual loss. ' +
      CONFIRM,
    requiredDocuments: [
      'Aadhaar card',
      'Bank account passbook',
      'Land records or a tenancy / sowing declaration',
      'Sowing certificate or self-declaration where required',
    ],
    applicationProcess:
      'Enrol before the season cut-off date through a bank, a Common Service Centre, an authorised insurance intermediary or the National Crop Insurance Portal — the same routes as PMFBY. Keep the enrolment receipt / policy reference. Payouts are triggered by the weather data, so there is usually no individual loss report to file.',
    officialSource: 'Ministry of Agriculture & Farmers Welfare, Government of India',
    officialUrl: 'https://pmfby.gov.in/',
    state: null,
  },
  {
    slug: 'paramparagat-krishi-vikas-yojana',
    title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    category: 'MINISTRY_SCHEME',
    summary:
      'Support for farmers to shift to organic farming through a cluster approach and low-cost Participatory Guarantee System certification.',
    purpose:
      'To lower dependence on chemical inputs, improve soil health, and help farmers get a premium for certified organic produce.',
    targetUsers: ['Farmer', 'Cooperative member', 'FPO member'],
    eligibility:
      'Groups of farmers who form a cluster (commonly around 20 hectares / 20 farmers) and commit to farming organically for at least three years. Assistance is per farmer per hectare, up to a ceiling.',
    benefits:
      'Financial assistance for the conversion to organic practices, on-farm and off-farm organic inputs, Participatory Guarantee System certification, and support for packaging, branding and marketing, along with handholding for the cluster. ' +
      CONFIRM,
    requiredDocuments: [
      'Aadhaar and land records of each cluster member',
      'A cluster / local-group formation record',
      'Bank account details',
    ],
    applicationProcess:
      'Farmer groups register a cluster and a local group through the State agriculture department or a regional council under the National Centre for Organic and Natural Farming, which guides the certification and releases the assistance in instalments.',
    officialSource: 'Department of Agriculture & Farmers Welfare, Government of India',
    officialUrl: 'https://pgsindia-ncof.gov.in/',
    state: null,
  },
];
