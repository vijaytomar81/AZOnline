// src/configLayer/models/evidence/views/passedEvidenceFields.config.ts

import {
    EVIDENCE_STATIC_FIELDS,
    EVIDENCE_RUNTIME_FIELDS,
} from "../fields";

export const PASSED_EVIDENCE_FIELDS = [

    // =========================
    // Scenario Level
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.SCENARIO_ID, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.SCENARIO_NAME, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.PLATFORM, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.APPLICATION, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.PRODUCT, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.JOURNEY_START_WITH, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.DESCRIPTION, toStructuredOutput: true, toReportOutput: true },

    { ...EVIDENCE_STATIC_FIELDS.STATUS, toStructuredOutput: true, toReportOutput: true },

    // =========================
    // Item Level
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.ITEM_NO, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.ACTION, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.SUB_TYPE, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.PORTAL, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.TEST_CASE_REF, toStructuredOutput: true, toReportOutput: true },

    { ...EVIDENCE_STATIC_FIELDS.STARTED_AT, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.FINISHED_AT, toStructuredOutput: true, toReportOutput: true },

    // =========================
    // Output / Runtime (important for passed)
    // =========================
    { ...EVIDENCE_RUNTIME_FIELDS.CALCULATED_EMAIL, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_RUNTIME_FIELDS.QUOTE_NUMBER, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_RUNTIME_FIELDS.POLICY_NUMBER, toStructuredOutput: true, toReportOutput: true },

] as const;

