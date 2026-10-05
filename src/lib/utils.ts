import fs from 'node:fs';
import path from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';
import { config } from './config';

export const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const formatDate = (d: Date, style: 'long' | 'short' = 'long') =>
  d.toLocaleDateString('en-GB', style === 'long'
    ? { day: 'numeric', month: 'long', year: 'numeric' }
    : { month: 'short', year: 'numeric' });

export const readingTime = (body = '') =>
  Math.max(1, Math.round(body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length / 220));

export const TYPE_LABEL = { tutorial: 'Tutorial', note: 'Note', article: 'Article' } as const;

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
const byDate = (a: { data: { date: Date } }, b: { data: { date: Date } }) => +b.data.date - +a.data.date;

export async function getProjects() { return (await getCollection('projects', isLive)).sort(byDate); }
export async function getWriting() { return (await getCollection('writing', isLive)).sort(byDate); }

export async function areaStats() {
  const [p, w] = [await getProjects(), await getWriting()];
  return new Map(config.areas.map((a) => [a.id, {
    projects: p.filter((x) => x.data.areas.includes(a.id)).length,
    writing: w.filter((x) => x.data.areas.includes(a.id)).length,
    tags: topTags([...p, ...w].filter((x) => x.data.areas.includes(a.id)), 5),
  }]));
}

export function topTags(entries: { data: { tags: string[] } }[], n = 8) {
  const counts = new Map<string, number>();
  entries.forEach((e) => e.data.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n).map(([t]) => t);
}

export async function seriesOf(entry: CollectionEntry<'writing'>) {
  if (!entry.data.series) return [];
  return (await getWriting())
    .filter((w) => w.data.series === entry.data.series)
    .sort((a, b) => (a.data.part ?? +a.data.date) - (b.data.part ?? +b.data.date));
}
