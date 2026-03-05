// scripts/clean-reports.js
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
    const reportsDir = path.join(repoRoot, "reports");

    rm(reportsDir);

    const dirs = [
        "reports/allure-report",
        "reports/excel",
    ];

    for (const d of dirs) {
        const abs = path.join(repoRoot, d);
        mkdir(abs);
        touchGitkeep(abs);
    }

    console.log(`✅ Cleaned + recreated reports folders under: ${reportsDir}`);
}

main();