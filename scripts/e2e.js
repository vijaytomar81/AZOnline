#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Enterprise-level E2E Orchestrator (v2)
 *
 * Runs:
 *   1) Data Builder (ts-node)
 *   2) Playwright tests
 *
 * Works in:
 *   - Windows PowerShell
 *   - macOS / Linux
 *   - Jenkins
 *
 * Usage:
 *   node scripts/e2e.js --excel "file.xlsx" --sheet "FlowNB" --verbose -- --project=chromium
 *
 * RULE:
 *   args BEFORE "--"  => data-builder
 *   args AFTER  "--"  => playwright
 */

const path = require("path");
const { spawnSync } = require("child_process");

/**
 * Run command safely
 */
function run(exe, args, options = {}) {
    const res = spawnSync(exe, args, {
        stdio: "inherit",
        shell: false,
        ...options,
    });

    if (res.error) throw res.error;
    return res.status ?? 0;
}

function main() {
    const argv = process.argv.slice(2);

    // Split args by "--"
    const separatorIndex = argv.indexOf("--");

    const dataBuilderArgs =
        separatorIndex >= 0 ? argv.slice(0, separatorIndex) : argv;

    const playwrightArgs =
        separatorIndex >= 0 ? argv.slice(separatorIndex + 1) : [];

    const root = process.cwd();

    // ----------------------------
    // DATA BUILDER
    // ----------------------------
    const dataBuilderEntry = path.join(
        root,
        "src",
        "data",
        "data-builder",
        "index.ts"
    );

    // IMPORTANT:
    // use JS cli entry (NOT ts-node.cmd)
    const tsNodeCli = require.resolve("ts-node/dist/bin.js");

    console.log("[e2e] Running data-builder...");
    console.log("[e2e] >", process.execPath, tsNodeCli, dataBuilderEntry, ...dataBuilderArgs);

    const dbCode = run(process.execPath, [
        tsNodeCli,
        dataBuilderEntry,
        ...dataBuilderArgs,
    ]);

    if (dbCode !== 0) {
        console.error("[e2e] Data-builder failed");
        process.exit(dbCode);
    }

    // ----------------------------
    // PLAYWRIGHT
    // ----------------------------
    const playwrightCli = require.resolve("@playwright/test/cli");

    console.log("[e2e] Running Playwright...");
    console.log("[e2e] >", process.execPath, playwrightCli, "test", ...playwrightArgs);

    const pwCode = run(process.execPath, [
        playwrightCli,
        "test",
        ...playwrightArgs,
    ]);

    process.exit(pwCode);
}

main();