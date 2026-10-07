import claimsData from "./claims.json";
import educationData from "./education.json";
import experienceData from "./experience.json";
import highlightsData from "./highlights.json";
import linksData from "./links.json";
import newsData from "./news.json";
import profileData from "./profile.json";
import projectsData from "./projects.json";
import publicationsData from "./publications.json";
import researchData from "./research.json";
import skillsData from "./skills.json";
import testimonialsData from "./testimonials.json";

export type Claim = {
  id: string;
  statement: string;
  evidence: string;
  publicSafe: boolean;
  approved: boolean;
  lastVerified: string | null;
  notes?: string;
};

export type Link = {
  kind: "email" | "github" | "linkedin" | "scholar" | "resume";
  label: string;
  href: string;
  available: boolean;
  claimIds: string[];
};

export type LabeledLink = { label: string; href: string };

export type Profile = {
  publish: boolean;
  displayName: string;
  role: string;
  affiliation: string;
  affiliationShort: string;
  fellowship: string;
  description: string;
  bio: string[];
  availability: string;
  broadLocation: string;
  photo: string | null;
  claimIds: string[];
};

export type NewsItem = {
  id: string;
  publish: boolean;
  /** Year and month, as YYYY-MM. */
  date: string;
  text: string;
  href?: string;
  linkLabel?: string;
  claimIds: string[];
};

export type ResearchItem = {
  id: string;
  publish: boolean;
  title: string;
  tagline: string;
  status: string;
  tone: "released" | "accepted" | "progress";
  summary: string;
  /** One-sentence version for the CV. */
  short: string;
  stack: string[];
  href: string;
  links: LabeledLink[];
  claimIds: string[];
};

export type Project = {
  id: string;
  publish: boolean;
  title: string;
  summary: string;
  stack: string[];
  href: string;
  links: LabeledLink[];
  claimIds: string[];
};

export type Publication = {
  id: string;
  publish: boolean;
  title: string;
  authors: string[];
  venue: string;
  status: "published" | "accepted" | "preprint";
  year: number;
  note?: string;
  links: LabeledLink[];
  claimIds: string[];
};

export type Experience = {
  id: string;
  publish: boolean;
  role: string;
  organization: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  bullets: string[];
  href?: string;
  hrefLabel?: string;
  claimIds: string[];
};

export type Education = {
  id: string;
  publish: boolean;
  institution: string;
  degree: string;
  start: string;
  end: string;
  details: string[];
  claimIds: string[];
};

export type Highlight = {
  id: string;
  publish: boolean;
  category: "honor" | "service" | "certification";
  title: string;
  detail?: string;
  href?: string;
  claimIds: string[];
};

export type Testimonial = {
  id: string;
  publish: boolean;
  quote: string;
  name: string;
  role: string;
  relation: string;
  claimIds: string[];
};

export type SkillGroup = {
  id: string;
  publish: boolean;
  title: string;
  items: string[];
  claimIds: string[];
};

const published = <T extends { publish: boolean }>(items: T[]) =>
  items.filter((item) => item.publish);

export const claims = claimsData as Claim[];
export const profile = profileData as Profile;
export const links = (linksData as Link[]).filter((link) => link.available);
export const news = published(newsData as NewsItem[]);
export const research = published(researchData as ResearchItem[]);
export const projects = published(projectsData as Project[]);
export const publications = published(publicationsData as Publication[]);
export const experience = published(experienceData as Experience[]);
export const education = published(educationData as Education[]);
export const highlights = published(highlightsData as Highlight[]);
export const skillGroups = published(skillsData as SkillGroup[]);
export const testimonials = published(testimonialsData as Testimonial[]);

export const linkOf = (kind: Link["kind"]) =>
  links.find((link) => link.kind === kind);

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Formats a YYYY-MM date as "Sep 2026". */
export const monthYear = (date: string) => {
  const [year, month] = date.split("-");
  return `${months[Number(month) - 1]} ${year}`;
};

/** True for the owner's own name in an author list. */
export const isSelf = (author: string) => /\bNeom$/.test(author);
