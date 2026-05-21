import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = path.resolve(import.meta.dirname, "..");
const cvRoot = path.resolve(root, "..", "cv");
const pagesRoot = path.resolve(root, "..", "dekura.github.io");

const sourceMessage =
  process.env.SOURCE_MESSAGE ?? "Update personal homepage source";
const cvMessage = process.env.CV_MESSAGE ?? "Update CV source";

const blockedPathPattern =
  /(^|\/)(\.env($|\.)|credentials?\.json$|secrets?\.json$|.*private.*key.*$)/i;

async function run(command, args, cwd) {
  const { stdout, stderr } = await execFileAsync(command, args, {
    cwd,
    env: process.env,
    maxBuffer: 1024 * 1024 * 20,
  });

  if (stdout.trim()) console.log(stdout.trim());
  if (stderr.trim()) console.error(stderr.trim());
}

async function gitOutput(args, cwd) {
  const { stdout } = await execFileAsync("git", args, {
    cwd,
    env: process.env,
    maxBuffer: 1024 * 1024 * 20,
  });
  return stdout.trim();
}

async function statusEntries(cwd) {
  const status = await gitOutput(["status", "--porcelain"], cwd);
  return status ? status.split("\n") : [];
}

function statusPath(entry) {
  return entry.slice(3).split(" -> ").at(-1) ?? "";
}

async function assertNoBlockedFiles(cwd, label) {
  const blocked = (await statusEntries(cwd))
    .map(statusPath)
    .filter((filePath) => blockedPathPattern.test(filePath));

  if (blocked.length > 0) {
    throw new Error(
      [
        `Refusing to deploy: ${label} has paths that look sensitive.`,
        ...blocked.map((filePath) => `- ${filePath}`),
      ].join("\n"),
    );
  }
}

async function commitAndPushIfChanged({ cwd, label, message }) {
  await assertNoBlockedFiles(cwd, label);

  if ((await statusEntries(cwd)).length === 0) {
    console.log(`${label}: no source changes to commit.`);
    return;
  }

  await run("git", ["add", "-A"], cwd);

  if ((await statusEntries(cwd)).length === 0) {
    console.log(`${label}: no staged changes to commit.`);
    return;
  }

  await run("git", ["commit", "-m", message], cwd);
  await run("git", ["push", "origin", "HEAD"], cwd);
}

async function main() {
  await run("npm", ["test"], root);
  await run("npm", ["run", "build"], root);

  await commitAndPushIfChanged({
    cwd: root,
    label: "personal-homepage",
    message: sourceMessage,
  });

  await commitAndPushIfChanged({
    cwd: cvRoot,
    label: "cv",
    message: cvMessage,
  });

  await run("node", ["scripts/deploy-github-pages.mjs", "--push"], root);

  const pagesStatus = await statusEntries(pagesRoot);
  if (pagesStatus.length > 0) {
    throw new Error(
      [
        "Deploy completed, but ../dekura.github.io still has uncommitted changes:",
        ...pagesStatus,
      ].join("\n"),
    );
  }
}

await main();
