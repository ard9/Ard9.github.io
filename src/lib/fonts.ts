import { config } from './config';

// Fonts that ship with the site (self-hosted, no extra setup).
const BUNDLED: Record<string, string> = {
  'bricolage grotesque': 'Bricolage Grotesque Variable',
  'newsreader': 'Newsreader Variable',
  'jetbrains mono': 'JetBrains Mono Variable',
};

const FALLBACK = {
  display: "'Segoe UI', system-ui, sans-serif",
  prose: "'Iowan Old Style', Georgia, serif",
  code: "ui-monospace, 'SFMono-Regular', Menlo, monospace",
};

type Role = keyof typeof FALLBACK;
const DEFAULT_WEIGHTS: Record<Role, string> = { display: '400;700', prose: '400;700', code: '400' };

function googleFamily(family: string, weights: string, italic: boolean) {
  const name = family.trim().replace(/\s+/g, '+');
  if (!italic) return `family=${name}:wght@${weights}`;
  const list = weights.split(';');
  const pairs = [...list.map((w) => `0,${w}`), ...list.map((w) => `1,${w}`)].join(';');
  return `family=${name}:ital,wght@${pairs}`;
}

export function resolveFonts() {
  const vars: string[] = [];
  const google: string[] = [];
  for (const role of Object.keys(FALLBACK) as Role[]) {
    const raw = config.fonts[role];
    const font = typeof raw === 'string' ? { family: raw } : raw;
    const bundled = BUNDLED[font.family.trim().toLowerCase()];
    const family = bundled ?? font.family.trim();
    if (!bundled) google.push(googleFamily(family, font.weights ?? DEFAULT_WEIGHTS[role], font.italic ?? false));
    vars.push(`--font-${role}:'${family}',${FALLBACK[role]};`);
  }
  return {
    vars: vars.join(''),
    googleHref: google.length ? `https://fonts.googleapis.com/css2?${google.join('&')}&display=swap` : undefined,
  };
}
