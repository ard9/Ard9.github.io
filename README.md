# ard9.github.io

Personal site of Armin Rahimi: projects & files, writing, areas and CV.
Built with [Astro](https://astro.build), searchable with [Pagefind](https://pagefind.app),
and deployed to GitHub Pages automatically on every push.

**You never need to edit code to change content.** Everything lives in plain text files:

| What you want to change | Edit this |
| --- | --- |
| Name, intro, menu, links, areas, fonts, colours | `config/site.yaml` |
| CV (jobs, skills, education…) | `config/resume.yaml` |
| Projects | `content/projects/*.md` |
| Tutorials, notes and articles | `content/writing/*.md` |
| Extra pages (e.g. About) | `content/pages/*.md` |
| Downloadable files | `public/files/` |
| Images | `public/images/` |
| Jupyter notebooks | `public/notebooks/` |

## How content is organised

**Areas** are the main shelves of the site, defined once in `config/site.yaml`
(LLMs & Agents, LLMOps & MLOps, Speech & Audio, Applied ML). Each has a colour and its
own page at `/areas/<id>`. **Tags** are free-form details such as `vLLM` or `LoRA`.

Every project and article lists its areas and tags at the top of its file:

```yaml
areas: [speech-audio, ops]
tags: [ASR, TensorRT, FastAPI]
```

The site then places it on each area's page, colour-codes it, and makes it filterable on
the Work and Writing pages (filters stay in the address, e.g. `/projects?area=ops`).

To add an area, add a block under `areas:` in `config/site.yaml`. To add skills to an
area page, give a skill group in `config/resume.yaml` the matching `area:`.

## Add a project

1. Copy `content/projects/_template.md` and rename it, e.g. `speaker-diarization.md`.
   The file name becomes the URL: `/projects/speaker-diarization`.
2. Fill in the fields at the top and write the story below.
   `highlights:` shows up to four key results in large type on the project page.
3. To attach files, put them in `public/files/` and list them under `files:`.
   Each one is shown with its type and size automatically.
4. Commit and push. The site rebuilds in about a minute.

## Add writing

Same as above, using `content/writing/_template.md`.

- `type:` is `tutorial`, `note` or `article`. Visitors can filter by type.
- `series:` and `part:` link multi-part posts together.
- `notebook: /notebooks/my-notebook.ipynb` adds **Open in Colab**, **Download** and **View on GitHub** buttons.
- Maths works with `$inline$` and `$$block$$`. Code blocks are highlighted in both themes.
- `draft: true` hides a file from the live site while you work on it.

### Audio samples

Rename a file from `.md` to `.mdx`, then:

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

## Dark and light themes

Visitors switch with the button in the header, and their choice is remembered.
`theme.default` in `config/site.yaml` sets the starting theme (`dark`, `light` or
`system`), and `theme.dark` / `theme.light` set the base colours. Area colours are set
per theme under each area.

## Fonts

Write any font name under `fonts:` in `config/site.yaml`. The three built-in fonts
(Bricolage Grotesque, Instrument Sans, JetBrains Mono) load from the site itself; any
other name is loaded from Google Fonts, so copy the exact name from
[fonts.google.com](https://fonts.google.com).

```yaml
fonts:
  display: Space Grotesk
  body:
    family: Lora
    weights: "400;600"
    italic: true
  code: JetBrains Mono
```

## Search

Press `Ctrl K` (or `/`) on any page. The search index is built automatically after each
build, so new content is searchable as soon as the site is deployed.

## If something is wrong

A typo in `config/site.yaml`, `config/resume.yaml` or a file's front matter stops the
build with a message naming the file and the field, for example an unknown area id.
Check the **Actions** tab on GitHub to see it.

## Run it on your computer (optional)

Requires Node.js 20 or newer.

```bash
npm install
npm run dev      # http://localhost:4321, reloads as you edit (search needs a build)
npm run build    # production build and search index into dist/
npm run preview  # serve the built site, search included
```
