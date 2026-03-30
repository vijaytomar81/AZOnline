// src/evidence/artifacts/excel/index.ts

export type { FlattenedOutputKey } from "./flattenOutputKeys";
export { flattenOutputKeys } from "./flattenOutputKeys";

export { prettifyExcelColumn } from "./prettifyExcelColumn";

export type { ExecutionExcelColumn } from "./executionExcelColumns";
export { EXECUTION_EXCEL_COLUMNS } from "./executionExcelColumns";

export type {
    SummaryRow,
    ExecutionCaseRow,
    BuildExecutionExcelRowsInput,
} from "./buildExecutionExcelRows";
export { buildExecutionExcelRows } from "./buildExecutionExcelRows";

export type {
    WriteExecutionEvidenceExcelInput,
    WriteExecutionEvidenceExcelResult,
} from "./writeExecutionEvidenceExcel";
export { writeExecutionEvidenceExcel } from "./writeExecutionEvidenceExcel";
