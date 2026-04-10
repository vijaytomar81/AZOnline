// src/configLayer/models/evidence/views/metaEvidenceFields.config.ts

import {
    EVIDENCE_STATIC_FIELDS,
    EVIDENCE_RUNTIME_FIELDS,
} from "../fields";

export const META_EVIDENCE_FIELDS = [

    // =========================
    // Run section
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.RUN_ID, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.MODE, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.ENVIRONMENT, toStructuredOutput: true, toReportOutput: true },

    // =========================
    // Timing section
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.STARTED_AT, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.FINISHED_AT, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.TOTAL_TIME, toStructuredOutput: true, toReportOutput: true },

    // =========================
    // Results section
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.TOTAL_ITEMS, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.PASSED_ITEMS, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.FAILED_ITEMS, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.NOT_EXECUTED_ITEMS, toStructuredOutput: true, toReportOutput: true },

    // Optional extended counts
    { ...EVIDENCE_STATIC_FIELDS.TOTAL_COUNT, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.PASSED_COUNT, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.FAILED_COUNT, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.ERROR_COUNT, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.NOT_EXECUTED_COUNT, toStructuredOutput: true, toReportOutput: true },

    // New business-friendly summary fields
    { ...EVIDENCE_RUNTIME_FIELDS.PASS_RATE, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_RUNTIME_FIELDS.EXECUTION_TIME, toStructuredOutput: true, toReportOutput: true },

    // =========================
    // Runtime section
    // =========================
    { ...EVIDENCE_RUNTIME_FIELDS.MACHINE_NAME, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_RUNTIME_FIELDS.USER, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.PLATFORM, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_RUNTIME_FIELDS.OS_VERSION, toStructuredOutput: true, toReportOutput: true },

    // =========================
    // Browser section
    // =========================
    { ...EVIDENCE_RUNTIME_FIELDS.BROWSER, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_RUNTIME_FIELDS.BROWSER_CHANNEL, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_RUNTIME_FIELDS.BROWSER_VERSION, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_RUNTIME_FIELDS.HEADLESS, toStructuredOutput: true, toReportOutput: true },

    // =========================
    // System metadata section
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.WORKER_ARTIFACT_COUNT, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.MERGED_CASE_COUNT, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.CORRUPTED_ARTIFACT_COUNT, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.DUPLICATE_CASE_COUNT, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.CLEANUP_WORKER_ARTIFACTS, toStructuredOutput: true, toReportOutput: true },

    { ...EVIDENCE_STATIC_FIELDS.FINALIZED_AT, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.ARTIFACT_TIMESTAMP, toStructuredOutput: true, toReportOutput: true },

    // =========================
    // Paths (technical only)
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.OUTPUT_ROOT, toStructuredOutput: true, toReportOutput: false },
    { ...EVIDENCE_STATIC_FIELDS.EVIDENCE_DIR, toStructuredOutput: true, toReportOutput: false },
    { ...EVIDENCE_STATIC_FIELDS.PASSED_EVIDENCE_PATH, toStructuredOutput: true, toReportOutput: false },
    { ...EVIDENCE_STATIC_FIELDS.FAILED_EVIDENCE_PATH, toStructuredOutput: true, toReportOutput: false },
    { ...EVIDENCE_STATIC_FIELDS.NOT_EXECUTED_EVIDENCE_PATH, toStructuredOutput: true, toReportOutput: false },

    { ...EVIDENCE_RUNTIME_FIELDS.EVIDENCE_DIRECTORY, toStructuredOutput: true, toReportOutput: true },

    { ...EVIDENCE_STATIC_FIELDS.PAGE_SCANS_DIR, toStructuredOutput: true, toReportOutput: false },
    { ...EVIDENCE_STATIC_FIELDS.PROMOTED_PAGE_SCAN_COUNT, toStructuredOutput: true, toReportOutput: true },


] as const;