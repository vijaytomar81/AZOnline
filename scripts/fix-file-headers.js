// scripts/fix-file-headers.js

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");

const ICON_OK = "✓";
const ICON_WARN = "⚠️";
const ICON_ADD = "➕";
const ICON_FAIL = "❌";

const ANSI = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",

    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    gray: "\x1b[90m",
};

function muted(text) {
    // return (text, ANSI.gray);
    return `${ANSI.gray}${text}${ANSI.reset}`;
}

function success(text) {
    return `${ANSI.green}${text}${ANSI.reset}`;
}

function failure(text) {
    return `${ANSI.red}${text}${ANSI.reset}`;
}

function printSection(title) {
    console.log("");
    console.log(title);
    console.log("-".repeat(title.length));
}

function printCommandTitle(title) {
    const text = title.trim();
    const line = "*".repeat(Math.max(text.length, 32));

    console.log("");
    console.log(line);
    console.log(text);
    console.log(line);
}

function printKeyValue(key, value, width = 10) {
    const label = String(key).padEnd(width, " ");
    console.log(`${label}: ${value}`);
}

function printStatus(symbol, text) {
    console.log(`${symbol} ${text}`);
}

function printIndented(label, value) {
    const padded = String(label).padEnd(24, " ");
    console.log(`  ${padded}${value}`);
}

function printSummary(title, rows, resultText) {
    const longestKey = Math.max(...rows.map(([k]) => String(k).length));
    const longestValue = Math.max(
        ...rows.map(([, v]) => String(v).length),
        resultText ? String(resultText).length : 0
    );

    const pad = longestKey + 3;
    const lineWidth = longestKey + longestValue;
    const line = "-".repeat(lineWidth);

    console.log("");
    console.log(muted(line));
    console.log(title);
    console.log(muted(line));

    for (const [k, v] of rows) {
        const label = String(k).padEnd(pad, " ");
        console.log(`${muted(label)}: ${v}`);
    }

    console.log(line);

    if (resultText !== undefined) {
        const label = "Result".padEnd(pad, " ");
        console.log(`${label}: ${resultText}`);
    }

    return pad;
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

function fixOne(fileAbs, { checkMode }) {
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
        if (!checkMode) fs.writeFileSync(fileAbs, lines.join("\n"), "utf8");
        return { changed: true, status: "incorrect", from: cur, to: want };
    }

    lines.splice(i, 0, want);
    if (!checkMode) fs.writeFileSync(fileAbs, lines.join("\n"), "utf8");
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
    const checkMode = argv.includes("--checkMode");

    if (!fs.existsSync(SRC_DIR)) {
        printStatus(ICON_FAIL, `Not found: ${SRC_DIR}`);
        process.exit(1);
    }

    printCommandTitle("📦 HEADER CHECK");
    // printSection("Header Check");
    printKeyValue("mode", checkMode ? "checkMode" : "fixMode");
    printKeyValue("root", ROOT);
    printKeyValue("srcDir", SRC_DIR);

    printSection("Scanning files");

    const files = walk(SRC_DIR);
    console.log(`Found ${files.length} TypeScript file(s)`);

    let changed = 0;
    let scanned = 0;
    let missing = 0;
    let incorrect = 0;

    printSection(checkMode ? "Header issues" : "Applying fixes");

    for (const f of files) {
        scanned++;
        const res = fixOne(f, { checkMode });
        const fileRel = normalizeSlashes(path.relative(ROOT, f));

        if (res.status === "missing") missing++;
        if (res.status === "incorrect") incorrect++;

        if (checkMode) {
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

    if (checkMode && changed === 0) {
        printStatus(ICON_OK, "No header issues found");
    }

    if (!checkMode && changed === 0) {
        printStatus(ICON_OK, "No files needed header updates");
    }

    if (checkMode) {
        const resultText =
            changed === 0
                ? success("ALL GOOD")
                : failure("HEADER ISSUE FOUND");

        printSummary("HEADER SUMMARY", [
            ["Files scanned", scanned],
            ["Files needing fix", changed],
            ["Missing headers", missing],
            ["Incorrect headers", incorrect],
            ["Mode", "checkMode"],
        ], resultText);
    } else {
        const resultText =
            changed > 0
                ? success("COMPLETED")
                : failure("NOT COMPLETED");

        printSummary("HEADER SUMMARY", [
            ["Files scanned", scanned],
            ["Files changed", changed],
            ["Headers added", missing],
            ["Headers corrected", incorrect],
            ["Mode", "fixMode"],
        ], resultText);
    }

    if (checkMode && changed > 0) {
        process.exitCode = 0;
    }
}

main();