/**
 * 10 - ZSKILLUP IN ACTION
 *
 * The brief's framing: Partners gives institutional proof, Testimonials gives
 * learner proof, and this section gives VISUAL proof that ZSkillup is genuinely
 * active on the ground. It also renames the destination away from "Gallery",
 * which "sounds passive" - the concept is "ZSkillup in Action".
 *
 * Built to scale: adding 100+ photographs later must not change the homepage
 * layout. The homepage shows one featured carousel plus eight gallery tiles;
 * everything beyond that lives behind "View More Photos".
 *
 * Photographs are the approved comp's own images, extracted by
 * `scripts/extract-comp-assets.py`. The comp contains ONE featured photograph and
 * eight gallery photographs, so the featured carousel currently draws on the
 * gallery set as well - more dedicated featured shots are needed. See
 * CONTENT-TODO.md.
 */

export const inAction = {
  eyebrow: "Events & moments",
  headline: "ZSkillup in Action.",
  supporting:
    "A glimpse of ZSkillup in action — across campuses, classrooms, industry interactions and community events. Real people. Real learning. A brighter tomorrow.",
  viewMore: { label: "View All Moments", href: "/events" },
  featuredBadge: "Featured Event",
} as const;

/**
 * Filters, simplified per the brief.
 * "Webinars" was dropped - not worth a homepage filter without substantial
 * visual content behind it.
 */
export const badgeColors: Record<string, string> = {
  "campus-programs": "bg-[#ede9fe] text-[#6d28d9]",
  "community":       "bg-[#dcfce7] text-[#16a34a]",
  "industry":        "bg-[#fff3e0] text-[#ea6c00]",
  "workshops":       "bg-[#ede9fe] text-[#6d28d9]",
  "events":          "bg-[#fce7f3] text-[#be185d]",
  "expert-talks":    "bg-[#fff3e0] text-[#ea6c00]",
};

export const badgeLabels: Record<string, string> = {
  "campus-programs": "Campus Program",
  "community":       "Community",
  "industry":        "Industry",
  "workshops":       "Workshop",
  "events":          "Event",
  "expert-talks":    "Expert Talk",
};

export const galleryFilters = [
  { id: "all", label: "All" },
  { id: "campus-programs", label: "Campus Programs" },
  { id: "workshops", label: "Workshops" },
  { id: "industry", label: "Industry Interactions" },
  { id: "events", label: "Events" },
  { id: "community", label: "Student Community" },
  { id: "expert-talks", label: "Expert Talks" },
] as const;

export type GalleryCategory = (typeof galleryFilters)[number]["id"];

export type Article = {
  heading: string;
  body: string;
  /** Optional image path shown beside this article block */
  image?: string;
  imageAlt?: string;
};

export type Photo = {
  src: string;
  alt: string;
  title: string;
  /** One short context line. Keep it short. */
  caption: string;
  category: Exclude<GalleryCategory, "all">;
  /** URL-safe slug for the event detail page */
  slug: string;
  /** Display date string, e.g. "Mar 15, 2024" */
  date?: string;
  /** City / venue shown alongside the date */
  location?: string;
  /** Long-form article blocks shown on the event detail page */
  articles?: Article[];
  /** Additional photo paths shown in the gallery on the detail page */
  photos?: string[];
};

/**
 * Featured carousel. The brief asks for strong, high-quality real photographs
 * showing people and action rather than posed group shots.
 */
