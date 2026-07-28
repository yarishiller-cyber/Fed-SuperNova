/* =========================================================================
   Funding dataset — U.S. federal & non-dilutive funding sources a defense /
   dual-use startup pursuing simulation-heavy technology would care about.
   Figures summarized from official agency pages + public reporting as of the
   date below. ALWAYS re-verify on the linked official source before relying
   on any number — award caps, deadlines and intake status change constantly.

   2026 note: The federal SBIR/STTR program LAPSED for ~6 months
   (Oct 2025 – Mar 2026) and was reauthorized in March 2026 through FY2031,
   adding a new late-stage "Strategic Breakthrough" Phase II (up to ~$30M at
   large agencies). Agencies reopened solicitations after the March 2026
   signing, so SBIR/STTR is open again — verify each agency's current cycle.
   ========================================================================= */

const LAST_VERIFIED = "2026-07";

/* Facet vocabularies (order = display order) */
const FACETS = {
  dept: ["DoD", "DOE", "Civilian", "Cross-agency"],
  mechanism: [
    "SBIR / STTR", "R&D Contract / BAA", "Other Transaction (Prototype)",
    "Matching Funds", "Prize / Challenge", "Loan / Loan Guarantee",
    "Production Transition", "Accelerator", "Regional / Ecosystem"
  ],
  capital: ["Non-dilutive", "Debt (non-dilutive)"],
  award: ["< $100K", "$100K–$500K", "$500K–$2M", "$2M–$15M", "$15M+"],
  tech: [
    "Aerospace", "Space", "Autonomy / UAV", "Hypersonics", "Directed Energy",
    "Microelectronics", "RF / Sensors", "Energy / Power", "Propulsion",
    "Advanced Materials", "Cyber", "AI / ML", "Ballistics / Weapons",
    "Quantum", "Biotech / Health"
  ]
};

