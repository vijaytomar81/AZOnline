// src/configLayer/models/evidence/views/notExecutedEvidenceFields.config.ts

import { PASSED_EVIDENCE_FIELDS } from "./passedEvidenceFields.config";
import { EVIDENCE_STATIC_FIELDS } from "../fields";

export const NOT_EXECUTED_EVIDENCE_FIELDS = [

    // =========================
    // Reuse all passed fields
    // =========================
    ...PASSED_EVIDENCE_FIELDS,

    // =========================
    // Not executed specific fields
    // =========================
    { ...EVIDENCE_STATIC_FIELDS.MESSAGE, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.ERROR_DETAILS, toStructuredOutput: true, toReportOutput: true },
    { ...EVIDENCE_STATIC_FIELDS.BLOCKED_BY, toStructuredOutput: true, toReportOutput: false },

] as const;

