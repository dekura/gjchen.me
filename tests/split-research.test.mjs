import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { test } from "node:test";

test("personal homepage delegates research and CV to the legacy research site", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));
  const site = await readFile("src/data/site.ts", "utf8");
  const home = await readFile("src/pages/index.astro", "utf8");
  const astroConfig = await readFile("astro.config.mjs", "utf8");
  const buildResearch = await readFile("scripts/build-research.mjs", "utf8");
  const makefile = await readFile("Makefile", "utf8");

  assert.equal(
    packageJson.scripts.build,
    "node scripts/build-research.mjs && astro check && astro build",
  );
  assert.equal(packageJson.scripts["build:research"], "node scripts/build-research.mjs");
  assert.equal(packageJson.scripts["dev:full"], "npm run build && astro preview --host 127.0.0.1");
  assert.equal(packageJson.scripts.deploy, "node scripts/deploy-github-pages.mjs --push");
  assert.match(makefile, /^research:\n\tnpm run build:research/m);
  assert.match(makefile, /^dev: research\n\tnpm run dev -- --host 127\.0\.0\.1/m);
  assert.match(site, /href:\s*"\/research\/"/);
  assert.match(site, /href:\s*"\/research\/data\/cv\.pdf"/);
  assert.doesNotMatch(home, /\/publications/);
  assert.match(astroConfig, /bibliography:\s*"src\/data\/references\.bib"/);
  assert.match(astroConfig, /researchDirectoryIndexPlugin/);
  assert.match(astroConfig, /\/research\/index\.html/);
  assert.match(buildResearch, /bundle exec jekyll build/);
  assert.match(buildResearch, /public\/research/);
  assert.match(buildResearch, /make", \["all"\], cvRoot/);
  assert.match(buildResearch, /outputCvPdf = path\.join\(outputRoot, "data", "cv\.pdf"\)/);
  assert.match(buildResearch, /copyCvIntoResearch/);
  assert.match(buildResearch, /rewriteLegacyAssetPaths/);

  await assert.rejects(() => stat("src/pages/research.astro"), /ENOENT/);
  await assert.rejects(() => stat("src/pages/publications.astro"), /ENOENT/);
});
