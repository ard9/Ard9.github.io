import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { areaIds } from './lib/config';

const area = z.enum(areaIds as [string, ...string[]], {
  errorMap: () => ({ message: `must be one of the area ids in config/site.yaml: ${areaIds.join(', ')}` }),
});
const fileLink = z.object({ label: z.string(), path: z.string(), note: z.string().optional() });
const extLink = z.object({ label: z.string(), url: z.string() });
const pattern = '**/[^_]*.{md,mdx}'; // files starting with "_" are ignored (templates)

// content/projects/*.md(x)  →  /projects/<file-name>
const projects = defineCollection({
  loader: glob({ pattern, base: './content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    areas: z.array(area).min(1, 'add at least one area, e.g. areas: [llm-agents]'),
    tags: z.array(z.string()).default([]),
    highlights: z.array(z.object({ value: z.string(), label: z.string() })).max(4).default([]),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
    status: z.string().optional(),
    links: z.array(extLink).default([]),
    files: z.array(fileLink).default([]),
    draft: z.boolean().default(false),
  }),
});

// content/writing/*.md(x)  →  /writing/<file-name>
const writing = defineCollection({
  loader: glob({ pattern, base: './content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    type: z.enum(['tutorial', 'note', 'article']).default('tutorial'),
    areas: z.array(area).min(1, 'add at least one area, e.g. areas: [speech-audio]'),
    tags: z.array(z.string()).default([]),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    series: z.string().optional(),
    part: z.number().optional(),
    notebook: z.string().optional(),
    source: extLink.optional(),
    files: z.array(fileLink).default([]),
    draft: z.boolean().default(false),
  }),
});

// content/pages/*.md(x)  →  /<file-name>   (e.g. about.md → /about)
const pages = defineCollection({
  loader: glob({ pattern, base: './content/pages' }),
  schema: z.object({ title: z.string(), description: z.string().optional() }),
});

export const collections = { projects, writing, pages };
