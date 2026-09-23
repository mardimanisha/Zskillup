export type BlogCategory =
  | "software-development"
  | "data-science"
  | "artificial-intelligence"
  | "mba"
  | "general"
  | "digital-marketing"
  | "management"
  | "finance"
  | "agentic-ai"
  | "dba"
  | "generative-ai"
  | "student-stories"
  | "career-tips";

export const allCategories: { value: BlogCategory; label: string }[] = [
  { value: "software-development", label: "Software Development" },
  { value: "data-science", label: "Data Science" },
  { value: "artificial-intelligence", label: "Artificial Intelligence" },
  { value: "mba", label: "MBA" },
  { value: "general", label: "General" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "management", label: "Management" },
  { value: "finance", label: "Finance" },
  { value: "agentic-ai", label: "Agentic AI" },
  { value: "dba", label: "DBA" },
  { value: "generative-ai", label: "Generative AI" },
  { value: "student-stories", label: "Student Stories" },
  { value: "career-tips", label: "Career Tips" },
];

export type BlogSection = { heading: string; body: string; image?: string; imageAlt?: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  categoryLabel: string;
  date: string;
  readTime: number;
  author: { name: string; avatar?: string };
  coverImage?: string;
  featured?: boolean;
  sections?: BlogSection[];
};

