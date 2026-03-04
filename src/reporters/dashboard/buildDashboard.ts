// src/reporters/dashboard/buildDashboard.ts

import fs from "node:fs";
import path from "node:path";

import { getReporterPaths } from "../paths";
import { parsePlaywrightJsonReport } from "../playwrightParser";
import { buildAnalytics } from "../analytics";
import { upsertTrendPoint } from "../history";

import type {
    DashboardBuildResult,
    DashboardLatestPayload,
    FileBreakdownRow,
    FlakyTestRow,
    NormalizedTestResult,
    RunSummary,
    SlowTestRow,
} from "../schema";

function ensureDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function safeWriteJson(filePath: string, data: unknown) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function nowIso() {
    return new Date().toISOString();
}

function safeNumber(n: unknown, fallback = 0) {
    const v = typeof n === "number" ? n : Number(n);
    return Number.isFinite(v) ? v : fallback;
}

function computeRunSummary(params: {
    runId: string;
    startedAtIso: string;
    endedAtIso: string;
    tests: NormalizedTestResult[];
}): RunSummary {
    const { runId, startedAtIso, endedAtIso, tests } = params;

    let passed = 0, failed = 0, flaky = 0, skipped = 0;
    for (const t of tests) {
        if (t.status === "passed") passed++;
        else if (t.status === "failed") failed++;
        else if (t.status === "flaky") flaky++;
        else if (t.status === "skipped") skipped++;
    }

    const total = tests.length;

    // pass rate: by your schema comment you can choose; here we exclude skipped from denominator
    const executed = passed + failed + flaky;
    const passRate = executed > 0 ? passed / executed : 0;

    const durationMs =
        Math.max(0, new Date(endedAtIso).getTime() - new Date(startedAtIso).getTime()) ||
        tests.reduce((sum, t) => sum + safeNumber(t.durationMs), 0);

    return {
        runId,
        startedAtIso,
        endedAtIso,
        durationMs,
        total,
        passed,
        failed,
        flaky,
        skipped,
        passRate,
    };
}

function buildFileBreakdown(tests: NormalizedTestResult[]): FileBreakdownRow[] {
    const map = new Map<string, NormalizedTestResult[]>();
    for (const t of tests) {
        const f = t.file || "unknown";
        const arr = map.get(f);
        if (arr) arr.push(t);
        else map.set(f, [t]);
    }

    return Array.from(map.entries())
        .map(([file, items]) => {
            let passed = 0, failed = 0, flaky = 0, skipped = 0;
            let totalDur = 0;

            for (const t of items) {
                totalDur += safeNumber(t.durationMs);
                if (t.status === "passed") passed++;
                else if (t.status === "failed") failed++;
                else if (t.status === "flaky") flaky++;
                else if (t.status === "skipped") skipped++;
            }

            const total = items.length;
            const avgDurationMs = total > 0 ? Math.round(totalDur / total) : 0;

            return { file, total, passed, failed, flaky, skipped, avgDurationMs };
        })
        .sort((a, b) => a.file.localeCompare(b.file));
}

function buildFlakyTop(tests: NormalizedTestResult[], topN = 10): FlakyTestRow[] {
    return tests
        .filter((t) => t.status === "flaky")
        .sort((a, b) => safeNumber(b.durationMs) - safeNumber(a.durationMs))
        .slice(0, topN)
        .map((t) => ({
            id: t.id,
            title: t.title,
            file: t.file,
            project: t.project,
            retries: t.retries,
            lastDurationMs: t.durationMs,
            lastError: t.errors?.[0],
        }));
}

function buildSlowTop(tests: NormalizedTestResult[], topN = 10): SlowTestRow[] {
    return [...tests]
        .sort((a, b) => safeNumber(b.durationMs) - safeNumber(a.durationMs))
        .slice(0, topN)
        .map((t) => ({
            id: t.id,
            title: t.title,
            file: t.file,
            project: t.project,
            durationMs: t.durationMs,
            status: t.status,
        }));
}

/**
 * Build dashboard artifacts:
 * - reports/dashboard/latest.json
 * - reports/dashboard/history.json (trend points)
 */
export function buildDashboard(opts?: {
    repoRoot?: string;
    keepHistoryDays?: number; // default 30
}): DashboardBuildResult {
    const paths = getReporterPaths({ repoRoot: opts?.repoRoot });
    const keepHistoryDays = opts?.keepHistoryDays ?? 30;

    // ✅ FIX #1: parser expects an options object, not a string
    const rawTests = parsePlaywrightJsonReport({ reportPath: paths.playwrightJsonReport });

    // ✅ FIX #2: normalize to match NormalizedTestResult exactly (file must be string)
    const tests: NormalizedTestResult[] = (rawTests as any[]).map((t) => ({
        id: String(t.id ?? ""),
        title: String(t.title ?? ""),
        file: String(t.file ?? "unknown"),
        project: String(t.project ?? "default"),
        status: (t.status ?? "unknown") as any, // parser should already use your TestStatus union
        durationMs: safeNumber(t.durationMs),
        retries: safeNumber(t.retries),
        errors: Array.isArray(t.errors) ? (t.errors as unknown[]).map((e: unknown) => String(e)) : [],
        tags: Array.isArray(t.tags) ? (t.tags as unknown[]).map((x: unknown) => String(x)) : undefined,
    }));

    // analytics (optional use by dashboard later)
    // Not strictly required for latest.json, but useful for future UI fields.
    buildAnalytics({ tests });

    // run timing
    const endedAtIso = nowIso();
    const startedAtIso = endedAtIso; // keep simple for now; later you can read from report metadata if you want
    const runId = endedAtIso.replace(/[:.]/g, "-");

    const summary = computeRunSummary({ runId, startedAtIso, endedAtIso, tests });

    const flakyTop = buildFlakyTop(tests, 10);
    const slowTop = buildSlowTop(tests, 10);
    const files = buildFileBreakdown(tests);

    // history trend
    const trend = upsertTrendPoint({
        historyPath: paths.dashboardHistoryJson,
        summary,
        keepLast: keepHistoryDays,
    });

    const payload: DashboardLatestPayload = {
        summary,
        tests,
        flakyTop,
        slowTop,
        files,
        trend,
    };

    safeWriteJson(paths.dashboardLatestJson, payload);

    return {
        latestPath: paths.dashboardLatestJson,
        historyPath: paths.dashboardHistoryJson,
    };
}