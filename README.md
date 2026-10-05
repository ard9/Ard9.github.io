# ard9.github.io

Personal site of Armin Rahimi: CV, projects & files, and tutorials.
Built with [Astro](https://astro.build) and deployed to GitHub Pages automatically.

**You never need to edit code to change content.** Everything lives in plain text files:

| What you want to change | Edit this |
| --- | --- |
| Name, intro, menu, social links, colours | `config/site.yaml` |
| CV (jobs, skills, education…) | `config/resume.yaml` |
| Projects | `content/projects/*.md` |
| Tutorials | `content/tutorials/*.md` |
| Extra pages (e.g. About) | `content/pages/*.md` |
| Downloadable files | `public/files/` |
| Images | `public/images/` |
| Jupyter notebooks | `public/notebooks/` |

## Add a project

1. Copy `content/projects/_template.md` and rename it, e.g. `speaker-diarization.md`.
   The file name becomes the URL: `/projects/speaker-diarization`.
2. Fill in the fields at the top and write the description below.
3. To attach files, put them in `public/files/` and list them under `files:`.
   The site shows each one with its type and size automatically.
4. Commit and push. The site rebuilds in about a minute.

## Add a tutorial

Same as above, using `content/tutorials/_template.md`.

- `topic:` groups tutorials. A new topic gets its own section and page automatically.
- `notebook: /notebooks/my-notebook.ipynb` adds **Open in Colab**, **Download** and **View on GitHub** buttons.
- Maths works with `$inline$` and `$$block$$` (KaTeX). Code blocks are highlighted.
- Set `draft: true` to hide something from the live site while you work on it.

### Audio samples

Rename a tutorial or project from `.md` to `.mdx`, then:

```mdx
import AudioClip from '../../src/components/AudioClip.astro';

<AudioClip src="/files/sample.wav" caption="Narrowband version" />
```

## Add a page to the menu

Create `content/pages/about.md`, then add it to `nav:` in `config/site.yaml`:

```yaml
nav:
  - label: About
    href: /about
```

## If something is wrong

If you make a typo in `config/site.yaml`, `config/resume.yaml` or a file's front matter,
the build stops and the error message names the file and the field. Check the
**Actions** tab on GitHub to see it.

## Run it on your computer (optional)

Requires Node.js 20 or newer.

```bash
npm install
npm run dev      # opens http://localhost:4321 and reloads as you edit
npm run build    # production build into dist/
```