export const featuredEvents: readonly Photo[] = [
  {
    src: "/images/events/industry-expert-session.jpg",
    alt: "Speaker presenting to a packed audience at ZSkillup Tech Career Summit 2024",
    title: "ZSkillup Tech Career Summit 2024",
    caption: "Inspiring conversations, real opportunities and a stronger tomorrow — together.",
    category: "industry",
    slug: "tech-career-summit-2024",
    date: "Nov 16, 2024",
    location: "Bengaluru, India",
    articles: [
      {
        heading: "Where ambition met opportunity",
        body: "The ZSkillup Tech Career Summit 2024 brought together over 500 students, industry leaders, and career coaches under one roof in Bengaluru. The energy was electric — every session sparked new ideas about what a career in tech could look like, and every hallway conversation turned into a potential connection.",
        image: "/images/events/expert-talk-series.jpg",
        imageAlt: "Industry expert speaking to an engaged audience",
      },
      {
        heading: "Keynotes, panels, and real talk",
        body: "From hands-on workshops on AI and data science to candid panel discussions on breaking into product management, attendees left with clarity, contacts, and a renewed sense of direction. Speakers from leading companies shared hiring insights, day-in-the-life stories, and actionable advice — no fluff, just real guidance.",
        image: "/images/events/hands-on-learning-lab.jpg",
        imageAlt: "Students engaging in a hands-on workshop session",
      },
    ],
    photos: [
      "/images/events/hands-on-learning-lab.jpg",
      "/images/events/expert-talk-series.jpg",
      "/images/events/group-activity-workshop.jpg",
    ],
  },
  {
    src: "/images/events/student-community-cohort.jpg",
    alt: "A large cohort of students gathered at a ZSkillup campus program",
    title: "Student Community",
    caption: "A growing community of learners",
    category: "community",
    slug: "student-community",
    date: "Feb 10, 2024",
    location: "Pune",
    articles: [
      {
        heading: "A community that grows together",
        body: "Our Pune cohort came together not just to learn, but to build lasting friendships along the way. Study groups formed organically, ideas were traded freely, and the classroom energy carried on long after each session ended.",
        image: "/images/events/group-activity-workshop.jpg",
        imageAlt: "Students collaborating during a group activity session",
      },
      {
        heading: "Peer-led learning",
        body: "Senior learners mentored newer ones, turning every meetup into a two-way exchange of experience and encouragement. It's this culture of showing up for each other that keeps the ZSkillup community growing.",
        image: "/images/events/institutional-collaboration.jpg",
        imageAlt: "ZSkillup team with institution representatives",
      },
    ],
  },
  {
    src: "/images/events/acca-career-workshop-session.jpg",
    alt: "A speaker presenting global certification career opportunities to students",
    title: "ACCA Career Workshop",
    caption: "Exploring global commerce opportunities",
    category: "workshops",
    slug: "acca-career-workshop",
    date: "Jan 20, 2024",
    location: "Delhi",
    articles: [
      {
        heading: "Opening doors to global commerce",
        body: "The ACCA Career Workshop walked students through what it actually takes to build a career in global finance and accountancy. Practising professionals shared the certification path, the exam journey, and the doors it opens internationally.",
        image: "/images/events/expert-talk-series.jpg",
        imageAlt: "Industry expert speaking to an engaged audience",
      },
      {
        heading: "Practical guidance, real pathways",
        body: "Beyond the theory, students got hands-on help mapping out their own ACCA timeline — from choosing the right papers to planning study schedules around college. Many left with a clear next step instead of just information.",
        image: "/images/events/hands-on-learning-lab.jpg",
        imageAlt: "Students engaging in a hands-on workshop session",
      },
    ],
  },
  {
    src: "/images/events/certificate-distribution.jpg",
    alt: "Students holding their programme completion certificates",
    title: "Certificate Distribution",
    caption: "Celebrating achievements",
    category: "events",
    slug: "certificate-distribution-2024",
    date: "Mar 28, 2024",
    location: "Bangalore",
    articles: [
      {
        heading: "Celebrating every milestone",
        body: "Months of coursework, assignments, and late-night study sessions came full circle as students walked up to receive their programme completion certificates in Bangalore. The room was full of proud families and prouder graduates.",
        image: "/images/events/group-activity-workshop.jpg",
        imageAlt: "Students collaborating during a group activity session",
      },
      {
        heading: "A moment years in the making",
        body: "For many in this cohort, the certificate marked more than a course finishing — it marked the start of a new career direction. ZSkillup mentors stayed on to talk through what's next, from placements to further study.",
        image: "/images/events/student-community-cohort.jpg",
        imageAlt: "A large cohort of students gathered at a ZSkillup campus program",
      },
    ],
  },
];

