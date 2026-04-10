// src/configLayer/models/evidence/views/errorEvidenceFields.config.ts

import { PASSED_EVIDENCE_FIELDS } from "./passedEvidenceFields.config";
import { EVIDENCE_STATIC_FIELDS } from "../fields";

export const ERROR_EVIDENCE_FIELDS = [

    // =========================
    // Reuse all passed fields
    // =========================
    ...PASSED_EVIDENCE_FIELDS,

    // =========================
    // Error specific fields
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.MESSAGE, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.ERROR_DETAILS, toJSON: true, toExcel: true },
    { ...EVIDENCE_STATIC_FIELDS.BLOCKED_BY, toJSON: true, toExcel: false },

] as const;

