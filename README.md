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
npm run dev
```

`npm run dev` is fastest for editing the Astro homepage. It does not emulate the
final `/research/` subsite route.

To inspect the whole deployed shape locally, including `/research/`, run:

```bash
npm run dev:full
```

## One-command build

```bash
npm run build
```

This command:

1. Builds and stages the CV from `../cv`.
2. Builds the legacy Jekyll research site from `../dekura.github.io`.
3. Copies that output into `public/research`.
4. Rewrites legacy absolute asset paths so `/research/` works as a subsite.
5. Runs `astro check` and builds the new Astro homepage.

Use this before previewing or deploying.

## One-command deploy

```bash
npm run deploy
```

This command builds the full site, syncs `dist/` into the existing
`../dekura.github.io` repository, commits the generated static output, and pushes
to `origin`.

If you want to inspect the generated files before committing/pushing, run:

```bash
npm run deploy:stage
```

`deploy:stage` builds the full site and copies `dist/` into `../dekura.github.io`
without committing or pushing.

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
