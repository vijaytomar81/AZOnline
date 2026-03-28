// src/evidence/contracts/EvidenceLabel.ts

import { EVIDENCE_LABELS } from "../constants/evidenceLabels";

export type StandardEvidenceLabel =
    typeof EVIDENCE_LABELS[keyof typeof EVIDENCE_LABELS];

/**
 * Extensible label:
 * - supports predefined constants
 * - allows custom strings
 */
export type EvidenceLabel = StandardEvidenceLabel | string;