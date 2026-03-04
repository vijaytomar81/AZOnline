// src/reporters/playwrightParser.ts

import fs from "node:fs";
import path from "node:path";

export type NormalizedTestStatus =
    | "passed"
    | "failed"
    | "skipped"
    | "timedOut"
    | "interrupted"
    | "flaky"
    | "unknown";

export type NormalizedTest = {
    id: string;              // stable-ish identifier
    title: string;           // human readable full title
    file?: string;           // test file path if present
    project?: string;        // chromium / webkit / etc
    status: NormalizedTestStatus;
    durationMs: number;
    retries: number;
    errors: string[];
};

type PWJsonReport = any;

/**
 * Default report location used by your Playwright config:
 *   ['json', { outputFile: 'reports/json/results.json' }]
 */
export function defaultPlaywrightJsonPath() {
    return path.join(process.cwd(), "reports", "json", "results.json");
}

function safeString(x: any): string {
    if (typeof x === "string") return x;
    if (x == null) return "";
    try {
        return String(x);
    } catch {
        return "";
    }
}

function joinTitlePath(parts: string[]) {
    return parts.filter(Boolean).join(" › ");
}

function extractErrorMessages(results: any[]): string[] {
    const out: string[] = [];
    for (const r of results ?? []) {
        const errs = r?.errors ?? [];
        for (const e of errs) {
            const msg = safeString(e?.message || e?.value || e);
            if (msg) out.push(msg);
        }
    }
    return out;
}

/**
 * Heuristic:
 * - if a test has multiple results across retries and at least one failed and one passed => flaky
 * - else use final result status if present
 */
function computeStatus(test: any): NormalizedTestStatus {
    const results = test?.results ?? [];
    const statuses = results.map((r: any) => safeString(r?.status)).filter(Boolean);

    const hasPassed = statuses.includes("passed");
    const hasFailed = statuses.includes("failed");
    const hasTimedOut = statuses.includes("timedOut");
    const hasSkipped = statuses.includes("skipped");
    const hasInterrupted = statuses.includes("interrupted");

    if (hasPassed && (hasFailed || hasTimedOut || hasInterrupted)) return "flaky";
    // prefer last status if exists
    const last = statuses[statuses.length - 1] ?? safeString(test?.status);

    switch (last) {
        case "passed":
        case "failed":
        case "skipped":
        case "timedOut":
        case "interrupted":
            return last;
        default:
            // fallback: best-effort inference
            if (hasFailed) return "failed";
            if (hasTimedOut) return "timedOut";
            if (hasSkipped) return "skipped";
            if (hasInterrupted) return "interrupted";
            if (hasPassed) return "passed";
            return "unknown";
    }
}

function computeDurationMs(test: any): number {
    const results = test?.results ?? [];
    const sum = results.reduce((acc: number, r: any) => acc + (Number(r?.duration) || 0), 0);
    if (Number.isFinite(sum) && sum > 0) return sum;
    const single = Number(test?.duration) || 0;
    return Number.isFinite(single) ? single : 0;
}

function computeRetries(test: any): number {
    const results = test?.results ?? [];
    // Playwright "retries" usually means how many extra attempts happened
    return Math.max(0, (results?.length || 1) - 1);
}

function walkSuites(
    suite: any,
    titlePath: string[],
    out: NormalizedTest[],
    projectName?: string
) {
    const nextTitlePath = [...titlePath, safeString(suite?.title)].filter(Boolean);

    // nested suites
    for (const s of suite?.suites ?? []) {
        walkSuites(s, nextTitlePath, out, projectName);
    }

    // specs → tests
    for (const spec of suite?.specs ?? []) {
        const specTitle = safeString(spec?.title);
        const specPath = [...nextTitlePath, specTitle].filter(Boolean);

        const file = safeString(spec?.file || suite?.file || spec?.location?.file || "");

        for (const t of spec?.tests ?? []) {
            const title = joinTitlePath(specPath);

            // stable-ish id: file + project + title
            const id = `${file}::${projectName ?? ""}::${title}`;

            const normalized: NormalizedTest = {
                id,
                title,
                file: file || undefined,
                project: projectName,
                status: computeStatus(t),
                durationMs: computeDurationMs(t),
                retries: computeRetries(t),
                errors: extractErrorMessages(t?.results ?? []),
            };

            out.push(normalized);
        }
    }
}

/**
 * Reads Playwright JSON report and returns flat normalized test list.
 */
export function parsePlaywrightJsonReport(params?: { reportPath?: string }): NormalizedTest[] {
    const reportPath = params?.reportPath ?? defaultPlaywrightJsonPath();
    if (!fs.existsSync(reportPath)) {
        throw new Error(`Playwright JSON report not found: ${reportPath}`);
    }

    const raw = fs.readFileSync(reportPath, "utf8");
    const json = JSON.parse(raw) as PWJsonReport;

    const tests: NormalizedTest[] = [];

    // report.suites holds the root suites
    const rootSuites = json?.suites ?? [];
    const projectName = safeString(json?.config?.projects?.[0]?.name) || undefined;

    for (const s of rootSuites) {
        walkSuites(s, [], tests, projectName);
    }

    return tests;
}