// scripts/fix-file-headers.js

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");

const ICON_WARN = "⚠️";
const ICON_ADD = "➕";

function walk(dir) {
    const out = [];
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, ent.name);
        if (ent.isDirectory()) out.push(...walk(abs));
        else if (ent.isFile() && abs.endsWith(".ts")) out.push(abs);
    }
    return out;
}

function normalizeSlashes(p) {
    return p.replace(/\\/g, "/");
}

function fixOne(fileAbs, { dryRun }) {
    const rel = normalizeSlashes(path.relative(ROOT, fileAbs));
    const want = `// ${rel}`;

    const raw = fs.readFileSync(fileAbs, "utf8");
    const lines = raw.split(/\r?\n/);

    // Respect shebang if any (rare in TS, but safe)
    let i = 0;
    if (lines[0]?.startsWith("#!")) i = 1;

    const first = lines[i] ?? "";

    // Case A: first line is already a src header comment -> replace if wrong
    if (/^\s*\/\/\s*src\//.test(first)) {
        const cur = first.trim();

        if (cur === want) {
            return { changed: false, status: "ok", from: cur, to: want };
        }

        lines[i] = want;
        if (!dryRun) fs.writeFileSync(fileAbs, lines.join("\n"), "utf8");
        return { changed: true, status: "incorrect", from: cur, to: want };
    }

    // Case B: no header -> insert at top (after shebang if present)
    lines.splice(i, 0, want);
    if (!dryRun) fs.writeFileSync(fileAbs, lines.join("\n"), "utf8");
    return { changed: true, status: "missing", from: "(missing)", to: want };
}

function logIssue(fileRel, res) {
    if (res.status === "missing") {
        console.log(`${ICON_ADD} MISSING HEADER`);
        console.log(`   file: ${fileRel}`);
        console.log(`   expected: ${res.to}\n`);
        return;
    }

    if (res.status === "incorrect") {
        console.log(`${ICON_WARN} INCORRECT HEADER`);
        console.log(`   file: ${fileRel}`);
        console.log(`   current:  ${res.from}`);
        console.log(`   expected: ${res.to}\n`);
    }
}

function main() {
    const argv = process.argv.slice(2);
    const dryRun = argv.includes("--dryRun");

    if (!fs.existsSync(SRC_DIR)) {
        console.error(`❌ Not found: ${SRC_DIR}`);
        process.exit(1);
    }

    const files = walk(SRC_DIR);

    let changed = 0;
    let scanned = 0;
    let missing = 0;
    let incorrect = 0;

    for (const f of files) {
        scanned++;
        const res = fixOne(f, { dryRun });
        const fileRel = normalizeSlashes(path.relative(ROOT, f));

        if (res.status === "missing") missing++;
        if (res.status === "incorrect") incorrect++;

        if (dryRun) {
            // show only files needing action
            if (res.changed) {
                changed++;
                logIssue(fileRel, res);
            }
            continue;
        }

        // non-dryRun: only print changed files
        if (res.changed) {
            changed++;
            console.log(`FIX ✅ ${fileRel}`);
            console.log(`   ${res.from}  ->  ${res.to}\n`);
        }
    }

    console.log(
        `\n✅ Done. scanned=${scanned} changed=${changed} missing=${missing} incorrect=${incorrect}${dryRun ? " (dryRun)" : ""}`
    );

    // Optional CI behavior: fail dry-run if any changes are needed
    // if (dryRun && changed > 0) process.exitCode = 1;
}

main();