export const trendingTopics: { label: string; value: BlogCategory | "all" }[] = [
  { label: "Generative AI", value: "generative-ai" },
  { label: "Artificial Intelligence", value: "artificial-intelligence" },
  { label: "Management", value: "management" },
  { label: "Digital Marketing", value: "digital-marketing" },
  { label: "Data Science", value: "data-science" },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "rise-of-ai-in-career-preparation",
    title: "The Rise of AI in Career Preparation",
    excerpt:
      "How AI is reshaping student learning, career guidance and recruitment — and what this means for the next generation.",
    category: "artificial-intelligence",
    categoryLabel: "Artificial Intelligence",
    date: "2024-03-14",
    readTime: 7,
    author: { name: "Neha Kapoor" },
    coverImage: "/images/campus-student-hero.png",
    featured: true,
    sections: [
      {
        heading: "AI is no longer a future concept — it's a present reality",
        body: "Students today are entering a job market that has fundamentally shifted. Recruiters are using AI-powered screening tools, companies are deploying intelligent assistants in day-to-day workflows, and the very definition of an 'entry-level skill' has changed. Understanding how AI intersects with your career path is no longer optional — it's a baseline expectation.\n\nConsider what has changed in just the last two admission cycles: resume parsers now rank candidates before a human ever opens the file, video-interview platforms score tone and pacing alongside content, and internal onboarding tools increasingly expect new hires to already know how to work alongside a copilot. None of this means human judgement matters less — if anything, it matters more, because the students who succeed are the ones who can direct these tools rather than be filtered out by them. Waiting until final year to engage with this shift puts students at a structural disadvantage that is difficult to close in a single placement season, which is why forward-looking institutions are now introducing AI literacy as early as the first semester.",
        image: "/images/events/expert-talk-series.jpg",
        imageAlt: "Expert talk series on AI and careers",
      },
      {
        heading: "From static resumes to dynamic skill graphs",
        body: "Traditional hiring was built around the static resume. Now, AI-driven platforms map candidates against live skill graphs — dynamic profiles that update based on certifications, project portfolios and assessments. Students who learn to build and maintain these profiles will stand out far above those who submit PDFs and wait. ZSkillup helps students build precisely this kind of verifiable skill identity.\n\nBuilding this kind of profile does not require an overnight overhaul. It starts with small, consistent habits — logging every project with a measurable outcome, requesting a short recommendation after every internship or volunteer role, and revisiting certifications so they reflect current tools rather than what was fashionable two years ago. Recruiters increasingly cross-reference what a candidate claims against what is verifiable online, so the gap between a polished resume and a thin digital footprint has become one of the fastest ways to lose credibility in a screening call. Students who treat their skill graph as a living document, updated every semester rather than every job search, consistently move faster through hiring pipelines.",
        image: "/images/events/hands-on-learning-lab.jpg",
        imageAlt: "Students working in a hands-on learning lab",
      },
      {
        heading: "Preparation is the only moat",
        body: "The students who will thrive in this AI-augmented world are not those who fear the technology, but those who learn to work alongside it. Structured exposure through mock interviews, AI-simulated assessments and industry mentorship programmes gives students a decisive advantage. The preparation gap is real — and it is closeable.\n\nIn practice, this means treating placement preparation the way athletes treat training — as a discipline with reps, feedback and measurable improvement, not a one-off event before final exams. Students who run five mock interviews with structured feedback consistently outperform those who read about interview technique but never rehearse it under pressure. The gap between knowing and doing is where most placement anxiety actually lives, and it is the one gap institutions and students can close together with the right structure, the right cadence of feedback, and enough repetition that the nerves fade before the real interview ever begins.",
        image: "/images/events/interactive-workshop.jpg",
        imageAlt: "Students in an interactive workshop session",
      },
    ],
  },
  {
    slug: "what-recruiters-expect-from-fresh-graduates",
    title: "What Recruiters Expect from Fresh Graduates",
    excerpt:
      "Industry hiring managers share the soft skills, technical awareness and mindset they look for in campus hires.",
    category: "career-tips",
    categoryLabel: "Career Tips",
    date: "2024-03-10",
    readTime: 5,
    author: { name: "Arjun Mehta" },
    coverImage: "/images/events/expert-talk-series.jpg",
    sections: [
      {
        heading: "Communication still tops every list",
        body: "Across every industry vertical we spoke to — from fintech to FMCG — clear, confident communication remained the number one differentiator. Not vocabulary or grammar, but the ability to articulate ideas, listen actively and adjust your message to different audiences. Students who have practised this through group discussions, presentations and real-world internships arrive with a visible edge.\n\nHiring managers were unusually specific about what 'good communication' actually looks like in an interview room: a candidate who can summarise a complex project in three sentences before diving into detail, who asks a clarifying question instead of guessing, and who can disagree with an interviewer's assumption respectfully and with evidence. None of these are innate talents — they are trainable habits. Students who record and review their own mock interviews tend to improve faster than those who simply read tips, because hearing your own filler words and rambling answers is far more corrective than any article.",
        image: "/images/events/acca-career-workshop-session.jpg",
        imageAlt: "Students at a career workshop session",
      },
      {
        heading: "Attitude over aptitude, especially in the first 90 days",
        body: "Technical skills can be taught; attitude is much harder to change. Hiring managers consistently told us they would rather onboard a candidate with a learning mindset and coachable attitude than someone with a higher GPA who resists feedback. Show that you are genuinely curious about the industry, prepared to make mistakes and eager to grow.\n\nThis plays out concretely in how new hires are evaluated during probation. Managers described watching for whether a fresher asks for feedback proactively rather than waiting for a review cycle, whether they document what they learn so mistakes are not repeated, and whether they own up to gaps instead of quietly hoping no one notices. Candidates who can point to a specific instance where they received tough feedback and visibly changed their approach — in a group project, an internship, even a college competition — give interviewers real evidence of coachability rather than a claim about it.",
        image: "/images/events/group-activity-workshop.jpg",
        imageAlt: "Group activity workshop",
      },
      {
        heading: "Awareness of the business context",
        body: "The freshers who impress most in interviews are those who have done their homework — not just on the company, but on its sector, competitors and current challenges. Five minutes of contextual research signals genuine interest and is almost always rewarded.\n\nThe strongest candidates go a step further: they connect that research to a point of view. Instead of reciting the company's mission statement, they mention a recent product launch or market move and ask an informed question about it, or note how the role they are interviewing for might contribute to a challenge the company is publicly facing. This kind of preparation takes under an hour but is rare enough that hiring managers remember it long after the interview ends, and it often becomes the deciding factor between two similarly qualified candidates.",
        image: "/images/events/industry-expert-session.jpg",
        imageAlt: "Industry expert session",
      },
    ],
  },
  {
    slug: "how-colleges-can-improve-employability-outcomes",
    title: "How Colleges Can Improve Employability Outcomes",
    excerpt:
      "Practical steps institutions can take to bridge the gap between academic learning and workplace expectations.",
    category: "management",
    categoryLabel: "Management",
    date: "2024-03-06",
    readTime: 6,
    author: { name: "Priya Nair" },
    coverImage: "/images/events/institutional-collaboration.jpg",
    sections: [
      {
        heading: "Start with an honest skills audit",
        body: "Many institutions find it uncomfortable to measure the gap between what students learn and what employers need. Running an annual skills audit — surveying alumni, partner companies and placement data — gives colleges actionable numbers rather than vague impressions. The institutions with the strongest placement records universally begin here.\n\nA useful audit does not stop at surface-level satisfaction surveys. It tracks which specific competencies recruiters flagged as missing during interview debriefs, which courses alumni say they use daily versus rarely, and where placement offers cluster or stall by department. Once a college has this data broken down by cohort and discipline, curriculum decisions stop being guesswork and start being targeted — a business analytics elective added because recruiters named it repeatedly, not because it sounded current.",
        image: "/images/events/institutional-collaboration.jpg",
        imageAlt: "Institutional collaboration meeting",
      },
      {
        heading: "Embed industry exposure into the curriculum",
        body: "Guest lectures are good; structured industry immersion is better. Partnering with companies to co-design modules, run live case studies or host in-campus bootcamps gives students real-world context that no textbook can replicate. Colleges that have formalised these partnerships see measurable improvements in placement rates within two to three academic cycles.\n\nThe institutions that get the most out of these partnerships treat them as two-way relationships rather than one-off favours. They give industry partners a genuine role in shaping assessment criteria, invite them back to review student output rather than just deliver a single talk, and track which partner-designed modules actually correlate with stronger interview performance. Over time this builds a feedback loop where the curriculum evolves alongside what employers are actually hiring for, instead of drifting further from it year after year.",
        image: "/images/events/expert-talk-series.jpg",
        imageAlt: "Expert talk series on campus",
      },
      {
        heading: "Build a placement culture, not just a placement cell",
        body: "The placement cell is a support function, not the entire answer. When career readiness is woven into the cultural fabric of campus life — through clubs, competitions, mentorship circles and peer accountability groups — students arrive at their final year with confidence rather than anxiety.\n\nIn practice, this means giving students ownership of career-readiness activities rather than only receiving them from the placement office. Student-run case competitions, peer-led mock interview circles and alumni-hosted informal Q&A sessions all create repeated, low-stakes exposure to the skills that matter — long before the pressure of an actual interview season. Colleges that invest in this kind of culture consistently report that students walk into their first real interview having already rehearsed the format dozens of times among peers.",
        image: "/images/events/student-community-cohort.jpg",
        imageAlt: "Student community cohort",
      },
    ],
  },
  {
    slug: "from-campus-to-career-real-student-journeys",
    title: "From Campus to Career: Real Student Journeys",
    excerpt:
      "Three students share how structured placement preparation changed the trajectory of their careers.",
    category: "student-stories",
    categoryLabel: "Student Stories",
    date: "2024-03-06",
    readTime: 8,
    author: { name: "Editorial Team" },
    coverImage: "/images/events/student-community-cohort.jpg",
    sections: [
      {
        heading: "Riya — from zero callbacks to three offers",
        body: "Riya was in her final semester with a strong academic record but no interview calls. After joining a structured placement readiness programme, she rebuilt her resume around outcomes rather than duties, practised case interviews with a peer cohort and researched her target companies in depth. Within six weeks she had three offers on the table. 'It was not about being smarter,' she told us. 'It was about being prepared.'\n\nWhat changed for Riya was largely invisible on paper: the same internships and projects she already had, described differently. Instead of listing 'assisted with marketing tasks', her resume now read 'ran a campaign that grew social engagement by 40% over eight weeks' — the same work, framed around a measurable result. She also stopped applying broadly and started tailoring her first two interview answers to each company's specific challenges, something she credits directly to the mock interview feedback she received on being too generic.",
        image: "/images/learners/ritika-singh.jpg",
        imageAlt: "Student success story",
      },
      {
        heading: "Aditya — finding the right fit, not just any offer",
        body: "Aditya's challenge was different: he had offers but none that matched his goals. Through a structured self-assessment and mentorship sessions, he clarified what he was actually looking for — a role with ownership and a steep learning curve. He eventually joined a growth-stage company in a role that did not exist in the initial job description because he was able to articulate exactly how he could contribute.\n\nThe turning point for Aditya was a single mentorship conversation where he was asked to describe his ideal Monday morning at work in detail. The answer — leading a small initiative rather than executing someone else's — helped him realise he had been optimising for brand name over role fit. He went back to two companies that had already interviewed him with a specific proposal for a project he wanted to own, and one of them created a role around it.",
        image: "/images/events/acca-career-workshop-session.jpg",
        imageAlt: "Career workshop and mentorship session",
      },
      {
        heading: "Sneha — turning a gap year into a differentiator",
        body: "Sneha took a year off after graduation and worried it would be a red flag. Her mentor helped her reframe it as a story of intentional exploration — she had freelanced, volunteered and built a small portfolio. In interviews, the gap became her strongest talking point. Authenticity, it turns out, is a hiring differentiator.\n\nSneha's mentor pushed her to stop apologising for the gap and instead structure it as a narrative with a beginning, a decision point and a result — much like any other project on a resume. She learned to describe exactly what she freelanced on, what she earned from it, and what she would do differently next time. Interviewers, she found, responded far better to specific, honest reflection than to a vague explanation offered defensively, and two separate interviewers told her afterwards that her answer on the gap year was the most memorable part of the conversation.",
        image: "/images/learners/sneha-patel.jpg",
        imageAlt: "Sneha Patel — student journey",
      },
    ],
  },
  {
    slug: "how-to-build-placement-readiness-for-students",
    title: "How to Build Placement Readiness for Students",
    excerpt:
      "A framework institutions can use to assess, develop and track campus placement readiness at scale.",
    category: "management",
    categoryLabel: "Management",
    date: "2024-03-05",
    readTime: 6,
    author: { name: "Lokesh R." },
    coverImage: "/images/events/hands-on-learning-lab.jpg",
    sections: [
      {
        heading: "Define what 'ready' actually means",
        body: "Placement readiness is not a feeling — it is a measurable state. Start by defining the competencies, behaviours and knowledge that a 'placement-ready' student demonstrates. This definition should be built collaboratively with your industry partners, not derived from historical assumptions. Once defined, everything else becomes a matter of tracking progress toward it.\n\nA workable definition usually spans three layers: functional knowledge specific to the discipline, transferable skills like communication and problem structuring, and interview-specific readiness such as the ability to handle a case question under time pressure. Institutions that define readiness only in terms of the first layer — grades and technical knowledge — consistently see strong students underperform in interviews, because the other two layers were never explicitly taught or assessed.",
        image: "/images/events/interactive-workshop.jpg",
        imageAlt: "Interactive workshop defining readiness",
      },
      {
        heading: "Assess early, not just before the season",
        body: "The biggest mistake colleges make is treating placement preparation as a final-year activity. Students who begin structured readiness work in their first or second year have dramatically better outcomes. Baseline assessments in year one reveal gaps early enough to address them — not in a six-week sprint before companies arrive on campus.\n\nEarly assessment also changes how students relate to feedback. A second-year student told that their communication needs work has years to act on it without the pressure of an imminent interview; a final-year student hearing the same feedback often has only weeks, which breeds panic rather than improvement. Colleges that run light-touch readiness check-ins every semester, rather than one intensive push before placement season, report students who arrive at their final interviews calmer and more consistently prepared.",
        image: "/images/events/hands-on-learning-lab.jpg",
        imageAlt: "Hands-on learning lab assessment",
      },
      {
        heading: "Track, iterate, and share the data",
        body: "Data-driven placement programmes outperform those run on intuition. Track which preparation interventions correlate with better outcomes, which students are progressing and which need additional support, and share aggregate findings with faculty and industry partners. Transparency creates accountability and accelerates improvement.\n\nThe institutions doing this well typically maintain a simple dashboard tracking mock interview scores, attendance at readiness workshops and eventual placement outcomes side by side, reviewed once a term rather than once a year. This makes it possible to spot, for instance, that students who attend at least three mock interviews convert offers at a meaningfully higher rate than those who attend none — a finding that then justifies making mock interviews a stronger part of the programme rather than an optional add-on.",
        image: "/images/events/certificate-distribution.jpg",
        imageAlt: "Certificate distribution event",
      },
    ],
  },
  {
    slug: "the-rise-of-ai-in-career-need-in-2027",
    title: "The Rise of AI in Career Need in 2027",
    excerpt:
      "An evidence-based look at which AI competencies will define employable graduates by 2027.",
    category: "generative-ai",
    categoryLabel: "Generative AI",
    date: "2024-03-07",
    readTime: 7,
    author: { name: "Sneha Jadhav" },
    coverImage: "/images/events/acca-career-workshop-session.jpg",
    sections: [
      {
        heading: "Prompt engineering is the new spreadsheet literacy",
        body: "Just as the ability to use a spreadsheet became a baseline office skill in the 1990s, the ability to write effective prompts for AI tools is rapidly becoming table stakes. By 2027, candidates who cannot demonstrate fluency with AI-assisted workflows — drafting, summarising, analysing, automating — will find themselves filtered out before the first interview.\n\nThis fluency is less about memorising clever prompt templates and more about knowing how to break a vague task into a well-specified request, how to iterate on a first draft rather than accept it blindly, and how to combine multiple tools into a workflow — research, draft, refine, verify. Students who build this habit early, on coursework and personal projects, develop an instinct for it that is very difficult to fake convincingly in an interview, which is exactly why recruiters are starting to test for it directly.",
        image: "/images/events/expert-talk-series.jpg",
        imageAlt: "Expert talk on AI literacy",
      },
      {
        heading: "Critical evaluation of AI outputs matters more than the tools",
        body: "AI tools will proliferate and change. What will not change is the need for human judgment in evaluating what those tools produce. Students who can identify AI errors, hallucinations and bias will be far more valuable than those who simply accept the output. This critical lens is the core employability skill of the AI era.\n\nIn practice, this looks like a habit of always asking 'what would make this wrong?' before submitting AI-assisted work — checking a generated statistic against its source, questioning whether a summarised argument actually holds up, or noticing when a tool has quietly filled a gap with something plausible rather than true. Employers increasingly describe this as the difference between a junior employee they have to double-check and one they can trust with ambiguous, high-stakes tasks.",
        image: "/images/events/group-activity-workshop.jpg",
        imageAlt: "Group activity evaluating AI outputs",
      },
      {
        heading: "Ethical and responsible AI use is a professional expectation",
        body: "Organisations are increasingly introducing AI governance policies, and new hires are expected to know and follow them. Understanding data privacy, intellectual property implications and the ethical use of generative AI is no longer a specialist topic — it is a professional baseline that hiring teams will assess.\n\nStudents preparing for this landscape benefit from treating it as seriously as any other compliance topic — knowing, for example, what kinds of client or company data should never be pasted into a public AI tool, how to disclose AI assistance transparently in academic and professional work, and why attribution matters even when a tool made the first draft. Institutions that build this into coursework now are preparing students for policies they will otherwise have to learn the hard way on the job.",
        image: "/images/events/institutional-collaboration.jpg",
        imageAlt: "Institutional session on responsible AI",
      },
    ],
  },
  {
    slug: "building-a-stronger-placement-culture",
    title: "Building a Stronger Student Placement Culture",
    excerpt:
      "How academic institutions can build a campus culture that normalises career planning from year one.",
    category: "general",
    categoryLabel: "General",
    date: "2024-03-05",
    readTime: 8,
    author: { name: "Editorial Team" },
    coverImage: "/images/events/group-activity-workshop.jpg",
    sections: [
      {
        heading: "Culture is built in year one, not year four",
        body: "The most placement-successful campuses we work with share one trait: they introduce career awareness in the very first semester. Not pressure — awareness. Exposing first-year students to alumni journeys, industry interactions and career mapping exercises normalises the conversation and removes the stigma of not having everything figured out immediately.\n\nThe most effective first-year sessions are deliberately low-stakes: a panel of recent alumni describing the winding, often non-linear paths that led to their current roles, rather than a polished success story that makes uncertainty feel like failure. Students who hear early that career direction is something you iterate on, not something you are expected to arrive with, engage far more openly with career planning in the years that follow.",
        image: "/images/events/student-community-cohort.jpg",
        imageAlt: "Student community cohort gathering",
      },
      {
        heading: "Peer learning accelerates more than faculty instruction",
        body: "Students listen to students. Peer mentorship programmes — where final-year students guide juniors through placement preparation — create a powerful learning loop that compounds year over year. The mentors reinforce their own skills by teaching, and the mentees get guidance from someone who was recently in their exact position.\n\nThe strongest peer programmes give mentors real structure rather than leaving the relationship informal — a shared checklist of milestones, a monthly check-in format, and specific skills each mentor is responsible for reinforcing, whether that is resume review, mock interviews or industry research. This structure prevents the common failure mode where peer mentorship starts strong in the first month and quietly fades once both parties get busy.",
        image: "/images/events/interactive-workshop.jpg",
        imageAlt: "Peer learning workshop",
      },
      {
        heading: "Recognition shapes behaviour",
        body: "What gets recognised gets repeated. Institutions that publicly celebrate not just placement offers but placement preparation milestones — a student who completed a mock interview, a team that won a case competition, a peer mentor who supported ten juniors — create a culture where career readiness is seen as an achievement worth pursuing, not a chore to be endured at the end of four years.\n\nThis kind of recognition works best when it is visible and specific rather than generic — naming the student and the milestone in a newsletter or assembly, rather than a vague mention of 'placement activities'. Over several cohorts, this visibility does something subtler than motivate individuals: it resets what the whole campus considers normal, so that showing up prepared becomes the expectation rather than the exception.",
        image: "/images/events/certificate-distribution.jpg",
        imageAlt: "Certificate distribution celebrating student milestones",
      },
    ],
  },
];

export const categoryColors: Record<BlogCategory, string> = {
  "software-development": "bg-[#e8f0fc] text-[#1a47a8]",
  "data-science": "bg-[#fdeaea] text-[#a12d2d]",
  "artificial-intelligence": "bg-[#ede8fc] text-[#5b2bcb]",
  mba: "bg-[#fdf3e8] text-[#8a6400]",
  general: "bg-[#e8f6f4] text-[#025c55]",
  "digital-marketing": "bg-[#fdeaea] text-[#a12d2d]",
  management: "bg-[#e8f6f4] text-[#025c55]",
  finance: "bg-[#e8f0fc] text-[#1a47a8]",
  "agentic-ai": "bg-[#ede8fc] text-[#5b2bcb]",
  dba: "bg-[#fdf3e8] text-[#8a6400]",
  "generative-ai": "bg-[#ede8fc] text-[#5b2bcb]",
  "student-stories": "bg-[#fdf3e8] text-[#8a6400]",
  "career-tips": "bg-[#fdeaea] text-[#a12d2d]",
};
