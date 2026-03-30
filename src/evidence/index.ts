// src/evidence/index.ts

export { EVIDENCE_LABELS } from "./constants/evidenceLabels";

export type { EvidenceEntry } from "./contracts/EvidenceEntry";
export type { EvidenceLabel } from "./contracts/EvidenceLabel";
export type { EvidenceStore } from "./contracts/EvidenceStore";
export type { EvidenceValue } from "./contracts/EvidenceValue";

export { createEvidenceStore } from "./core/createEvidenceStore";
export { InMemoryEvidenceStore } from "./core/InMemoryEvidenceStore";

export type { EvidenceRunInfo } from "./runtime/EvidenceRunInfo";
export type { EvidenceContext } from "./runtime/EvidenceContext";
export { createEvidenceContext } from "./runtime/createEvidenceContext";

export type { EvidenceArtifactPaths } from "./artifacts/contracts/EvidenceArtifactPaths";

export type {
    EvidenceArtifactWriter,
    EvidenceArtifactWriteResult,
} from "./artifacts/contracts/EvidenceArtifactWriter";

export { buildEvidenceArtifactPath } from "./artifacts/paths/buildEvidenceArtifactPath";
export { buildEvidenceJson } from "./artifacts/json/buildEvidenceJson";

export {
    buildEvidenceMetadata,
    type BuildEvidenceMetadataInput,
    type EvidenceExecutionStatus,
} from "./artifacts/json/buildEvidenceMetadata";

export {
    WriteEvidenceJsonArtifact,
    writeEvidenceJsonArtifact,
    type WriteEvidenceJsonArtifactInput,
} from "./artifacts/json/writeEvidenceJsonArtifact";

export {
    buildRunEvidence,
    type RunEvidence,
    type RunEvidenceCaseMap,
} from "./artifacts/run/buildRunEvidence";

export {
    buildFinalEvidenceFiles,
    type FinalEvidenceCases,
    type FinalEvidenceFiles,
} from "./artifacts/run/buildFinalEvidenceFiles";

export {
    writeWorkerEvidenceArtifact,
    type WriteWorkerEvidenceArtifactInput,
    type WriteWorkerEvidenceArtifactResult,
    type WorkerEvidenceArtifact,
} from "./artifacts/run/writeWorkerEvidenceArtifact";

export {
    mergeWorkerEvidence,
    type MergeWorkerEvidenceInput,
    type MergeWorkerEvidenceResult,
} from "./artifacts/run/mergeWorkerEvidence";

export {
    finalizeRunEvidence,
    type FinalizeRunEvidenceInput,
    type FinalizeRunEvidenceResult,
} from "./artifacts/run/finalizeRunEvidence";

export {
    cleanupOldEvidenceRuns,
    type CleanupOldEvidenceRunsInput,
} from "./artifacts/run/cleanupOldEvidenceRuns";

export type { FlattenedOutputKey } from "./artifacts/excel/flattenOutputKeys";
export { flattenOutputKeys } from "./artifacts/excel/flattenOutputKeys";

export { prettifyExcelColumn } from "./artifacts/excel/prettifyExcelColumn";

export type { ExecutionExcelColumn } from "./artifacts/excel/executionExcelColumns";
export { EXECUTION_EXCEL_COLUMNS } from "./artifacts/excel/executionExcelColumns";

export type {
    SummaryRow,
    ExecutionCaseRow,
    BuildExecutionExcelRowsInput,
} from "./artifacts/excel/buildExecutionExcelRows";
export { buildExecutionExcelRows } from "./artifacts/excel/buildExecutionExcelRows";

export type {
    WriteExecutionEvidenceExcelInput,
    WriteExecutionEvidenceExcelResult,
} from "./artifacts/excel/writeExecutionEvidenceExcel";
export { writeExecutionEvidenceExcel } from "./artifacts/excel/writeExecutionEvidenceExcel";

export type { EvidenceArtifactConfig } from "./config/EvidenceArtifactConfig";
export { resolveEvidenceArtifactConfig } from "./config/resolveEvidenceArtifactConfig";
