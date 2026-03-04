// src/reporters/paths.ts

import path from "node:path";
import fs from "node:fs";

export type ReporterPaths = {
    repoRoot: string;

    // Playwright outputs (from playwright.config.ts)
    playwrightJsonReport: string;

    // Our generated dashboard artifacts
    dashboardOutDir: string;
    dashboardLatestJson: string;
    dashboardHistoryJson: string;
};

function ensureDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Central place for all report paths.
 *
 * Defaults assume you run from repo root.
 * If CI runs from elsewhere, you can pass { repoRoot: process.cwd() } explicitly.
 */
export function getReporterPaths(opts?: { repoRoot?: string }): ReporterPaths {
    const repoRoot = opts?.repoRoot ?? process.cwd();

    const playwrightJsonReport = path.join(repoRoot, "reports", "json", "results.json");

    const dashboardOutDir = path.join(repoRoot, "reports", "dashboard");
    ensureDir(dashboardOutDir);

    const dashboardLatestJson = path.join(dashboardOutDir, "latest.json");
    const dashboardHistoryJson = path.join(dashboardOutDir, "history.json");

    return {
        repoRoot,
        playwrightJsonReport,
        dashboardOutDir,
        dashboardLatestJson,
        dashboardHistoryJson,
    };
}