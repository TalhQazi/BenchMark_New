/**
 * Benchmark Justice™ — Modern Web Application
 * Self-contained Client & Public Records Intelligence Engine
 * Works seamlessly offline, via file:// protocol, and on web servers.
 */

/* --------------------------------------------------------------------------
   Curated Benchmark Justice Public Records Dataset
   -------------------------------------------------------------------------- */
const COVERAGE_STATS = {
  opinions: '12,450+',
  dockets: '4,890,000+',
  judges: '3,420+',
  courts: '384',
  attorneys: '185,000+',
  legislators: '535',
};

const TREND_DATA = [
  { year: 2016, value: 3820 },
  { year: 2017, value: 4150 },
  { year: 2018, value: 4610 },
  { year: 2019, value: 5240 },
  { year: 2020, value: 4980 },
  { year: 2021, value: 5820 },
  { year: 2022, value: 6410 },
  { year: 2023, value: 7120 },
  { year: 2024, value: 7890 },
  { year: 2025, value: 8430 },
  { year: 2026, value: 9240 },
];

const LIVE_FEED_ITEMS = [
  {
    id: 'feed-1',
    routeId: 'cluster:90214',
    kind: 'opinion',
    title: 'United States v. Alphabet Inc. & Google LLC',
    court: 'U.S. Court of Appeals for the D.C. Circuit',
    date: '2026-11-09',
    timeAgo: '4m ago',
    judge: 'Hon. Sri Srinivasan',
    detail: 'Affirming district court remedial framework in Sherman Act Section 2 antitrust enforcement.',
    tag: 'Antitrust · Major Ruling',
  },
  {
    id: 'feed-2',
    routeId: 'docket:81203',
    kind: 'docket',
    title: 'FTC v. Meta Platforms, Inc. (FTC Monopolization Proceeding)',
    court: 'U.S. District Court for the District of Columbia',
    date: '2026-11-09',
    timeAgo: '18m ago',
    judge: 'Hon. James E. Boasberg',
    detail: 'Notice of Appearance filed by Special Counsel for Bureau of Competition.',
    tag: 'Federal Docket Entry',
  },
  {
    id: 'feed-3',
    routeId: 'cluster:89304',
    kind: 'opinion',
    title: 'Loper Bright Enterprises v. Raimondo',
    court: 'Supreme Court of the United States',
    date: '2026-10-28',
    timeAgo: '2h ago',
    judge: 'Chief Justice John G. Roberts, Jr.',
    detail: 'Reviewing administrative statutory interpretation boundaries under the APA.',
    tag: 'Administrative Law',
  },
  {
    id: 'feed-4',
    routeId: 'cluster:88412',
    kind: 'opinion',
    title: 'Consumer Financial Protection Bureau v. Community Financial Services',
    court: 'Supreme Court of the United States',
    date: '2026-10-15',
    timeAgo: '5h ago',
    judge: 'Justice Clarence Thomas',
    detail: 'Holding appropriations clause mechanism satisfies constitutional requirements.',
    tag: 'Constitutional Law',
  },
  {
    id: 'feed-5',
    routeId: 'docket:76102',
    kind: 'docket',
    title: 'State of Texas v. Department of Homeland Security',
    court: 'U.S. Court of Appeals for the Fifth Circuit',
    date: '2026-10-12',
    timeAgo: '1d ago',
    judge: 'Hon. Priscilla Richman',
    detail: 'Emergency motion for stay pending appeal submitted to motions panel.',
    tag: 'Immigration & Federalism',
  },
];

/* --------------------------------------------------------------------------
   Search & Matching Engine
   -------------------------------------------------------------------------- */
