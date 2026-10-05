import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const fileLink = z.object({ label: z.string(), path: z.string(), note: z.string().optional() });
const extLink = z.object({ label: z.string(), url: z.string() });

// content/projects/*.md(x)  →  /projects/<file-name>
const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
    status: z.string().optional(),
    links: z.array(extLink).default([]),
    files: z.array(fileLink).default([]),
    draft: z.boolean().default(false),
  }),
});

// content/tutorials/*.md(x)  →  /tutorials/<file-name>
const tutorials = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './content/tutorials' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    topic: z.string(),
    tags: z.array(z.string()).default([]),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    notebook: z.string().optional(),
    source: extLink.optional(),
    files: z.array(fileLink).default([]),
    draft: z.boolean().default(false),
  }),
});

// content/pages/*.md(x)  →  /<file-name>   (e.g. about.md → /about)
const pages = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './content/pages' }),
  schema: z.object({ title: z.string(), description: z.string().optional() }),
});

export const collections = { projects, tutorials, pages };
