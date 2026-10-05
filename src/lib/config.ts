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
  nav: z.array(link).default([]),
  home: z.object({
    headline: z.string(),
    intro: z.string(),
    sections: z.array(z.enum(['projects', 'tutorials', 'experience'])).default(['projects', 'tutorials', 'experience']),
    projects_count: z.number().default(4),
    tutorials_count: z.number().default(4),
    experience_title: z.string().default('Latest role'),
  }),
  sections: z.object({
    projects: z.object({ title: z.string(), intro: z.string().optional() }),
    tutorials: z.object({ title: z.string(), intro: z.string().optional() }),
    cv: z.object({ title: z.string() }),
  }),
  footer: z.object({ note: z.string().optional() }).default({}),
  fonts: z.object({
    display: font.default('Bricolage Grotesque'),
    prose: font.default('Newsreader'),
    code: font.default('JetBrains Mono'),
  }).default({}),
  theme: z.object({ accent: z.string().default('#FBB061'), accent_2: z.string().default('#E0507A') }).default({}),
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
  skills: z.array(z.object({ group: z.string(), items: z.array(z.string()) })).default([]),
  education: z.array(z.object({
    degree: z.string(), school: z.string(), start: z.string().optional(), end: z.string().optional(), note: z.string().optional(),
  })).default([]),
  certifications: z.array(z.object({ name: z.string(), issuer: z.string().optional(), url: z.string().optional() })).default([]),
  languages: z.array(z.object({ name: z.string(), level: z.string() })).default([]),
});

function load<T extends z.ZodTypeAny>(raw: string, schema: T, file: string): z.infer<T> {
  const parsed = schema.safeParse(yaml.load(raw));
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  • ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`\n\nThere's a problem in ${file}:\n${issues}\n`);
  }
  return parsed.data;
}

export const config = load(siteRaw, siteSchema, 'config/site.yaml');
export const resume = load(resumeRaw, resumeSchema, 'config/resume.yaml');