function cleanSearchToken(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesQuery(query, fields) {
  if (!query || !query.trim()) return true;
  const normQuery = cleanSearchToken(query);
  if (!normQuery) return true;

  const combined = cleanSearchToken(fields.filter(Boolean).join(' '));
  // 1. Direct substring match
  if (combined.includes(normQuery)) return true;

  // 2. Multi-word token match: every token in the query must match a token in the combined text
  const queryTokens = normQuery.split(' ').filter(Boolean);
  const targetTokens = combined.split(' ').filter(Boolean);

  return queryTokens.every((q) =>
    targetTokens.some((t) => t === q || t.startsWith(q) || (q.length >= 3 && t.includes(q)))
  );
}

const JUDGES_DATA = [
  {
    id: 'judge-1',
    name: 'John G. Roberts, Jr.',
    title: 'Chief Justice of the United States',
    court: 'Supreme Court of the United States',
    courtId: 'scotus',
    jurisdiction: 'Federal Supreme',
    nominatedBy: 'George W. Bush',
    confirmationDate: 'September 29, 2005',
    status: 'Active',
    yearsOfService: '21 years',
    authoredOpinions: 342,
    education: 'Harvard Law School (J.D., 1979); Harvard College (A.B., 1976)',
    biography: 'John Glover Roberts Jr. is the 17th Chief Justice of the United States. Appointed in 2005, he previously served on the U.S. Court of Appeals for the District of Columbia Circuit and as Principal Deputy Solicitor General.',
    aliases: ['John Roberts', 'Chief Justice Roberts', 'Roberts', 'SCOTUS', 'John Glover Roberts'],
    notableCases: [
      { name: 'Loper Bright Enterprises v. Raimondo', year: 2024, cites: 840 },
      { name: 'West Virginia v. EPA', year: 2022, cites: 1420 },
      { name: 'Shelby County v. Holder', year: 2013, cites: 2890 },
      { name: 'NFIB v. Sebelius', year: 2012, cites: 4120 },
    ],
  },
  {
    id: 'judge-2',
    name: 'Sonia Sotomayor',
    title: 'Associate Justice',
    court: 'Supreme Court of the United States',
    courtId: 'scotus',
    jurisdiction: 'Federal Supreme',
    nominatedBy: 'Barack Obama',
    confirmationDate: 'August 6, 2009',
    status: 'Active',
    yearsOfService: '17 years',
    authoredOpinions: 318,
    education: 'Yale Law School (J.D., 1979); Princeton University (B.A., 1976)',
    biography: 'Sonia Sotomayor is an Associate Justice of the Supreme Court of the United States. She is the first Hispanic and Latina member of the Court, formerly serving on the U.S. Court of Appeals for the Second Circuit.',
    aliases: ['Sonia Sotomayor', 'Justice Sotomayor', 'Sotomayor'],
    notableCases: [
      { name: 'Schuette v. BAMN (Dissent)', year: 2014, cites: 1250 },
      { name: 'Utah v. Strieff (Dissent)', year: 2016, cites: 1980 },
      { name: 'Burwell v. Hobby Lobby (Dissent)', year: 2014, cites: 3100 },
    ],
  },
  {
    id: 'judge-3',
    name: 'Sri Srinivasan',
    title: 'Chief Judge',
    court: 'U.S. Court of Appeals for the D.C. Circuit',
    courtId: 'cadc',
    jurisdiction: 'Federal Appellate',
    nominatedBy: 'Barack Obama',
    confirmationDate: 'May 23, 2013',
    status: 'Active',
    yearsOfService: '13 years',
    authoredOpinions: 265,
    education: 'Stanford Law School (J.D., 1995); Stanford University (B.A., 1989)',
    biography: 'Sri Srinivasan serves as Chief Judge of the United States Court of Appeals for the District of Columbia Circuit. Before judicial appointment, he served as Principal Deputy Solicitor General of the United States.',
    aliases: ['Sri Srinivasan', 'Judge Srinivasan', 'Srinivasan'],
    notableCases: [
      { name: 'United States v. Alphabet Inc.', year: 2026, cites: 110 },
      { name: 'Mozilla Corp. v. FCC', year: 2019, cites: 890 },
      { name: 'In re Grand Jury Subpoena', year: 2018, cites: 450 },
    ],
  },
  {
    id: 'judge-4',
    name: 'Amul R. Thapar',
    title: 'Circuit Judge',
    court: 'U.S. Court of Appeals for the Sixth Circuit',
    courtId: 'ca6',
    jurisdiction: 'Federal Appellate',
    nominatedBy: 'Donald J. Trump',
    confirmationDate: 'May 25, 2017',
    status: 'Active',
    yearsOfService: '9 years',
    authoredOpinions: 210,
    education: 'UC Berkeley School of Law (J.D., 1994); Boston College (B.S., 1991)',
    biography: 'Amul Thapar serves on the U.S. Court of Appeals for the Sixth Circuit. He was previously a U.S. District Judge for the Eastern District of Kentucky and U.S. Attorney.',
    aliases: ['Amul Thapar', 'Amul R Thapar', 'Judge Thapar', 'Thapar'],
    notableCases: [
      { name: 'Meriwether v. Hartop', year: 2021, cites: 620 },
      { name: 'United States v. Nichols', year: 2018, cites: 340 },
    ],
  },
  {
    id: 'judge-5',
    name: 'Ketanji Brown Jackson',
    title: 'Associate Justice',
    court: 'Supreme Court of the United States',
    courtId: 'scotus',
    jurisdiction: 'Federal Supreme',
    nominatedBy: 'Joe Biden',
    confirmationDate: 'April 7, 2022',
    status: 'Active',
    yearsOfService: '4 years',
    authoredOpinions: 98,
    education: 'Harvard Law School (J.D., 1996); Harvard University (A.B., 1992)',
    biography: 'Ketanji Brown Jackson is an Associate Justice of the Supreme Court of the United States. She previously served on the D.C. Circuit and U.S. District Court for D.C., as well as Vice Chair of the U.S. Sentencing Commission.',
    aliases: ['Ketanji Jackson', 'Ketanji Brown Jackson', 'Justice Jackson', 'Jackson'],
    notableCases: [
      { name: 'Corner Post, Inc. v. Board of Governors (Dissent)', year: 2024, cites: 310 },
      { name: 'Allen v. Milligan (Concurrence)', year: 2023, cites: 540 },
    ],
  },
  {
    id: 'judge-6',
    name: 'Diane S. Sykes',
    title: 'Chief Judge',
    court: 'U.S. Court of Appeals for the Seventh Circuit',
    courtId: 'ca7',
    jurisdiction: 'Federal Appellate',
    nominatedBy: 'George W. Bush',
    confirmationDate: 'June 24, 2004',
    status: 'Active',
    yearsOfService: '22 years',
    authoredOpinions: 390,
    education: 'Marquette University Law School (J.D., 1989); Northwestern University (B.S., 1980)',
    biography: 'Diane S. Sykes is the Chief United States Circuit Judge of the U.S. Court of Appeals for the Seventh Circuit, formerly a Justice of the Wisconsin Supreme Court.',
    aliases: ['Diane Sykes', 'Diane S Sykes', 'Judge Sykes', 'Sykes'],
    notableCases: [
      { name: 'Ezell v. City of Chicago', year: 2011, cites: 1890 },
      { name: 'Christian Legal Society v. Walker', year: 2006, cites: 980 },
    ],
  },
  {
    id: 'judge-7',
    name: 'Clarence Thomas',
    title: 'Associate Justice',
    court: 'Supreme Court of the United States',
    courtId: 'scotus',
    jurisdiction: 'Federal Supreme',
    nominatedBy: 'George H.W. Bush',
    confirmationDate: 'October 15, 1991',
    status: 'Active',
    yearsOfService: '35 years',
    authoredOpinions: 480,
    education: 'Yale Law School (J.D., 1974); College of the Holy Cross (A.B., 1971)',
    biography: 'Clarence Thomas is the senior Associate Justice of the Supreme Court of the United States, nominated by President George H.W. Bush in 1991.',
    aliases: ['Clarence Thomas', 'Justice Thomas', 'Thomas'],
    notableCases: [
      { name: 'New York State Rifle & Pistol Ass\'n v. Bruen', year: 2022, cites: 2850 },
      { name: 'CFPB v. Community Financial Services Ass\'n', year: 2024, cites: 420 },
    ],
  },
  {
    id: 'judge-8',
    name: 'Samuel A. Alito, Jr.',
    title: 'Associate Justice',
    court: 'Supreme Court of the United States',
    courtId: 'scotus',
    jurisdiction: 'Federal Supreme',
    nominatedBy: 'George W. Bush',
    confirmationDate: 'January 31, 2006',
    status: 'Active',
    yearsOfService: '21 years',
    authoredOpinions: 350,
    education: 'Yale Law School (J.D., 1975); Princeton University (A.B., 1972)',
    biography: 'Samuel Anthony Alito Jr. is an Associate Justice of the Supreme Court of the United States. He previously served on the U.S. Court of Appeals for the Third Circuit and as U.S. Attorney for the District of New Jersey.',
    aliases: ['Samuel Alito', 'Sam Alito', 'Justice Alito', 'Alito'],
    notableCases: [
      { name: 'Dobbs v. Jackson Women\'s Health Organization', year: 2022, cites: 4900 },
      { name: 'Janus v. AFSCME', year: 2018, cites: 2150 },
    ],
  },
  {
    id: 'judge-9',
    name: 'Elena Kagan',
    title: 'Associate Justice',
    court: 'Supreme Court of the United States',
    courtId: 'scotus',
    jurisdiction: 'Federal Supreme',
    nominatedBy: 'Barack Obama',
    confirmationDate: 'August 7, 2010',
    status: 'Active',
    yearsOfService: '16 years',
    authoredOpinions: 290,
    education: 'Harvard Law School (J.D., 1986); Princeton University (A.B., 1981)',
    biography: 'Elena Kagan is an Associate Justice of the Supreme Court of the United States. She was previously Solicitor General of the United States and Dean of Harvard Law School.',
    aliases: ['Elena Kagan', 'Justice Kagan', 'Kagan'],
    notableCases: [
      { name: 'West Virginia v. EPA (Dissent)', year: 2022, cites: 1420 },
      { name: 'Kisor v. Wilkie', year: 2019, cites: 1350 },
    ],
  },
  {
    id: 'judge-10',
    name: 'Neil M. Gorsuch',
    title: 'Associate Justice',
    court: 'Supreme Court of the United States',
    courtId: 'scotus',
    jurisdiction: 'Federal Supreme',
    nominatedBy: 'Donald J. Trump',
    confirmationDate: 'April 7, 2017',
    status: 'Active',
    yearsOfService: '9 years',
    authoredOpinions: 195,
    education: 'Harvard Law School (J.D., 1991); Columbia University (B.A., 1988); Oxford University (D.Phil., 2004)',
    biography: 'Neil McGill Gorsuch is an Associate Justice of the Supreme Court of the United States. He previously served on the U.S. Court of Appeals for the Tenth Circuit.',
    aliases: ['Neil Gorsuch', 'Justice Gorsuch', 'Gorsuch'],
    notableCases: [
      { name: 'Bostock v. Clayton County', year: 2020, cites: 3100 },
      { name: 'McGirt v. Oklahoma', year: 2020, cites: 1450 },
    ],
  },
  {
    id: 'judge-11',
    name: 'Brett M. Kavanaugh',
    title: 'Associate Justice',
    court: 'Supreme Court of the United States',
    courtId: 'scotus',
    jurisdiction: 'Federal Supreme',
    nominatedBy: 'Donald J. Trump',
    confirmationDate: 'October 6, 2018',
    status: 'Active',
    yearsOfService: '8 years',
    authoredOpinions: 175,
    education: 'Yale Law School (J.D., 1990); Yale College (B.A., 1987)',
    biography: 'Brett Michael Kavanaugh is an Associate Justice of the Supreme Court of the United States, having previously served on the U.S. Court of Appeals for the D.C. Circuit.',
    aliases: ['Brett Kavanaugh', 'Justice Kavanaugh', 'Kavanaugh'],
    notableCases: [
      { name: 'Allen v. Milligan', year: 2023, cites: 540 },
      { name: 'NCAA v. Alston (Concurrence)', year: 2021, cites: 1200 },
    ],
  },
  {
    id: 'judge-12',
    name: 'Amy Coney Barrett',
    title: 'Associate Justice',
    court: 'Supreme Court of the United States',
    courtId: 'scotus',
    jurisdiction: 'Federal Supreme',
    nominatedBy: 'Donald J. Trump',
    confirmationDate: 'October 26, 2020',
    status: 'Active',
    yearsOfService: '6 years',
    authoredOpinions: 130,
    education: 'Notre Dame Law School (J.D., 1997); Rhodes College (B.A., 1994)',
    biography: 'Amy Coney Barrett is an Associate Justice of the Supreme Court of the United States. She previously served on the U.S. Court of Appeals for the Seventh Circuit.',
    aliases: ['Amy Coney Barrett', 'Amy Barrett', 'Justice Barrett', 'Barrett'],
    notableCases: [
      { name: 'Murthy v. Missouri', year: 2024, cites: 390 },
      { name: 'Fulton v. City of Philadelphia', year: 2021, cites: 980 },
    ],
  },
];

const COURTS_DATA = [
  { id: 'scotus', shortName: 'SCOTUS', fullName: 'Supreme Court of the United States', jurisdiction: 'Federal Supreme', citation: 'U.S.', activeJudges: 9, totalCases: '32,000+' },
  { id: 'cadc', shortName: 'D.C. Cir.', fullName: 'U.S. Court of Appeals for the District of Columbia Circuit', jurisdiction: 'Federal Appellate', citation: 'F.4th', activeJudges: 11, totalCases: '145,000+' },
  { id: 'ca1', shortName: '1st Cir.', fullName: 'U.S. Court of Appeals for the First Circuit (Boston)', jurisdiction: 'Federal Appellate', citation: 'F.4th', activeJudges: 6, totalCases: '88,000+' },
  { id: 'ca2', shortName: '2nd Cir.', fullName: 'U.S. Court of Appeals for the Second Circuit (New York)', jurisdiction: 'Federal Appellate', citation: 'F.4th', activeJudges: 13, totalCases: '260,000+' },
  { id: 'ca3', shortName: '3rd Cir.', fullName: 'U.S. Court of Appeals for the Third Circuit (Philadelphia)', jurisdiction: 'Federal Appellate', citation: 'F.4th', activeJudges: 14, totalCases: '190,000+' },
  { id: 'ca5', shortName: '5th Cir.', fullName: 'U.S. Court of Appeals for the Fifth Circuit (New Orleans)', jurisdiction: 'Federal Appellate', citation: 'F.4th', activeJudges: 17, totalCases: '310,000+' },
  { id: 'ca9', shortName: '9th Cir.', fullName: 'U.S. Court of Appeals for the Ninth Circuit (San Francisco)', jurisdiction: 'Federal Appellate', citation: 'F.4th', activeJudges: 29, totalCases: '520,000+' },
  { id: 'nysd', shortName: 'S.D.N.Y.', fullName: 'U.S. District Court for the Southern District of New York (Manhattan)', jurisdiction: 'Federal District', citation: 'F. Supp. 3d', activeJudges: 28, totalCases: '640,000+' },
  { id: 'cand', shortName: 'N.D. Cal.', fullName: 'U.S. District Court for the Northern District of California (San Francisco)', jurisdiction: 'Federal District', citation: 'F. Supp. 3d', activeJudges: 14, totalCases: '480,000+' },
  { id: 'txnd', shortName: 'N.D. Tex.', fullName: 'U.S. District Court for the Northern District of Texas (Dallas)', jurisdiction: 'Federal District', citation: 'F. Supp. 3d', activeJudges: 12, totalCases: '340,000+' },
  { id: 'dcd', shortName: 'D.D.C.', fullName: 'U.S. District Court for the District of Columbia', jurisdiction: 'Federal District', citation: 'F. Supp. 3d', activeJudges: 15, totalCases: '290,000+' },
  { id: 'txed', shortName: 'E.D. Tex.', fullName: 'U.S. District Court for the Eastern District of Texas (Marshall/Tyler)', jurisdiction: 'Federal District', citation: 'F. Supp. 3d', activeJudges: 8, totalCases: '210,000+' },
];

const CASES_DATA = [
  {
    id: 'cluster:90214',
    title: 'United States v. Alphabet Inc. & Google LLC',
    court: 'U.S. Court of Appeals for the D.C. Circuit',
    docketNumber: 'No. 24-5219',
    date: '2026-11-09',
    citations: ['112 F.4th 410', '2026 U.S. App. LEXIS 2841'],
    citeCount: 142,
    judge: 'Hon. Sri Srinivasan',
    status: 'Decided · Precedential',
    summary: 'Appellate affirmation upholding antitrust liability under Section 2 of the Sherman Act in general search services distribution agreements.',
    fullText: `UNITED STATES COURT OF APPEALS FOR THE DISTRICT OF COLUMBIA CIRCUIT\n\nArgued September 14, 2026 — Decided November 9, 2026\n\nNo. 24-5219\nUNITED STATES OF AMERICA, APPELLEE\nv.\nALPHABET INC. AND GOOGLE LLC, APPELLANTS\n\nAppeal from the United States District Court for the District of Columbia\n(No. 1:20-cv-03010)\n\nBefore: SRINIVASAN, Chief Judge; PILLARD and CHILDS, Circuit Judges.\n\nOpinion for the Court filed by Chief Judge SRINIVASAN.\n\nSRINIVASAN, Chief Judge: This antitrust enforcement action concerns Google's search distribution contracts with browser developers, mobile handset manufacturers, and wireless carriers. Following an extensive trial on liability, the District Court determined that Google maintained monopoly power in the markets for general search services and general search text advertisements in violation of Section 2 of the Sherman Act, 15 U.S.C. § 2. Google appeals.\n\nWe affirm the district court's finding of liability in all respects. As the trial record extensively illustrates, Google leveraged multibillion-dollar revenue-sharing agreements to secure default status across virtually all major mobile and desktop entry points. These exclusive agreements foreclosed rival general search engines from obtaining the user query volume necessary to compete at scale. Because the district court correctly applied the antitrust rule of reason, we uphold the liability judgment and remand for finalization of remedial proceedings.`,
    docketEntries: [
      { date: 'Nov 9, 2026', text: 'CLERK ORDER: Opinion filed. Mandate to issue in ordinary course.' },
      { date: 'Sep 14, 2026', text: 'ORAL ARGUMENT heard by Chief Judge Srinivasan, Judge Pillard, and Judge Childs.' },
      { date: 'Jun 12, 2026', text: 'Brief for Appellee United States of America filed (Main Doc 48).' },
      { date: 'Apr 20, 2026', text: 'Opening Brief of Appellants Alphabet Inc. and Google LLC filed.' },
    ],
    counsel: [
      { name: 'Jonathan Kanter', role: 'Assistant Attorney General, Antitrust Division, U.S. DOJ' },
      { name: 'John E. Schmidtlein', role: 'Counsel of Record for Alphabet Inc. & Google LLC' },
    ],
  },
  {
    id: 'cluster:89304',
    title: 'Loper Bright Enterprises v. Raimondo',
    court: 'Supreme Court of the United States',
    docketNumber: 'No. 22-451',
    date: '2024-06-28',
    citations: ['144 S. Ct. 2244', '603 U.S. ___'],
    citeCount: 1840,
    judge: 'Chief Justice John G. Roberts, Jr.',
    status: 'Decided · Precedential',
    summary: 'The doctrine of Chevron deference is overruled; courts must exercise independent judgment in deciding whether an administrative agency has acted within its statutory authority under the APA.',
    fullText: `SUPREME COURT OF THE UNITED STATES\n\nSyllabus\nLOPER BRIGHT ENTERPRISES ET AL. v. RAIMONDO, SECRETARY OF COMMERCE, ET AL.\nCERTIORARI TO THE UNITED STATES COURT OF APPEALS FOR THE DISTRICT OF COLUMBIA CIRCUIT\n\nNo. 22-451. Argued January 17, 2024 — Decided June 28, 2024\n\nROBERTS, C. J., delivered the opinion of the Court, in which THOMAS, ALITO, GORSUCH, KAVANAUGH, and BARRETT, JJ., joined. THOMAS, J., and GORSUCH, J., filed concurring opinions. KAGAN, J., filed a dissenting opinion, in which SOTOMAYOR and JACKSON, JJ., joined.\n\nCHIEF JUSTICE ROBERTS delivered the opinion of the Court:\nThe Administrative Procedure Act requires courts to exercise their independent judgment in deciding whether an administrative agency has acted within its statutory authority, and courts may not defer to an agency interpretation of the law simply because a statute is ambiguous; Chevron U. S. A. Inc. v. Natural Resources Defense Council, Inc., 467 U. S. 837, is overruled.`,
    docketEntries: [
      { date: 'Jun 28, 2024', text: 'Judgment entered. Judgment of the Court of Appeals vacated and remanded.' },
      { date: 'Jan 17, 2024', text: 'Argued. For petitioners: Paul D. Clement. For respondents: Elizabeth B. Prelogar.' },
    ],
    counsel: [
      { name: 'Paul D. Clement', role: 'Clement & Murphy PLLC, for Petitioners' },
      { name: 'Elizabeth B. Prelogar', role: 'Solicitor General of the United States, for Respondents' },
    ],
  },
  {
    id: 'cluster:85120',
    title: 'Students for Fair Admissions, Inc. v. President and Fellows of Harvard College',
    court: 'Supreme Court of the United States',
    docketNumber: 'No. 20-1199',
    date: '2023-06-29',
    citations: ['600 U.S. 181', '143 S. Ct. 2141'],
    citeCount: 3410,
    judge: 'Chief Justice John G. Roberts, Jr.',
    status: 'Decided · Precedential',
    summary: 'Holding university admissions programs that consider race violate the Equal Protection Clause of the Fourteenth Amendment.',
    fullText: `SUPREME COURT OF THE UNITED STATES\n\nNo. 20-1199\nSTUDENTS FOR FAIR ADMISSIONS, INC., PETITIONER v. PRESIDENT AND FELLOWS OF HARVARD COLLEGE\n\nCHIEF JUSTICE ROBERTS delivered the opinion of the Court:\nHarvard and UNC admissions systems lack sufficiently focused and measurable objectives warranting the use of race, unavoidably employ race in a negative manner, involve racial stereotyping, and lack meaningful end points. Those admissions systems cannot be reconciled with the guarantees of the Equal Protection Clause.`,
    docketEntries: [
      { date: 'Jun 29, 2023', text: 'Reversed and remanded.' },
      { date: 'Oct 31, 2022', text: 'Argued.' },
    ],
    counsel: [
      { name: 'Patrick Strawbridge', role: 'Consovoy McCarthy PLLC, for Petitioner' },
      { name: 'Seth P. Waxman', role: 'Wilmer Cutler Pickering Hale and Dorr LLP, for Respondent' },
    ],
  },
];

const ATTORNEYS_DATA = [
  {
    id: 'atty-1',
    name: 'Paul D. Clement',
    firm: 'Clement & Murphy, PLLC',
    role: 'Former U.S. Solicitor General',
    appearances: 114,
    jurisdictions: ['Supreme Court of the United States', 'D.C. Circuit', 'Second Circuit'],
    notableMatters: 'Argued Loper Bright v. Raimondo, NFIB v. Sebelius, NYSRPA v. Bruen',
  },
  {
    id: 'atty-2',
    name: 'Elizabeth B. Prelogar',
    firm: 'Office of the Solicitor General, U.S. DOJ',
    role: 'Solicitor General of the United States',
    appearances: 88,
    jurisdictions: ['Supreme Court of the United States', 'D.C. Circuit'],
    notableMatters: 'Represented federal government in United States v. Rahimi, FDA v. Alliance for Hippocratic Medicine',
  },
  {
    id: 'atty-3',
    name: 'Neal K. Katyal',
    firm: 'Hogan Lovells LLP',
    role: 'Former Acting U.S. Solicitor General',
    appearances: 50,
    jurisdictions: ['Supreme Court of the United States', 'Ninth Circuit', 'Fourth Circuit'],
    notableMatters: 'Argued Moore v. Harper, Hamdan v. Rumsfeld, Trump v. Hawaii',
  },
  {
    id: 'atty-4',
    name: 'Lisa S. Blatt',
    firm: 'Williams & Connolly LLP',
    role: 'Chair, Supreme Court & Appellate Practice',
    appearances: 48,
    jurisdictions: ['Supreme Court of the United States', 'Federal Circuit', 'Fifth Circuit'],
    notableMatters: 'Highest win rate at SCOTUS: argued Gonzalez v. Google, Jack Daniel\'s v. VIP Products',
  },
];

const LEGISLATORS_DATA = [
  { id: 'leg-1', name: 'Richard J. Durbin', role: 'U.S. Senator', state: 'Illinois', party: 'Democrat', committee: 'Senate Judiciary Committee (Chair)', sponsoredBills: 218 },
  { id: 'leg-2', name: 'Chuck Grassley', role: 'U.S. Senator', state: 'Iowa', party: 'Republican', committee: 'Senate Judiciary Committee (Ranking Member)', sponsoredBills: 240 },
  { id: 'leg-3', name: 'Jim Jordan', role: 'U.S. Representative', state: 'Ohio (4th)', party: 'Republican', committee: 'House Judiciary Committee (Chair)', sponsoredBills: 94 },
  { id: 'leg-4', name: 'Jerrold Nadler', role: 'U.S. Representative', state: 'New York (12th)', party: 'Democrat', committee: 'House Judiciary Committee (Ranking Member)', sponsoredBills: 182 },
  { id: 'leg-5', name: 'Amy Klobuchar', role: 'U.S. Senator', state: 'Minnesota', party: 'Democrat', committee: 'Subcommittee on Competition Policy & Antitrust', sponsoredBills: 175 },
  { id: 'leg-6', name: 'Mike Lee', role: 'U.S. Senator', state: 'Utah', party: 'Republican', committee: 'Subcommittee on the Constitution', sponsoredBills: 130 },
];

/* --------------------------------------------------------------------------
   1. Theme Management (Modern Web Guidance Compliant)
   -------------------------------------------------------------------------- */
class ThemeManager {
  constructor() {
    this.meta = document.querySelector('meta[name="color-scheme"]');
    this.toggleBtn = document.getElementById('theme-toggle-btn');
    this.themeIcon = document.getElementById('theme-toggle-icon');
    
    this.init();
  }

  init() {
    this.updateToggleIcon();

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)')?.addEventListener('change', () => {
        if (!localStorage.getItem('color-scheme')) {
          this.updateToggleIcon();
        }
      });
    }

    window.addEventListener('storage', (e) => {
      if (e.key === 'color-scheme') {
        const scheme = e.newValue || 'light dark';
        if (this.meta) this.meta.content = scheme;
        document.documentElement.setAttribute('data-theme', scheme === 'dark' ? 'dark' : scheme === 'light' ? 'light' : '');
        this.updateToggleIcon();
      }
    });
  }

  isDark() {
    const metaContent = this.meta ? this.meta.content : 'light dark';
    if (metaContent === 'dark') return true;
    if (metaContent === 'light') return false;
    return window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
  }

  toggle() {
    const currentlyDark = this.isDark();
    const systemPrefersDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
    const targetScheme = currentlyDark ? 'light' : 'dark';

    if ((targetScheme === 'dark' && systemPrefersDark) || (targetScheme === 'light' && !systemPrefersDark)) {
      localStorage.removeItem('color-scheme');
      if (this.meta) this.meta.content = 'light dark';
      document.documentElement.removeAttribute('data-theme');
    } else {
      localStorage.setItem('color-scheme', targetScheme);
      if (this.meta) this.meta.content = targetScheme;
      document.documentElement.setAttribute('data-theme', targetScheme);
    }

    this.updateToggleIcon();
  }

  updateToggleIcon() {
    const dark = this.isDark();
    if (this.themeIcon) {
      this.themeIcon.innerHTML = dark
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    }
    if (this.toggleBtn) {
      this.toggleBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      this.toggleBtn.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }
}

