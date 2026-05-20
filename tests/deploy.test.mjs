import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("GitHub Pages deploy script targets the existing dekura.github.io repo safely", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));
  const deployScript = await readFile("scripts/deploy-github-pages.mjs", "utf8");

  assert.equal(packageJson.scripts["deploy:stage"], "node scripts/deploy-github-pages.mjs");
  assert.equal(packageJson.scripts.deploy, "node scripts/deploy-github-pages.mjs --push");
  assert.match(deployScript, /dekura\.github\.io/);
  assert.match(deployScript, /assertCleanGitWorktree/);
  assert.match(deployScript, /syncDistToLegacyRepo/);
  assert.match(deployScript, /git\(\["commit"/);
  assert.match(deployScript, /git\(\["push"/);
});
