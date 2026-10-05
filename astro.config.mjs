import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import yaml from 'js-yaml';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const { site } = yaml.load(fs.readFileSync('./config/site.yaml', 'utf8'));

export default defineConfig({
  site: site.url,
  integrations: [mdx(), sitemap()],
  build: { inlineStylesheets: 'always' },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' }, defaultColor: false, wrap: false },
  },
});
