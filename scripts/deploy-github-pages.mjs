import { execFile } from "node:child_process";
import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = path.resolve(import.meta.dirname, "..");
const distRoot = path.join(root, "dist");
const legacyRepo = path.resolve(root, "..", "dekura.github.io");
const shouldPush = process.argv.includes("--push");
const deployMessage = process.env.DEPLOY_MESSAGE ?? "Deploy personal homepage";

async function run(command, args, cwd) {
  const { stdout, stderr } = await execFileAsync(command, args, {
    cwd,
    env: process.env,
    maxBuffer: 1024 * 1024 * 20,
  });

  if (stdout.trim()) console.log(stdout.trim());
  if (stderr.trim()) console.error(stderr.trim());
}

async function git(args, cwd = legacyRepo) {
  return run("git", args, cwd);
}

async function gitOutput(args, cwd = legacyRepo) {
  const { stdout } = await execFileAsync("git", args, {
    cwd,
    env: process.env,
    maxBuffer: 1024 * 1024 * 20,
  });
  return stdout.trim();
}

async function assertCleanGitWorktree() {
  const status = await gitOutput(["status", "--porcelain"], legacyRepo);
  if (status) {
    throw new Error(
      [
        "Refusing to deploy: ../dekura.github.io has uncommitted changes.",
        "Commit, stash, or clean that repository first.",
        status,
      ].join("\n"),
    );
  }
}

async function emptyLegacyRepoRoot() {
  const entries = await readdir(legacyRepo, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === ".git") continue;
    await rm(path.join(legacyRepo, entry.name), { recursive: true, force: true });
  }
}

async function syncDistToLegacyRepo() {
  await emptyLegacyRepoRoot();
  await cp(distRoot, legacyRepo, { recursive: true });
  await writeFile(path.join(legacyRepo, "CNAME"), "gjchen.me\n");
}

async function hasDeployChanges() {
  const status = await gitOutput(["status", "--porcelain"], legacyRepo);
  return Boolean(status);
}

async function main() {
  await assertCleanGitWorktree();
  await run("npm", ["run", "build"], root);
  await syncDistToLegacyRepo();

  if (!shouldPush) {
    console.log("Staged dist/ into ../dekura.github.io. Review it, then run npm run deploy.");
    return;
  }

  await git(["add", "-A"]);
  if (!(await hasDeployChanges())) {
    console.log("No deploy changes to commit.");
    return;
  }

  await git(["commit", "-m", deployMessage]);
  await git(["push", "origin", "HEAD"]);
}

await main();
