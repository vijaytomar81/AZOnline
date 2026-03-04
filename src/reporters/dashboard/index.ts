// src/reporters/dashboard/index.ts

import { buildDashboard } from "./buildDashboard";
import { writeDashboardHtml } from "./renderHtml";
import { createLogger } from "../logger";
import { usage } from "./dashboardHelp";

function getArg(argv: string[], name: string): string | undefined {
    const i = argv.indexOf(name);
    if (i >= 0) return argv[i + 1];

    const eq = argv.find((a) => a.startsWith(`${name}=`));
    if (eq) return eq.split("=").slice(1).join("=");

    return undefined;
}

function hasFlag(argv: string[], name: string): boolean {
    return argv.includes(name);
}

function parseBool(v: string | undefined, fallback: boolean): boolean {
    if (v == null) return fallback;
    const s = v.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(s)) return true;
    if (["false", "0", "no", "n"].includes(s)) return false;
    return fallback;
}

async function main() {
    const argv = process.argv.slice(2);

    if (hasFlag(argv, "--help") || hasFlag(argv, "-h")) {
        console.log(usage());
        return;
    }

    const verbose = hasFlag(argv, "--verbose");
    const logToFile = hasFlag(argv, "--logToFile");
    const logFilePath = getArg(argv, "--logFilePath");

    const log = createLogger({
        prefix: "[dashboard]",
        verbose,
        withTimestamp: true,
        logToFile,
        logFilePath,
    });

    const repoRoot = getArg(argv, "--repoRoot");

    const keepHistoryDaysRaw = getArg(argv, "--keepHistoryDays");
    const keepHistoryDays = keepHistoryDaysRaw ? Number(keepHistoryDaysRaw) : undefined;
    if (keepHistoryDaysRaw && (!Number.isFinite(keepHistoryDays!) || keepHistoryDays! <= 0)) {
        log.error(`Invalid --keepHistoryDays: ${keepHistoryDaysRaw}`);
        process.exit(1);
    }

    // HTML options
    const noHtml = hasFlag(argv, "--noHtml");
    const outHtml = getArg(argv, "--outHtml");
    const templatePath = getArg(argv, "--templatePath");
    const cssPath = getArg(argv, "--cssPath");
    const pageTitle = getArg(argv, "--pageTitle");
    const headerHtml = getArg(argv, "--headerHtml");
    const footerHtml = getArg(argv, "--footerHtml");

    const strictCss = parseBool(getArg(argv, "--strictCss"), true);

    log.info("Building dashboard JSON artifacts...");

    const res = buildDashboard({
        repoRoot,
        keepHistoryDays,
    });

    log.info(`✅ Dashboard latest: ${res.latestPath}`);
    if (res.historyPath) log.info(`✅ Dashboard history: ${res.historyPath}`);

    if (!noHtml) {
        log.info("Rendering dashboard HTML...");

        const out = writeDashboardHtml({
            repoRoot,
            outFile: outHtml,
            templatePath: templatePath,
            cssPath: cssPath,
            pageTitle,
            headerHtml,
            footerHtml,
            strictCss,
        });

        log.info(`✅ Dashboard HTML: ${out.htmlPath}`);
        log.info(`✅ Dashboard CSS:  ${out.cssPath}`);
    } else {
        log.info("Skipping HTML generation (--noHtml).");
    }

    if (logToFile) {
        log.info(`Log file: ${logFilePath ?? "reports/dashboard/build.log"}`);
    }
}

main().catch((e) => {
    const msg = e?.message || String(e);
    console.error(msg);
    process.exit(1);
});