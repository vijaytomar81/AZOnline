// scripts/fix-file-headers.js

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");

const ICON_OK = "✓";
const ICON_WARN = "⚠️";
const ICON_ADD = "➕";
const ICON_FAIL = "❌";

function printSection(title) {
    console.log("");
    console.log(title);
    console.log("-".repeat(title.length));
}

function printKeyValue(key, value) {
    const label = String(key).padEnd(10, " ");
    console.log(`${label}: ${value}`);
}

function printStatus(symbol, text) {
    console.log(`${symbol} ${text}`);
}

function printIndented(label, value) {
    const padded = String(label).padEnd(24, " ");
    console.log(`  ${padded}${value}`);
}

function printSummary(title, rows) {
    console.log("");
    console.log("--------------------------------------------------");
    console.log(title);
    console.log("--------------------------------------------------");

    for (const [k, v] of rows) {
        const label = String(k).padEnd(20, " ");
        console.log(`${label}: ${v}`);
    }

    console.log("--------------------------------------------------");
}

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

    let i = 0;
    if (lines[0]?.startsWith("#!")) i = 1;

    const first = lines[i] ?? "";

    if (/^\s*\/\/\s*src\//.test(first)) {
        const cur = first.trim();

        if (cur === want) {
            return { changed: false, status: "ok", from: cur, to: want };
        }

        lines[i] = want;
        if (!dryRun) fs.writeFileSync(fileAbs, lines.join("\n"), "utf8");
        return { changed: true, status: "incorrect", from: cur, to: want };
    }

    lines.splice(i, 0, want);
    if (!dryRun) fs.writeFileSync(fileAbs, lines.join("\n"), "utf8");
    return { changed: true, status: "missing", from: "(missing)", to: want };
}

function logDryRunIssue(fileRel, res) {
    if (res.status === "missing") {
        printStatus(ICON_ADD, fileRel);
        printIndented("status", "missing header");
        printIndented("expected", res.to);
        console.log("");
        return;
    }

    if (res.status === "incorrect") {
        printStatus(ICON_WARN, fileRel);
        printIndented("status", "incorrect header");
        printIndented("current", res.from);
        printIndented("expected", res.to);
        console.log("");
    }
}

function logFix(fileRel, res) {
    printStatus(ICON_OK, fileRel);
    printIndented("from", res.from);
    printIndented("to", res.to);
    console.log("");
}

function main() {
    const argv = process.argv.slice(2);
    const dryRun = argv.includes("--dryRun");

    if (!fs.existsSync(SRC_DIR)) {
        printStatus(ICON_FAIL, `Not found: ${SRC_DIR}`);
        process.exit(1);
    }

    printSection("Header Check");
    printKeyValue("mode", dryRun ? "dry-run" : "fix");
    printKeyValue("root", ROOT);
    printKeyValue("srcDir", SRC_DIR);

    printSection("Scanning files");

    const files = walk(SRC_DIR);
    console.log(`Found ${files.length} TypeScript file(s)`);

    let changed = 0;
    let scanned = 0;
    let missing = 0;
    let incorrect = 0;

    printSection(dryRun ? "Header issues" : "Applying fixes");

    for (const f of files) {
        scanned++;
        const res = fixOne(f, { dryRun });
        const fileRel = normalizeSlashes(path.relative(ROOT, f));

        if (res.status === "missing") missing++;
        if (res.status === "incorrect") incorrect++;

        if (dryRun) {
            if (res.changed) {
                changed++;
                logDryRunIssue(fileRel, res);
            }
            continue;
        }

        if (res.changed) {
            changed++;
            logFix(fileRel, res);
        }
    }

    if (dryRun && changed === 0) {
        printStatus(ICON_OK, "No header issues found");
    }

    if (!dryRun && changed === 0) {
        printStatus(ICON_OK, "No files needed header updates");
    }

    printSummary("HEADER SUMMARY", [
        ["Files scanned", scanned],
        ["Files changed", changed],
        ["Missing", missing],
        ["Incorrect", incorrect],
        ["Mode", dryRun ? "dry-run" : "fix"],
    ]);

    console.log(
        `Result               : ${changed > 0 ? (dryRun ? "ISSUES FOUND" : "COMPLETED") : "CLEAN"
        }`
    );

    if (dryRun && changed > 0) {
        process.exitCode = 1;
    }
}

main();