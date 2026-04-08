// src/evidenceLayer/artifacts/excel/buildExecutionSummaryRows.ts

export type SummaryRowKind = "title" | "section" | "data" | "spacer";

export type SummaryRow = {
    kind: SummaryRowKind;
    Field: string;
    Value: string | number;
};

function getString(value: unknown): string {
    return String(value ?? "");
}

function createRow(field: string, value: string | number, kind: SummaryRowKind = "data"): SummaryRow {
    return { kind, Field: field, Value: value };
}

function section(title: string): SummaryRow {
    return createRow(title, "", "section");
}

function spacer(): SummaryRow {
    return createRow("", "", "spacer");
}

function title(text: string): SummaryRow {
    return createRow(text, "", "title");
}

export function buildExecutionSummaryRows(args: {
    runId: string;
    metadata: Record<string, unknown>;
    totalItems: number;
    passed: number;
    failed: number;
    notExecuted: number;
}): SummaryRow[] {

    const runtime = (args.metadata.runtimeInfo ?? {}) as any;
    const system = runtime.system ?? {};
    const browser = runtime.browser ?? {};

    const passRate =
        args.totalItems > 0
            ? ((args.passed / args.totalItems) * 100).toFixed(2) + "%"
            : "0%";

    return [
        title("Execution Summary"),
        spacer(),

        section("Run"),
        createRow("Run Id", args.runId),
        createRow("Mode", getString(args.metadata.mode)),
        createRow("Environment", getString(args.metadata.environment)),
        createRow("Evidence Directory", getString(args.metadata.evidenceDir)),
        spacer(),

        section("Runtime"),
        createRow("Machine Name", getString(system.machineName)),
        createRow("User", getString(system.user)),
        createRow("Platform", getString(system.platform)),
        createRow("OS Version", getString(system.osVersion)),
        spacer(),

        section("Browser"),
        createRow("Browser", getString(browser.name)),
        createRow("Browser Channel", getString(browser.channel)),
        createRow("Browser Version", getString(browser.version)),
        createRow("Headless", getString(browser.headless)),
        spacer(),

        section("Results"),
        createRow("Total Items", args.totalItems),
        createRow("Passed", args.passed),
        createRow("Failed", args.failed),
        createRow("Not Executed", args.notExecuted),
        createRow("Pass Rate (%)", passRate),
        spacer(),

        section("Timing"),
        createRow("Execution Time", getString(args.metadata.totalTime)),
        createRow("Started At", getString(args.metadata.startedAt)),
        createRow("Finished At", getString(args.metadata.finishedAt)),
    ];
}
