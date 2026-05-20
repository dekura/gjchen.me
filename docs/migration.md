# Migration Plan

This project is a new Astro homepage, intentionally separate from the legacy
Jekyll academic site at `../dekura.github.io`.

## Keep

- `../dekura.github.io` as the academic research/publications site.
- `../cv/cv.yaml` and `../cv/publications/*.bib` as the source of truth for the
  academic site and CV build.
- `gjchen.me` as the eventual production domain.

## Replace

- The root `gjchen.me` homepage. This Astro project should become the main
  personal homepage.
- The new site should not replace the academic research pipeline. It links to it.

## First Release Scope

- f.cv-inspired homepage focused on current work after the Ph.D.
- Research and CV links that point to the legacy academic site under `/research`.
- MDX writing system with math, citation, code highlighting, RSS, and sitemap.
- Lightweight `/projects`, `/sparkles`, and `/about` pages.

## Release Steps

1. Run `npm test`.
2. Run `npm run build`.
3. Confirm `dist/research/index.html` exists.
4. Review `dist/` locally with `npm run preview`.
5. Deploy the generated `dist/` directory as the full site.
6. Keep CV PDF generation in `../cv`, surfaced by the legacy research subsite.

`npm run build` is the one-command build path. It builds the CV, builds the
legacy Jekyll research site, copies it under `public/research`, rewrites legacy
absolute paths to `/research/...`, and then builds the Astro homepage.

For GitHub Pages deployment through the existing `../dekura.github.io` repo:

- `npm run deploy:stage` builds the full site and copies `dist/` into
  `../dekura.github.io` without committing.
- `npm run deploy` builds, syncs, commits, and pushes the generated output to the
  existing `dekura/dekura.github.io` remote.
