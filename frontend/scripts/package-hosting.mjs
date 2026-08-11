/**
 * Produces a single upload-ready archive for shared hosting.
 *
 *   npm run package
 *
 * Runs the production build, checks the things that silently break a static
 * deploy, and zips the result. Upload the contents of that zip into public_html.
 *
 * The checks matter more than the zip. A CRA build that's missing .htaccess
 * looks completely fine locally and then 404s on every route but the homepage,
 * which is a miserable thing to debug over FTP.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BUILD = path.join(ROOT, "build");
const OUT_DIR = path.join(ROOT, "deploy");

/**
 * `shell` is only needed for npx on Windows, where it resolves npx.cmd. Passing
 * arguments through a shell elsewhere would concatenate rather than escape them.
 */
const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, {
    cwd: ROOT,
    stdio: "inherit",
    shell: cmd === "npx" && process.platform === "win32",
    ...opts,
  });

function dirSize(dir) {
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    total += entry.isDirectory() ? dirSize(p) : statSync(p).size;
  }
  return total;
}

function preflight() {
  const problems = [];
  const warnings = [];

  const indexPath = path.join(BUILD, "index.html");
  if (!existsSync(indexPath)) {
    problems.push("build/index.html is missing — the build did not complete.");
    return { problems, warnings };
  }

  // The single most common shared-hosting failure: the rewrite rules never
  // shipped, so every route except / returns 404.
  if (!existsSync(path.join(BUILD, ".htaccess"))) {
    problems.push(
      ".htaccess is missing from build/. Without it /menu will 404 on Apache.\n" +
        "    Confirm frontend/public/.htaccess exists, then rebuild.",
    );
  }

  // Optimized images must be present; the site references /img/* exclusively.
  const imgDir = path.join(BUILD, "img");
  if (!existsSync(imgDir)) {
    problems.push("build/img is missing. Run `npm run images` and rebuild.");
  } else {
    const avif = readdirSync(imgDir).filter((f) => f.endsWith(".avif"));
    if (avif.length === 0) problems.push("No AVIF images in build/img. Run `npm run images`.");
  }

  const html = readFileSync(indexPath, "utf8");

  // A leftover %PUBLIC_URL% means an asset path never got substituted.
  if (html.includes("%PUBLIC_URL%")) {
    problems.push("index.html still contains %PUBLIC_URL% — an asset path didn't resolve.");
  }

  // The opening sequence is inline; if it's gone, index.html was overwritten.
  if (!html.includes('id="tw-loader"')) {
    warnings.push("The inline loading screen is not in index.html.");
  }

  // Absolute /-rooted asset paths break when served from a subfolder.
  const homepage = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8")).homepage;
  if (!homepage) {
    warnings.push(
      "No `homepage` set in package.json, so assets are linked from the domain root.\n" +
        "    Correct for example.com. If you're serving from example.com/cafe/, set\n" +
        '    "homepage": "/cafe/" and update RewriteBase in public/.htaccess, then rebuild.',
    );
  }

  return { problems, warnings };
}

function makeZip(zipPath) {
  rmSync(zipPath, { force: true });

  if (process.platform === "win32") {
    // Compress-Archive is present on any supported Windows. -Path build\* zips
    // the contents rather than the folder, which is what needs to land in
    // public_html. It does skip dotfiles, so .htaccess is added separately.
    run("powershell", [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-Command",
      `Compress-Archive -Path '${BUILD}\\*' -DestinationPath '${zipPath}' -Force; ` +
        `Compress-Archive -Path '${BUILD}\\.htaccess' -DestinationPath '${zipPath}' -Update`,
    ]);
    return;
  }

  // `zip` keeps dotfiles when the glob is '.', unlike Compress-Archive.
  run("zip", ["-r", "-q", zipPath, ".", "-x", ".DS_Store"]);
}

function main() {
  console.log("\n▸ Building production bundle\n");
  run("npx", ["craco", "build"]);

  console.log("\n▸ Pre-flight checks\n");
  const { problems, warnings } = preflight();

  for (const w of warnings) console.log(`  note     ${w}`);
  for (const p of problems) console.log(`  PROBLEM  ${p}`);

  if (problems.length) {
    console.error(`\n${problems.length} problem(s) would break the deploy. Not packaging.\n`);
    process.exit(1);
  }
  if (!warnings.length) console.log("  all clear");

  mkdirSync(OUT_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const zipPath = path.join(OUT_DIR, `the-white-mug-${stamp}.zip`);

  console.log("\n▸ Packaging\n");
  const cwd = process.cwd();
  process.chdir(BUILD);
  try {
    makeZip(zipPath);
  } finally {
    process.chdir(cwd);
  }

  const zipKb = statSync(zipPath).size / 1024;
  console.log(
    `\nUncompressed build  ${(dirSize(BUILD) / 1024 / 1024).toFixed(2)} MB` +
      `\nArchive             ${(zipKb / 1024).toFixed(2)} MB` +
      `\n\n→ ${path.relative(ROOT, zipPath)}` +
      `\n\nUpload the CONTENTS of this zip into public_html (not the zip itself,` +
      `\nand not a folder containing it). index.html must sit at the top level.` +
      `\nMake sure .htaccess uploads too — most FTP clients hide dotfiles by default.\n`,
  );
}

main();
