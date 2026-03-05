// scripts/clean-results.js
const fs = require("node:fs");
const path = require("node:path");

function rm(p) {
    fs.rmSync(p, { recursive: true, force: true });
}

function mkdir(p) {
    fs.mkdirSync(p, { recursive: true });
}

function touchGitkeep(dir) {
    const fp = path.join(dir, ".gitkeep");
    if (!fs.existsSync(fp)) fs.writeFileSync(fp, "", "utf8");
}

function main() {
    const repoRoot = process.cwd();
    const resultsDir = path.join(repoRoot, "results");

    rm(resultsDir);

    const dirs = [
        "results/allure-results",
        "results/playwright/html",
        "results/playwright/json",
        "results/playwright/junit",
    ];

    for (const d of dirs) {
        const abs = path.join(repoRoot, d);
        mkdir(abs);
        touchGitkeep(abs);
    }

    console.log(`✅ Cleaned + recreated results folders under: ${resultsDir}`);
}

main();