import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, mkdir, opendir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = path.resolve(import.meta.dirname, "..");
const cvRoot = path.resolve(root, "..", "cv");
const cvPdf = path.join(cvRoot, "build", "cv.pdf");
const legacyRoot = path.resolve(root, "..", "dekura.github.io");
const legacySite = path.join(legacyRoot, "_site");
const legacyPublishedResearch = path.join(legacyRoot, "research");
// Static output target: public/research
const outputRoot = path.join(root, "public", "research");
const outputCvPdf = path.join(outputRoot, "data", "cv.pdf");

const textExtensions = new Set([
  ".html",
  ".css",
  ".js",
  ".xml",
  ".txt",
  ".json",
  ".webmanifest",
]);

async function run(command, args, cwd) {
  await execFileAsync(command, args, {
    cwd,
    env: process.env,
    maxBuffer: 1024 * 1024 * 20,
  });
}

function rewriteLegacyAssetPaths(content) {
  return content
    .replaceAll('href="/', 'href="/research/')
    .replaceAll('src="/', 'src="/research/')
    .replaceAll('url(/', 'url(/research/')
    .replaceAll('content="/', 'content="/research/')
    .replaceAll("href='/", "href='/research/")
    .replaceAll("src='/", "src='/research/")
    .replaceAll("url('/", "url('/research/")
    .replaceAll('href="/research/research/', 'href="/research/')
    .replaceAll('src="/research/research/', 'src="/research/')
    .replaceAll("href='/research/research/", "href='/research/")
    .replaceAll("src='/research/research/", "src='/research/");
}

async function rewriteTree(directory) {
  const entries = await Array.fromAsync(await opendir(directory));

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await rewriteTree(entryPath);
      continue;
    }

    if (!textExtensions.has(path.extname(entry.name))) continue;

    const original = await readFile(entryPath, "utf8");
    const rewritten = rewriteLegacyAssetPaths(original);
    if (rewritten !== original) {
      await writeFile(entryPath, rewritten);
    }
  }
}

async function buildCv() {
  if (!existsSync(path.join(cvRoot, "Makefile"))) return;

  await run("make", ["all"], cvRoot);

  if (!existsSync(cvPdf)) {
    throw new Error("CV build completed, but ../cv/build/cv.pdf was not found.");
  }
}

async function copyCvIntoResearch() {
  if (!existsSync(cvPdf)) return;

  await mkdir(path.dirname(outputCvPdf), { recursive: true });
  await cp(cvPdf, outputCvPdf);
}

async function main() {
  await buildCv();

  if (existsSync(path.join(legacyRoot, "_config.yml"))) {
    if (existsSync(path.join(cvRoot, "Makefile"))) {
      await run("make", ["stage"], cvRoot);
    }
    // Equivalent shell command: bundle exec jekyll build
    await run("bundle", ["exec", "jekyll", "build"], legacyRoot);
  } else if (existsSync(path.join(legacyPublishedResearch, "index.html"))) {
    await rm(outputRoot, { recursive: true, force: true });
    await mkdir(outputRoot, { recursive: true });
    await cp(legacyPublishedResearch, outputRoot, { recursive: true });
  } else {
    throw new Error(
      "Cannot find legacy Jekyll source or published research output in ../dekura.github.io",
    );
  }

  if (existsSync(path.join(legacyRoot, "_config.yml"))) {
    await rm(outputRoot, { recursive: true, force: true });
    await mkdir(outputRoot, { recursive: true });
    await cp(legacySite, outputRoot, { recursive: true });
  }

  await copyCvIntoResearch();
  await rewriteTree(outputRoot);
}

await main();
