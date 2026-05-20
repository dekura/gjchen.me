import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("theme system defaults to dark and persists explicit choices", async () => {
  const css = await readFile("src/styles/global.css", "utf8");
  const layout = await readFile("src/layouts/BaseLayout.astro", "utf8");
  const toggle = await readFile("src/components/ThemeToggle.astro", "utf8");

  assert.match(css, /:root\s*\{[^}]*--background:\s*#11100f/s);
  assert.match(css, /\[data-theme=['"]light['"]\]\s*\{/);
  assert.match(layout, /localStorage\.getItem\("theme"\)/);
  assert.match(layout, /const theme = stored === "light" \|\| stored === "dark" \? stored : "dark"/);
  assert.match(toggle, /localStorage\.setItem\("theme", theme\)/);
  assert.match(toggle, /setTheme\(nextTheme\)/);
  assert.match(toggle, /theme-icon theme-icon-moon/);
  assert.match(toggle, /theme-icon theme-icon-sun/);
  assert.match(toggle, /class="sr-only"/);
  assert.doesNotMatch(toggle, /theme-toggle-text/);
});
