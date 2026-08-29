import type { KnowledgeCategory } from '@sahakar/shared';

/**
 * Seed knowledge base — plain-language summaries of well-established, publicly
 * documented facts about cooperatives, PACS, PMFBY, and financial basics, each
 * attributed to an official authority and source page.
 *
 * These are conservative overviews for the RAG assistant to ground on. They
 * deliberately avoid volatile specifics (exact premium rates, amounts,
 * deadlines, section numbers) — the assistant is instructed to send users to
 * the official source for those. Administrators replace/extend this in M7.
 */

export interface SeedDoc {
  title: string;
  category: KnowledgeCategory;
  authority: string;
  sourceUrl: string;
  language: 'en';
  text: string;
}

const VERIFIED_NOTE =
  'This is a plain-language summary for general guidance. Confirm current rules, amounts and dates on the official source.';

export const SEED_DOCS: SeedDoc[] = [
  {
    title: 'What is a PACS (Primary Agricultural Credit Society)',
    category: 'PACS_SERVICE',
    authority: 'NABARD / Ministry of Cooperation, Government of India',
    sourceUrl: 'https://www.nabard.org/',
    language: 'en',
    text: `A Primary Agricultural Credit Society, usually called a PACS, is a village-level cooperative society owned and controlled by its farmer members. It is the point where most rural cooperative credit reaches the farmer.

PACS are the base of a three-tier short-term cooperative credit structure. The PACS at the village level are affiliated to a District Central Cooperative Bank (DCCB) at the district level, and the DCCBs are affiliated to a State Cooperative Bank (StCB) at the state level.

Common services a PACS may provide to its members include short-term crop loans for cultivation, supply of farm inputs such as seed and fertiliser, acceptance of deposits, and sometimes storage, procurement and distribution of essential commodities. The exact services depend on the individual society and state.

To use PACS services a person normally has to become a member of that society by applying, meeting the eligibility in the society's by-laws, and buying a share. Membership and loan decisions are made by the society.

${VERIFIED_NOTE}`,
  },
  {
    title: 'Becoming a member of a cooperative society',
    category: 'MEMBER_SERVICE',
    authority: 'Model cooperative principles (ICA) and State Cooperative Societies Acts',
    sourceUrl: 'https://www.ica.coop/en/cooperatives/cooperative-identity',
    language: 'en',
    text: `Cooperative membership is voluntary and open. Any person who can use the services of the society and is willing to accept the responsibilities of membership can generally apply to join, without unfair discrimination on grounds of gender, social status, race, political affiliation or religion.

To become a member you usually: apply in writing to the society, meet the conditions in that society's registered by-laws (for example living or holding land in the society's area of operation), pay the entrance fee if any, and buy at least the minimum number of shares. The managing committee or general body admits members.

A member typically has the right to attend and vote at the general body meeting on the principle of one member, one vote, to stand for election to the committee, to use the society's services, and to receive information about the society's working and accounts. Members also have duties, such as following the by-laws, repaying loans on time, and participating in meetings.

If an application for membership is refused, the applicant can usually appeal to the authority named in the state cooperative law, such as the Registrar of Cooperative Societies.

${VERIFIED_NOTE}`,
  },
  {
    title: 'The seven cooperative principles',
    category: 'GOVERNANCE',
    authority: 'International Cooperative Alliance (ICA) — Statement on the Cooperative Identity',
    sourceUrl: 'https://www.ica.coop/en/cooperatives/cooperative-identity',
    language: 'en',
    text: `Cooperatives around the world, including in India, are guided by seven principles:

1. Voluntary and open membership — open to all who can use the services and accept the responsibilities of membership.
2. Democratic member control — members control the cooperative and elect its leaders; in a primary cooperative each member has one vote.
3. Member economic participation — members contribute to and democratically control the capital of the cooperative, and share in surplus.
4. Autonomy and independence — the cooperative is a self-help organisation controlled by its members.
5. Education, training and information — cooperatives provide education and training to members, elected representatives and staff.
6. Cooperation among cooperatives — cooperatives work together through local, national and international structures.
7. Concern for community — cooperatives work for the sustainable development of their communities.

These principles are the basis of cooperative governance: an elected managing committee, a general body of members that takes major decisions, regular meetings, and independent audit of accounts.

${VERIFIED_NOTE}`,
  },
  {
    title: 'The Ministry of Cooperation',
    category: 'MINISTRY_SCHEME',
    authority: 'Ministry of Cooperation, Government of India',
    sourceUrl: 'https://cooperation.gov.in/',
    language: 'en',
    text: `The Ministry of Cooperation is a separate central government ministry created in July 2021 to provide a dedicated administrative and policy framework for the cooperative movement in the country. Its stated vision is "Sahakar se Samriddhi" — prosperity through cooperation.

The Ministry works on strengthening cooperatives as people-based institutions, deepening cooperatives to the grassroots, and promoting cooperative-based economic activity. A major ongoing programme is the computerisation of Primary Agricultural Credit Societies (PACS) to bring them onto a common software platform linked with the district and state cooperative banks.

Cooperatives are also regulated at the state level. Each state has a Registrar of Cooperative Societies under its State Cooperative Societies Act, and societies operating in more than one state come under the Multi-State Cooperative Societies Act administered by the Central Registrar.

For details of specific schemes, application forms and current guidelines, use the Ministry's official website.

${VERIFIED_NOTE}`,
  },
  {
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) — overview',
    category: 'PMFBY_AGRICULTURE',
    authority: 'Ministry of Agriculture & Farmers Welfare, Government of India',
    sourceUrl: 'https://pmfby.gov.in/',
    language: 'en',
    text: `Pradhan Mantri Fasal Bima Yojana (PMFBY) is the Government of India's crop insurance scheme, launched in 2016. It provides insurance cover to farmers against the failure of a notified crop in a notified area due to non-preventable natural risks.

Key points that are generally true, but should be confirmed on the PMFBY portal for your state and season:
- The scheme covers notified crops only, in areas notified by the State Government for that season (Kharif or Rabi).
- Since the Kharif 2020 season the scheme is voluntary for all farmers, including those who have taken a crop loan.
- The farmer pays a fixed maximum share of the premium — a small percentage of the sum insured — and the government subsidises the rest. The exact farmer premium share depends on the crop and season.
- Enrolment can be done through banks, Common Service Centres (CSCs), authorised insurance intermediaries, or directly on the National Crop Insurance Portal.
- To claim for a localised loss (for example hailstorm or inundation affecting an individual field), the farmer generally has to report the loss quickly — commonly within 72 hours — through the crop insurance app, the insurance company, the bank, or the agriculture department.

Documents usually needed include proof of identity, land records or a tenancy/sowing declaration, a bank account, and sowing details. For the current cut-off dates, premium rates, notified crops and claim process, always check pmfby.gov.in or your nearest agriculture office.

${VERIFIED_NOTE}`,
  },
  {
    title: 'Reporting crop loss under PMFBY',
    category: 'PMFBY_AGRICULTURE',
    authority: 'Ministry of Agriculture & Farmers Welfare — PMFBY',
    sourceUrl: 'https://pmfby.gov.in/',
    language: 'en',
    text: `Under PMFBY, how a crop loss is assessed depends on the type of loss.

Widespread losses affecting a whole notified area are assessed mainly through crop cutting experiments and technology, and eligible farmers in that area are paid based on the shortfall in average yield. The individual farmer does not have to file a separate claim for this type of loss.

Individual or localised losses — such as hailstorm, landslide, inundation, cloudburst, or natural fire affecting specific fields — and post-harvest losses for a crop kept in the field for drying, are assessed on an individual basis. For these, the farmer generally must intimate the loss within about 72 hours of it happening.

Loss can usually be reported through the Crop Insurance mobile app, the toll-free number of the scheme, the concerned insurance company, the bank branch, or the local agriculture department office. After intimation, a surveyor is expected to assess the loss within a set number of days.

Keep a record of your intimation (date, time, reference number). Exact timelines, contact numbers and the claim process for your district are on the official PMFBY portal and with your agriculture office.

${VERIFIED_NOTE}`,
  },
  {
    title: 'Kisan Credit Card (KCC)',
    category: 'PACS_SERVICE',
    authority: 'NABARD / Reserve Bank of India',
    sourceUrl: 'https://www.nabard.org/',
    language: 'en',
    text: `The Kisan Credit Card (KCC) scheme provides farmers with timely, low-cost short-term credit for cultivation and other needs. It can be issued by commercial banks, regional rural banks, small finance banks and cooperative banks, including through Primary Agricultural Credit Societies (PACS).

A KCC is generally used for the costs of crop cultivation, post-harvest expenses, working capital for farm activities like dairy or fisheries, and a portion for the farmer's consumption needs. Credit is given as a running account — the farmer draws money when needed and repays after harvest.

Farmers who own land and cultivate it, tenant farmers, oral lessees and sharecroppers, and members of joint liability groups can generally apply, subject to the bank's rules. Applications are made to the bank branch or the PACS with identity proof, land records or a cultivation certificate, and a photograph.

Interest rates, credit limits and any interest subvention or prompt-repayment incentive change over time and are decided by the government and the bank. Check the current terms with your bank or PACS.

${VERIFIED_NOTE}`,
  },
  {
    title: 'Cooperative grievances and dispute resolution',
    category: 'GRIEVANCE_PROCESS',
    authority: 'State Cooperative Societies Acts / Registrar of Cooperative Societies',
    sourceUrl: 'https://cooperation.gov.in/',
    language: 'en',
    text: `If a member has a problem with a cooperative society — for example about membership, a loan, a deposit, an election, or the conduct of office-bearers — there are usually several steps.

First, raise the issue in writing with the society itself, addressed to the secretary or the managing committee, and keep a copy. Many societies are required to place member complaints before the committee.

If the society does not resolve it, most disputes touching the business of the society can be referred to the Registrar of Cooperative Societies (or an authority nominated by the Registrar, such as a cooperative arbitrator or cooperative court) under the relevant State Cooperative Societies Act. The Registrar's office also handles complaints about mismanagement and can order inquiry or audit.

For societies registered under the Multi-State Cooperative Societies Act, the Central Registrar of Cooperative Societies is the corresponding authority.

Complaints about the cooperative sector at the national level can also be sent to the Ministry of Cooperation. For consumer-type disputes, the ordinary consumer grievance forums may also be available.

The exact authority, format and time limit depend on your state's law. Confirm the correct office and procedure with the local office of the Registrar of Cooperative Societies.

${VERIFIED_NOTE}`,
  },
  {
    title: 'Financial basics: saving, interest and borrowing',
    category: 'FINANCIAL_LITERACY',
    authority: 'Reserve Bank of India — financial education material / National Centre for Financial Education',
    sourceUrl: 'https://www.rbi.org.in/financialeducation/home.aspx',
    language: 'en',
    text: `Saving means keeping aside a small part of your income regularly, before spending the rest. Even a small fixed amount saved every week or month adds up over a year and gives you a cushion for emergencies, seeds, school fees or medical needs.

Interest is the cost of money. When you keep money in a bank savings account or fixed deposit, the bank pays you interest. When you take a loan, you pay interest to the lender. "Simple interest" is charged only on the original amount; "compound interest" is charged on the original amount plus the interest already added, so a loan with compound interest grows faster if it is not repaid.

An EMI (Equated Monthly Instalment) is a fixed amount you pay every month to repay a loan, covering part of the principal and part of the interest. Before taking a loan, ask for the interest rate per year, the total amount you will repay, the EMI, and any processing fee or penalty.

Borrow from a registered bank, cooperative bank, PACS, or an RBI-registered microfinance institution. Avoid unregistered private moneylenders who charge very high interest and may not follow fair practices. A basic bank account can be opened under the Pradhan Mantri Jan Dhan Yojana with minimal documents.

Be alert to fraud: never share your bank OTP, PIN or card number with anyone, including callers who claim to be from a bank or the government. Banks never ask for these.

${VERIFIED_NOTE}`,
  },
  {
    title: 'Cooperative society by-laws',
    category: 'BYLAWS',
    authority: 'State Cooperative Societies Acts and Rules',
    sourceUrl: 'https://cooperation.gov.in/',
    language: 'en',
    text: `By-laws are the written rules of an individual cooperative society, registered along with the society. They work within the State Cooperative Societies Act and Rules and cannot go against them.

By-laws usually cover: the name and registered address of the society; its area of operation; its objects (what business it does); who can become a member and how; the rights and duties of members; share capital and fees; how the general body meeting and the managing committee work, including how elections are held and how often meetings must take place; how surplus is used; how accounts are kept and audited; and how the by-laws themselves can be amended.

A member has the right to get a copy of the by-laws from the society, usually on payment of a small fee. Changes to by-laws normally need approval by the general body and registration by the Registrar of Cooperative Societies before they take effect.

If you want to know a specific rule — for example the notice period for a general meeting, or the quorum for a valid meeting — check that society's registered by-laws and the state Act. The society secretary or the Registrar's office can help.

${VERIFIED_NOTE}`,
  },
];
