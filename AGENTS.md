# AGENTS.md

Guidance for future coding agents working on this repository.

## Project Purpose

This repo is the source for Guojin Chen's post-PhD personal homepage. It owns
the root homepage, writing, projects, sparkles, and a short About page.

It does not own the academic research site. The legacy research/CV site is built
from sibling repos and mounted under `/research/`.

## Repository Layout

- Source repo: `dekura/gjchen.me`
- Local source path: `/Users/joyg/career/research/reputation/personal-homepage`
- Live Pages repo: `/Users/joyg/career/research/reputation/dekura.github.io`
- CV/research data repo: `/Users/joyg/career/research/reputation/cv`

## Commands

Use `make dev` for full local homepage editing with `/research/` available:

```bash
make dev
```

Use `npm run dev` only for fast Astro-only editing when `/research/` is not
needed:

```bash
npm run dev
```

Use `npm run build` before claiming the site builds:

```bash
npm test
npm run build
```

Use `make deploy` only when the user explicitly asks to publish the whole
system:

```bash
make deploy
```

## Deployment Flow

`npm run build` does all of this:

1. Builds the CV from `../cv` when the source is available.
2. Builds or reuses the legacy research site from `../dekura.github.io`.
3. Copies the legacy research output into `public/research`.
4. Copies the generated CV PDF to `public/research/data/cv.pdf`.
5. Rewrites absolute legacy asset paths to `/research/...`.
6. Runs `astro check` and builds the Astro homepage.

`make deploy` runs tests and build, commits/pushes changed source in this repo
and `../cv`, then syncs `dist/` into `../dekura.github.io`, commits generated
static output there, and pushes to GitHub Pages.

## Editing Rules

- Do not edit generated files in `../dekura.github.io` by hand.
- Do not commit `public/research/`, `public/data/`, `dist/`, `.astro/`, or
  `node_modules/` in this source repo.
- Keep homepage copy focused on foundation models for agentic systems.
- Mention computational lithography as background, not the primary homepage
  narrative.
- Keep `Research` and `CV` links pointing to `/research/` and
  `/research/data/cv.pdf`.
- If changing CSS, keep global styles in `src/styles/global.css` rather than
  adding many local Tailwind utility classes.

## Verification Checklist

Before saying work is complete:

```bash
npm test
npm run build
```

Expected result: tests pass, `astro check` reports `0 errors / 0 warnings / 0 hints`.
