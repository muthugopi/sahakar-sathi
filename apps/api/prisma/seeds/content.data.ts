import type { ContentSectionCode } from '@sahakar/shared';

export interface SeedTopic {
  section: ContentSectionCode;
  slug: string;
  topic: string;
  title: string;
  summary: string;
  simpleExplanation: string;
  detailedExplanation?: string;
  example?: string;
  authority: string;
  sourceUrl?: string;
  order: number;
}

const COOP_AUTHORITY = 'State Cooperative Societies Acts & Rules / ICA cooperative principles';
const COOP_URL = 'https://cooperation.gov.in/';
const RBI_URL = 'https://www.rbi.org.in/financialeducation/home.aspx';
const PMFBY_URL = 'https://pmfby.gov.in/';
const NABARD_URL = 'https://www.nabard.org/';

const STATE_NOTE =
  '\n\n_Cooperative law is a State subject. The exact rule, notice period, quorum or time limit is set by your State Cooperative Societies Act and Rules and by the society’s registered by-laws. Check with the society or the local office of the Registrar of Cooperative Societies._';

export const SEED_TOPICS: SeedTopic[] = [
  /* ---------------------------------------------------------------- */
  /*  COOPERATIVE LAW & GOVERNANCE                                     */
  /* ---------------------------------------------------------------- */
  {
    section: 'COOPERATIVE_LAW',
    slug: 'coop-what-is-a-cooperative-society',
    topic: 'The cooperative society',
    title: 'What is a cooperative society?',
    summary:
      'A member-owned, member-run organisation that people form to meet a common economic need together.',
    simpleExplanation:
      'A cooperative society is a group of people who come together, put in a small share of money each, and run an organisation **together** to serve their shared need — for example getting crop loans, buying seed and fertiliser, selling milk, or storing grain.\n\nThe people who use the society are the people who own it. It is not owned by an outside businessman or by the government. Every member has an equal say — **one member, one vote** — no matter how many shares they hold.\n\nThe society is registered with the Registrar of Cooperative Societies and works within the State Cooperative Societies Act.',
    detailedExplanation:
      'A cooperative society is a body registered under the relevant State Cooperative Societies Act (or the Multi-State Cooperative Societies Act where it operates in more than one state). On registration it becomes a body corporate with perpetual succession, a common seal, and the power to hold property, enter contracts and sue or be sued in its own name.\n\nIt is distinguished from a company by the cooperative principles: open and voluntary membership, democratic member control (one member one vote in a primary society), member economic participation, autonomy, education and training, cooperation among cooperatives, and concern for community. Surplus is used for the development of the society and the benefit of members in proportion to their use of its services, not distributed as profit on capital.' +
      STATE_NOTE,
    authority: COOP_AUTHORITY,
    sourceUrl: COOP_URL,
    order: 1,
  },
  {
    section: 'COOPERATIVE_LAW',
    slug: 'coop-membership',
    topic: 'Membership',
    title: 'Becoming and staying a member',
    summary: 'Who can join, how to join, and how membership can end.',
    simpleExplanation:
      'Membership is **open and voluntary**. If you can use the society’s services and you live or hold land in its area, you can usually apply.\n\nTo join you normally:\n- apply in writing to the society\n- meet the conditions in the society’s by-laws\n- pay the entrance fee, if any\n- buy at least the minimum number of shares\n\nThe managing committee decides on your application. If it is refused, you can appeal to the Registrar of Cooperative Societies.\n\nMembership can end if you resign, transfer all your shares, stop being eligible, or are removed for a reason allowed by the by-laws (such as long default or acting against the society).',
    detailedExplanation:
      'The Act and Rules set out classes of membership (ordinary, nominal/associate), the conditions for admission, the maximum time within which the committee must decide an application, and the member’s right of appeal against refusal or expulsion. A nominal or associate member usually cannot vote or stand for election.\n\nCessation of membership, expulsion (which generally requires a resolution passed by a special majority in general meeting and, in many states, approval of the Registrar), and the consequences for shares and liabilities are governed by the Act and by-laws.' +
      STATE_NOTE,
    authority: COOP_AUTHORITY,
    sourceUrl: COOP_URL,
    order: 2,
  },
  {
    section: 'COOPERATIVE_LAW',
    slug: 'coop-member-rights',
    topic: 'Rights',
    title: 'Your rights as a member',
    summary: 'What you are entitled to do and to know as a member.',
    simpleExplanation:
      'As a member you generally have the right to:\n- **attend and vote** at the general body meeting — one member, one vote\n- **stand for election** to the managing committee\n- **use the services** of the society\n- **get information**: a copy of the by-laws, the list of members, the audited accounts, and the minutes of general meetings, usually on payment of a small fee\n- **share in the surplus** as decided by the general body\n- **appeal** to the Registrar if you are wrongly refused membership or a service, or wrongly expelled',
    detailedExplanation:
      'Statutory rights typically include inspection of specified books and documents at the society’s office during office hours, obtaining copies on payment of fees, receiving notice of general meetings, and moving resolutions subject to the by-laws. Voting rights may be suspended for members in default beyond a period fixed by the Act or by-laws. Remedies for denial of rights lie with the Registrar and, on further appeal, the Cooperative Tribunal / Court.' +
      STATE_NOTE,
    authority: COOP_AUTHORITY,
    sourceUrl: COOP_URL,
    order: 3,
  },
  {
    section: 'COOPERATIVE_LAW',
    slug: 'coop-member-duties',
    topic: 'Duties',
    title: 'Your duties as a member',
    summary: 'What the society expects from every member.',
    simpleExplanation:
      'Being a member is not only rights — it comes with duties:\n- follow the **by-laws** and the decisions of the general body\n- **repay loans on time** and keep your dues clear\n- **use the society’s services** genuinely (for example, actually route your produce or purchases through it)\n- **take part in meetings** and elections\n- give correct information to the society and update it when your details change\n- do nothing that harms the society or other members\n\nMembers who stay in long default can lose their vote or their membership.',
    authority: COOP_AUTHORITY,
    sourceUrl: COOP_URL,
    order: 4,
  },
  {
    section: 'COOPERATIVE_LAW',
    slug: 'coop-governance-general-body-and-committee',
    topic: 'Governance',
    title: 'How a society is run: general body and managing committee',
    summary: 'The two decision-making bodies and what each one does.',
    simpleExplanation:
      'A cooperative has two main bodies:\n\n**The general body** — all the members together. It is the highest authority. It approves the accounts and budget, elects the managing committee, amends the by-laws, and takes major decisions. It usually must meet at least once a year (the Annual General Meeting).\n\n**The managing committee** (also called the board) — a small group **elected by the members**. It runs the day-to-day work within the powers given by the by-laws and the general body: admitting members, sanctioning loans, appointing staff, and reporting back to the general body.\n\nThe accounts must be **audited** every year by an auditor approved for cooperatives.',
    detailedExplanation:
      'The Act fixes the term of the committee (commonly five years), the maximum period by which elections must be held before the term expires, reservation of seats (for women, Scheduled Castes / Scheduled Tribes, and sometimes weaker sections) as prescribed, and the grounds and procedure for supersession of a committee by the Registrar. It also mandates timely audit, placement of the audit report before the general body, and action on audit objections. Many states now have a State Cooperative Election Authority that conducts committee elections.' +
      STATE_NOTE,
    authority: COOP_AUTHORITY,
    sourceUrl: COOP_URL,
    order: 5,
  },
  {
    section: 'COOPERATIVE_LAW',
    slug: 'coop-elections-and-voting',
    topic: 'Elections',
    title: 'Elections and voting',
    summary: 'How the managing committee is chosen.',
    simpleExplanation:
      'The managing committee is **elected by the members** in a general meeting or a separate election, by secret ballot or show of hands as the rules provide.\n\nKey points that are generally true:\n- one member, one vote — shares do not give extra votes in a primary society\n- a member in long default may not be allowed to vote or contest\n- some seats are **reserved** — for women, and for Scheduled Castes / Scheduled Tribes — as laid down by the Act\n- the committee has a fixed term (often five years) and elections must be held before it ends\n- in many states an independent **State Cooperative Election Authority** now conducts these elections\n\nDisputes about an election go to the authority named in the state law, not to the ordinary civil court.',
    detailedExplanation:
      'The 97th Constitutional Amendment and the corresponding state amendments require timely, free and fair elections to cooperative boards, a fixed board term, and independent conduct of elections. The Act and election rules cover the electoral roll, nominations, scrutiny, voting, counting, declaration of results, and the exclusive forum and limitation period for election petitions.' +
      STATE_NOTE,
    authority: COOP_AUTHORITY,
    sourceUrl: COOP_URL,
    order: 6,
  },
  {
    section: 'COOPERATIVE_LAW',
    slug: 'coop-meetings-and-quorum',
    topic: 'Meetings',
    title: 'Meetings, notice and quorum',
    summary: 'When meetings must be held and what makes them valid.',
    simpleExplanation:
      'The general body must meet at least once a year — the **Annual General Meeting** — to approve the accounts and budget and to consider the audit report. A **special general meeting** can be called by the committee, by the Registrar, or on the written request of the number of members fixed by the by-laws.\n\nFor a meeting to be valid:\n- proper **notice** must be given to members in advance (the by-laws set how many days and how)\n- a minimum number of members must be present — the **quorum**\n- if there is no quorum, the meeting is adjourned and the adjourned meeting may proceed with whoever is present, as the by-laws allow',
    detailedExplanation:
      'The Act and by-laws prescribe the mode and period of notice, the business that must be transacted at the AGM, the quorum for ordinary and adjourned meetings, the majority required for ordinary resolutions and for special business (by-law amendment, expulsion, amalgamation, division), and the requirement to record and preserve minutes. Failure to hold the AGM within the prescribed period can attract action against the committee.' +
      STATE_NOTE,
    authority: COOP_AUTHORITY,
    sourceUrl: COOP_URL,
    order: 7,
  },
  {
    section: 'COOPERATIVE_LAW',
    slug: 'coop-bylaws',
    topic: 'By-laws',
    title: 'By-laws: the society’s own rulebook',
    summary: 'What by-laws contain and how they are changed.',
    simpleExplanation:
      'By-laws are the **written rules of your particular society**, registered along with it. They work within the State Act — they cannot go against it.\n\nBy-laws usually cover: the society’s name and area, what business it does, who can be a member, members’ rights and duties, shares and fees, how meetings and elections work, how surplus is used, and how the accounts are audited.\n\nYou can ask the society for a copy of the by-laws, usually for a small fee. To change a by-law, the **general body must approve** the change and the **Registrar must register** it before it takes effect.',
    detailedExplanation:
      'A by-law amendment requires a resolution passed by the majority prescribed by the Act (often two-thirds of members present and voting at a general meeting), followed by application to the Registrar for registration. The Registrar may register, refuse (with reasons), or suggest modifications. An amendment takes effect only from the date of registration. Certain model by-laws are issued by the Registrar / federal society.' +
      STATE_NOTE,
    authority: COOP_AUTHORITY,
    sourceUrl: COOP_URL,
    order: 8,
  },
  {
    section: 'COOPERATIVE_LAW',
    slug: 'coop-dispute-resolution',
    topic: 'Disputes',
    title: 'Disputes and how they are settled',
    summary: 'Where to take a dispute touching the business of a society.',
    simpleExplanation:
      'Most disputes **touching the business of a society** — between a member and the society, between members, or between the society and its committee or an officer — are **not** taken to the ordinary civil court.\n\nThey go to the **Registrar of Cooperative Societies** or to an authority the Registrar nominates (a cooperative arbitrator, a cooperative court, or a nominee). The Registrar can also order an inquiry or audit into the society’s working on a complaint.\n\nSteps:\n1. Raise the issue in writing with the society first and keep a copy.\n2. If it is not resolved, file a dispute / complaint with the Registrar’s office in the form and within the time the state law requires.\n3. Appeals from that decision go to the Cooperative Tribunal / Court named in the Act.',
    detailedExplanation:
      'The Act defines which matters are "disputes" for compulsory reference (usually excluding pure service disputes of employees in some states), the limitation period, the powers of the deciding authority (to summon witnesses, award costs, grant interim relief), execution of awards as decrees, and the appellate forum. Complaints of misappropriation or mismanagement can lead to an inquiry, surcharge proceedings against office-bearers, or supersession of the committee.' +
      STATE_NOTE,
    authority: COOP_AUTHORITY,
    sourceUrl: COOP_URL,
    order: 9,
  },

  /* ---------------------------------------------------------------- */
  /*  PACS SERVICES                                                   */
  /* ---------------------------------------------------------------- */
  {
    section: 'PACS',
    slug: 'pacs-membership',
    topic: 'Membership',
    title: 'Joining a PACS',
    summary: 'How to become a member of your village Primary Agricultural Credit Society.',
    simpleExplanation:
      'A **PACS** is your village-level cooperative credit society. To use its services you first become a member.\n\nUsually you:\n- apply to the PACS in your area of residence or landholding\n- give identity and land documents\n- buy the minimum shares fixed by the by-laws\n- pay the entrance fee, if any\n\nThe managing committee admits you. Once a member, you can apply for crop loans, keep deposits, and buy inputs through the society, and you get one vote in its general body.',
    authority: 'NABARD / State Cooperative Societies Acts',
    sourceUrl: NABARD_URL,
    order: 1,
  },
  {
    section: 'PACS',
    slug: 'pacs-crop-loans',
    topic: 'Agricultural credit',
    title: 'Short-term crop loans through a PACS',
    summary: 'How PACS crop loans and the Kisan Credit Card work.',
    simpleExplanation:
      'The main job of a PACS is **short-term credit for cultivation** — money to buy seed, fertiliser, and to meet other crop costs, repaid after harvest.\n\nThe PACS assesses how much credit your crop and land need (the "scale of finance"), sanctions a limit, and disburses it — often through a **Kisan Credit Card** account. Crop loans up to the government-notified limit usually carry concessional interest, and paying on time can earn a further rebate.\n\nApply at the PACS with your membership number, land records and identity documents. Ask for the interest rate, the repayment date, and whether an interest subvention applies this year.',
    detailedExplanation:
      'PACS refinance their lending through the District Central Cooperative Bank and the State Cooperative Bank, with NABARD refinance support. Loan eligibility, the scale of finance, security (usually hypothecation of crops and sometimes a charge on land), the interest subvention and prompt-repayment incentive, and the treatment of overdues and rescheduling in the event of a natural calamity are governed by RBI / NABARD circulars and state cooperative policy, which change from year to year.',
    authority: 'NABARD / Reserve Bank of India',
    sourceUrl: NABARD_URL,
    order: 2,
  },
  {
    section: 'PACS',
    slug: 'pacs-deposits',
    topic: 'Deposits',
    title: 'Keeping deposits with a PACS',
    summary: 'Savings and fixed deposits at the society.',
    simpleExplanation:
      'Many PACS accept **deposits** from members — a savings account, a recurring deposit where you put in a fixed sum every month, or a fixed deposit for a set period that earns more interest.\n\nAsk your PACS what deposit products it offers, the interest rate, and the rules for withdrawal. Keep your passbook or deposit receipt safe, and check that entries are made correctly.\n\nDeposit safety depends on the financial health of the society and the cooperative banking structure above it — this is not the same protection as a commercial bank, so ask about it before placing a large amount.',
    authority: 'NABARD / State Cooperative Societies Acts',
    sourceUrl: NABARD_URL,
    order: 3,
  },
  {
    section: 'PACS',
    slug: 'pacs-input-supply',
    topic: 'Input services',
    title: 'Buying seed, fertiliser and other inputs',
    summary: 'Getting farm inputs through the society.',
    simpleExplanation:
      'A PACS often runs a small **input outlet** — selling certified seed, fertiliser, and sometimes pesticides and farm implements to members, frequently linked to the crop loan so you do not need cash upfront.\n\nBuying through the PACS can mean fair prices, genuine stock, and a proper receipt. Always take the bill, check the batch and expiry on fertiliser and pesticide packs, and keep the receipt in case you need it for an insurance or subsidy claim.',
    authority: 'Ministry of Cooperation / NABARD',
    sourceUrl: 'https://cooperation.gov.in/',
    order: 4,
  },
  {
    section: 'PACS',
    slug: 'pacs-procurement-and-storage',
    topic: 'Procurement & storage',
    title: 'Selling produce and storing grain',
    summary: 'Procurement, godown and storage services.',
    simpleExplanation:
      'Some PACS act as a **procurement point** — buying paddy, wheat or other produce from members at the notified support price on behalf of a government agency — and run a **godown** where members can store grain safely instead of selling immediately at a low price.\n\nAsk your PACS whether it does procurement this season, what quality norms and documents are needed, and whether storage or a pledge loan against stored grain is available.',
    authority: 'Ministry of Cooperation / NABARD',
    sourceUrl: 'https://cooperation.gov.in/',
    order: 5,
  },
  {
    section: 'PACS',
    slug: 'pacs-new-services',
    topic: 'New services',
    title: 'PACS as multi-service centres',
    summary: 'Wider services as PACS are computerised and diversified.',
    simpleExplanation:
      'As PACS are **computerised** and brought onto a common platform, many are being enabled to offer more services to villages — for example acting as a Common Service Centre for government applications, running a fair-price shop, a fuel or gas outlet, a generic-medicine (Jan Aushadhi) counter, or providing water and micro-irrigation services.\n\nWhat your PACS offers depends on your state and your society. Ask your PACS secretary which of these have started in your village.',
    authority: 'Ministry of Cooperation, Government of India',
    sourceUrl: 'https://cooperation.gov.in/',
    order: 6,
  },

  /* ---------------------------------------------------------------- */
  /*  FINANCIAL LITERACY                                              */
  /* ---------------------------------------------------------------- */
  {
    section: 'FINANCIAL_LITERACY',
    slug: 'money-saving-regularly',
    topic: 'Saving',
    title: 'Saving a little, regularly',
    summary: 'Why small regular savings matter more than the amount.',
    simpleExplanation:
      'Saving means keeping aside a **small part of your income first**, and spending what is left — not the other way around.\n\nThe habit matters more than the amount. Even a fixed small sum every week builds a cushion for seed, school fees, a medical need, or a bad season, so you do not have to borrow at high interest in an emergency.\n\nKeep savings where they are safe and separate from daily cash — a bank or PACS account, a recurring deposit, or a fixed deposit. Avoid keeping large cash at home.',
    example:
      'A farmer sells vegetables twice a week. She decides to put ₹100 into a recurring deposit every market day, before buying anything. In a year that is about ₹10,400 plus interest — enough to buy the next season’s seed without a loan.',
    authority: 'Reserve Bank of India — financial education',
    sourceUrl: RBI_URL,
    order: 1,
  },
  {
    section: 'FINANCIAL_LITERACY',
    slug: 'money-interest-simple-and-compound',
    topic: 'Interest',
    title: 'How interest works',
    summary: 'Simple interest, compound interest, and why it matters for loans.',
    simpleExplanation:
      'Interest is the **price of money over time**. If you keep money in a deposit, the bank pays you interest. If you take a loan, you pay interest.\n\n**Simple interest** is charged only on the original amount.\n**Compound interest** is charged on the original amount *plus* the interest already added — so an unpaid loan grows faster and faster.\n\nWhen borrowing, always ask: what is the interest **rate per year**, is it simple or compound, and what is the **total amount** I will repay by the end?',
    example:
      'A ₹10,000 loan at 2% per month. As simple interest that is ₹200 a month — ₹2,400 in a year. If it compounds monthly and nothing is repaid, the amount owed after a year is over ₹12,680, and it keeps growing. Paying on time is what keeps a loan cheap.',
    authority: 'Reserve Bank of India — financial education',
    sourceUrl: RBI_URL,
    order: 2,
  },
  {
    section: 'FINANCIAL_LITERACY',
    slug: 'money-loans-and-emi',
    topic: 'Loans & EMI',
    title: 'Understanding a loan and its EMI',
    summary: 'What to check before you sign for any loan.',
    simpleExplanation:
      'An **EMI** (Equated Monthly Instalment) is the fixed amount you pay every month to repay a loan. Each EMI pays a part of the borrowed amount (principal) and a part of the interest.\n\nBefore taking any loan, ask for and write down:\n- the **interest rate per year**\n- the **EMI amount** and how many months\n- the **total** you will repay (principal + all interest + fees)\n- the **processing fee** and any penalty for late or early payment\n- whether the rate can change later\n\nBorrow only what you can repay from expected income, and keep the sanction letter and repayment schedule.',
    example:
      'A dairy farmer is offered ₹60,000 for a buffalo. Lender A: 12% per year, ₹5,000 EMI for 13 months, total about ₹64,900. Lender B (a private financier): "just ₹3,000 a month" but for 30 months — total ₹90,000. Same loan, ₹25,000 difference. Always compare the total, not the monthly figure.',
    authority: 'Reserve Bank of India — financial education',
    sourceUrl: RBI_URL,
    order: 3,
  },
  {
    section: 'FINANCIAL_LITERACY',
    slug: 'money-choosing-a-lender',
    topic: 'Credit',
    title: 'Choosing where to borrow',
    summary: 'Registered lenders vs unregistered moneylenders.',
    simpleExplanation:
      'Borrow from a **registered institution**: a bank, a cooperative bank, your PACS, or an RBI-registered microfinance institution or NBFC. They must tell you the rate clearly, give you a proper agreement and receipts, and follow fair recovery practices.\n\nAvoid **unregistered private moneylenders**. They often charge very high interest, add hidden charges, take blank signed papers or land documents as "security", and use pressure to recover. If you are already caught in such a loan, speak to your bank, PACS, or the district administration about options.',
    example:
      'Before the season, a trader offers an "advance" against the standing crop at what turns out to be 5% per month, and insists the crop be sold only to him at his price. The same farmer’s PACS crop loan would have been a fraction of that cost. The cheap-looking advance was the expensive option.',
    authority: 'Reserve Bank of India — financial education',
    sourceUrl: RBI_URL,
    order: 4,
  },
  {
    section: 'FINANCIAL_LITERACY',
    slug: 'money-bank-account-basics',
    topic: 'Basic banking',
    title: 'Using a bank account well',
    summary: 'Opening an account, and keeping it safe.',
    simpleExplanation:
      'A basic bank account can be opened with minimal documents under the **Jan Dhan** scheme, with no minimum balance.\n\nGood habits:\n- keep your **passbook updated** and check entries\n- link your account to **Aadhaar** so you receive scheme money (DBT) directly\n- keep your **PIN, OTP and card number secret** — never tell them to anyone, including callers who say they are from the bank or the government\n- use the **Bank Mitra** (business correspondent) in your village for deposits and withdrawals if the branch is far\n- register your **mobile number** so you get SMS for every transaction',
    example:
      'A farmer gets a call: "Your account will be blocked, tell me the OTP to keep it active." A bank never asks for an OTP. He hangs up and calls the branch number printed in his passbook. Nothing was wrong — the call was a fraud attempt.',
    authority: 'Reserve Bank of India / Department of Financial Services',
    sourceUrl: RBI_URL,
    order: 5,
  },
  {
    section: 'FINANCIAL_LITERACY',
    slug: 'money-insurance-basics',
    topic: 'Insurance',
    title: 'Insurance in simple terms',
    summary: 'Paying a small amount to protect against a big loss.',
    simpleExplanation:
      'Insurance means **many people each pay a small amount (the premium)**, and the pool pays out to the few who suffer a covered loss. You are buying protection, not a return.\n\nCommon covers for a rural household:\n- **crop insurance** (PMFBY) against crop failure\n- **life cover** and **accident cover** — some are very low cost and linked to a bank account\n- **livestock insurance** for cattle bought on loan\n\nBefore buying, ask: what exactly is covered, what is **not** covered, how do I make a claim, and by when. Keep the policy paper and premium receipt.',
    authority: 'Reserve Bank of India / IRDAI consumer education',
    sourceUrl: RBI_URL,
    order: 6,
  },
  {
    section: 'FINANCIAL_LITERACY',
    slug: 'money-budgeting-farm-household',
    topic: 'Budgeting',
    title: 'A simple plan for a farm household',
    summary: 'Matching lumpy farm income to steady household needs.',
    simpleExplanation:
      'Farm income comes in **lumps** — a big amount at harvest, little in between. Household needs are **steady** — food, school, health, every month.\n\nA simple plan at harvest:\n1. **Set aside** next season’s input cost and loan repayment **first**.\n2. Keep an **emergency fund** — a few months of household expenses.\n3. Put the rest where it is safe (deposit), and draw a fixed monthly amount for the household.\n\nWrite down what you expect to spend on the crop and the house for the year. Checking actual against the plan each month shows problems early.',
    example:
      'After selling paddy, a household receives ₹1,20,000. They first move ₹45,000 (next crop + loan EMI) and ₹20,000 (emergency) into deposits, then live on ₹55,000 over the lean months. The following season they do not need a high-interest advance.',
    authority: 'Reserve Bank of India — financial education',
    sourceUrl: RBI_URL,
    order: 7,
  },
  {
    section: 'FINANCIAL_LITERACY',
    slug: 'money-avoiding-fraud',
    topic: 'Avoiding fraud',
    title: 'Spotting and avoiding financial fraud',
    summary: 'Common tricks and how to stay safe.',
    simpleExplanation:
      'Warning signs of a scam:\n- someone asks for your **OTP, PIN, card number or UPI PIN** — no genuine bank or officer ever needs these\n- a call or message says you must **pay a fee to receive** a scheme benefit, loan, prize or subsidy\n- **"guaranteed high returns"** on a deposit or a chit — real investments cannot guarantee that\n- pressure to **act immediately** or your account/benefit will be lost\n- a link asking you to "verify" your bank details\n\nWhat to do: stop, do not share anything, and call the official number in your passbook or on the scheme’s real website. Report bank fraud to your bank at once and to the national cyber-crime helpline **1930**.',
    authority: 'Reserve Bank of India / Ministry of Home Affairs (cyber-crime)',
    sourceUrl: RBI_URL,
    order: 8,
  },

  /* ---------------------------------------------------------------- */
  /*  PMFBY FAQ                                                       */
  /* ---------------------------------------------------------------- */
  {
    section: 'PMFBY',
    slug: 'pmfby-am-i-eligible',
    topic: 'Eligibility',
    title: 'Am I eligible for PMFBY?',
    summary: 'Who can enrol for crop insurance.',
    simpleExplanation:
      'You can generally enrol if:\n- you are growing a **notified crop** in a **notified area** for that season, and\n- you can show you are cultivating that land — as an owner (land records) or as a **tenant / sharecropper** with the documents your state accepts.\n\nSince Kharif 2020 the scheme is **voluntary for everyone**, including farmers who have taken a crop loan. Check the notified crops and areas for your district and season on the PMFBY portal before the cut-off date.',
    authority: 'Ministry of Agriculture & Farmers Welfare — PMFBY',
    sourceUrl: PMFBY_URL,
    order: 1,
  },
  {
    section: 'PMFBY',
    slug: 'pmfby-what-is-the-premium',
    topic: 'Premium',
    title: 'How much premium do I pay?',
    summary: 'The farmer pays a capped share; the government pays the rest.',
    simpleExplanation:
      'You pay only a **capped share** of the premium — a small percentage of the sum insured. The rest is paid as subsidy by the central and state governments.\n\nThe exact farmer share depends on the **crop and the season**, and the sum insured depends on the crop and area. The portal shows the premium for your crop when you enrol. Do not pay any "extra charge" beyond the premium shown — ask for a receipt.',
    authority: 'Ministry of Agriculture & Farmers Welfare — PMFBY',
    sourceUrl: PMFBY_URL,
    order: 2,
  },
  {
    section: 'PMFBY',
    slug: 'pmfby-how-do-i-enrol',
    topic: 'Enrolment',
    title: 'How and where do I enrol?',
    summary: 'Enrolment routes and the documents needed.',
    simpleExplanation:
      'You can enrol through:\n- a **bank** (if you have a crop loan or a savings account there)\n- a **Common Service Centre (CSC)**\n- an **authorised insurance intermediary / agent**\n- directly on the **National Crop Insurance Portal**\n\nKeep ready: Aadhaar, bank passbook, land records or a tenancy/sowing declaration, and sowing details. Enrol **before the season’s cut-off date** and keep the enrolment receipt or policy reference number safe.',
    authority: 'Ministry of Agriculture & Farmers Welfare — PMFBY',
    sourceUrl: PMFBY_URL,
    order: 3,
  },
  {
    section: 'PMFBY',
    slug: 'pmfby-report-crop-loss',
    topic: 'Crop loss',
    title: 'My crop is damaged — what do I do?',
    summary: 'Reporting an individual crop loss in time.',
    simpleExplanation:
      'For an **individual / localised loss** — hailstorm, inundation, landslide, cloudburst, or natural fire hitting your field, and post-harvest losses for a crop left in the field to dry — report it **quickly, generally within about 72 hours**.\n\nHow to report:\n- the **Crop Insurance mobile app**, or\n- the scheme **toll-free number**, or\n- your **insurance company**, **bank**, or the local **agriculture office**\n\nGive your policy / enrolment number, survey number, crop, and the date and cause of loss. Note the **date, time and reference number** of your report. A surveyor should then assess the loss.\n\nWidespread losses across a notified area are assessed through crop-cutting experiments — you do not file a separate claim for those.',
    authority: 'Ministry of Agriculture & Farmers Welfare — PMFBY',
    sourceUrl: PMFBY_URL,
    order: 4,
  },
  {
    section: 'PMFBY',
    slug: 'pmfby-claim-status',
    topic: 'Claims',
    title: 'How do I check my claim or payout?',
    summary: 'Where claim and payout status is shown.',
    simpleExplanation:
      'Claim and payout status is shown on the **PMFBY portal** — use your policy / application number or your registered mobile number. Payouts are made by the **insurance company** into your bank account.\n\nIf a payout is delayed or you disagree with the amount, first raise it with the **insurance company** (its details are on your policy), then with the **District Level Monitoring Committee** or the agriculture department, and use the scheme’s grievance channel on the portal. Keep your policy, loss-intimation reference and bank passbook ready.',
    authority: 'Ministry of Agriculture & Farmers Welfare — PMFBY',
    sourceUrl: PMFBY_URL,
    order: 5,
  },
  {
    section: 'PMFBY',
    slug: 'pmfby-important-dates',
    topic: 'Deadlines',
    title: 'What are the important dates?',
    summary: 'Season cut-offs and the loss-reporting window.',
    simpleExplanation:
      'Two timings matter most:\n1. The **enrolment cut-off date** for the season (Kharif or Rabi). It is fixed by government notification and differs by state and crop — miss it and you cannot be covered for that season. Check the portal early.\n2. The **loss-intimation window** for an individual loss — generally about **72 hours** from when the loss happens.\n\nOther timelines (surveyor visit, claim settlement) are set in the scheme’s operational guidelines. Confirm the exact dates for your state and season on the PMFBY portal or with your agriculture office — do not rely on last year’s dates.',
    authority: 'Ministry of Agriculture & Farmers Welfare — PMFBY',
    sourceUrl: PMFBY_URL,
    order: 6,
  },
  {
    section: 'PMFBY',
    slug: 'pmfby-what-is-covered',
    topic: 'Coverage',
    title: 'What is covered, and what is not',
    summary: 'The risks PMFBY pays for, and the losses it excludes.',
    simpleExplanation:
      'PMFBY covers the **shortfall in yield of a notified crop** in a notified area caused by natural, unavoidable events, across the whole crop cycle:\n- **prevented or failed sowing** when a large part of the area could not be sown because of bad weather\n- **standing-crop loss** from drought, dry spells, flood, inundation, widespread pests and disease, landslide, natural fire, lightning, storm, hailstorm and cyclone\n- **post-harvest loss** for a crop left cut and spread in the field to dry, if it is damaged by cyclone, cyclonic or unseasonal rain within a set number of days of harvest\n- **localised losses** to individual fields from hailstorm, landslide, inundation, cloudburst and natural fire\n\nIt does **not** cover losses from war and nuclear risks, malicious damage, theft, grazing or damage by domestic or wild animals, preventable losses from poor management, or risks that are not notified for your crop and area.',
    detailedExplanation:
      'The State Government notifies, before each season, the crops and Insurance Units (usually a village / village panchayat for major crops) that are covered, the sum insured, the indemnity level, and the assigned insurance company. Add-on covers beyond the standard risks may be offered by a State at extra premium. The exact list of covered and excluded perils for your crop is in the season notification and the scheme’s operational guidelines on the PMFBY portal.',
    authority: 'Ministry of Agriculture & Farmers Welfare — PMFBY',
    sourceUrl: PMFBY_URL,
    order: 7,
  },
  {
    section: 'PMFBY',
    slug: 'pmfby-how-payout-is-calculated',
    topic: 'Payout',
    title: 'How a payout is worked out',
    summary: 'Sum insured, threshold yield and the area-yield shortfall.',
    simpleExplanation:
      'For a widespread loss, PMFBY uses an **area approach**, not your individual field.\n\n- Each notified crop has a **sum insured** per hectare (usually the Scale of Finance fixed for that crop by the district).\n- It also has a **threshold yield** — the average yield of past normal years, adjusted by the indemnity level.\n- After harvest, the **actual yield** for the Insurance Unit is measured through crop-cutting experiments.\n- If the actual yield falls below the threshold yield, every insured farmer in that unit gets a payout in proportion to the shortfall — roughly:\n\n  **(threshold yield − actual yield) ÷ threshold yield × sum insured**\n\nSo if the unit’s yield is 40% below the threshold, an insured farmer gets about 40% of the sum insured for the area they insured. Individual and post-harvest losses are assessed on the field and paid on the actual assessed loss instead.',
    detailedExplanation:
      'Yield estimation increasingly uses technology (remote sensing, smart sampling, and tools referred to as YES-TECH and WINDS) alongside crop-cutting experiments. Claims are paid by the insurance company into the bank account linked to the enrolment. Timelines for releasing State premium subsidy, finalising yield data and paying claims are set in the operational guidelines; delays by a State or insurer can attract interest to the farmer under those guidelines.',
    example:
      'A farmer insures 1 hectare of paddy with a sum insured of ₹60,000. The threshold yield for the village unit is 30 quintals/ha; crop-cutting shows an actual yield of 18 quintals/ha — a 40% shortfall. The indicative payout is 40% of ₹60,000 = ₹24,000, paid to every insured paddy farmer in that unit.',
    authority: 'Ministry of Agriculture & Farmers Welfare — PMFBY',
    sourceUrl: PMFBY_URL,
    order: 8,
  },
  {
    section: 'PMFBY',
    slug: 'pmfby-loanee-and-non-loanee',
    topic: 'Loan farmers',
    title: 'If you have a crop loan (loanee farmers)',
    summary: 'The scheme is voluntary — how to stay in or opt out.',
    simpleExplanation:
      'Before Kharif 2020, a farmer with a crop loan / Kisan Credit Card for a notified crop was **automatically** enrolled and the premium was deducted from the loan account. Since Kharif 2020 the scheme is **voluntary for everyone**.\n\nWhat this means for a loanee farmer:\n- If you **want the cover**, do nothing — the bank enrols you and deducts your premium share, the same as before.\n- If you **do not want the cover** this season, give your bank branch a **written opt-out request**, generally at least **7 days before the enrolment cut-off date**. Keep the acknowledged copy.\n- Your decision applies for that season; you can choose again next season.\n\nCheck that the crop and area recorded by the bank match what you are actually growing — a wrong crop entry can affect your claim.',
    authority: 'Ministry of Agriculture & Farmers Welfare — PMFBY',
    sourceUrl: PMFBY_URL,
    order: 9,
  },
  {
    section: 'PMFBY',
    slug: 'pmfby-premium-deducted-wrongly',
    topic: 'Wrong deduction',
    title: 'The bank deducted my premium but I did not want cover',
    summary: 'What to do if you were enrolled or debited without consent.',
    simpleExplanation:
      'If a premium was deducted although you had opted out in writing, or you were enrolled for the wrong crop or area:\n\n1. Go to the **bank branch** that holds your loan / KCC account with your passbook and the opt-out acknowledgement (if any). Ask for a written explanation and correction.\n2. If the branch does not resolve it, write to the **insurance company** for the district (its name is in the season notification and on the PMFBY portal) with your policy / application number.\n3. Escalate to the **District Level Monitoring Committee** or the agriculture department, and raise a grievance on the **PMFBY portal** or the scheme helpline.\n\nKeep every letter and reference number. A wrong enrolment is usually corrected or the premium refunded once the facts are clear.',
    authority: 'Ministry of Agriculture & Farmers Welfare — PMFBY',
    sourceUrl: PMFBY_URL,
    order: 10,
  },
  {
    section: 'PMFBY',
    slug: 'pmfby-grievance-and-helpline',
    topic: 'Grievance',
    title: 'Helpline and grievance redressal',
    summary: 'Where to complain about enrolment, survey or a claim.',
    simpleExplanation:
      'If something goes wrong — enrolment not done, no surveyor visit, claim delayed, or you disagree with the amount — use these in order:\n\n1. The **insurance company** for your district (details on your policy and the PMFBY portal) — raise it in writing with your policy / application number.\n2. The **PMFBY portal grievance** section, and the scheme **toll-free helpline** (currently **14447** — confirm the current number).\n3. The **agriculture department** at block / district level, and the **District Level Monitoring Committee** chaired by the District Collector.\n4. The **State-Level Coordination Committee on Crop Insurance** for unresolved matters.\n\nAlways keep your enrolment receipt, loss-intimation reference, survey report and bank passbook ready.',
    detailedExplanation:
      'The operational guidelines fix the composition of the district and State committees, the timelines within which each grievance level must respond, and the requirement for insurance companies to run district offices and a grievance cell during the season. A dedicated crop-insurance grievance / monitoring portal (referred to in recent seasons as the Krishi Rakshak Portal and helpline) may also be available — check the current channel on pmfby.gov.in.',
    authority: 'Ministry of Agriculture & Farmers Welfare — PMFBY',
    sourceUrl: PMFBY_URL,
    order: 11,
  },
  {
    section: 'PMFBY',
    slug: 'pmfby-doorstep-enrolment',
    topic: 'Enrolment help',
    title: 'Doorstep enrolment and checking your policy',
    summary: 'Getting enrolled at home, and verifying it went through.',
    simpleExplanation:
      'A **non-loanee farmer** can enrol without going to a bank:\n- through a **Common Service Centre**\n- through an **authorised insurance intermediary / agent**\n- directly on the **National Crop Insurance Portal** (self-enrolment)\n- through the **doorstep-enrolment app** used by authorised agents in recent seasons, where the agent visits and enrols you on the spot\n\nAfter enrolling, **verify the policy**:\n- you should get an SMS and a policy / application number\n- check your name, crop, area, bank account and premium on the PMFBY portal (search by mobile or policy number)\n- keep the receipt safe until the season’s claims are settled\n\nPay only the premium shown on the portal and insist on a receipt — there is no separate service charge for a farmer.',
    authority: 'Ministry of Agriculture & Farmers Welfare — PMFBY',
    sourceUrl: PMFBY_URL,
    order: 12,
  },

  /* ---------------------------------------------------------------- */
  /*  COOPERATIVE LAW — additional topics                             */
  /* ---------------------------------------------------------------- */
  {
    section: 'COOPERATIVE_LAW',
    slug: 'coop-types-of-societies',
    topic: 'Types',
    title: 'The main types of cooperative society',
    summary: 'Credit, marketing, producer, consumer, housing and more — and how they are tiered.',
    simpleExplanation:
      'Cooperatives are formed for many purposes. Common types are:\n- **Credit** — village PACS, urban cooperative banks, employee credit societies\n- **Agricultural marketing** — societies that pool and sell members’ produce\n- **Producer / processing** — dairy, sugar, oilseed, handloom, fishery societies that process and market what members produce\n- **Consumer** — societies that run fair-price or general stores for members\n- **Housing** — societies that develop or manage housing for members\n- **Multipurpose** — societies that combine credit with input supply, storage and other services\n\nThey are also **tiered**: a **primary** society has individual members; a **secondary / district** society (for example a District Central Cooperative Bank) has primary societies as members; an **apex / State** society or federation sits at the top.',
    detailedExplanation:
      'Classification and the permitted area of operation for each class are governed by the State Cooperative Societies Act and Rules and the model by-laws issued by the Registrar or the federal society. A society is registered for specific objects and cannot carry on business outside them without a by-law amendment. Some classes (cooperative banks) are also regulated by the Reserve Bank of India under banking law.' +
      STATE_NOTE,
    authority: COOP_AUTHORITY,
    sourceUrl: COOP_URL,
    order: 10,
  },
  {
    section: 'COOPERATIVE_LAW',
    slug: 'coop-audit-and-accounts',
    topic: 'Audit',
    title: 'Audit, accounts and the annual return',
    summary: 'Every society’s books are audited each year — and members can see the result.',
    simpleExplanation:
      'A cooperative must keep proper books and have them **audited every year** by an auditor from the cooperative audit department or a panel approved for cooperatives. The society is then given an **audit classification** (a grade).\n\nAfter the audit the society must:\n- place the **audited accounts and the audit report** before the general body (the AGM)\n- act on the **audit objections** and report what it did\n- file the **annual return** with the Registrar within the time the Act allows\n\nAs a member you can ask for a copy of the audited balance sheet and the audit report, usually for a small fee. Persistent audit objections or a poor classification can lead the Registrar to order an inquiry.',
    detailedExplanation:
      'The Act fixes who may audit, the period within which the audit must be completed and the AGM held, the format of the annual return, and the consequences of default (penalty, action against the committee, or supersession). Special audit, re-audit and test audit can be ordered by the Registrar. Members in general meeting may also appoint a certified auditor from the approved panel where the Act permits.' +
      STATE_NOTE,
    authority: COOP_AUTHORITY,
    sourceUrl: COOP_URL,
    order: 11,
  },
  {
    section: 'COOPERATIVE_LAW',
    slug: 'coop-surplus-and-dividend',
    topic: 'Surplus',
    title: 'How surplus and dividend are handled',
    summary: 'Reserve fund first, a limited dividend on shares, and a rebate on how much you used the society.',
    simpleExplanation:
      'A cooperative is not run to pay profit on capital. If there is a **surplus** at the year end, the Act and by-laws set the order in which it is used:\n1. a compulsory transfer to the **reserve fund**\n2. a contribution to the **cooperative education fund** and often other statutory funds\n3. a **limited dividend** on share capital, capped by the Act or by-laws\n4. the rest may be returned to members as a **patronage rebate** — in proportion to how much each member *used* the society (produce sold through it, interest paid, purchases made), not to shares held\n\nThe general body approves the appropriation of surplus each year. A society in loss, or with audit objections, may not be allowed to pay any dividend.',
    detailedExplanation:
      'The maximum rate of dividend, the minimum reserve-fund transfer, the funds that must be created (education, bad-debt, dividend-equalisation, common good), and any contribution to a State cooperative union or federation are prescribed by the Act and Rules. The reserve fund is generally indivisible and cannot be distributed to members even on winding up in many States.' +
      STATE_NOTE,
    authority: COOP_AUTHORITY,
    sourceUrl: COOP_URL,
    order: 12,
  },
  {
    section: 'COOPERATIVE_LAW',
    slug: 'coop-nomination',
    topic: 'Nomination',
    title: 'Nominating someone for your shares and deposits',
    summary: 'A nomination lets the society transfer your interest quickly after your death.',
    simpleExplanation:
      'Every member should file a **nomination** with the society, naming who should receive the value of the member’s **shares, deposits and other interest** if the member dies.\n\nWhy it matters:\n- the society can pay or transfer the interest to the nominee **without** insisting on a succession certificate or probate\n- it avoids disputes and long delays for the family\n\nHow to do it:\n- give a **written nomination** to the society in the form its by-laws provide\n- you can **change** it at any time in writing\n- keep an acknowledged copy\n\nA nominee usually receives the money **in trust** for the legal heirs — nomination decides who the society pays, not who finally owns it, unless the law of your State says otherwise.',
    detailedExplanation:
      'Section provisions on nomination, the effect of no nomination (payment as the by-laws or Rules provide, often up to a ceiling without legal representation), transmission of shares to a nominee or heir subject to the society’s membership conditions, and the maximum value that can be paid without a court document are set by the State Act and Rules.' +
      STATE_NOTE,
    authority: COOP_AUTHORITY,
    sourceUrl: COOP_URL,
    order: 13,
  },
  {
    section: 'COOPERATIVE_LAW',
    slug: 'coop-share-transfer-and-withdrawal',
    topic: 'Shares',
    title: 'Transferring or withdrawing your shares',
    summary: 'Cooperative shares are not freely tradable — there are limits and a process.',
    simpleExplanation:
      'Unlike company shares, cooperative shares **cannot be freely bought and sold**. The Act and by-laws restrict it:\n- a **transfer** to another person usually needs the person to be eligible for membership and the **committee’s approval**, after you have held the shares for a minimum period\n- **withdrawal** (the society refunding your share value when you resign) is allowed only as the by-laws provide, often with **notice**, and the total that a society refunds in one year is **capped** (commonly a small percentage of its share capital) so it stays financially sound\n- shares may not be withdrawn while you owe money to the society\n\nApply in writing, get the committee decision in writing, and expect refunds to take time if the annual cap is already used up.',
    authority: COOP_AUTHORITY,
    sourceUrl: COOP_URL,
    order: 14,
  },
  {
    section: 'COOPERATIVE_LAW',
    slug: 'coop-registrar-role',
    topic: 'The Registrar',
    title: 'The Registrar of Cooperative Societies',
    summary: 'The State authority that registers, supervises and, when needed, intervenes in societies.',
    simpleExplanation:
      'Every State has a **Registrar of Cooperative Societies** (with district and taluka officers). The Registrar:\n- **registers** a new society and its by-laws, and registers by-law amendments\n- arranges the **annual audit** and can order a special audit, an **inquiry** or an **inspection** on a complaint\n- decides **disputes** touching the business of a society, or appoints an arbitrator\n- can order **surcharge** (recovery) against office-bearers for loss caused by their negligence or misconduct\n- can **supersede** a managing committee that is not functioning properly and appoint an administrator, for a limited period\n- oversees **elections** (now often through a separate State Cooperative Election Authority)\n- orders **amalgamation, division or winding up** in the situations the Act allows\n\nA member who cannot get relief from the society approaches the Registrar’s office; appeals go to the Cooperative Tribunal or the authority named in the Act.',
    detailedExplanation:
      'The 97th Constitutional Amendment and the matching State amendments limit how long a committee can be superseded (commonly six months to one year), require independent election machinery, and protect the board’s tenure. The Registrar’s powers of inquiry (on a set fraction of members’ request or suo motu), the surcharge procedure, and the appeal / revision hierarchy are all defined in the State Act.' +
      STATE_NOTE,
    authority: COOP_AUTHORITY,
    sourceUrl: COOP_URL,
    order: 15,
  },
  {
    section: 'COOPERATIVE_LAW',
    slug: 'coop-multi-state-societies',
    topic: 'Multi-State',
    title: 'Multi-State cooperative societies',
    summary: 'Societies working in more than one State come under a central law and the Central Registrar.',
    simpleExplanation:
      'A cooperative whose objects and area of operation cross a **State boundary** is registered under the **Multi-State Cooperative Societies Act**, not a State Act. It is regulated by the **Central Registrar of Cooperative Societies** under the Ministry of Cooperation.\n\nThe basics are the same as a State society — voluntary membership, one member one vote in a primary society, an elected board, annual audit and AGM — but registration, by-law amendments, disputes, inquiry and winding up are handled centrally.\n\nRecent amendments to the central law have added features such as a Cooperative Election Authority, a Cooperative Ombudsman for member complaints, and a rehabilitation fund for sick societies. For the current provisions, check the Ministry of Cooperation website.',
    authority: 'Multi-State Cooperative Societies Act / Ministry of Cooperation, Government of India',
    sourceUrl: COOP_URL,
    order: 16,
  },

  /* ---------------------------------------------------------------- */
  /*  PACS SERVICES — additional topics                               */
  /* ---------------------------------------------------------------- */
  {
    section: 'PACS',
    slug: 'pacs-common-service-centre',
    topic: 'e-services',
    title: 'Getting government e-services at your PACS',
    summary: 'Computerised PACS acting as a Common Service Centre.',
    simpleExplanation:
      'Many computerised PACS are now registered as a **Common Service Centre (CSC)**. That means you may be able to do, at the society office, things that earlier meant a trip to town:\n- apply for **certificates and records** (income, caste, residence, land extracts)\n- **PAN**, passport and some pension applications\n- **bill payments and recharges**, money transfer\n- **PMFBY crop-insurance** enrolment\n- **Ayushman Bharat** and other scheme registrations\n\nWhat is actually available depends on your State and how far your PACS has been enabled. Ask the PACS secretary for the list of CSC services and the small fees for each.',
    authority: 'Ministry of Cooperation, Government of India',
    sourceUrl: 'https://cooperation.gov.in/',
    order: 7,
  },
  {
    section: 'PACS',
    slug: 'pacs-pledge-loan-on-produce',
    topic: 'Pledge loan',
    title: 'Borrowing against stored produce',
    summary: 'A short-term loan against grain kept in the society godown.',
    simpleExplanation:
      'If your PACS runs a **godown**, you can often store your grain there after harvest and take a **pledge loan** against it — instead of selling immediately when prices are lowest.\n\nHow it works:\n- you deposit the produce; the society issues a **storage receipt** and lends you a part of its value (commonly up to 70–75%)\n- you repay the loan with interest when you sell, and take back the produce or let the society release it to the buyer\n- you gain if the price rises enough to cover the interest and storage cost\n\nAsk about the interest rate, the storage charge, the maximum period, and what happens to quality claims. A warehouse receipt from an accredited warehouse can sometimes be used with a bank in the same way.',
    authority: 'NABARD / Ministry of Cooperation',
    sourceUrl: NABARD_URL,
    order: 8,
  },
  {
    section: 'PACS',
    slug: 'pacs-women-and-shg-linkage',
    topic: 'Women & SHGs',
    title: 'Women members and self-help group linkage',
    summary: 'How women and SHGs take part in a PACS.',
    simpleExplanation:
      'Women can be **full members** of a PACS in their own right — with land, a cultivation certificate, or as members of a joint liability group or self-help group engaged in agriculture or allied work.\n\nMany State Acts now **reserve seats** for women on the managing committee, and computerisation and the model by-laws push societies to enrol more women members.\n\nA **self-help group** can be linked to the PACS for credit: the group saves together, the PACS lends to the group, and the group on-lends to its members. Ask your PACS whether it does SHG lending, the group’s eligibility, and the interest terms.',
    authority: 'NABARD / State Cooperative Societies Acts',
    sourceUrl: NABARD_URL,
    order: 9,
  },
  {
    section: 'PACS',
    slug: 'pacs-complaint-process',
    topic: 'Complaints',
    title: 'Raising a complaint about your PACS',
    summary: 'The steps if the society denies a service or mishandles your account.',
    simpleExplanation:
      'If your PACS wrongly refuses membership or a loan, makes a mistake in your account, or an office-bearer behaves improperly:\n\n1. **Write to the secretary / managing committee** of the PACS, keep a copy, and ask for the matter to be placed before the committee.\n2. If unresolved, take it to the **District Central Cooperative Bank** (which supervises PACS) or the **Assistant / Deputy Registrar** of Cooperative Societies for your area.\n3. File a **dispute or complaint** with the **Registrar** under the State Act — the Registrar can order an inquiry or audit, decide the dispute, or act against office-bearers.\n4. Appeals go to the **Cooperative Tribunal / Court** named in the Act.\n\nFor a crop-insurance or scheme-benefit problem routed through the PACS, also use that scheme’s own grievance channel.',
    authority: 'State Cooperative Societies Acts / Registrar of Cooperative Societies',
    sourceUrl: 'https://cooperation.gov.in/',
    order: 10,
  },

  /* ---------------------------------------------------------------- */
  /*  FINANCIAL LITERACY — additional topics                          */
  /* ---------------------------------------------------------------- */
  {
    section: 'FINANCIAL_LITERACY',
    slug: 'money-upi-and-digital-payments',
    topic: 'Digital payments',
    title: 'Using UPI and digital payments safely',
    summary: 'Simple rules that stop most digital-payment frauds.',
    simpleExplanation:
      'UPI apps let you pay instantly from your bank account using a phone. A few rules keep you safe:\n- your **UPI PIN is only for paying**, never for *receiving* money — if someone asks you to enter your PIN "to get" a refund, prize or payment, it is a fraud\n- **check the name** that shows up before you approve a payment\n- ignore **"collect requests"** from unknown people — approving one sends *your* money out\n- never scan a **QR code** someone sends you "to receive" money — QR codes are for paying\n- keep your phone locked; do not install apps or "screen sharing / AnyDesk" tools that a caller asks you to install\n\nIf you pay the wrong person or are cheated, call your bank at once and the cyber-crime helpline **1930**, and raise a complaint in the app.',
    example:
      'A buyer for a farmer’s goats says he has sent an "advance" but the farmer must "confirm receipt" by entering his UPI PIN on a link. Entering the PIN would have *sent* ₹5,000, not received it. A real payment just arrives — you never approve anything to receive money.',
    authority: 'Reserve Bank of India / National Payments Corporation of India — consumer awareness',
    sourceUrl: RBI_URL,
    order: 9,
  },
  {
    section: 'FINANCIAL_LITERACY',
    slug: 'money-credit-history',
    topic: 'Credit record',
    title: 'Your credit history and why repayment matters',
    summary: 'How past repayment affects your next loan.',
    simpleExplanation:
      'Every loan you take from a bank, cooperative bank, PACS or registered lender is reported to **credit information companies**. They keep a record of how regularly you repaid, and give lenders a **credit score**.\n\n- **Paying every instalment on time** builds a good record — future loans come faster, in larger amounts, and sometimes at a better rate.\n- **Missed or defaulted payments** stay on the record for years and make it hard to borrow, even for a family member who applied jointly.\n- A **settled** or written-off loan also leaves a mark — clearing the full amount is better.\n\nYou are entitled to see your own credit report (one free report a year from each company). Check it for mistakes — a wrongly reported default can be disputed and corrected.',
    authority: 'Reserve Bank of India — financial education',
    sourceUrl: RBI_URL,
    order: 10,
  },
  {
    section: 'FINANCIAL_LITERACY',
    slug: 'money-dbt-and-aadhaar-seeding',
    topic: 'DBT',
    title: 'Direct Benefit Transfer and Aadhaar seeding',
    summary: 'How scheme money reaches your account — and how to keep it flowing.',
    simpleExplanation:
      'Most scheme payments — PM-KISAN, LPG subsidy, scholarships, pensions, MGNREGA wages, crop-insurance claims — are paid by **Direct Benefit Transfer (DBT)** straight into a bank account.\n\nFor DBT to work the account must be **Aadhaar-seeded and linked in the NPCI mapper**: your Aadhaar is connected to *one* bank account, and that is where the money lands.\n\n- Tell your bank which account should receive DBT and ask them to **seed Aadhaar and enable it for DBT**.\n- If you have several accounts, DBT goes to the **last one** you linked — money can seem to "go missing" because it went to an old account.\n- Keep the account **active** (a small transaction now and then) and the **KYC updated**, or credits can bounce.\n- Check status on the DBT / bank portal or by asking the branch.',
    authority: 'Department of Financial Services / NPCI',
    sourceUrl: RBI_URL,
    order: 11,
  },
  {
    section: 'FINANCIAL_LITERACY',
    slug: 'money-chit-funds-and-ponzi',
    topic: 'Deposit traps',
    title: 'Chit funds, deposit schemes and Ponzi traps',
    summary: 'Telling a regulated scheme from one that will lose your money.',
    simpleExplanation:
      'People are often offered "schemes" promising to **double your money**, pay very high monthly returns, or a prize for depositing with an agent. Many are **Ponzi schemes** — early payouts are just later people’s deposits, and the whole thing collapses.\n\nWarning signs:\n- **guaranteed high returns** with "no risk"\n- pressure to **bring in friends and family** for a commission\n- an unregistered agent, cash only, receipts on plain paper\n- returns that sound far above a bank fixed deposit\n\nSafer ground:\n- **registered chit funds** run under the Chit Funds Act by a licensed company (still understand the rules before joining)\n- **bank / post-office deposits**, RBI-registered NBFC deposits, PACS deposits\n- for investment, regulated options like NSC, PPF, KVP, or mutual funds through a registered distributor\n\nIf you have lost money to such a scheme, complain to the police and the State’s protection-of-depositors authority.',
    authority: 'Reserve Bank of India / Securities and Exchange Board of India — investor awareness',
    sourceUrl: RBI_URL,
    order: 12,
  },
  {
    section: 'FINANCIAL_LITERACY',
    slug: 'money-nominees-and-documents',
    topic: 'Papers & nominees',
    title: 'Nominees, and keeping financial papers in order',
    summary: 'A short checklist so your family can access what is yours.',
    simpleExplanation:
      'Money and cover are of no use if the family cannot find or claim them. A simple routine:\n- add a **nominee** to every bank account, fixed deposit, PACS deposit, insurance policy, PPF and pension account — and update it after a marriage or a death in the family\n- keep **one folder** with: bank passbooks, deposit receipts, insurance policies and premium receipts, loan sanction letters, land records, Aadhaar / PAN, and the scheme enrolment papers (PM-KISAN, PMFBY, PMJJBY, PMSBY, APY)\n- tell a **trusted family member** where the folder is and what each paper is for\n- write down **account and policy numbers** and the helpline for each, kept separately from PINs\n- review the folder once a year, around harvest, when you do the household plan\n\nA nominee receives the money from the institution quickly; who finally owns it still follows inheritance law, so a simple **will** avoids disputes.',
    authority: 'Reserve Bank of India / IRDAI — consumer education',
    sourceUrl: RBI_URL,
    order: 13,
  },
];
