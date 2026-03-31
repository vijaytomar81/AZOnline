// src/evidence/artifacts/excel/index.ts

export type { FlattenedOutputKey } from "./flattenOutputKeys";
export { flattenOutputKeys } from "./flattenOutputKeys";

export { prettifyExcelColumn } from "./prettifyExcelColumn";

export type { ExecutionExcelColumn } from "./executionExcelColumns";
export { EXECUTION_EXCEL_COLUMNS } from "./executionExcelColumns";

export type { ExecutionCaseRow } from "./buildExecutionItemRows";
export { buildExecutionItemRows } from "./buildExecutionItemRows";

export type { SummaryRow, SummaryRowKind } from "./buildExecutionSummaryRows";
export { buildExecutionSummaryRows } from "./buildExecutionSummaryRows";

export type { BuildExecutionExcelRowsInput } from "./buildExecutionExcelRows";
export { buildExecutionExcelRows } from "./buildExecutionExcelRows";

export { autoFitExecutionSheetColumns } from "./autoFitExecutionSheetColumns";
export { styleExecutionSheet } from "./styleExecutionSheet";
export { writeExecutionSummarySheet } from "./writeExecutionSummarySheet";

export type {
    WriteExecutionEvidenceExcelInput,
    WriteExecutionEvidenceExcelResult,
} from "./writeExecutionEvidenceExcel";
export { writeExecutionEvidenceExcel } from "./writeExecutionEvidenceExcel";
