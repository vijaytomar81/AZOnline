// src/configLayer/models/evidence/fields/evidenceStaticFields.config.ts

import type { EvidenceFieldDefinition } from "../types";

export const EVIDENCE_STATUS = {
    PASSED: "passed",
    FAILED: "failed",
    ERROR: "error",
    NOT_EXECUTED: "not_executed",
} as const;

export type EvidenceStatus =
    (typeof EVIDENCE_STATUS)[keyof typeof EVIDENCE_STATUS];

export const EVIDENCE_STATIC_FIELDS = {

    SCENARIO_ID: { field: "SCENARIO_ID", key: "scenarioId", label: "Scenario ID", valueType: "string" },
    SCENARIO_NAME: { field: "SCENARIO_NAME", key: "scenarioName", label: "Scenario Name", valueType: "string" },
    PLATFORM: { field: "PLATFORM", key: "platform", label: "Platform", valueType: "string" },
    APPLICATION: { field: "APPLICATION", key: "application", label: "Application", valueType: "string" },
    PRODUCT: { field: "PRODUCT", key: "product", label: "Product", valueType: "string" },
    JOURNEY_START_WITH: { field: "JOURNEY_START_WITH", key: "journeyStartWith", label: "Journey Start With", valueType: "string" },
    DESCRIPTION: { field: "DESCRIPTION", key: "description", label: "Description", valueType: "string" },
    STATUS: { field: "STATUS", key: "status", label: "Status", valueType: "string", allowedValues: Object.values(EVIDENCE_STATUS) },

    ITEM_NO: { field: "ITEM_NO", key: "itemNo", label: "Item No", valueType: "number" },
    ACTION: { field: "ACTION", key: "action", label: "Action", valueType: "string" },
    SUB_TYPE: { field: "SUB_TYPE", key: "subType", label: "Sub Type", valueType: "string" },
    PORTAL: { field: "PORTAL", key: "portal", label: "Portal", valueType: "string" },
    TEST_CASE_REF: { field: "TEST_CASE_REF", key: "testCaseRef", label: "Test Case Ref", valueType: "string" },
    STARTED_AT: { field: "STARTED_AT", key: "startedAt", label: "Started At", valueType: "string" },
    FINISHED_AT: { field: "FINISHED_AT", key: "finishedAt", label: "Finished At", valueType: "string" },
    MESSAGE: { field: "MESSAGE", key: "message", label: "Message", valueType: "string" },
    ERROR_DETAILS: { field: "ERROR_DETAILS", key: "errorDetails", label: "Error Details", valueType: "string" },
    BLOCKED_BY: { field: "BLOCKED_BY", key: "blockedBy", label: "Blocked By", valueType: "json" },

    RUN_ID: { field: "RUN_ID", key: "runId", label: "Run Id", valueType: "string" },
    MODE: { field: "MODE", key: "mode", label: "Mode", valueType: "string" },
    ENVIRONMENT: { field: "ENVIRONMENT", key: "environment", label: "Environment", valueType: "string" },
    TOTAL_TIME: { field: "TOTAL_TIME", key: "totalTime", label: "Total Time", valueType: "string" },
    TOTAL_ITEMS: { field: "TOTAL_ITEMS", key: "totalItems", label: "Total Items", valueType: "number" },
    PASSED_ITEMS: { field: "PASSED_ITEMS", key: "passedItems", label: "Passed Items", valueType: "number" },
    FAILED_ITEMS: { field: "FAILED_ITEMS", key: "failedItems", label: "Failed Items", valueType: "number" },
    ERROR_ITEMS: { field: "ERROR_ITEMS", key: "errorItems", label: "Error Items", valueType: "number" },
    NOT_EXECUTED_ITEMS: { field: "NOT_EXECUTED_ITEMS", key: "notExecutedItems", label: "Not Executed Items", valueType: "number" },

    // =========================
    // Extended counts
    // =========================
    TOTAL_COUNT: { field: "TOTAL_COUNT", key: "totalCount", label: "Total Count", valueType: "number" },
    PASSED_COUNT: { field: "PASSED_COUNT", key: "passedCount", label: "Passed Count", valueType: "number" },
    FAILED_COUNT: { field: "FAILED_COUNT", key: "failedCount", label: "Failed Count", valueType: "number" },
    ERROR_COUNT: { field: "ERROR_COUNT", key: "errorCount", label: "Error Count", valueType: "number" },
    NOT_EXECUTED_COUNT: { field: "NOT_EXECUTED_COUNT", key: "notExecutedCount", label: "Not Executed Count", valueType: "number" },

    // =========================
    // System metadata
    // =========================
    WORKER_ARTIFACT_COUNT: { field: "WORKER_ARTIFACT_COUNT", key: "workerArtifactCount", label: "Worker Artifact Count", valueType: "number" },
    MERGED_CASE_COUNT: { field: "MERGED_CASE_COUNT", key: "mergedCaseCount", label: "Merged Case Count", valueType: "number" },
    CORRUPTED_ARTIFACT_COUNT: { field: "CORRUPTED_ARTIFACT_COUNT", key: "corruptedArtifactCount", label: "Corrupted Artifact Count", valueType: "number" },
    DUPLICATE_CASE_COUNT: { field: "DUPLICATE_CASE_COUNT", key: "duplicateCaseCount", label: "Duplicate Case Count", valueType: "number" },
    CLEANUP_WORKER_ARTIFACTS: { field: "CLEANUP_WORKER_ARTIFACTS", key: "cleanupWorkerArtifacts", label: "Cleanup Worker Artifacts", valueType: "boolean" },

    FINALIZED_AT: { field: "FINALIZED_AT", key: "finalizedAt", label: "Finalized At", valueType: "string" },
    ARTIFACT_TIMESTAMP: { field: "ARTIFACT_TIMESTAMP", key: "artifactTimestamp", label: "Artifact Timestamp", valueType: "string" },

    // =========================
    // Paths
    // =========================
    OUTPUT_ROOT: { field: "OUTPUT_ROOT", key: "outputRoot", label: "Output Root", valueType: "string" },
    EVIDENCE_DIR: { field: "EVIDENCE_DIR", key: "evidenceDir", label: "Evidence Directory", valueType: "string" },
    PASSED_EVIDENCE_PATH: { field: "PASSED_EVIDENCE_PATH", key: "passedEvidencePath", label: "Passed Evidence Path", valueType: "string" },
    FAILED_EVIDENCE_PATH: { field: "FAILED_EVIDENCE_PATH", key: "failedEvidencePath", label: "Failed Evidence Path", valueType: "string" },
    NOT_EXECUTED_EVIDENCE_PATH: { field: "NOT_EXECUTED_EVIDENCE_PATH", key: "notExecutedEvidencePath", label: "Not Executed Evidence Path", valueType: "string" },

    PAGE_SCANS_DIR: { field: "PAGE_SCANS_DIR", key: "pageScansDir", label: "Page Scans Directory", valueType: "string" },
    PROMOTED_PAGE_SCAN_COUNT: { field: "PROMOTED_PAGE_SCAN_COUNT", key: "promotedPageScanCount", label: "Promoted Page Scan Count", valueType: "number" },

} as const satisfies Record<string, EvidenceFieldDefinition>;
