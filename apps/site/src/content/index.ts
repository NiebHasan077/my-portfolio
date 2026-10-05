import claimsData from "./claims.json";
import educationData from "./education.json";
import experienceData from "./experience.json";
import highlightsData from "./highlights.json";
import linksData from "./links.json";
import profileData from "./profile.json";
import projectsData from "./projects.json";
import publicationsData from "./publications.json";
import researchData from "./research.json";
import skillsData from "./skills.json";

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

export type Profile = {
  publish: boolean;
  displayName: string;
  headline: string;
  summary: string;
  about: string;
  broadLocation: string;
  claimIds: string[];
};

export type Experience = {
  id: string;
  publish: boolean;
  organization: string;
  role: string;
  period: string;
  summary: string;
  claimIds: string[];
};

export type Education = {
  id: string;
  publish: boolean;
  institution: string;
  degree: string;
  period: string;
  details?: string[];
  claimIds: string[];
};

export type Project = {
  id: string;
  publish: boolean;
  title: string;
  eyebrow: string;
  summary: string;
  details: string[];
  technologies: string[];
  href: string;
  claimIds: string[];
};

export type Research = {
  id: string;
  publish: boolean;
  title: string;
  summary: string;
  eyebrow: string;
  status: string;
  href: string;
  workstreams: Array<{
    title: string;
    status: string;
    summary: string;
  }>;
  claimIds: string[];
};

export type Publication = {
  id: string;
  publish: boolean;
  title: string;
  venue: string;
  status: "published" | "accepted" | "preprint";
  year: number;
  href?: string;
  claimIds: string[];
};

export type Highlight = {
  id: string;
  publish: boolean;
  category: "problem-solving" | "leadership";
  title: string;
  detail: string;
  href?: string;
  claimIds: string[];
};

export type SkillGroup = {
  id: string;
  publish: boolean;
  title: string;
  items: string[];
  claimIds: string[];
};

export const claims = claimsData as Claim[];
export const education = educationData as Education[];
export const experience = experienceData as Experience[];
export const highlights = highlightsData as Highlight[];
export const links = linksData as Link[];
export const profile = profileData as Profile;
export const projects = projectsData as Project[];
export const publications = publicationsData as Publication[];
export const research = researchData as Research[];
export const skillGroups = (skillsData as SkillGroup[]).filter(
  (group) => group.publish,
);

export const publishedProjects = projects.filter((project) => project.publish);
export const availableLinks = links.filter((link) => link.available);
export const publishedHighlights = highlights.filter((item) => item.publish);
