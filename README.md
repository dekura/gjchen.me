# Personal Homepage

Astro-based personal homepage for post-PhD work, writing, projects, and curated links.

The academic research site remains separate in `../dekura.github.io` and should
be built into `/research`.

## Stack

- Astro static site generation
- MDX content collections
- KaTeX via `remark-math` and `rehype-katex`
- BibTeX citations via `rehype-citation`
- Expressive Code for code blocks
- Tailwind CSS v4 for styling

## Site Split

This repository owns:

- The landing page at `/`
- Writing under `/writing`
- Projects under `/projects`
- Curated links under `/sparkles`
- A short professional About page

The legacy research repository owns:

- Research profile
- Publications
- Academic CV PDF
- The CV/BibTeX build pipeline

In production, the new homepage should link to the legacy research site at:

- `/research/`
- `/research/data/cv.pdf`

## Development

```bash
npm install
make dev
```

`make dev` first prepares the legacy `/research/` subsite and CV PDF, then starts
Astro dev server. This avoids local preview 404s for `/research/`.

`npm run dev` remains available as the fastest path for editing only the Astro
homepage. It does not prepare the final `/research/` subsite route.

To inspect the whole deployed shape locally, including `/research/`, run:

```bash
make preview
```

## Daily Workflow

Use this repo for source changes:

```bash
cd /Users/joyg/career/research/reputation/personal-homepage
```

Typical loop:

```bash
make dev
# edit Astro pages, CSS, or content
make test
make build
git add <changed files>
git commit -m "Describe the source change"
git push
```

To publish the live site after source changes:

```bash
make deploy
```

This verifies and builds the full site, commits/pushes changes in this source
repo and `../cv` when present, then deploys the generated static output into the
existing GitHub Pages repo at `../dekura.github.io` and pushes it.

## One-command build

```bash
npm run build
```

This command:

1. Builds and stages the CV from `../cv`.
2. Builds the legacy Jekyll research site from `../dekura.github.io`.
3. Copies that output into `public/research`.
4. Copies the generated CV PDF to `public/research/data/cv.pdf`.
5. Rewrites legacy absolute asset paths so `/research/` works as a subsite.
6. Runs `astro check` and builds the new Astro homepage.

Use this before previewing or deploying.

## One-command deploy

```bash
make deploy
```

This command builds the full site, commits/pushes changed source in this repo and
`../cv`, syncs `dist/` into the existing `../dekura.github.io` repository,
commits the generated static output, and pushes to `origin`.

If you want to inspect the generated files before committing/pushing, run:

```bash
npm run deploy:stage
```

`deploy:stage` builds the full site and copies `dist/` into `../dekura.github.io`
without committing or pushing.

## Repository Roles

- Source repo: `dekura/gjchen.me`, local path `personal-homepage`.
- Live GitHub Pages repo: `dekura/dekura.github.io`, local path `../dekura.github.io`.
- CV/research source repo: local path `../cv`.

Do not edit generated files in `../dekura.github.io` by hand. Make source changes
in this repo or in `../cv`, then run `make deploy`.

## Verification

```bash
npm test
npm run build
```

`npm run build` builds both the research subsite and the Astro homepage.

## Content

- `src/content/blog/` for longform writing
- `src/content/projects/` for projects
- `src/content/sparkles/` for curated links

Blog posts can use LaTeX math and local BibTeX citations from
`src/data/references.bib`:

```mdx
Inline math: $L(\theta)$

Citation: [@ICCAD20_damo]

[^ref]
```

## Migration Notes

The old Jekyll academic homepage lives at `../dekura.github.io`. Treat it as
the source of truth for academic research and publications.

Suggested deployment path:

1. Build and review this project locally.
2. Deploy this Astro project as the root `gjchen.me` homepage.
3. Deploy the legacy academic site under `gjchen.me/research`.
4. Keep `../cv` as the source of truth for academic data and CV PDF generation.
