// src/frameworkCore/executionLayer/logging/executionLogRenderer.ts

import { failure, muted, success } from "@utils/cliFormat";
import { EXECUTION_MODES } from "@configLayer/core/executionModes";
import type { ExecutionMode } from "@configLayer/core/executionModes";
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
    platform?: string;
    application?: string;
    product?: string;
    journeyContext?: { type: string };
}): string {
    const lines: string[] = [];
    const title =
        args.mode === EXECUTION_MODES.DATA
            ? success("[DATA-MODE EXECUTION]")
            : success("[E2E-MODE EXECUTION]");

    lines.push("");
    lines.push(headerLine(title));
    lines.push(field("Environment", args.environment));

    if (args.mode === EXECUTION_MODES.DATA) {
        if (args.platform) {
            lines.push(field("Platform", args.platform));
        }

        if (args.application) {
            lines.push(field("Application", args.application));
        }

        if (args.product) {
            lines.push(field("Product", args.product));
        }

        if (args.journeyContext?.type) {
            lines.push(field("JourneyContext", args.journeyContext.type));
        }

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
    archiveMessage?: string;
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
        field(
            "Failed",
            args.failed > 0 ? failure(String(args.failed)) : success("0")
        )
    );
    lines.push(field("Total Time", muted(args.totalTime)));

    if (args.evidenceDir) {
        lines.push(field("Artifact Dir", muted(args.evidenceDir)));
    }

    if (args.archiveMessage) {
        lines.push(field("Archived?", muted(args.archiveMessage)));
    }

    if (args.passedEvidencePath) {
        lines.push(field("Passed Artifact", muted(args.passedEvidencePath)));
    }

    if (args.failedEvidencePath) {
        lines.push(field("Failed Artifact", muted(args.failedEvidencePath)));
    }

    lines.push("================================================");

    return lines.join("\n");
}
