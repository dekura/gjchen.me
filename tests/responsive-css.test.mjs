import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("homepage typography has a mobile-specific scale", async () => {
  const css = await readFile("src/styles/global.css", "utf8");

  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.home-title\s*\{[^}]*font-size:\s*clamp\(2rem,\s*3\.85vw,\s*3\.35rem\)/s);
  assert.match(css, /\.home-title\s*\{[^}]*font-size:\s*clamp\(1\.65rem,\s*7vw,\s*2\.25rem\)/s);
  assert.match(css, /\.home-hero\s*\{[^}]*padding-top:\s*2\.25rem/s);
  assert.match(css, /\.home-copy\s*\{[^}]*font-size:\s*0\.98rem/s);
  assert.match(css, /\.page-title\s*\{[^}]*font-size:\s*clamp\(2\.05rem,\s*4\.2vw,\s*3\.6rem\)/s);
  assert.match(css, /\.page-title\s*\{[^}]*font-size:\s*clamp\(1\.95rem,\s*9vw,\s*2\.7rem\)/s);
  assert.match(css, /\.article-title\s*\{[^}]*font-size:\s*clamp\(2rem,\s*4\.4vw,\s*3\.5rem\)/s);
  assert.match(css, /\.section-title\s*\{[^}]*font-size:\s*clamp\(1\.45rem,\s*3\.2vw,\s*2\.15rem\)/s);
  assert.match(css, /\.content-title,\s*\.publication-title\s*\{[^}]*font-size:\s*1\.12rem/s);
});
