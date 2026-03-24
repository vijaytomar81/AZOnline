// src/execution/core/logging/shared.ts

import { failure, muted, success, warning } from "@utils/cliFormat";
import type { StepExecutionResult } from "@execution/core/result";

export function headerLine(title: string): string {
    return `====================${title}====================`;
}

export function divider(): string {
    return "------------------------------------------------------------";
}

export function safeText(value: unknown): string {
    return String(value ?? "");
}

export function field(label: string, value: unknown): string {
    return `${muted(label.padEnd(17))}: ${safeText(value)}`;
}

export function renderFields(
    entries: Array<[string, unknown]>
): string[] {
    const filtered = entries.filter(
        ([, value]) => value !== undefined && value !== null && String(value) !== ""
    );

    if (!filtered.length) {
        return [];
    }

    const maxWidth = Math.max(...filtered.map(([label]) => label.length));

    return filtered.map(([label, value]) => {
        return `${muted(label.padEnd(maxWidth))}: ${safeText(value)}`;
    });
}

export function statusText(status: string): string {
    if (status === "passed") return success("PASSED");
    if (status === "failed") return failure("FAILED");
    return warning(status.toUpperCase());
}

export function stepDuration(step: StepExecutionResult): string {
    const start = new Date(step.startedAt).getTime();
    const end = new Date(step.finishedAt).getTime();

    if (Number.isNaN(start) || Number.isNaN(end)) {
        return "0.00s";
    }

    return `${((end - start) / 1000).toFixed(2)}s`;
}

export function collectFieldIfPresent(
    entries: Array<[string, unknown]>,
    label: string,
    value: unknown
): void {
    if (value !== undefined && value !== null && String(value) !== "") {
        entries.push([label, value]);
    }
}