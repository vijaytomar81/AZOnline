// src/executionLayer/logging/executionLogRenderer.ts

import { failure, muted, success } from "@utils/cliFormat";
import type { ExecutionMode } from "@executionLayer/contracts";
import { field, headerLine } from "./shared";

export function formatDuration(startMs: number): string {
    return `${((Date.now() - startMs) / 1000).toFixed(2)}s`;
}

export function renderExecutionHeader(args: {
    mode: ExecutionMode;
    environment: string;
    iterations: number;
    parallel: number;
    schema?: string;
    source?: string;
    sheet?: string;
    totalCases?: number;
    totalScenarios?: number;
}): string {
    const lines: string[] = [];
    const title =
        args.mode === "data"
            ? success("[DATA-MODE EXECUTION]")
            : success("[E2E-MODE EXECUTION]");

    lines.push("");
    lines.push(headerLine(title));
    lines.push(field("Environment", args.environment));

    if (args.mode === "data") {
        lines.push(field("Schema", args.schema ?? ""));
        lines.push(field("Source", args.source ?? ""));
        lines.push(field("Total Cases", args.totalCases ?? 0));
    } else {
        lines.push(field("Sheet", args.sheet ?? ""));
        lines.push(field("Total Scenarios", args.totalScenarios ?? 0));
    }

    lines.push(field("Iterations", args.iterations));
    lines.push(field("Parallel", args.parallel));
    lines.push("==================================================");

    return lines.join("\n");
}

export function renderExecutionSummary(args: {
    total: number;
    passed: number;
    failed: number;
    totalTime: string;
    runId?: string;
    evidenceDir?: string;
    passedEvidencePath?: string;
    failedEvidencePath?: string;
}): string {
    const lines: string[] = [];

    lines.push("");
    lines.push("====================[SUMMARY]====================");

    if (args.runId) {
        lines.push(field("Run Id", muted(args.runId)));
    }

    lines.push(field("Total", muted(String(args.total))));
    lines.push(field("Passed", success(String(args.passed))));
    lines.push(
        field("Failed", args.failed > 0 ? failure(String(args.failed)) : success("0"))
    );
    lines.push(field("Total Time", muted(args.totalTime)));

    if (args.evidenceDir) {
        lines.push(field("Evidence Dir", muted(args.evidenceDir)));
    }

    if (args.passedEvidencePath) {
        lines.push(field("Passed Evidence", muted(args.passedEvidencePath)));
    }

    if (args.failedEvidencePath) {
        lines.push(field("Failed Evidence", muted(args.failedEvidencePath)));
    }

    lines.push("================================================");

    return lines.join("\n");
}