/** Gallery grid - eight visible on the homepage. */
export const galleryPhotos: readonly Photo[] = [
  {
    src: "/images/events/acca-career-workshop-session.jpg",
    alt: "A speaker presenting at a campus program session",
    title: "Future Ready Workshop",
    caption: "Building skills for what's next",
    category: "campus-programs",
    slug: "future-ready-workshop",
    date: "Jan 20, 2024",
    articles: [
      {
        heading: "Skills built for what's next",
        body: "The Future Ready Workshop was designed around one question: what do students actually need to walk into the job market with confidence? The answer took shape across a day of practical sessions on communication, problem-solving, and workplace readiness.",
        image: "/images/events/hands-on-learning-lab.jpg",
        imageAlt: "Students engaging in a hands-on workshop session",
      },
      {
        heading: "Learning by doing",
        body: "Rather than lectures, students worked through real scenarios in small groups — pitching ideas, giving feedback, and adjusting on the fly. It's the kind of practice that sticks far longer than a slide deck.",
        image: "/images/events/interactive-workshop.jpg",
        imageAlt: "A facilitator writing ideas on a whiteboard during an interactive workshop",
      },
    ],
  },
  {
    src: "/images/events/student-community-cohort.jpg",
    alt: "A large cohort of students posed together at a ZSkillup campus program",
    title: "Student Community Meet",
    caption: "A growing community of learners",
    category: "community",
    slug: "student-community-meet",
    date: "Feb 10, 2024",
    articles: [
      {
        heading: "Building connections that last",
        body: "The Student Community Meet brought together learners from across programs to share experiences, swap notes, and build friendships that go beyond the classroom. It was a reminder that learning is as much about the people you meet as the skills you acquire.",
        image: "/images/events/group-activity-workshop.jpg",
        imageAlt: "Students collaborating during a group activity session",
      },
      {
        heading: "Peer learning in action",
        body: "Structured peer-led sessions gave students the floor to share what they had learned — in their own words, at their own pace. The result was a room full of genuine curiosity, laughter, and the kind of insight that only comes from lived experience.",
        image: "/images/events/institutional-collaboration.jpg",
        imageAlt: "ZSkillup team with institution representatives",
      },
    ],
    photos: [
      "/images/events/group-activity-workshop.jpg",
      "/images/events/institutional-collaboration.jpg",
      "/images/events/certificate-distribution.jpg",
    ],
  },
  {
    src: "/images/events/hands-on-learning-lab.jpg",
    alt: "A group of students gathered around a laptop during a practical session",
    title: "Hands-on Learning",
    caption: "Practical skills for real-world careers",
    category: "industry",
    slug: "hands-on-learning",
    date: "Mar 5, 2024",
    articles: [
      {
        heading: "Practical skills for real-world careers",
        body: "This session traded theory for practice, putting students directly in front of the tools and workflows used on the job. Working in small teams, they tackled a live-style problem from start to finish, with mentors on hand to guide the process.",
        image: "/images/events/group-activity-workshop.jpg",
        imageAlt: "Students seated around a table collaborating during a group activity",
      },
      {
        heading: "From theory to practice",
        body: "The biggest shift students noticed was in confidence — after building something end to end, industry concepts that once felt abstract suddenly made sense. That's the gap this format is built to close.",
        image: "/images/events/expert-talk-series.jpg",
        imageAlt: "A speaker presenting to an engaged audience",
      },
    ],
  },
  {
    src: "/images/events/expert-talk-series.jpg",
    alt: "A speaker presenting 'Adapting to the Future of Work' to an audience",
    title: "Adapting to the Future of Work",
    caption: "Conversations with industry leaders",
    category: "expert-talks",
    slug: "adapting-to-future-of-work",
    date: "Mar 28, 2024",
    articles: [
      {
        heading: "Conversations with industry leaders",
        body: "Leaders from across sectors sat down with students to talk candidly about how work itself is changing — new tools, new skill expectations, and what actually matters when hiring. It was less keynote, more honest conversation.",
        image: "/images/events/industry-expert-session.jpg",
        imageAlt: "Speaker presenting to a packed audience",
      },
      {
        heading: "Preparing for what's ahead",
        body: "Students left with a clearer sense of which skills to invest in now, rather than chasing trends later. The recurring advice: stay adaptable, and treat learning as an ongoing habit, not a one-time milestone.",
        image: "/images/events/acca-career-workshop-session.jpg",
        imageAlt: "A speaker presenting career opportunities to students",
      },
    ],
  },
  {
    src: "/images/events/certificate-distribution.jpg",
    alt: "Students holding their programme completion certificates",
    title: "Certificate Distribution",
    caption: "Celebrating achievements",
    category: "events",
    slug: "certificate-distribution",
    date: "Mar 28, 2024",
    articles: [
      {
        heading: "Hard work, recognized",
        body: "Each certificate handed out represented weeks of coursework, projects, and steady effort. Watching students walk up one by one, it was clear this was a milestone worth celebrating properly.",
        image: "/images/events/student-community-cohort.jpg",
        imageAlt: "A large cohort of students gathered at a ZSkillup campus program",
      },
      {
        heading: "The next chapter begins",
        body: "For most graduates, this wasn't an ending but a launchpad — several left the ceremony straight into conversations with mentors about placements and next steps.",
        image: "/images/events/institutional-collaboration.jpg",
        imageAlt: "ZSkillup team with institution representatives",
      },
    ],
  },
  {
    src: "/images/events/group-activity-workshop.jpg",
    alt: "Students seated around a table collaborating during a group activity",
    title: "Group Activities",
    caption: "Learning together, growing together",
    category: "workshops",
    slug: "group-activities-workshop",
    date: "Jan 15, 2024",
    articles: [
      {
        heading: "Learning together, growing together",
        body: "This workshop leaned entirely on teamwork — every exercise was built around small groups working through a shared challenge rather than individuals working alone. The result was as much about collaboration skills as it was about the subject itself.",
        image: "/images/events/interactive-workshop.jpg",
        imageAlt: "A facilitator writing ideas on a whiteboard during an interactive workshop",
      },
      {
        heading: "Collaboration at the core",
        body: "Students who came in strangers left as teammates, having navigated disagreements, split tasks, and presented a shared result. It's a reminder that most real work happens in groups, not silos.",
        image: "/images/events/hands-on-learning-lab.jpg",
        imageAlt: "Students engaging in a hands-on workshop session",
      },
    ],
  },
  {
    src: "/images/events/institutional-collaboration.jpg",
    alt: "ZSkillup team members talking with institution representatives beside a ZSkillup banner",
    title: "Institutional Collaboration",
    caption: "Partnering for greater impact",
    category: "campus-programs",
    slug: "institutional-collaboration",
    date: "Dec 10, 2023",
    articles: [
      {
        heading: "Partnering for greater impact",
        body: "ZSkillup's campus programs run deepest where institutions are genuinely invested — this visit was about aligning on curriculum, scheduling, and the outcomes both sides wanted to see. Good partnerships start with these unglamorous conversations.",
        image: "/images/events/student-community-cohort.jpg",
        imageAlt: "A large cohort of students gathered at a ZSkillup campus program",
      },
      {
        heading: "Building bridges with institutions",
        body: "Every new collaboration widens the reach of ZSkillup's programs to students who might not otherwise access them. This visit laid the groundwork for a cohort that later graduated with certificates in hand.",
        image: "/images/events/certificate-distribution.jpg",
        imageAlt: "Students holding their programme completion certificates",
      },
    ],
  },
  {
    src: "/images/events/interactive-workshop.jpg",
    alt: "A facilitator writing ideas on a whiteboard during an interactive workshop",
    title: "Interactive Workshop",
    caption: "Turning ideas into action",
    category: "events",
    slug: "interactive-workshop",
    date: "Nov 18, 2023",
    articles: [
      {
        heading: "Turning ideas into action",
        body: "Rather than passively taking notes, students spent this session at the whiteboard — sketching out ideas, debating approaches, and refining them in real time with a facilitator steering the discussion.",
        image: "/images/events/group-activity-workshop.jpg",
        imageAlt: "Students seated around a table collaborating during a group activity",
      },
      {
        heading: "A hands-on approach to learning",
        body: "By the end, rough ideas had turned into concrete plans students could actually act on. It's this format — active, messy, collaborative — that tends to produce the most useful takeaways.",
        image: "/images/events/expert-talk-series.jpg",
        imageAlt: "A speaker presenting to an engaged audience",
      },
    ],
  },
];
