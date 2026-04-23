// src/toolingLayer/pageObjects/generator/generator/reporting/buildGenerationReportText.ts

import type { GenerationSummaryRow, GenerationResult } from "./types";

function padRight(value: string, width: number): string {
    return value.length >= width ? value : value + " ".repeat(width - value.length);
}

export function buildGenerationReportText(params: {
    summaryRows: GenerationSummaryRow[];
    result: GenerationResult;
}): string {
    const lines: string[] = [
        "--------------------------------",
        "GENERATOR SUMMARY",
        "--------------------------------",
        ...params.summaryRows.map(
            (row: GenerationSummaryRow) =>
                `${padRight(row.label, 18)}: ${row.value}`
        ),
        "--------------------------------",
        `${padRight("Result", 18)}: ${params.result}`,
        "--------------------------------",
    ];

    return lines.join("\n");
}
