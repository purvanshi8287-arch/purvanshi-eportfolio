window.PORTFOLIO = {
  profile: {
    name: "Purvanshi",
    positioning: "PGDM Financial Management student | Building skills for equity research, risk and assurance.",
    email: "purvanshi8287@gmail.com",
    phone: "+91-8287413909",
    city: "Gurugram, India",
    linkedin: "https://www.linkedin.com/in/purvanshi-mittal-b76aaa316/"
  },
  roles: ["Equity Research Analyst", "Risk Analyst", "Tax & Audit Associate"],
  about: "I’m Purvanshi, a PGDM Financial Management student at FIIB, New Delhi, with a B.Com background from the University of Delhi. My current interests include equity research, risk, taxation and auditing. Through coursework, an individual chatbot prototype, financial dashboard work and a finance internship, I’m learning to connect analysis with careful documentation and transparent assumptions.",
  education: [
    { title: "PGDM, Financial Management", detail: "Fortune Institute of International Business (FIIB) · 2026–present" },
    { title: "Bachelor of Commerce", detail: "University of Delhi · 2021–2024" }
  ],
  experience: {
    title: "Finance Intern",
    organization: "JBM Kanemitsu",
    period: "September–October 2025",
    location: "Gurugram, India",
    tasks: [
      "Supported payment clearing and reconciliation activities.",
      "Assisted with bill booking and invoice verification.",
      "Helped maintain TCS collection documentation.",
      "Contributed to financial statement analysis."
    ],
    note: "Responsibilities are summarized from my resume; specific quantified outcomes were not provided."
  },
  skills: [
    { name: "Financial analysis", proof: "Titan dashboard", href: "#project-titan" },
    { name: "Market research", proof: "Corporate debt review", href: "#project-indian-debt" },
    { name: "Reconciliation", proof: "JBM internship", href: "#experience" },
    { name: "Invoice verification", proof: "JBM internship", href: "#experience" },
    { name: "Financial documentation", proof: "JBM internship", href: "#experience" },
    { name: "Chatbot prototyping", proof: "BYJU’S prototype", href: "#project-byju" }
  ],
  tools: [
    { name: "Microsoft Excel", proof: "Debt market analysis workbook", href: "#project-indian-debt" },
    { name: "ChatGPT", proof: "BYJU’S prototype", href: "#project-byju" }
  ],
  projects: [
    {
      id: "project-byju",
      title: "BYJU’S Spend Review Assistant",
      kind: "Academic team assignment · Individual chatbot prototype",
      purpose: "The team explored how proposals for marketing, sponsorship and expansion could be reviewed with clearer evidence and decision gates before commitment.",
      process: "I identified the problem, collected evidence, built my own chatbot prototype using ChatGPT, and stress-tested it. Each team member built an individual bot; the team then compared them.",
      contribution: "Problem identification · evidence collection · individual chatbot build · stress testing",
      outcome: "The team selected another member’s bot. My individual prototype remains a GitHub-hosted academic demo. I report passing all 12 stress scenarios; the results sheet is blank, so that result is unverified. It has not been used in a live decision, and no business impact is measured.",
      evidence: [
        { label: "Open prototype", href: "https://purvanshi8287-arch.github.io/byjus-spend-review-chatbot/proposal-review.html" },
        { label: "View source repository", href: "https://github.com/purvanshi8287-arch/byjus-spend-review-chatbot" },
        { label: "Evidence source pack", href: "https://github.com/purvanshi8287-arch/byjus-spend-review-chatbot/blob/main/web-evidence-pack.md" }
      ],
      evidenceNote: "Evidence available: the hosted prototype and source pack. The stress-test result cannot be independently verified because the uploaded results sheet is blank.",
      status: "Academic prototype"
    },
    {
      id: "project-titan",
      title: "Titan Company Limited — Financial Dashboard",
      kind: "Interactive company analysis · HTML",
      purpose: "Create an interactive view of Titan Company Limited’s financial performance across annual and quarterly results, segments, cash flows, capital and ownership.",
      process: "The standalone dashboard includes charts, selectors, navigation and a sources/definitions section. It notes that no Capitaline export was present and its source notes identify Screener, Titan Company and NSE materials.",
      contribution: "Personal contribution and project context — To Be Added.",
      outcome: "A runnable dashboard is included with this portfolio. Personal contribution, project context and specific methods used — To Be Added.",
      evidence: [{ label: "Open the dashboard", href: "projects/titan-company-financial-dashboard.html" }],
      evidenceNote: "The dashboard notes that no Capitaline export was present and identifies its sources. Personal contribution and project context remain To Be Added.",
      status: "Financial analysis"
    },
    {
      id: "project-indian-debt",
      title: "Indian Corporate Debt Market — Five-Year Review",
      kind: "Financial Market Institutions · Academic research",
      purpose: "Examine how India’s corporate debt market changed from FY2021–22 to FY2025–26 across market size, primary mobilisation, bond issuance, secondary trading and FPI participation.",
      process: "I explored NSE and BSE market information alongside SEBI and RBI publications, then organized five-year comparisons in Excel and wrote a Word report. The workbook’s source notes also cite the Economic Survey, MoSPI GDP data and NSDL’s FPI Monitor.",
      contribution: "Reviewed market sources, analyzed five-year trends, organized the workbook and wrote the report.",
      outcome: "The report finds that outstanding bonds increased from ₹40.2 lakh crore in FY22 to ₹58.2 lakh crore in FY26 (about 9.7% CAGR), while remaining around 15–17% of GDP. Debt accounted for 75.4% of five-year primary resource mobilisation, and private placements represented 98.6% of issuance.",
      evidence: [
        { label: "Read the report", href: "projects/indian-corporate-debt-market-review/corporate-debt-market-review.docx" },
        { label: "Open the analysis workbook", href: "projects/indian-corporate-debt-market-review/corporate-debt-market-analysis.xlsx" },
        { label: "View the GitHub project", href: "https://github.com/purvanshi8287-arch/purvanshi-eportfolio/tree/main/projects/indian-corporate-debt-market-review" }
      ],
      evidenceNote: "FY26 figures are provisional or approximate. The workbook flags several series for checking against original tables. FPI net flows cover all debt, not corporate debt alone; rating data combines AAA and AA+, so an AAA-only share is not established.",
      status: "Financial markets research"
    }
  ],
  certificates: [
    {
      title: "Using the Time Value of Money to Make Financial Decisions",
      orbitTitle: "Time Value of Money",
      issuer: "LinkedIn Learning",
      detail: "Completed October 18, 2026 · Skill covered: Time Value of Money",
      href: "https://www.linkedin.com/learning/certificates/98b2147eb5abd1ccacd602d520c86687c3861827746d6895a690d88ff487b736?trk=share_certificate",
      file: "certificates/certificate-time-value-of-money.png",
      verified: true,
      focus: ["Time value of money"],
      note: "The certificate lists Time Value of Money as a top skill covered. The course title centres on using it in financial decisions.",
      evidenceStatus: "LinkedIn certificate link available"
    },
    {
      title: "Hands-On AI: Build Automated Workflows in Google Workspace Studio",
      orbitTitle: "Workspace Studio Workflows",
      issuer: "LinkedIn Learning",
      detail: "Certificate file provided · completion date not listed here",
      file: "certificates/certificate-workspace-studio.pdf",
      href: "",
      verified: false,
      focus: ["Workflow automation", "Google Workspace Studio"],
      note: "Course focus is described by the certificate title. A separate public verification link has not been provided.",
      evidenceStatus: "Certificate file on site · no public verification link"
    },
    {
      title: "Cultivating a Growth Mindset",
      orbitTitle: "Growth Mindset",
      issuer: "LinkedIn Learning",
      detail: "Completed October 19, 2026 · Skill listed: Growth Strategies",
      file: "certificates/certificate-growth-mindset.pdf",
      href: "https://www.linkedin.com/learning/certificates/0e556f15f9ba9fa028223b54b45626cb94b94b2dabc56c6e24630639e042b689?trk=share_certificate",
      verified: true,
      focus: ["Growth Strategies"],
      focusHeading: "Skill listed on LinkedIn",
      note: "The LinkedIn certificate page lists Growth Strategies under skills covered. Course completion does not establish independent proficiency.",
      evidenceStatus: "LinkedIn certificate link available"
    },
    {
      title: "International Business and Finance",
      orbitTitle: "International Business & Finance",
      issuer: "LinkedIn Learning",
      detail: "Completed October 28, 2026 · Skills listed: Corporate Finance, International Business",
      href: "https://www.linkedin.com/learning/certificates/4e6f2f1ef60e93387267129aad6d5324ba179a7fbc8595d79cdb3d002092ba53?trk=share_certificate",
      verified: true,
      focus: ["Corporate Finance", "International Business"],
      focusHeading: "Skills listed on LinkedIn",
      note: "The LinkedIn certificate page lists Corporate Finance and International Business under skills covered. Course completion does not establish independent proficiency.",
      evidenceStatus: "LinkedIn certificate link available"
    },
    {
      title: "Brand-O-Mania 2026",
      orbitTitle: "Brand-O-Mania 2026",
      issuer: "Dyal Singh College · Delhi University",
      detail: "Certificate of participation · FIIB, New Delhi",
      file: "certificates/certificate-brand-o-mania-2026.jpg",
      verified: false,
      focus: ["Participation"],
      focusHeading: "Certificate record",
      note: "The certificate confirms participation in Brand-O-Mania 2026. It does not list event activities or skills, so none are claimed here.",
      evidenceStatus: "Participation certificate image"
    }
  ]
};
