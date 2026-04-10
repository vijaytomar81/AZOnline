// src/configLayer/models/evidence/views/metaEvidenceFields.config.ts

import {
    EVIDENCE_STATIC_FIELDS,
    EVIDENCE_RUNTIME_FIELDS,
} from "../fields";

export const META_EVIDENCE_FIELDS = [

    // =========================
    // Run level
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.RUN_ID, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.MODE, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.ENVIRONMENT, toJSON: true, toExcel: true },

    { ...EVIDENCE_STATIC_FIELDS.STARTED_AT, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.FINISHED_AT, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.TOTAL_TIME, toJSON: true, toExcel: true },

    // =========================
    // Counts
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.TOTAL_ITEMS, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.PASSED_ITEMS, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.FAILED_ITEMS, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.NOT_EXECUTED_ITEMS, toJSON: true, toExcel: true },

    // Optional extended counts (if defined in static)
    { ...EVIDENCE_STATIC_FIELDS.TOTAL_COUNT, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.PASSED_COUNT, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.FAILED_COUNT, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.ERROR_COUNT, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.NOT_EXECUTED_COUNT, toJSON: true, toExcel: true },

    // =========================
    // System metadata
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.WORKER_ARTIFACT_COUNT, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.MERGED_CASE_COUNT, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.CORRUPTED_ARTIFACT_COUNT, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.DUPLICATE_CASE_COUNT, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.CLEANUP_WORKER_ARTIFACTS, toJSON: true, toExcel: true },

    { ...EVIDENCE_STATIC_FIELDS.FINALIZED_AT, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.ARTIFACT_TIMESTAMP, toJSON: true, toExcel: true },

    // =========================
    // Paths
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.OUTPUT_ROOT, toJSON: true, toExcel: false },
    { ...EVIDENCE_STATIC_FIELDS.EVIDENCE_DIR, toJSON: true, toExcel: false },
    { ...EVIDENCE_STATIC_FIELDS.PASSED_EVIDENCE_PATH, toJSON: true, toExcel: false },
    { ...EVIDENCE_STATIC_FIELDS.FAILED_EVIDENCE_PATH, toJSON: true, toExcel: false },
    { ...EVIDENCE_STATIC_FIELDS.NOT_EXECUTED_EVIDENCE_PATH, toJSON: true, toExcel: false },

    { ...EVIDENCE_STATIC_FIELDS.PAGE_SCANS_DIR, toJSON: true, toExcel: false },
    { ...EVIDENCE_STATIC_FIELDS.PROMOTED_PAGE_SCAN_COUNT, toJSON: true, toExcel: true },

    // =========================
    // Runtime Info (keep JSON only)
    // =========================
    { ...EVIDENCE_RUNTIME_FIELDS.RUNTIME_SYSTEM, toJSON: true, toExcel: false },
    { ...EVIDENCE_RUNTIME_FIELDS.RUNTIME_BROWSER, toJSON: true, toExcel: false },

] as const;