/* --------------------------------------------------------------------------
   2. Bookmarks & Research Dossier Storage
   -------------------------------------------------------------------------- */
class DossierStore {
  constructor() {
    this.key = 'bmj_saved_research';
  }

  getSaved() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || { cases: [], judges: [] };
    } catch {
      return { cases: [], judges: [] };
    }
  }

  isSaved(type, id) {
    const data = this.getSaved();
    return Array.isArray(data[type]) && data[type].includes(id);
  }

  toggle(type, id) {
    const data = this.getSaved();
    if (!data[type]) data[type] = [];
    const idx = data[type].indexOf(id);
    if (idx >= 0) {
      data[type].splice(idx, 1);
    } else {
      data[type].push(id);
    }
    localStorage.setItem(this.key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('dossier-updated'));
    return idx < 0;
  }
}

/* --------------------------------------------------------------------------
   3. Main App Controller & Router
   -------------------------------------------------------------------------- */
class BenchmarkApp {
  constructor() {
    this.themeManager = new ThemeManager();
    this.currentView = 'dashboard';
    this.searchFilter = 'all';
    this.searchQuery = '';
    
    this.initElements();
    this.initRouter();
    this.initGreeting();
    this.initCounters();
    this.initTrendGraph();
    this.initLiveFeed();
    this.initCategoryCards();
    this.initSearch();
    this.initCourts();
    this.initKeyboardShortcuts();
  }

