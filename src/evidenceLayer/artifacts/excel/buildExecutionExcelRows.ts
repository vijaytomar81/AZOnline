// src/evidenceLayer/artifacts/excel/buildExecutionExcelRows.ts

import {
    FAILED_EVIDENCE_FIELDS,
    NOT_EXECUTED_EVIDENCE_FIELDS,
    PASSED_EVIDENCE_FIELDS,
} from "@configLayer/models/evidence/views";
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
    const passedRows = buildExecutionItemRows({
        cases: input.passedEvidence?.cases ?? {},
        fields: PASSED_EVIDENCE_FIELDS,
    });

    const failedRows = buildExecutionItemRows({
        cases: input.failedEvidence?.cases ?? {},
        fields: FAILED_EVIDENCE_FIELDS,
    });

    const notExecutedRows = buildExecutionItemRows({
        cases: input.notExecutedEvidence?.cases ?? {},
        fields: NOT_EXECUTED_EVIDENCE_FIELDS,
    });

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
