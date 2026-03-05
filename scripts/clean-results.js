// scripts/clean-results.js
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
    const resultsDir = path.join(repoRoot, "results");

    // Ensure base exists and clean inside it (safer than rm(resultsDir))
    ensureDir(resultsDir);
    rmChildEntries(resultsDir, { keep: [".gitkeep"] });

    const dirs = [
        "results/allure-results",
        "results/playwright/html",
        "results/playwright/json",
        "results/playwright/junit",
    ];

    for (const d of dirs) {
        const abs = path.join(repoRoot, d);
        ensureDir(abs);
        touchGitkeep(abs);
    }

    // Keep top-level .gitkeep too
    touchGitkeep(resultsDir);

    console.log(`✅ Cleaned results contents and recreated structure under: ${resultsDir}`);
}

main();