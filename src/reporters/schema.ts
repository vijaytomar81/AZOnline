// src/reporters/schema.ts

export type TestStatus = "passed" | "failed" | "flaky" | "skipped";

export type NormalizedTestResult = {
    id: string;           // stable unique id (file + project + titlePath)
    title: string;        // human-readable title
    file: string;         // test file path
    project: string;      // playwright project name (chromium, etc.)
    status: TestStatus;
    durationMs: number;
    retries: number;
    errors: string[];
    tags?: string[];      // optional future use
};

export type RunSummary = {
    runId: string;        // unique run id (timestamp-based or CI build id)
    startedAtIso: string; // ISO time
    endedAtIso: string;   // ISO time
    durationMs: number;

    total: number;
    passed: number;
    failed: number;
    flaky: number;
    skipped: number;

    passRate: number;     // 0..1 (passed / total excluding skipped OR incl skipped—your choice in analytics.ts)
};

export type FlakyTestRow = {
    id: string;
    title: string;
    file: string;
    project: string;
    retries: number;
    lastDurationMs: number;
    lastError?: string;
};

export type SlowTestRow = {
    id: string;
    title: string;
    file: string;
    project: string;
    durationMs: number;
    status: TestStatus;
};

export type FileBreakdownRow = {
    file: string;
    total: number;
    passed: number;
    failed: number;
    flaky: number;
    skipped: number;
    avgDurationMs: number;
};

export type StatusTrendPoint = {
    dateIso: string; // e.g. "2026-03-04"
    total: number;
    passed: number;
    failed: number;
    flaky: number;
    skipped: number;
    passRate: number; // 0..1
};

export type DashboardLatestPayload = {
    summary: RunSummary;
    tests: NormalizedTestResult[];

    flakyTop: FlakyTestRow[];
    slowTop: SlowTestRow[];
    files: FileBreakdownRow[];

    // Optional: filled only when history exists
    trend?: StatusTrendPoint[];
};

export type DashboardBuildResult = {
    latestPath: string;   // where latest.json was written
    historyPath?: string; // where history.json was written (optional)
};