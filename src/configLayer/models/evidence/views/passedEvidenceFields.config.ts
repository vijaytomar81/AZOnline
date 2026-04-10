// src/configLayer/models/evidence/views/passedEvidenceFields.config.ts

import {
    EVIDENCE_STATIC_FIELDS,
    EVIDENCE_RUNTIME_FIELDS,
} from "../fields";

export const PASSED_EVIDENCE_FIELDS = [

    // =========================
    // Scenario Level
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.SCENARIO_ID, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.SCENARIO_NAME, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.PLATFORM, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.APPLICATION, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.PRODUCT, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.JOURNEY_START_WITH, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.DESCRIPTION, toJSON: true, toExcel: true },

    { ...EVIDENCE_STATIC_FIELDS.STATUS, toJSON: true, toExcel: true },

    // =========================
    // Item Level
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.ITEM_NO, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.ACTION, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.SUB_TYPE, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.PORTAL, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.TEST_CASE_REF, toJSON: true, toExcel: true },

    { ...EVIDENCE_STATIC_FIELDS.STARTED_AT, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.FINISHED_AT, toJSON: true, toExcel: true },

    // =========================
    // Output / Runtime (important for passed)
    // =========================
    { ...EVIDENCE_RUNTIME_FIELDS.CALCULATED_EMAIL, toJSON: true, toExcel: true },
    { ...EVIDENCE_RUNTIME_FIELDS.QUOTE_NUMBER, toJSON: true, toExcel: true },
    { ...EVIDENCE_RUNTIME_FIELDS.POLICY_NUMBER, toJSON: true, toExcel: true },

] as const;

