// scripts/clean-reports.js
const fs = require("node:fs");
const path = require("node:path");

function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
}

function rmChildEntries(dir, { keep = [] } = {}) {
    if (!fs.existsSync(dir)) return;

    const keepSet = new Set(keep.map((x) => x.toLowerCase()));
    for (const name of fs.readdirSync(dir)) {
        if (keepSet.has(name.toLowerCase())) continue;
        fs.rmSync(path.join(dir, name), { recursive: true, force: true });
    }
}

function touchGitkeep(dir) {
    const fp = path.join(dir, ".gitkeep");
    if (!fs.existsSync(fp)) fs.writeFileSync(fp, "", "utf8");
}

function main() {
    const repoRoot = process.cwd();
    const reportsDir = path.join(repoRoot, "reports");

    // Ensure base exists and clean inside it (safer than rm(reportsDir))
    ensureDir(reportsDir);
    rmChildEntries(reportsDir, { keep: [".gitkeep"] });

    const dirs = [
        "reports/allure-report",
        "reports/excel",
    ];

    for (const d of dirs) {
        const abs = path.join(repoRoot, d);
        ensureDir(abs);
        touchGitkeep(abs);
    }

    // Keep top-level .gitkeep too
    touchGitkeep(reportsDir);

    console.log(`✅ Cleaned reports contents and recreated structure under: ${reportsDir}`);
}

main();