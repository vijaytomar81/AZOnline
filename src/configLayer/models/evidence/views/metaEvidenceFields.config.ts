// src/configLayer/models/evidence/views/metaEvidenceFields.config.ts

import {
    EVIDENCE_STATIC_FIELDS,
    EVIDENCE_RUNTIME_FIELDS,
} from "../fields";
import type { EvidenceFieldDefinition, MetaEvidenceViewField } from "../types";

export const META_EVIDENCE_FIELDS = [

    // =========================
    // Run section
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.RUN_ID, section: "Run", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.MODE, section: "Run", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.ENVIRONMENT, section: "Run", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_RUNTIME_FIELDS.EVIDENCE_DIRECTORY, section: "Run", toStructuredOutput: true, toReportOutput: true },

    // =========================
    // Timing section
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.STARTED_AT, section: "Timing", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.FINISHED_AT, section: "Timing", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.TOTAL_TIME, section: "Timing", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_RUNTIME_FIELDS.EXECUTION_TIME, section: "Timing", toStructuredOutput: true, toReportOutput: true },

    // =========================
    // Results section
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.TOTAL_ITEMS, section: "Results", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.PASSED_ITEMS, section: "Results", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.FAILED_ITEMS, section: "Results", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.ERROR_ITEMS, section: "Results", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.NOT_EXECUTED_ITEMS, section: "Results", toStructuredOutput: true, toReportOutput: true },

    // Optional extended counts
    { ...EVIDENCE_STATIC_FIELDS.TOTAL_COUNT, section: "Results", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.PASSED_COUNT, section: "Results", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.FAILED_COUNT, section: "Results", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.ERROR_COUNT, section: "Results", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.NOT_EXECUTED_COUNT, section: "Results", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_RUNTIME_FIELDS.PASS_RATE, section: "Results", toStructuredOutput: true, toReportOutput: true },

    // =========================
    // Runtime section
    // =========================
    { ...EVIDENCE_RUNTIME_FIELDS.MACHINE_NAME, section: "Runtime", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_RUNTIME_FIELDS.USER, section: "Runtime", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.PLATFORM, section: "Runtime", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_RUNTIME_FIELDS.OS_VERSION, section: "Runtime", toStructuredOutput: true, toReportOutput: true },

    // =========================
    // Browser section
    // =========================
    { ...EVIDENCE_RUNTIME_FIELDS.BROWSER, section: "Browser", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_RUNTIME_FIELDS.BROWSER_CHANNEL, section: "Browser", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_RUNTIME_FIELDS.BROWSER_VERSION, section: "Browser", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_RUNTIME_FIELDS.HEADLESS, section: "Browser", toStructuredOutput: true, toReportOutput: true },

    // =========================
    // System metadata section
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.WORKER_ARTIFACT_COUNT, section: "System Metadata", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.MERGED_CASE_COUNT, section: "System Metadata", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.CORRUPTED_ARTIFACT_COUNT, section: "System Metadata", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.DUPLICATE_CASE_COUNT, section: "System Metadata", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.CLEANUP_WORKER_ARTIFACTS, section: "System Metadata", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.FINALIZED_AT, section: "System Metadata", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.ARTIFACT_TIMESTAMP, section: "System Metadata", toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.PROMOTED_PAGE_SCAN_COUNT, section: "System Metadata", toStructuredOutput: true, toReportOutput: true },

    // =========================
    // Paths (technical only)
    // No section -> fallback to "Other Info" if ever shown in report
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.OUTPUT_ROOT, toStructuredOutput: true, toReportOutput: false },
    { ...EVIDENCE_STATIC_FIELDS.EVIDENCE_DIR, toStructuredOutput: true, toReportOutput: false },
    { ...EVIDENCE_STATIC_FIELDS.PASSED_EVIDENCE_PATH, toStructuredOutput: true, toReportOutput: false },
    { ...EVIDENCE_STATIC_FIELDS.FAILED_EVIDENCE_PATH, toStructuredOutput: true, toReportOutput: false },
    { ...EVIDENCE_STATIC_FIELDS.NOT_EXECUTED_EVIDENCE_PATH, toStructuredOutput: true, toReportOutput: false },
    { ...EVIDENCE_STATIC_FIELDS.PAGE_SCANS_DIR, toStructuredOutput: true, toReportOutput: false },

] as const satisfies readonly MetaEvidenceViewField[];