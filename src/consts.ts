// ============================================================
// thedev — site-wide constants
// TODO: fill in your real values before going live (Phase 7)
// ============================================================

export const SITE_TITLE = "thedev";
export const SITE_DESCRIPTION =
  "Not your traditional developer — the developer. Articles on AWS, software engineering, devtools and shipping side projects.";
export const SITE_TAGLINE = "technical writing on cloud, code & tools";

// ---- Navigation ----
export const NAV = [
  { label: "Home", href: "/", key: "home" },
  { label: "Articles", href: "/articles", key: "articles" },
  { label: "About", href: "/about", key: "about" },
  { label: "Contact", href: "/contact", key: "contact" },
] as const;

// ---- Social links — TODO: replace placeholders ----
export const SOCIALS = {
  github: "https://github.com/youssefframy",
  linkedin: "https://linkedin.com/in/youssefframy",
} as const;

// ---- Credly — TODO: replace with your profile/badge URLs ----
export const CREDLY = {
  profile: "https://www.credly.com/users/youssefframy/badges#credly",
} as const;

// ---- Certifications by provider with direct links ----
export const CERT_PROVIDERS = [
  {
    id: "AWS",
    certs: [
      {
        code: "CLF",
        name: "Cloud Practitioner",
        tier: "Foundational",
        link: "https://www.credly.com/users/youssefframy/badges",
      },
      {
        code: "AIF",
        name: "AI Practitioner",
        tier: "Foundational",
        link: "https://www.credly.com/users/youssefframy/badges",
      },
      {
        code: "SAA",
        name: "Solutions Architect",
        tier: "Associate",
        link: "https://www.credly.com/users/youssefframy/badges",
      },
      {
        code: "DVA",
        name: "Developer",
        tier: "Associate",
        link: "https://www.credly.com/users/youssefframy/badges",
      },
      {
        code: "SOA",
        name: "CloudOps",
        tier: "Associate",
        link: "https://www.credly.com/users/youssefframy/badges",
      },
      {
        code: "DEA",
        name: "Data Engineer",
        tier: "Associate",
        link: "https://www.credly.com/users/youssefframy/badges",
      },
      {
        code: "MLA",
        name: "Machine Learning Engineer",
        tier: "Associate",
        link: "https://www.credly.com/users/youssefframy/badges",
      },
      {
        code: "SAP",
        name: "Solutions Architect",
        tier: "Professional",
        link: "https://www.credly.com/users/youssefframy/badges",
      },
      {
        code: "DOP",
        name: "DevOps Engineer",
        tier: "Professional",
        link: "https://www.credly.com/users/youssefframy/badges",
      },
      {
        code: "SCS",
        name: "Security",
        tier: "Specialty",
        link: "https://www.credly.com/users/youssefframy/badges",
      },
    ],
  },
  {
    id: "Azure",
    certs: [
      {
        code: "AZ104",
        name: "Administrator",
        tier: "Associate",
        link: "https://learn.microsoft.com/en-us/users/youssefframy/credentials/certifications?tab=credentials-tab",
      },
      {
        code: "AZ306",
        name: "Data Scientist",
        tier: "Associate",
        link: "https://learn.microsoft.com/en-us/users/youssefframy/credentials/certifications?tab=credentials-tab",
      },
      {
        code: "AZ204",
        name: "Developer",
        tier: "Associate",
        link: "https://learn.microsoft.com/en-us/users/youssefframy/credentials/certifications?tab=credentials-tab",
      },
    ],
  },
  {
    id: "GCP",
    certs: [
      {
        code: "PCA",
        name: "Professional Cloud Architect",
        tier: "Professional",
        link: "https://www.credly.com/badges/734c6192-b99e-48df-991f-e8d53784b6da",
      },
      {
        code: "PCD",
        name: "Professional Cloud Developer",
        tier: "Professional",
        link: "https://www.credly.com/badges/3d754a91-98f3-42c9-a8d3-f6721323691f",
      },
    ],
  },
  {
    id: "Other",
    certs: [
      {
        code: "MCT",
        name: "Microsoft Certified Trainer",
        tier: "",
        link: "https://www.credly.com/badges/d76bd925-fba0-438b-9dd9-4609db84c654",
      },
      {
        code: "AAI",
        name: "Champion - Authorized Instructor",
        tier: "",
        link: "https://www.credly.com/badges/88677579-f123-4e44-a245-9ea5fe323d23",
      },
      {
        code: "AAI",
        name: "AI/ML Guide",
        tier: "",
        link: "https://www.credly.com/badges/967575e0-d662-4813-bfab-423e2dac980f",
      },
    ],
  },
] as const;

export type CertProvider = (typeof CERT_PROVIDERS)[number];
export type Certification = CertProvider["certs"][number];

// ---- Post categories (single source of truth) ----
export const CATEGORIES = [
  {
    key: "AWS",
    cls: "t-aws",
    glyph: "☁",
    desc: "Serverless, cost, and the occasional Graviton rabbit hole.",
  },
  {
    key: "Software Engineering",
    cls: "t-se",
    glyph: "{}",
    desc: "Architecture decisions, type safety, and choosing boring on purpose.",
  },
  {
    key: "DevTools",
    cls: "t-devtools",
    glyph: ">_",
    desc: "CLIs, editors, and the tooling that makes a workday quieter.",
  },
  {
    key: "Projects",
    cls: "t-projects",
    glyph: "⚑",
    desc: "Shipping side projects without burning a weekend to ash.",
  },
  {
    key: "Notes",
    cls: "t-notes",
    glyph: "✷",
    desc: "Short field notes — debugging, reliability, things I read.",
  },
] as const;

export type Category = (typeof CATEGORIES)[number]["key"];

/** Ordered list of category keys (derived). */
export const CATS = CATEGORIES.map(
  (c) => c.key,
) as unknown as readonly Category[];

/** Category key → CSS modifier class (derived). */
export const CAT_CLASS = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.cls]),
) as Record<Category, string>;
