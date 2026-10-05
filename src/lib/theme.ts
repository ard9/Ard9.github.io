import { config } from './config';

// ── Fonts ──
const BUNDLED: Record<string, string> = {
  'bricolage grotesque': 'Bricolage Grotesque Variable',
  'instrument sans': 'Instrument Sans Variable',
  'jetbrains mono': 'JetBrains Mono Variable',
};
const FALLBACK = {
  display: "'Segoe UI', system-ui, sans-serif",
  body: "system-ui, 'Segoe UI', Roboto, sans-serif",
  code: "ui-monospace, 'SFMono-Regular', Menlo, monospace",
};
type Role = keyof typeof FALLBACK;
const DEFAULT_WEIGHTS: Record<Role, string> = { display: '400;700', body: '400;700', code: '400' };

function googleFamily(family: string, weights: string, italic: boolean) {
  const name = family.replace(/\s+/g, '+');
  if (!italic) return `family=${name}:wght@${weights}`;
  const list = weights.split(';');
  return `family=${name}:ital,wght@${[...list.map((w) => `0,${w}`), ...list.map((w) => `1,${w}`)].join(';')}`;
}

export function resolveFonts() {
  const vars: string[] = [];
  const google: string[] = [];
  for (const role of Object.keys(FALLBACK) as Role[]) {
    const raw = config.fonts[role];
    const f = typeof raw === 'string' ? { family: raw } : raw;
    const bundled = BUNDLED[f.family.trim().toLowerCase()];
    const family = bundled ?? f.family.trim();
    if (!bundled) google.push(googleFamily(family, f.weights ?? DEFAULT_WEIGHTS[role], f.italic ?? false));
    vars.push(`--font-${role}:'${family}',${FALLBACK[role]};`);
  }
  return {
    vars: vars.join(''),
    googleHref: google.length ? `https://fonts.googleapis.com/css2?${google.join('&')}&display=swap` : undefined,
  };
}

// ── Colours ──
type Mode = 'dark' | 'light';
function palette(mode: Mode) {
  const p = config.theme[mode];
  const mix = (a: string, b: string, pct: number) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;
  const vars: Record<string, string> = {
    '--bg': p.background,
    '--surface': p.surface,
    '--sunk': mix(p.background, mode === 'dark' ? '#000' : p.line, mode === 'dark' ? 70 : 60),
    '--line': p.line,
    '--line-strong': mix(p.line, p.text, 78),
    '--fg': p.text,
    '--fg-soft': mix(p.text, p.background, 78),
    '--muted': p.muted,
    '--accent': p.text,
  };
  for (const a of config.areas) vars[`--area-${a.id}`] = a.color[mode];
  return `color-scheme:${mode};` + Object.entries(vars).map(([k, v]) => `${k}:${v};`).join('');
}

/** All theme CSS, generated from config/site.yaml */
export function themeCss() {
  const fonts = resolveFonts();
  const dark = palette('dark'), light = palette('light');
  const base = config.theme.default === 'light' ? light : dark;
  return [
    `:root{${fonts.vars}}`,
    `:root{${base}}`,
    config.theme.default === 'system' ? `@media (prefers-color-scheme: light){:root:not([data-theme]){${light}}}` : '',
    `:root[data-theme="dark"]{${dark}}`,
    `:root[data-theme="light"]{${light}}`,
  ].join('\n');
}
