// src/evidence/artifacts/excel/buildExecutionExcelRows.ts

import type { ExecutionCaseRow } from "./buildExecutionItemRows";
import { buildExecutionItemRows } from "./buildExecutionItemRows";
import {
    buildExecutionSummaryRows,
    type SummaryRow,
} from "./buildExecutionSummaryRows";

type EvidenceCase = Record<string, unknown>;
type EvidenceCases = Record<string, EvidenceCase>;
type EvidenceFile = {
    runId: string;
    cases: EvidenceCases;
};

export type BuildExecutionExcelRowsInput = {
    runId: string;
    metadata: Record<string, unknown>;
    passedEvidence: EvidenceFile;
    failedEvidence?: EvidenceFile;
};

function getString(value: unknown): string {
    return String(value ?? "");
}

export function buildExecutionExcelRows(
    input: BuildExecutionExcelRowsInput
): {
    summaryRows: SummaryRow[];
    passedRows: ExecutionCaseRow[];
    failedRows: ExecutionCaseRow[];
    notExecutedRows: ExecutionCaseRow[];
} {
    const allCases = {
        ...(input.passedEvidence?.cases ?? {}),
        ...(input.failedEvidence?.cases ?? {}),
    };

    const allRows = buildExecutionItemRows(allCases);

    const passedRows = allRows.filter(
        (row) => getString(row["Item Status"]).toLowerCase() === "passed"
    );

    const failedRows = allRows.filter(
        (row) => getString(row["Item Status"]).toLowerCase() === "failed"
    );

    const notExecutedRows = allRows.filter(
        (row) => getString(row["Item Status"]).toLowerCase() === "not_executed"
    );

    const summaryRows = buildExecutionSummaryRows({
        runId: input.runId,
        metadata: input.metadata,
        totalItems: allRows.length,
        passed: passedRows.length,
        failed: failedRows.length,
        notExecuted: notExecutedRows.length,
    });

    return {
        summaryRows,
        passedRows,
        failedRows,
        notExecutedRows,
    };
}
