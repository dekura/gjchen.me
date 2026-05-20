import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("homepage typography has a mobile-specific scale", async () => {
  const css = await readFile("src/styles/global.css", "utf8");

  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.home-title\s*\{[^}]*font-size:\s*clamp\(2\.7rem,\s*14vw,\s*4\.4rem\)/s);
  assert.match(css, /\.home-copy\s*\{[^}]*font-size:\s*1rem/s);
  assert.match(css, /\.page-title\s*\{[^}]*font-size:\s*clamp\(2\.4rem,\s*12vw,\s*3\.8rem\)/s);
});