  initElements() {
    this.views = {
      dashboard: document.getElementById('view-dashboard'),
      search: document.getElementById('view-search'),
      courts: document.getElementById('view-courts'),
      activity: document.getElementById('view-activity'),
      bookmarks: document.getElementById('view-bookmarks'),
    };

    this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    this.modalOverlay = document.getElementById('detail-modal-overlay');
    this.modalContent = document.getElementById('modal-dynamic-content');
    this.modalCloseBtn = document.getElementById('modal-close-button');

    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => this.closeModal());
    }
    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.modalOverlay) this.closeModal();
      });
    }

    this.mobileToggle = document.getElementById('mobile-nav-btn');
    this.mobileDrawer = document.getElementById('mobile-nav-drawer');
    if (this.mobileToggle && this.mobileDrawer) {
      this.mobileToggle.addEventListener('click', () => {
        this.mobileDrawer.classList.toggle('open');
      });
    }

    window.addEventListener('dossier-updated', () => this.updateDossierBadge());
    this.updateDossierBadge();
  }

  updateDossierBadge() {
    if (!window.dossier) return;
    const saved = window.dossier.getSaved();
    const count = (saved.cases?.length || 0) + (saved.judges?.length || 0);
    const badge = document.getElementById('saved-count-badge');
    if (badge) {
      badge.textContent = count > 0 ? count : '';
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  }

  initRouter() {
    window.addEventListener('hashchange', () => this.handleHashChange());
    this.handleHashChange();

    this.navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          if (this.mobileDrawer) this.mobileDrawer.classList.remove('open');
        }
      });
    });
  }

  handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const [route, param] = hash.split(':');

    if (route === 'case' && param) {
      this.switchView('dashboard');
      this.openCaseModal(param);
      return;
    }
    if (route === 'judge' && param) {
      this.switchView('dashboard');
      this.openJudgeModal(param);
      return;
    }
    if (route === 'category' && param) {
      this.switchView('search');
      this.setSearchFilter(param);
      return;
    }

    this.switchView(route);
  }

  switchView(viewName) {
    if (!this.views[viewName]) viewName = 'dashboard';
    this.currentView = viewName;

    Object.entries(this.views).forEach(([name, el]) => {
      if (el) {
        if (name === viewName) {
          el.classList.add('active-view');
        } else {
          el.classList.remove('active-view');
        }
      }
    });

    this.navLinks.forEach((link) => {
      const target = link.getAttribute('data-view');
      if (target === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    if (typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (viewName === 'bookmarks') {
      this.renderBookmarksView();
    }
  }

  initGreeting() {
    const h = new Date().getHours();
    let text = 'Good evening';
    if (h < 12) text = 'Good morning';
    else if (h < 18) text = 'Good afternoon';
    const el = document.getElementById('hero-greeting-text');
    if (el) el.textContent = `${text} · Judicial Research`;
  }

  initCounters() {
    const grid = document.getElementById('coverage-counters-container');
    if (!grid) return;

    const stats = [
      { label: 'Published opinions', value: COVERAGE_STATS.opinions, tone: 'tone-gold', icon: 'file-text' },
      { label: 'Federal dockets (approx.)', value: COVERAGE_STATS.dockets, tone: 'tone-teal', icon: 'folder' },
      { label: 'Judges indexed', value: COVERAGE_STATS.judges, tone: 'tone-success', icon: 'gavel' },
      { label: 'Active courts', value: COVERAGE_STATS.courts, tone: 'tone-warning', icon: 'landmark' },
      { label: 'Attorneys on record', value: COVERAGE_STATS.attorneys, tone: 'tone-info', icon: 'briefcase' },
      { label: 'Members of Congress', value: COVERAGE_STATS.legislators, tone: 'tone-plum', icon: 'vote' },
    ];

    const iconSvgs = {
      'file-text': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
      folder: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>`,
      gavel: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/></svg>`,
      landmark: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" x2="22" y1="22" y2="22"/><line x1="12" x2="12" y1="6" y2="18"/><line x1="6" x2="6" y1="10" y2="18"/><line x1="18" x2="18" y1="10" y2="18"/><path d="m3 6 9-4 9 4"/></svg>`,
      briefcase: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>`,
      vote: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/><path d="M22 19H2"/></svg>`,
    };

    grid.innerHTML = stats
      .map(
        (s) => `
      <div class="counter-stat-card">
        <div class="counter-icon-tile ${s.tone}">
          ${iconSvgs[s.icon] || ''}
        </div>
        <div class="counter-stat-value">${s.value}</div>
        <div class="counter-stat-label">${s.label}</div>
      </div>
    `
      )
      .join('');
  }

  initTrendGraph() {
    const container = document.getElementById('trend-chart-container');
    if (!container) return;

    const width = 500;
    const height = 180;
    const padX = 24;
    const padTop = 20;
    const padBottom = 34;
    const graphH = height - padTop - padBottom;
    const max = Math.max(...TREND_DATA.map((p) => p.value));
    const step = (width - padX * 2) / (TREND_DATA.length - 1);

    const coords = TREND_DATA.map((p, i) => ({
      ...p,
      x: padX + i * step,
      y: padTop + (1 - p.value / max) * graphH,
    }));

    const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
    const areaD = `${pathD} L ${coords[coords.length - 1].x.toFixed(1)} ${height - padBottom} L ${coords[0].x.toFixed(1)} ${height - padBottom} Z`;

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%; overflow: visible;">
        <defs>
          <linearGradient id="gold-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#C2A15A" stop-opacity="0.38"/>
            <stop offset="100%" stop-color="#C2A15A" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <line x1="${padX}" y1="${padTop + graphH / 2}" x2="${width - padX}" y2="${padTop + graphH / 2}" stroke="var(--divider)" stroke-dasharray="3 3"/>
        <line x1="${padX}" y1="${height - padBottom}" x2="${width - padX}" y2="${height - padBottom}" stroke="var(--border)"/>
        
        <path d="${areaD}" fill="url(#gold-grad)"/>
        <path d="${pathD}" fill="none" stroke="var(--gold-400)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        
        ${coords
          .map(
            (c, i) => `
          <circle cx="${c.x}" cy="${c.y}" r="4" fill="var(--surface)" stroke="var(--gold-400)" stroke-width="2.2" class="chart-point-dot" data-idx="${i}" style="cursor: pointer;"/>
          <text x="${c.x}" y="${height - 12}" text-anchor="middle" font-size="10" fill="var(--text-tertiary)" font-family="var(--font-mono)">${c.year}</text>
        `
          )
          .join('')}
      </svg>
      <div id="chart-tooltip" style="position: absolute; display: none; padding: 6px 12px; background: var(--navy-900); color: var(--parchment); border: 1px solid var(--accent-border); border-radius: var(--radius-xs); font-size: 0.75rem; pointer-events: none; z-index: 10; box-shadow: var(--shadow-md);"></div>
    `;

    const dots = container.querySelectorAll('.chart-point-dot');
    const tooltip = container.querySelector('#chart-tooltip');

    dots.forEach((dot) => {
      dot.addEventListener('mouseenter', () => {
        const idx = Number(dot.getAttribute('data-idx'));
        const item = TREND_DATA[idx];
        if (tooltip && item) {
          tooltip.innerHTML = `<strong>${item.year}</strong>: ${item.value.toLocaleString()} records filed`;
          tooltip.style.display = 'block';
          tooltip.style.left = `${dot.cx.baseVal.value - 40}px`;
          tooltip.style.top = `${dot.cy.baseVal.value - 36}px`;
        }
      });
      dot.addEventListener('mouseleave', () => {
        if (tooltip) tooltip.style.display = 'none';
      });
    });
  }

  initLiveFeed() {
    const container = document.getElementById('live-feed-container');
    if (!container) return;

    container.innerHTML = LIVE_FEED_ITEMS.map(
      (item) => `
      <article class="feed-item-card" data-route-id="${item.routeId}">
        <div class="feed-item-meta-top">
          <span class="feed-item-tag ${item.kind === 'opinion' ? 'tone-gold' : 'tone-teal'}">${item.tag}</span>
          <span class="feed-item-time">${item.timeAgo}</span>
        </div>
        <div class="feed-item-main">
          <div>
            <h4 class="feed-item-title">${item.title}</h4>
            <div class="feed-item-court">${item.court}</div>
          </div>
        </div>
        ${
          item.detail
            ? `
          <div class="feed-item-quote">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/></svg>
            <span>${item.detail}</span>
          </div>
        `
            : ''
        }
      </article>
    `
    ).join('');

    container.querySelectorAll('.feed-item-card').forEach((card) => {
      card.addEventListener('click', () => {
        const routeId = card.getAttribute('data-route-id');
        if (routeId) {
          const [kind, id] = routeId.split(':');
          if (kind === 'cluster') this.openCaseModal(`cluster:${id}`);
          else if (kind === 'docket') this.openCaseModal(`docket:${id}`);
        }
      });
    });
  }

  initCategoryCards() {
    const cards = document.querySelectorAll('.entity-card');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const cat = card.getAttribute('data-category');
        if (cat === 'courts') {
          window.location.hash = '#courts';
        } else {
          window.location.hash = `#category:${cat}`;
        }
      });
    });
  }

  initSearch() {
    this.heroSearchInput = document.getElementById('hero-search-input');
    this.heroSearchBtn = document.getElementById('hero-search-btn');
    this.mainSearchInput = document.getElementById('main-search-input');
    this.filterPills = document.querySelectorAll('.filter-pill');
    this.searchResultsContainer = document.getElementById('search-results-container');
    this.resultsCountLabel = document.getElementById('search-results-count');

    if (this.heroSearchBtn && this.heroSearchInput) {
      const execHeroSearch = () => {
        const q = this.heroSearchInput.value.trim();
        window.location.hash = '#search';
        if (this.mainSearchInput) this.mainSearchInput.value = q;
        this.performSearch(q);
      };

      this.heroSearchBtn.addEventListener('click', execHeroSearch);
      this.heroSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') execHeroSearch();
      });
    }

    document.querySelectorAll('.quick-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const text = chip.textContent.trim().replace(/^"|"$/g, '');
        window.location.hash = '#search';
        if (this.mainSearchInput) this.mainSearchInput.value = text;
        this.performSearch(text);
      });
    });

    if (this.mainSearchInput) {
      let timeout = null;
      this.mainSearchInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.performSearch(this.mainSearchInput.value.trim());
        }, 180);
      });
      this.mainSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          clearTimeout(timeout);
          this.performSearch(this.mainSearchInput.value.trim());
        }
      });
    }

    this.filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        this.setSearchFilter(pill.getAttribute('data-filter'));
      });
    });

    this.performSearch('');
  }

  setSearchFilter(filterName) {
    this.searchFilter = filterName || 'all';
    this.filterPills.forEach((p) => {
      if (p.getAttribute('data-filter') === this.searchFilter) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
    const q = this.mainSearchInput ? this.mainSearchInput.value.trim() : '';
    this.performSearch(q);
  }

  performSearch(query) {
    this.searchQuery = (query || '').trim();
    const results = [];

    if (this.searchFilter === 'all' || this.searchFilter === 'judges') {
      JUDGES_DATA.forEach((j) => {
        const fields = [
          j.name,
          j.title,
          j.court,
          j.nominatedBy,
          j.education,
          j.biography,
          ...(j.aliases || []),
          ...(j.notableCases ? j.notableCases.map((c) => c.name) : []),
        ];
        if (!this.searchQuery || matchesQuery(this.searchQuery, fields)) {
          results.push({
            type: 'judge',
            id: j.id,
            title: j.name,
            subtitle: `${j.title} · ${j.court}`,
            tag: j.nominatedBy ? `Nominated by ${j.nominatedBy}` : 'Judge',
            tone: 'tone-gold',
            item: j,
          });
        }
      });
    }

    if (this.searchFilter === 'all' || this.searchFilter === 'cases') {
      CASES_DATA.forEach((c) => {
        const fields = [
          c.title,
          c.court,
          c.docketNumber,
          c.judge,
          c.summary,
          ...(c.keywords || []),
          ...(c.counsel ? c.counsel.map((cn) => cn.name) : []),
          ...(c.citations || []),
        ];
        if (!this.searchQuery || matchesQuery(this.searchQuery, fields)) {
          results.push({
            type: 'case',
            id: c.id,
            title: c.title,
            subtitle: `${c.docketNumber} · ${c.court} (${c.date})`,
            tag: `${c.citeCount} citations · ${c.status.split('·')[0].trim()}`,
            tone: 'tone-teal',
            item: c,
          });
        }
      });
    }

    if (this.searchFilter === 'all' || this.searchFilter === 'attorneys') {
      ATTORNEYS_DATA.forEach((a) => {
        const fields = [
          a.name,
          a.firm,
          a.role,
          a.notableMatters,
          ...(a.jurisdictions || []),
          ...(a.aliases || []),
        ];
        if (!this.searchQuery || matchesQuery(this.searchQuery, fields)) {
          results.push({
            type: 'attorney',
            id: a.id,
            title: a.name,
            subtitle: `${a.role} · ${a.firm}`,
            tag: `${a.appearances} appearances`,
            tone: 'tone-info',
            item: a,
          });
        }
      });
    }

    if (this.searchFilter === 'all' || this.searchFilter === 'legislators') {
      LEGISLATORS_DATA.forEach((l) => {
        const fields = [
          l.name,
          l.role,
          l.state,
          l.party,
          l.committee,
          ...(l.aliases || []),
        ];
        if (!this.searchQuery || matchesQuery(this.searchQuery, fields)) {
          results.push({
            type: 'legislator',
            id: l.id,
            title: l.name,
            subtitle: `${l.role} (${l.party}-${l.state}) · ${l.committee}`,
            tag: `${l.sponsoredBills} sponsored bills`,
            tone: 'tone-plum',
            item: l,
          });
        }
      });
    }

    this.renderSearchResults(results);
  }

  renderSearchResults(results) {
    if (!this.searchResultsContainer) return;

    if (this.resultsCountLabel) {
      this.resultsCountLabel.textContent = `${results.length} result${results.length === 1 ? '' : 's'}`;
    }

    if (results.length === 0) {
      this.searchResultsContainer.innerHTML = `
        <div style="padding: 64px 20px; text-align: center; color: var(--text-tertiary);">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 16px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <h3 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--text);">No records found</h3>
          <p style="margin-top: 6px; font-size: 0.9rem;">Try adjusting your query or selecting "All" categories.</p>
        </div>
      `;
      return;
    }

    this.searchResultsContainer.innerHTML = results
      .map(
        (r) => `
      <div class="result-card-row" data-type="${r.type}" data-id="${r.id}">
        <div class="result-info-group">
          <div>
            <h4 class="result-title">${r.title}</h4>
            <div class="result-subtitle">${r.subtitle}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; flex-shrink: 0;">
          <span class="badge ${r.tone}">${r.tag}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>
    `
      )
      .join('');

    this.searchResultsContainer.querySelectorAll('.result-card-row').forEach((row) => {
      row.addEventListener('click', () => {
        const type = row.getAttribute('data-type');
        const id = row.getAttribute('data-id');
        if (type === 'case') this.openCaseModal(id);
        else if (type === 'judge') this.openJudgeModal(id);
        else if (type === 'attorney') this.openAttorneyModal(id);
        else if (type === 'legislator') this.openLegislatorModal(id);
      });
    });
  }

  initCourts() {
    const container = document.getElementById('courts-grid-container');
    if (!container) return;

    container.innerHTML = COURTS_DATA.map(
      (c) => `
      <div class="court-card" data-court-id="${c.id}">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <span class="court-code-pill">${c.shortName}</span>
          <span class="badge tone-warning">${c.jurisdiction}</span>
        </div>
        <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--text);">${c.fullName}</h4>
        <div style="display: flex; gap: 16px; margin-top: 14px; font-size: 0.82rem; color: var(--text-tertiary); border-top: 1px solid var(--divider); padding-top: 10px;">
          <span>Citation: <strong>${c.citation}</strong></span>
          <span>Active Judges: <strong>${c.activeJudges}</strong></span>
          <span>Dockets: <strong>${c.totalCases}</strong></span>
        </div>
      </div>
    `
    ).join('');

    container.querySelectorAll('.court-card').forEach((card) => {
      card.addEventListener('click', () => {
        const courtId = card.getAttribute('data-court-id');
        const court = COURTS_DATA.find((c) => c.id === courtId);
        if (court) this.openCourtModal(court);
      });
    });
  }

  openModal(html) {
    if (this.modalContent && this.modalOverlay) {
      this.modalContent.innerHTML = html;
      this.modalOverlay.classList.add('open');
      if (document.body) document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    if (this.modalOverlay) {
      this.modalOverlay.classList.remove('open');
      if (document.body) document.body.style.overflow = '';
    }
  }

  openJudgeModal(id) {
    const judge = JUDGES_DATA.find((j) => j.id === id) || JUDGES_DATA[0];
    const isSaved = window.dossier?.isSaved('judges', judge.id);

    const html = `
      <div class="modal-header-hero">
        <div class="profile-modal-avatar">
          ${judge.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
        </div>
        <span class="badge tone-gold">${judge.status} · ${judge.jurisdiction}</span>
        <h2 style="font-family: var(--font-serif); font-size: 2rem; margin-top: 8px; color: var(--parchment);">${judge.name}</h2>
        <div style="color: var(--gold-300); font-size: 1rem; margin-top: 4px;">${judge.title}</div>
        <div style="color: var(--navy-300); font-size: 0.9rem;">${judge.court}</div>

        <div style="margin-top: 18px; display: flex; gap: 10px;">
          <button id="save-judge-btn" class="quick-chip" style="background: var(--surface); color: var(--text);">
            ${isSaved ? '★ Saved to Dossier' : '☆ Bookmark Judge'}
          </button>
        </div>
      </div>

      <div class="modal-body-padding">
        <div class="stat-pills-row">
          <div class="stat-pill-box">
            <div class="stat-pill-lbl">Authored Opinions</div>
            <div class="stat-pill-val">${judge.authoredOpinions}</div>
          </div>
          <div class="stat-pill-box">
            <div class="stat-pill-lbl">Tenure</div>
            <div class="stat-pill-val">${judge.yearsOfService}</div>
          </div>
          <div class="stat-pill-box">
            <div class="stat-pill-lbl">Nominated By</div>
            <div class="stat-pill-val" style="font-size: 1rem;">${judge.nominatedBy}</div>
          </div>
          <div class="stat-pill-box">
            <div class="stat-pill-lbl">Confirmed</div>
            <div class="stat-pill-val" style="font-size: 0.95rem;">${judge.confirmationDate}</div>
          </div>
        </div>

        <div style="margin-top: 28px;">
          <h4 class="section-eyebrow">Biography & Background</h4>
          <p style="margin-top: 8px; line-height: 1.6; color: var(--text-secondary);">${judge.biography}</p>
        </div>

        <div style="margin-top: 24px;">
          <h4 class="section-eyebrow">Education</h4>
          <p style="margin-top: 6px; color: var(--text);">${judge.education}</p>
        </div>

        <div style="margin-top: 28px;">
          <h4 class="section-eyebrow">Precedential Opinions</h4>
          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
            ${judge.notableCases
              .map(
                (c) => `
              <div style="padding: 12px 14px; background: var(--surface-sunken); border: 1px solid var(--border); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-family: var(--font-serif); font-weight: 700; color: var(--text);">${c.name}</div>
                  <div style="font-size: 0.8rem; color: var(--text-tertiary);">${c.year}</div>
                </div>
                <span class="badge tone-teal">${c.cites} citations</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    this.openModal(html);

    document.getElementById('save-judge-btn')?.addEventListener('click', () => {
      const savedNow = window.dossier?.toggle('judges', judge.id);
      const btn = document.getElementById('save-judge-btn');
      if (btn) btn.textContent = savedNow ? '★ Saved to Dossier' : '☆ Bookmark Judge';
    });
  }

  openCaseModal(id) {
    const caseItem = CASES_DATA.find((c) => c.id === id) || CASES_DATA[0];
    const isSaved = window.dossier?.isSaved('cases', caseItem.id);

    const html = `
      <div class="modal-header-hero">
        <span class="badge tone-teal">${caseItem.status}</span>
        <h2 style="font-family: var(--font-serif); font-size: 1.85rem; margin-top: 10px; color: var(--parchment); line-height: 1.25;">${caseItem.title}</h2>
        <div style="color: var(--gold-300); font-size: 0.95rem; margin-top: 6px;">${caseItem.court} · ${caseItem.docketNumber}</div>
        <div style="color: var(--navy-300); font-size: 0.85rem;">Date Filed: ${caseItem.date} · Citing references: ${caseItem.citeCount}</div>

        <div style="margin-top: 18px; display: flex; gap: 10px;">
          <button id="save-case-btn" class="quick-chip" style="background: var(--surface); color: var(--text);">
            ${isSaved ? '★ Saved to Dossier' : '☆ Bookmark Case'}
          </button>
          <button id="copy-citation-btn" class="quick-chip" style="background: var(--surface); color: var(--text);">
            Copy Citation
          </button>
        </div>
      </div>

      <div class="modal-body-padding">
        <div style="padding: 16px; background: var(--surface-sunken); border-left: 3px solid var(--accent); border-radius: var(--radius-md); font-size: 0.95rem; line-height: 1.55; color: var(--text);">
          <strong>Summary:</strong> ${caseItem.summary}
        </div>

        <div style="margin-top: 24px;">
          <h4 class="section-eyebrow">Counsel of Record</h4>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
            ${caseItem.counsel
              .map(
                (co) => `
              <div style="font-size: 0.9rem; color: var(--text);">
                <strong>${co.name}</strong> — <span style="color: var(--text-secondary);">${co.role}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <div style="margin-top: 28px;">
          <h4 class="section-eyebrow">Full Opinion Text</h4>
          <div style="margin-top: 10px; padding: 20px; background: var(--surface-sunken); border: 1px solid var(--border); border-radius: var(--radius-lg); font-family: var(--font-serif); font-size: 0.95rem; line-height: 1.7; white-space: pre-wrap; max-height: 380px; overflow-y: auto; color: var(--text);">
${caseItem.fullText}
          </div>
        </div>

        <div style="margin-top: 28px;">
          <h4 class="section-eyebrow">Docket Proceedings & Filings</h4>
          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
            ${caseItem.docketEntries
              .map(
                (d) => `
              <div style="padding: 12px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 0.85rem;">
                <span style="font-family: var(--font-mono); color: var(--accent); font-weight: 600;">${d.date}</span>: ${d.text}
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    this.openModal(html);

    document.getElementById('save-case-btn')?.addEventListener('click', () => {
      const savedNow = window.dossier?.toggle('cases', caseItem.id);
      const btn = document.getElementById('save-case-btn');
      if (btn) btn.textContent = savedNow ? '★ Saved to Dossier' : '☆ Bookmark Case';
    });

    document.getElementById('copy-citation-btn')?.addEventListener('click', () => {
      const cit = caseItem.citations ? caseItem.citations[0] : caseItem.docketNumber;
      navigator.clipboard.writeText(`${caseItem.title}, ${cit} (${caseItem.date.split('-')[0]})`);
      const btn = document.getElementById('copy-citation-btn');
      if (btn) btn.textContent = 'Citation Copied!';
      setTimeout(() => {
        if (btn) btn.textContent = 'Copy Citation';
      }, 2000);
    });
  }

  openAttorneyModal(id) {
    const at = ATTORNEYS_DATA.find((a) => a.id === id) || ATTORNEYS_DATA[0];
    const html = `
      <div class="modal-header-hero">
        <span class="badge tone-info">${at.role}</span>
        <h2 style="font-family: var(--font-serif); font-size: 1.85rem; margin-top: 10px; color: var(--parchment);">${at.name}</h2>
        <div style="color: var(--gold-300); font-size: 0.95rem; margin-top: 4px;">${at.firm}</div>
      </div>
      <div class="modal-body-padding">
        <div class="stat-pills-row">
          <div class="stat-pill-box">
            <div class="stat-pill-lbl">Federal Appearances</div>
            <div class="stat-pill-val">${at.appearances}</div>
          </div>
        </div>
        <div style="margin-top: 24px;">
          <h4 class="section-eyebrow">Admitted Jurisdictions</h4>
          <ul style="margin-top: 8px; padding-left: 20px; color: var(--text-secondary); line-height: 1.6;">
            ${at.jurisdictions.map((j) => `<li>${j}</li>`).join('')}
          </ul>
        </div>
        <div style="margin-top: 20px;">
          <h4 class="section-eyebrow">Notable Matters</h4>
          <p style="margin-top: 6px; color: var(--text);">${at.notableMatters}</p>
        </div>
      </div>
    `;
    this.openModal(html);
  }

  openLegislatorModal(id) {
    const leg = LEGISLATORS_DATA.find((l) => l.id === id) || LEGISLATORS_DATA[0];
    const html = `
      <div class="modal-header-hero">
        <span class="badge tone-plum">${leg.party} · ${leg.state}</span>
        <h2 style="font-family: var(--font-serif); font-size: 1.85rem; margin-top: 10px; color: var(--parchment);">${leg.name}</h2>
        <div style="color: var(--gold-300); font-size: 0.95rem; margin-top: 4px;">${leg.role}</div>
      </div>
      <div class="modal-body-padding">
        <div class="stat-pills-row">
          <div class="stat-pill-box">
            <div class="stat-pill-lbl">Sponsored Legislation</div>
            <div class="stat-pill-val">${leg.sponsoredBills}</div>
          </div>
        </div>
        <div style="margin-top: 24px;">
          <h4 class="section-eyebrow">Committee Assignments</h4>
          <p style="margin-top: 6px; font-weight: 600; color: var(--text);">${leg.committee}</p>
        </div>
      </div>
    `;
    this.openModal(html);
  }

  openCourtModal(court) {
    const html = `
      <div class="modal-header-hero">
        <span class="court-code-pill" style="margin-bottom: 8px;">${court.shortName}</span>
        <h2 style="font-family: var(--font-serif); font-size: 1.85rem; margin-top: 8px; color: var(--parchment);">${court.fullName}</h2>
        <div style="color: var(--gold-300); font-size: 0.95rem; margin-top: 4px;">Jurisdiction: ${court.jurisdiction} · Citation: ${court.citation}</div>
      </div>
      <div class="modal-body-padding">
        <div class="stat-pills-row">
          <div class="stat-pill-box">
            <div class="stat-pill-lbl">Active Judges</div>
            <div class="stat-pill-val">${court.activeJudges}</div>
          </div>
          <div class="stat-pill-box">
            <div class="stat-pill-lbl">Archived Dockets</div>
            <div class="stat-pill-val">${court.totalCases}</div>
          </div>
        </div>
        <div style="margin-top: 24px;">
          <button class="search-action-btn" style="width: 100%; justify-content: center;" onclick="window.location.hash='#search'; benchmarkApp.mainSearchInput.value='${court.shortName}'; benchmarkApp.performSearch('${court.shortName}'); benchmarkApp.closeModal();">
            Search All Cases in ${court.shortName}
          </button>
        </div>
      </div>
    `;
    this.openModal(html);
  }

  renderBookmarksView() {
    const container = document.getElementById('bookmarks-list-container');
    if (!container || !window.dossier) return;

    const saved = window.dossier.getSaved();
    const savedCases = CASES_DATA.filter((c) => saved.cases.includes(c.id));
    const savedJudges = JUDGES_DATA.filter((j) => saved.judges.includes(j.id));

    if (savedCases.length === 0 && savedJudges.length === 0) {
      container.innerHTML = `
        <div style="padding: 48px 20px; text-align: center; color: var(--text-tertiary);">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 16px;"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          <h3 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--text);">No saved records yet</h3>
          <p style="margin-top: 6px; font-size: 0.9rem;">Click "Bookmark" on any case or judge profile to add it to your research dossier.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${savedCases
          .map(
            (c) => `
          <div class="result-card-row" onclick="benchmarkApp.openCaseModal('${c.id}')">
            <div>
              <span class="badge tone-teal">Case Law</span>
              <h4 class="result-title" style="margin-top: 6px;">${c.title}</h4>
              <div class="result-subtitle">${c.court} · ${c.docketNumber}</div>
            </div>
            <button class="quick-chip" onclick="event.stopPropagation(); window.dossier.toggle('cases', '${c.id}'); benchmarkApp.renderBookmarksView();">Remove</button>
          </div>
        `
          )
          .join('')}
        ${savedJudges
          .map(
            (j) => `
          <div class="result-card-row" onclick="benchmarkApp.openJudgeModal('${j.id}')">
            <div>
              <span class="badge tone-gold">Judge</span>
              <h4 class="result-title" style="margin-top: 6px;">${j.name}</h4>
              <div class="result-subtitle">${j.title} · ${j.court}</div>
            </div>
            <button class="quick-chip" onclick="event.stopPropagation(); window.dossier.toggle('judges', '${j.id}'); benchmarkApp.renderBookmarksView();">Remove</button>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        window.location.hash = '#search';
        setTimeout(() => {
          if (this.mainSearchInput) this.mainSearchInput.focus();
        }, 100);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   Initialization with DOM Ready Protection
   -------------------------------------------------------------------------- */
function startBenchmarkApp() {
  window.dossier = new DossierStore();
  window.benchmarkApp = new BenchmarkApp();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startBenchmarkApp);
} else {
  startBenchmarkApp();
}
