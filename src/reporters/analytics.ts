// src/reporters/analytics.ts

import type { NormalizedTestResult } from "./schema";

export type Status =
    | "passed"
    | "failed"
    | "flaky"
    | "skipped"
    | "timedOut"
    | "interrupted"
    | "unknown";

export type Analytics = {
    generatedAt: string;

    totals: {
        total: number;
        passed: number;
        failed: number;
        flaky: number;
        skipped: number;
        other: number;
        passRate: number; // 0..100 (passed / (passed+failed+flaky))
        executed: number; // passed+failed+flaky
    };

    byProject: Array<{
        project: string;
        total: number;
        passed: number;
        failed: number;
        flaky: number;
        skipped: number;
        passRate: number; // 0..100
    }>;

    byFile: Array<{
        file: string;
        total: number;
        passed: number;
        failed: number;
        flaky: number;
        skipped: number;
        passRate: number; // 0..100
    }>;

    flakyTests: Array<NormalizedTestResult>;
    slowTests: Array<NormalizedTestResult>; // sorted by duration desc

    topErrors: Array<{
        message: string;
        count: number;
        sampleTestIds: string[];
    }>;
};

function normalizeStatus(s: string | undefined): Status {
    const v = (s ?? "").toLowerCase();
    if (v === "passed") return "passed";
    if (v === "failed") return "failed";
    if (v === "flaky") return "flaky";
    if (v === "skipped") return "skipped";
    if (v === "timedout" || v === "timed_out" || v === "timeout") return "timedOut";
    if (v === "interrupted") return "interrupted";
    return "unknown";
}

function safeNumber(n: unknown, fallback = 0): number {
    const v = typeof n === "number" ? n : Number(n);
    return Number.isFinite(v) ? v : fallback;
}

function passRatePct(passed: number, executed: number): number {
    if (executed <= 0) return 0;
    const pct = (passed / executed) * 100;
    return Math.round(pct * 10) / 10; // 1 decimal
}

function groupBy<T>(items: T[], keyFn: (t: T) => string) {
    const map = new Map<string, T[]>();
    for (const it of items) {
        const k = keyFn(it) || "unknown";
        const arr = map.get(k);
        if (arr) arr.push(it);
        else map.set(k, [it]);
    }
    return map;
}

function summarizeGroup(items: NormalizedTestResult[]) {
    let passed = 0,
        failed = 0,
        flaky = 0,
        skipped = 0,
        other = 0;

    for (const t of items) {
        const st = normalizeStatus(t.status);
        if (st === "passed") passed++;
        else if (st === "failed") failed++;
        else if (st === "flaky") flaky++;
        else if (st === "skipped") skipped++;
        else other++;
    }

    const executed = passed + failed + flaky;

    return {
        total: items.length,
        passed,
        failed,
        flaky,
        skipped,
        other,
        executed,
        passRate: passRatePct(passed, executed),
    };
}

function normalizeErrorMessage(msg: string) {
    // Keep it stable-ish: trim, collapse whitespace, cap length
    const cleaned = msg.replace(/\s+/g, " ").trim();
    return cleaned.length > 180 ? cleaned.slice(0, 180) + "…" : cleaned;
}

export function buildAnalytics(params: {
    tests: NormalizedTestResult[];
    slowThresholdMs?: number; // default 3000
    topN?: number; // default 10
}): Analytics {
    const tests = params.tests ?? [];
    const slowThresholdMs = params.slowThresholdMs ?? 3000;
    const topN = params.topN ?? 10;

    const totals = summarizeGroup(tests);

    // totals.passRate is based on executed = passed+failed+flaky
    const totalsOut = {
        total: totals.total,
        passed: totals.passed,
        failed: totals.failed,
        flaky: totals.flaky,
        skipped: totals.skipped,
        other: totals.other,
        executed: totals.executed,
        passRate: totals.passRate,
    };

    // byProject
    const byProjectMap = groupBy(tests, (t) => t.project || "default");
    const byProject = Array.from(byProjectMap.entries())
        .map(([project, items]) => {
            const s = summarizeGroup(items);
            return {
                project,
                total: s.total,
                passed: s.passed,
                failed: s.failed,
                flaky: s.flaky,
                skipped: s.skipped,
                passRate: s.passRate,
            };
        })
        .sort((a, b) => a.project.localeCompare(b.project));

    // byFile
    const byFileMap = groupBy(tests, (t) => t.file || "unknown");
    const byFile = Array.from(byFileMap.entries())
        .map(([file, items]) => {
            const s = summarizeGroup(items);
            return {
                file,
                total: s.total,
                passed: s.passed,
                failed: s.failed,
                flaky: s.flaky,
                skipped: s.skipped,
                passRate: s.passRate,
            };
        })
        .sort((a, b) => a.file.localeCompare(b.file));

    // flaky + slow
    const flakyTests = tests
        .filter((t) => normalizeStatus(t.status) === "flaky")
        .sort((a, b) => safeNumber(b.durationMs) - safeNumber(a.durationMs));

    const slowTests = tests
        .filter((t) => safeNumber(t.durationMs) >= slowThresholdMs)
        .sort((a, b) => safeNumber(b.durationMs) - safeNumber(a.durationMs))
        .slice(0, 50);

    // topErrors
    const errorCounts = new Map<string, { count: number; ids: string[] }>();
    for (const t of tests) {
        const errs = Array.isArray(t.errors) ? t.errors : [];
        for (const e of errs) {
            if (!e) continue;
            const k = normalizeErrorMessage(String(e));
            const cur = errorCounts.get(k);
            if (cur) {
                cur.count++;
                if (cur.ids.length < 5) cur.ids.push(t.id);
            } else {
                errorCounts.set(k, { count: 1, ids: [t.id] });
            }
        }
    }

    const topErrors = Array.from(errorCounts.entries())
        .map(([message, v]) => ({ message, count: v.count, sampleTestIds: v.ids }))
        .sort((a, b) => b.count - a.count)
        .slice(0, topN);

    return {
        generatedAt: new Date().toISOString(),
        totals: totalsOut,
        byProject,
        byFile,
        flakyTests,
        slowTests,
        topErrors,
    };
}