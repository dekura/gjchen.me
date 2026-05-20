import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("homepage typography has a mobile-specific scale", async () => {
  const css = await readFile("src/styles/global.css", "utf8");

  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.home-title\s*\{[^}]*font-size:\s*clamp\(2\.7rem,\s*6\.2vw,\s*5\.4rem\)/s);
  assert.match(css, /\.home-title\s*\{[^}]*font-size:\s*clamp\(1\.95rem,\s*8\.5vw,\s*2\.8rem\)/s);
  assert.match(css, /\.home-hero\s*\{[^}]*padding-top:\s*2\.25rem/s);
  assert.match(css, /\.home-copy\s*\{[^}]*font-size:\s*0\.98rem/s);
  assert.match(css, /\.page-title\s*\{[^}]*font-size:\s*clamp\(2\.4rem,\s*12vw,\s*3\.8rem\)/s);
});
