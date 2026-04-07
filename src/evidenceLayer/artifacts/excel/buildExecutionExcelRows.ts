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
    notExecutedEvidence?: EvidenceFile;
};

export function buildExecutionExcelRows(
    input: BuildExecutionExcelRowsInput
): {
    summaryRows: SummaryRow[];
    passedRows: ExecutionCaseRow[];
    failedRows: ExecutionCaseRow[];
    notExecutedRows: ExecutionCaseRow[];
} {
    const passedRows = buildExecutionItemRows(input.passedEvidence?.cases ?? {});
    const failedRows = buildExecutionItemRows(input.failedEvidence?.cases ?? {});
    const notExecutedRows = buildExecutionItemRows(
        input.notExecutedEvidence?.cases ?? {}
    );

    const totalItems =
        passedRows.length + failedRows.length + notExecutedRows.length;

    const summaryRows = buildExecutionSummaryRows({
        runId: input.runId,
        metadata: input.metadata,
        totalItems,
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
