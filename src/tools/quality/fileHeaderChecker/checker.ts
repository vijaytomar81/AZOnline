// src/tools/quality/fileHeaderChecker/checker.ts

import fs from "node:fs";
import path from "node:path";

import {
    printCommandTitle,
    printSection,
    printKeyValue,
    printStatus,
    printIndented,
    printSummary,
    success,
    failure,
} from "@utils/cliFormat";
import { ICONS } from "@utils/icons";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");

export type HeaderCheckMode = "checkMode" | "fixMode";

type FixStatus = "ok" | "missing" | "incorrect";

type FixResult = {
    changed: boolean;
    status: FixStatus;
    from: string;
    to: string;
};

function walkTsFiles(dir: string): string[] {
    const out: string[] = [];

    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, ent.name);

        if (ent.isDirectory()) {
            out.push(...walkTsFiles(abs));
            continue;
        }

        if (ent.isFile() && abs.endsWith(".ts")) {
            out.push(abs);
        }
    }

    return out;
}

function normalizeSlashes(p: string): string {
    return p.replace(/\\/g, "/");
}

function fixOne(fileAbs: string, opts: { checkMode: boolean }): FixResult {
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
        if (!opts.checkMode) {
            fs.writeFileSync(fileAbs, lines.join("\n"), "utf8");
        }

        return { changed: true, status: "incorrect", from: cur, to: want };
    }

    lines.splice(i, 0, want);
    if (!opts.checkMode) {
        fs.writeFileSync(fileAbs, lines.join("\n"), "utf8");
    }

    return { changed: true, status: "missing", from: "(missing)", to: want };
}

function logCheckIssue(fileRel: string, res: FixResult) {
    if (res.status === "missing") {
        printStatus(ICONS.addIcon, fileRel);
        printIndented("status", "missing header");
        printIndented("expected", res.to);
        console.log("");
        return;
    }

    if (res.status === "incorrect") {
        printStatus(ICONS.warningIcon, fileRel);
        printIndented("status", "incorrect header");
        printIndented("current", res.from);
        printIndented("expected", res.to);
        console.log("");
    }
}

function logFix(fileRel: string, res: FixResult) {
    printStatus(ICONS.successIcon, fileRel);
    printIndented("from", res.from);
    printIndented("to", res.to);
    console.log("");
}

export function runHeaderChecker(mode: HeaderCheckMode) {
    const checkMode = mode === "checkMode";

    if (!fs.existsSync(SRC_DIR)) {
        printStatus(ICONS.failIcon, `Not found: ${SRC_DIR}`);
        process.exit(1);
    }

    printCommandTitle("HEADER CHECK", "headerCheckIcon");
    printKeyValue("mode", mode);
    printKeyValue("root", ROOT);
    printKeyValue("srcDir", SRC_DIR);

    printSection("Scanning files");

    const files = walkTsFiles(SRC_DIR);
    printStatus(ICONS.successIcon, `Found ${files.length} TypeScript file(s)`);

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
                logCheckIssue(fileRel, res);
            }
            continue;
        }

        if (res.changed) {
            changed++;
            logFix(fileRel, res);
        }
    }

    if (checkMode && changed === 0) {
        printStatus(ICONS.successIcon, "No header issues found");
    }

    if (!checkMode && changed === 0) {
        printStatus(ICONS.successIcon, "No files needed header updates");
    }

    if (checkMode) {
        const resultText =
            changed === 0 ? success("ALL GOOD") : failure("HEADER ISSUE FOUND");

        printSummary(
            "HEADER SUMMARY",
            [
                ["Files scanned", scanned],
                ["Files needing fix", changed],
                ["Missing headers", missing],
                ["Incorrect headers", incorrect],
                ["Mode", mode],
            ],
            resultText
        );

        if (changed > 0) {
            console.log("");
            printStatus(ICONS.hintIcon, "Suggested fix:");
            console.log("   npm run headers:fix");
        }

        return;
    }

    const resultText =
        changed > 0 ? success("COMPLETED") : failure("NOT COMPLETED");

    printSummary(
        "HEADER SUMMARY",
        [
            ["Files scanned", scanned],
            ["Files changed", changed],
            ["Headers added", missing],
            ["Headers corrected", incorrect],
            ["Mode", mode],
        ],
        resultText
    );
}