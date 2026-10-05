import yaml from 'js-yaml';
import { z } from 'astro/zod';
import siteRaw from '../../config/site.yaml?raw';
import resumeRaw from '../../config/resume.yaml?raw';

const link = z.object({ label: z.string(), href: z.string() });
const social = z.object({ label: z.string(), url: z.string(), icon: z.string().default('website') });
const font = z.union([
  z.string(),
  z.object({ family: z.string(), weights: z.string().optional(), italic: z.boolean().optional() }),
]);
const palette = (d: { background: string; surface: string; line: string; text: string; muted: string }) =>
  z.object({
    background: z.string().default(d.background),
    surface: z.string().default(d.surface),
    line: z.string().default(d.line),
    text: z.string().default(d.text),
    muted: z.string().default(d.muted),
  }).default({});

const siteSchema = z.object({
  site: z.object({
    url: z.string().url(),
    title: z.string(),
    description: z.string(),
    repo: z.string().optional(),
    branch: z.string().default('main'),
    language: z.string().default('en'),
  }),
  author: z.object({
    name: z.string(),
    role: z.string(),
    location: z.string().optional(),
    photo: z.string().optional(),
    email: z.string().optional(),
  }),
  socials: z.array(social).default([]),
  areas: z.array(z.object({
    id: z.string().regex(/^[a-z0-9-]+$/, 'use lowercase letters, numbers and dashes only'),
    name: z.string(),
    short: z.string(),
    intro: z.string().optional(),
    visual: z.enum(['patches', 'wave', 'graph', 'rail']).optional(),
    color: z.object({ dark: z.string(), light: z.string() }),
  })).min(1),
  nav: z.array(link).default([]),
  home: z.object({
    headline: z.string(),
    intro: z.string(),
    sections: z.array(z.enum(['areas', 'projects', 'writing', 'experience', 'contact'])).default(['areas', 'projects', 'writing', 'experience', 'contact']),
    projects_count: z.number().default(5),
    writing_count: z.number().default(4),
    experience_title: z.string().default('Latest role'),
    contact_title: z.string().default('Get in touch'),
    contact_text: z.string().optional(),
  }),
  sections: z.object({
    projects: z.object({ title: z.string(), intro: z.string().optional() }),
    writing: z.object({ title: z.string(), intro: z.string().optional() }),
    areas: z.object({ title: z.string(), intro: z.string().optional() }),
    cv: z.object({ title: z.string() }),
  }),
  footer: z.object({ note: z.string().optional() }).default({}),
  fonts: z.object({
    display: font.default('Bricolage Grotesque'),
    body: font.default('Instrument Sans'),
    code: font.default('JetBrains Mono'),
  }).default({}),
  theme: z.object({
    default: z.enum(['dark', 'light', 'system']).default('system'),
    dark: palette({ background: '#10131B', surface: '#171B26', line: '#272D3C', text: '#E8EBF2', muted: '#8C94A7' }),
    light: palette({ background: '#F4F5F8', surface: '#FFFFFF', line: '#DCE0E8', text: '#141823', muted: '#596173' }),
  }).default({}),
});

const resumeSchema = z.object({
  pdf: z.string().optional(),
  show_phone: z.boolean().default(false),
  phone: z.string().optional(),
  summary: z.string().optional(),
  experience: z.array(z.object({
    role: z.string(),
    company: z.string(),
    location: z.string().optional(),
    start: z.string(),
    end: z.string().default('Present'),
    summary: z.string().optional(),
    items: z.array(z.string()).default([]),
    groups: z.array(z.object({ title: z.string(), items: z.array(z.string()) })).default([]),
  })).default([]),
  projects: z.array(z.object({ name: z.string(), description: z.string(), url: z.string().optional() })).default([]),
  skills: z.array(z.object({ group: z.string(), area: z.string().optional(), items: z.array(z.string()) })).default([]),
  education: z.array(z.object({
    degree: z.string(), school: z.string(), start: z.string().optional(), end: z.string().optional(), note: z.string().optional(),
  })).default([]),
  certifications: z.array(z.object({ name: z.string(), issuer: z.string().optional(), url: z.string().optional() })).default([]),
  languages: z.array(z.object({ name: z.string(), level: z.string() })).default([]),
});

function fail(file: string, issues: string[]): never {
  throw new Error(`\n\nThere's a problem in ${file}:\n${issues.map((i) => `  • ${i}`).join('\n')}\n`);
}
function load<T extends z.ZodTypeAny>(raw: string, schema: T, file: string): z.infer<T> {
  const parsed = schema.safeParse(yaml.load(raw));
  if (!parsed.success) fail(file, parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`));
  return parsed.data;
}

export const config = load(siteRaw, siteSchema, 'config/site.yaml');
export const resume = load(resumeRaw, resumeSchema, 'config/resume.yaml');

export type Area = (typeof config.areas)[number];
export const areaIds = config.areas.map((a) => a.id);
export const areaById = new Map(config.areas.map((a) => [a.id, a]));

/** Throws a readable error if a file uses an area id that isn't defined in site.yaml */
export function checkAreas(ids: string[], file: string) {
  const bad = ids.filter((id) => !areaById.has(id));
  if (bad.length) fail(file, [`unknown area "${bad.join('", "')}". Use one of: ${areaIds.join(', ')}`]);
}
for (const s of resume.skills) if (s.area) checkAreas([s.area], 'config/resume.yaml');
