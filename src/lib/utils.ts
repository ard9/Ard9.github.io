import fs from 'node:fs';
import path from 'node:path';
import { getCollection } from 'astro:content';
import { config } from './config';

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const formatDate = (d: Date, style: 'long' | 'short' = 'long') =>
  d.toLocaleDateString('en-GB', style === 'long'
    ? { day: 'numeric', month: 'long', year: 'numeric' }
    : { month: 'short', year: 'numeric' });

export const readingTime = (body = '') => {
  const words = body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
};

export function fileSize(publicPath: string): string | undefined {
  if (/^https?:/.test(publicPath)) return undefined;
  try {
    const bytes = fs.statSync(path.join(process.cwd(), 'public', publicPath)).size;
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0, n = bytes;
    while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
    return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
  } catch { return undefined; }
}

export const fileExt = (p: string) => (p.split('.').pop() || '').toUpperCase();

export function colabUrl(notebook: string) {
  if (/^https?:/.test(notebook) || !config.site.repo) return undefined;
  return `https://colab.research.google.com/github/${config.site.repo}/blob/${config.site.branch}/public${notebook}`;
}
export function githubUrl(publicPath: string) {
  if (!config.site.repo) return undefined;
  return `https://github.com/${config.site.repo}/blob/${config.site.branch}/public${publicPath}`;
}

const isLive = (e: { data: { draft: boolean } }) => import.meta.env.DEV || !e.data.draft;

export async function getProjects() {
  return (await getCollection('projects', isLive)).sort((a, b) => +b.data.date - +a.data.date);
}
export async function getTutorials() {
  return (await getCollection('tutorials', isLive)).sort((a, b) => +b.data.date - +a.data.date);
}
export async function getTopics() {
  const map = new Map<string, { name: string; slug: string; count: number }>();
  for (const t of await getTutorials()) {
    const slug = slugify(t.data.topic);
    const cur = map.get(slug) ?? { name: t.data.topic, slug, count: 0 };
    cur.count++; map.set(slug, cur);
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