const PROGRAMS = [
  {
    id: "dod-sbir",
    name: "DoD SBIR / STTR",
    funder: "DoD (all services)",
    dept: "DoD",
    mechanism: "SBIR / STTR",
    capital: "Non-dilutive",
    award: "$2M–$15M",
    typical: "Phase I ≤ ~$323K · Phase II ≤ ~$2.15M · new Strategic Breakthrough Ph II ≤ ~$30M",
    eligibility: "US small business, <500 employees, 51%+ US-owned.",
    tech: ["Aerospace", "RF / Sensors", "AI / ML", "Autonomy / UAV", "Advanced Materials"],
    desc: "The foundational non-dilutive R&D program across every military service — phased funding from feasibility to prototype. Reauthorized through FY2031.",
    detail: "America's Seed Fund for defense. Phase I proves feasibility; Phase II builds a prototype; Phase III transitions to production (no SBIR dollar cap). FY2026 SBA guideline caps are roughly Phase I ≤ $323,090 and Phase II ≤ $2,153,927 without a waiver. The program lapsed Oct 2025–Mar 2026 and was reauthorized through FY2031, which also created a new late-stage 'Strategic Breakthrough' Phase II worth up to ~$30M at large agencies (sunsets 2031). Verify the current caps and open topics on sbir.gov.",
    source: "https://www.sbir.gov"
  },
  {
    id: "afwerx",
    name: "AFWERX SBIR / STTR (Open Topic)",
    funder: "AFWERX (Dept. of the Air Force)",
    dept: "DoD",
    mechanism: "SBIR / STTR",
    capital: "Non-dilutive",
    award: "$500K–$2M",
    typical: "Ph I ≤ ~$75K (SBIR) / ~$110K (STTR) · Ph II up to ~$2M · D2P2 up to ~$1.25M",
    eligibility: "US small business with an Air Force customer / dual-use tech.",
    tech: ["Aerospace", "Autonomy / UAV", "AI / ML", "RF / Sensors", "Directed Energy"],
    desc: "The Air Force's fast, company-led 'Open Topic' path — you pitch your own dual-use technology rather than answering a narrow topic.",
    detail: "AFWERX runs Open Topic SBIR/STTR cycles where founders propose their own solution. Phase I is a ~3-month feasibility study (up to ~$75K SBIR / ~$110K STTR); Phase II runs up to ~$2M; a Direct-to-Phase-II option (up to ~$1.25M) is open to teams with a signed customer memorandum. Solicitations reopened after the March 2026 reauthorization with a higher customer-evidence bar than the 2019–2023 era. AFWERX announces STRATFI/TACFI selections at Fed Supernova. Confirm exact amounts on the live solicitation.",
    source: "https://afwerx.com/divisions/sbir-sttr/"
  },
  {
    id: "spacewerx",
    name: "SpaceWERX SBIR / STTR (incl. Orbital Prime)",
    funder: "SpaceWERX (US Space Force)",
    dept: "DoD",
    mechanism: "SBIR / STTR",
    capital: "Non-dilutive",
    award: "$500K–$2M",
    typical: "Same SBIR/STTR structure as AFWERX; expanded Direct-to-Phase-II",
    eligibility: "US small business with space / on-orbit dual-use technology.",
    tech: ["Space", "RF / Sensors", "Propulsion", "AI / ML"],
    desc: "The Space Force innovation arm — SBIR/STTR for on-orbit, launch, comms, and space-domain-awareness technology.",
    detail: "SpaceWERX mirrors the AFWERX Open Topic model for space technologies (on-orbit servicing, propulsion, space comms, SDA sensors) and is the gateway to STRATFI/TACFI matching for space startups. A 26.BX specific-topic solicitation was open through mid-Aug 2026, with additional opportunities (on-orbit logistics, defensive cyber, cislunar SDA, novel sensing) released in May 2026. The Orbital Prime line (on-orbit servicing/debris) has cumulatively awarded ~175 contracts totaling ~$121M. Verify the current window on spacewerx.us.",
    source: "https://spacewerx.us/get-funded/"
  },
  {
    id: "stratfi",
    name: "STRATFI (Strategic Funding Increase)",
    funder: "AFWERX / SpaceWERX",
    dept: "DoD",
    mechanism: "Matching Funds",
    capital: "Non-dilutive",
    award: "$2M–$15M",
    typical: "$3M–$15M total (SBIR + government + private match)",
    eligibility: "Active or recent SBIR Phase II awardee with a DAF/USSF need + private match.",
    tech: ["Aerospace", "Space", "Autonomy / UAV", "AI / ML", "RF / Sensors"],
    desc: "The 'valley of death' bridge — blends SBIR, government, and matching private dollars to scale a Phase II into a program of record.",
    detail: "STRATFI combines SBIR funds, additional government money, and matched private capital into a single $3M–$15M package to bridge Phase II toward Phase III. Match structure: for every $1 of SBIR/STTR, the company brings ~$2 of other government funds (or $1 other-government + $2 private). It runs on an annual program-year cycle (PY26 active in 2026), with selections announced at events including Fed Supernova.",
    source: "https://spacewerx.us/accelerate/stratfi-tacfi/"
  },
  {
    id: "tacfi",
    name: "TACFI (Tactical Funding Increase)",
    funder: "AFWERX / SpaceWERX",
    dept: "DoD",
    mechanism: "Matching Funds",
    capital: "Non-dilutive",
    award: "$500K–$2M",
    typical: "$375K–$2M total (SBIR + government/private match, ≥1:1)",
    eligibility: "Active or recent SBIR Phase II awardee with a DAF/USSF need + private match.",
    tech: ["Aerospace", "Space", "AI / ML", "RF / Sensors"],
    desc: "A smaller, faster matching-funds bridge than STRATFI for maturing a Phase II effort toward transition.",
    detail: "TACFI provides $375K–$2M of blended funding to keep momentum between Phase II and a production contract. Match: for every $1 of SBIR/STTR, at least $1 of other (non-SBIR) government or private funding. It runs in the same annual PY26 STRATFI/TACFI cycle, with selections announced at events including Fed Supernova.",
    source: "https://afwerx.com/divisions/sbir-sttr/stratfi-tacfi/"
  },
  {
    id: "diu-cso",
    name: "DIU Commercial Solutions Opening (CSO)",
    funder: "Defense Innovation Unit (DIU)",
    dept: "DoD",
    mechanism: "Other Transaction (Prototype)",
    capital: "Non-dilutive",
    award: "$500K–$2M",
    typical: "Prototype OTs ~$500K–$5M · target award in 60–90 days",
    eligibility: "Any entity; commercial / nontraditional vendors favored.",
    tech: ["AI / ML", "Autonomy / UAV", "Cyber", "Space", "Energy / Power"],
    desc: "The fastest DoD on-ramp for commercial tech — prototype Other Transaction agreements awarded in as little as 60–90 days.",
    detail: "DIU uses the CSO / Other Transaction authority (10 U.S.C. § 4022) to prototype commercial technology against real warfighter problems. It is a standing, continuously open solicitation (amended March 2026), with 450+ prototype OTs (~$1.7B) since 2016 and a DIU FY2026 budget around $979M. Successful prototypes can convert to sole-source production. Under new leadership in 2026, focus has narrowed toward tech fieldable within ~3 years.",
    source: "https://www.diu.mil"
  },
  {
    id: "nsic",
    name: "NSIC (National Security Innovation Capital)",
    funder: "NSIC (within DIU)",
    dept: "DoD",
    mechanism: "Other Transaction (Prototype)",
    capital: "Non-dilutive",
    award: "$500K–$2M",
    typical: "~$500K–$3M (avg ~$1.8M) · rolling intake · ~8–36 mo performance",
    eligibility: "US dual-use hardware startup at TRL 3+.",
    tech: ["Autonomy / UAV", "RF / Sensors", "Space", "Energy / Power", "Microelectronics"],
    desc: "Non-dilutive hardware capital for dual-use startups — funds hardware milestones so founders don't rely on adversarial capital.",
    detail: "NSIC (now operating within DIU) funds development of dual-use hardware (autonomy, communications, sensors, space, power) with roughly $500K–$3M fixed-price Other Transaction agreements (average ~$1.8M) over ~8–36 months. Pitch decks are accepted year-round through a rolling Commercial Acceleration Opportunity. Verify current intake before relying on it.",
    source: "https://nsic.mil"
  },
  {
    id: "darpa",
    name: "DARPA Broad Agency Announcement (BAA)",
    funder: "DARPA",
    dept: "DoD",
    mechanism: "R&D Contract / BAA",
    capital: "Non-dilutive",
    award: "$2M–$15M",
    typical: "~$500K–$20M · contracts, grants, cooperative agreements, OTs",
    eligibility: "Any qualified performer (company, university, individual).",
    tech: ["AI / ML", "Microelectronics", "Hypersonics", "Space", "Directed Energy", "Quantum"],
    desc: "High-risk, high-reward breakthrough research across six technical offices with a ~$4.9B FY2026 budget request.",
    detail: "DARPA's primary instrument is the BAA, run continuously across all six technical offices via grants.gov / SAM.gov. Awards commonly range ~$500K–$20M depending on the program and your role, and can be contracts, grants, cooperative agreements, or Other Transactions. An accelerated pathway exists for sub-$2M proposals (awards ~30 days from selection). Ideal for founders with genuinely novel, physics-hard technology that needs validation.",
    source: "https://www.darpa.mil/work-with-us/opportunities"
  },
  {
    id: "army-xtech",
    name: "Army xTech (xTech|Inversion & related)",
    funder: "US Army (ASA ALT)",
    dept: "DoD",
    mechanism: "Prize / Challenge",
    capital: "Non-dilutive",
    award: "$500K–$2M",
    typical: "Up to ~$1M in cash prizes + an Army SBIR on-ramp up to ~$300K",
    eligibility: "US small business (some tracks open to large firms).",
    tech: ["Ballistics / Weapons", "Autonomy / UAV", "Energy / Power", "Advanced Materials", "AI / ML"],
    desc: "Army prize competitions with cash awards and a direct on-ramp into SBIR — no lengthy proposal to start.",
    detail: "xTech runs pitch-based prize competitions. The current xTech|Inversion competition offers up to ~$1M in total cash prizes (up to ~12 finalists at $20K each, then up to 5 winners at an additional ~$152K each), with winners able to submit an Army SBIR Phase I proposal worth up to ~$300K. Finalist pitches are held at Fed Supernova (Austin, Aug 2026); SBIR proposals follow in the fall. Check xtech.army.mil for the current competition and prize table.",
    source: "https://www.xtech.army.mil"
  },
  {
    id: "onr-navy",
    name: "ONR / Navy SBIR + Open BAA",
    funder: "Office of Naval Research / DoN",
    dept: "DoD",
    mechanism: "R&D Contract / BAA",
    capital: "Non-dilutive",
    award: "$500K–$2M",
    typical: "SBIR Ph I ~$140K–$220K · Ph II $1M+ · plus a continuously-open Long Range BAA",
    eligibility: "US small business; naval S&T relevance.",
    tech: ["RF / Sensors", "Autonomy / UAV", "Energy / Power", "Advanced Materials", "AI / ML"],
    desc: "Naval science & technology funding across 30+ areas, plus NavalX / TechSolutions rapid non-dilutive support.",
    detail: "The Navy/Marine Corps SBIR/STTR program (Phase I typically ~$140K–$220K, Phase II $1M+, bounded by the SBA caps) plus ONR's continuously-open Long Range BAA for broader naval S&T. NavalX and TechSolutions provide rapid, non-dilutive support and a path to sole-source contracts for solutions to naval problem sets.",
    source: "https://www.navysbir.com"
  },
  {
    id: "osc",
    name: "Office of Strategic Capital (OSC)",
    funder: "Office of Strategic Capital",
    dept: "DoD",
    mechanism: "Loan / Loan Guarantee",
    capital: "Debt (non-dilutive)",
    award: "$15M+",
    typical: "$10M–$150M direct loans · tenors up to 50 years · ~$4.4B FY26 lending capacity",
    eligibility: "US company in a covered technology category (facilities/equipment).",
    tech: ["Microelectronics", "Advanced Materials", "Quantum", "Energy / Power", "Space"],
    desc: "Long-tenor federal loans and loan guarantees for capital-intensive 'covered technology' — debt, not equity.",
    detail: "OSC provides direct loans (targeted $10M–$150M) at rates no lower than comparable Treasury rates with tenors up to 50 years, across 31 statutory covered-technology categories. Its FY2026 appropriation (~$97.8M subsidy) enables up to ~$4.4B in loans/guarantees; pilot authority runs through Oct 1, 2028, and the FY2027 request is a major scale-up (~$20B mandatory). Demand is heavy — 200+ applications totaling ~$8.9B were received in the first window. Verify the live notice before relying on terms.",
    source: "https://www.cto.mil/osc/"
  },
  {
    id: "apfit",
    name: "APFIT (Accelerate Procurement & Fielding)",
    funder: "OUSD(R&E) / DoD",
    dept: "DoD",
    mechanism: "Production Transition",
    capital: "Non-dilutive",
    award: "$15M+",
    typical: "$10M–$50M per project to move tech from development into production",
    eligibility: "Small business / nontraditional with a late-stage, transition-ready product.",
    tech: ["Autonomy / UAV", "Microelectronics", "RF / Sensors", "Advanced Materials"],
    desc: "Bridges the final gap to fielding — funds the jump from a matured prototype into initial production.",
    detail: "Made permanent in the FY2025 NDAA, APFIT invests $10M–$50M per project to accelerate late-stage transition. Its final FY2026 round (July 2026) added 30 awards totaling ~$548.1M and debuted the program's first software-only investments, pushing cumulative funding past $2B and 100+ capabilities fielded since FY2022. Congressionally directed and expected to continue.",
    source: "https://ac.cto.mil/apfit/"
  },
  {
    id: "me-commons",
    name: "Microelectronics Commons",
    funder: "DoD (CHIPS via NSWC Crane / NSTXL)",
    dept: "Cross-agency",
    mechanism: "Other Transaction (Prototype)",
    capital: "Non-dilutive",
    award: "$2M–$15M",
    typical: "~$2B program (FY23–27) · 8 regional hubs · +$160M added Nov 2025",
    eligibility: "Members of a regional hub (companies, universities, startups).",
    tech: ["Microelectronics", "AI / ML", "Quantum", "RF / Sensors", "Directed Energy"],
    desc: "CHIPS-funded network of 8 regional hubs turning lab-scale microelectronics into domestic prototypes.",
    detail: "A ~$2B CHIPS-funded effort (FY2023–2027) managed via NSWC Crane and NSTXL across 8 regional hubs. Focus areas: AI hardware, electromagnetic/electronic warfare, quantum, secure edge/IoT, 5G/6G, and commercial leap-ahead. A further $160M was injected in Nov 2025, and in mid-2026 the hubs began receiving Year-2 follow-on awards for meeting technical milestones. Access is through membership in a regional hub.",
    source: "https://www.microelectronicscommons.org"
  },
  {
    id: "nasa-sbir",
    name: "NASA SBIR / STTR + SBIR Ignite",
    funder: "NASA",
    dept: "Civilian",
    mechanism: "SBIR / STTR",
    capital: "Non-dilutive",
    award: "$500K–$2M",
    typical: "Phase I ≤ ~$225K (Ignite ≤ ~$150K) · Phase II ≤ ~$850K",
    eligibility: "US small business; space / aeronautics relevance.",
    tech: ["Space", "Propulsion", "Advanced Materials", "Aerospace"],
    desc: "Civilian space-technology seed funding — propulsion, in-space manufacturing, and aeronautics.",
    detail: "NASA's SBIR/STTR funds feasibility (Phase I up to ~$225K; the market-driven SBIR Ignite track up to ~$150K) and development (Phase II up to ~$850K). In April 2026 NASA moved to a rolling 2026–2027 BAA (valid through Sept 30, 2027) with rolling appendices instead of one annual solicitation. A strong complement for dual-use space startups also pursuing SpaceWERX.",
    source: "https://www.nasa.gov/sbir_sttr/"
  },
  {
    id: "nsf-sbir",
    name: "NSF SBIR / STTR (America's Seed Fund)",
    funder: "National Science Foundation",
    dept: "Civilian",
    mechanism: "SBIR / STTR",
    capital: "Non-dilutive",
    award: "$500K–$2M",
    typical: "Phase I ≤ ~$305K · Phase II ≤ ~$1.25M (+ IIB match $50K–$500K)",
    eligibility: "US small business with deep-tech; no equity taken.",
    tech: ["AI / ML", "Advanced Materials", "Microelectronics", "Energy / Power", "Quantum"],
    desc: "Broad deep-tech seed funding with no equity and no defense-specific requirement.",
    detail: "NSF's America's Seed Fund (solicitation NSF 26-510) backs nearly all deep-tech: Phase I up to ~$305K, Phase II up to ~$1.25M, plus a Phase IIB supplement of $50K–$500K matched to investor/customer funds. Fully non-dilutive with rolling Project Pitch submissions — a great parallel track for defense-adjacent startups with commercial applications.",
    source: "https://seedfund.nsf.gov"
  },
  {
    id: "doe-sbir",
    name: "DOE SBIR / STTR",
    funder: "Dept. of Energy",
    dept: "DOE",
    mechanism: "SBIR / STTR",
    capital: "Non-dilutive",
    award: "$100K–$500K",
    typical: "Phase I ≤ ~$200K (some topics higher; e.g. Genesis Mission ~$250K)",
    eligibility: "US small business; energy / grid / materials relevance.",
    tech: ["Energy / Power", "Advanced Materials", "Microelectronics"],
    desc: "Energy-focused seed funding administered through the DOE Office of Science and program offices.",
    detail: "DOE SBIR/STTR (Phase I up to ~$200K, varying by solicitation) funds energy, grid, and advanced-materials technologies. FY2026 has Phase I Releases 1 and 2 open plus a specialized 'Genesis Mission' Phase I (~40 awards / ~$10M). Relevant for power-electronics, batteries, and thermal-management startups that also serve defense.",
    source: "https://science.osti.gov/sbir"
  },
  {
    id: "arpa-e",
    name: "ARPA-E (OPEN / SCALEUP)",
    funder: "ARPA-E (DOE)",
    dept: "DOE",
    mechanism: "R&D Contract / BAA",
    capital: "Non-dilutive",
    award: "$2M–$15M",
    typical: "OPEN ~$250K–$10M (avg ~$3M) · SCALEUP up to tens of $M",
    eligibility: "Universities, labs, industry, and individuals.",
    tech: ["Energy / Power", "Advanced Materials", "Propulsion"],
    desc: "Transformational energy R&D — high-impact awards for breakthrough power, storage, and generation technology.",
    detail: "ARPA-E's OPEN program periodically funds transformational energy concepts (~$250K–$10M; the last Vision OPEN pool was ~$150M). SCALEUP helps prior awardees commercialize at larger scale (SCALEUP Ready is active in 2026 with new projects). OPEN runs on a periodic (not always-open) cadence — check ARPA-E eXCHANGE for live funding opportunities. Strong fit for electric-propulsion, power-electronics, and energy-storage founders.",
    source: "https://arpa-e.energy.gov"
  },
  {
    id: "nsf-engines",
    name: "NSF Regional Innovation Engines",
    funder: "National Science Foundation",
    dept: "Civilian",
    mechanism: "Regional / Ecosystem",
    capital: "Non-dilutive",
    award: "$15M+",
    typical: "~$15M initial (2 yrs) · up to ~$160M over 10 years per Engine",
    eligibility: "Regional coalitions (universities, startups, industry, government).",
    tech: ["AI / ML", "Advanced Materials", "Microelectronics", "Energy / Power", "Biotech / Health"],
    desc: "Place-based deep-tech ecosystems — large, milestone-based awards to build regional innovation capacity.",
    detail: "NSF Engines fund regional coalitions to grow use-inspired R&D, translation, and workforce in a specific technology and geography — roughly $15M over the first two years, scalable up to ~$160M over ten years. A second cohort of ~12 new Engines (~$180M across 20 states) was announced in July 2026. Founders typically plug in through an Engine in their region rather than applying solo.",
    source: "https://new.nsf.gov/funding/initiatives/regional-innovation-engines"
  },
  {
    id: "eda-tech-hubs",
    name: "EDA Regional Tech Hubs / Build to Scale",
    funder: "US Economic Development Administration",
    dept: "Civilian",
    mechanism: "Regional / Ecosystem",
    capital: "Non-dilutive",
    award: "$15M+",
    typical: "Implementation grants ~$20M–$50M per designated Hub",
    eligibility: "Designated Regional Technology & Innovation Hub consortia.",
    tech: ["Microelectronics", "Advanced Materials", "AI / ML", "Energy / Power", "Space"],
    desc: "Federal investment in regions building a globally competitive industry in a critical technology.",
    detail: "The EDA Regional Technology & Innovation Hubs program makes implementation grants (roughly $20M–$50M each) to designated Hubs to scale a critical-technology industry; a July 2026 round put ~$169M into 6 Hubs, with the program cumulatively past $650M. The related Build to Scale program funds regional accelerators and capital formation. Startups participate through their region's designated Hub or accelerator. Verify current NOFO status — the program has been re-scoped.",
    source: "https://www.eda.gov/funding/programs/regional-technology-and-innovation-hubs"
  }
];
