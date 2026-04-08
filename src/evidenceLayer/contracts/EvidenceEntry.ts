// src/evidenceLayer/contracts/EvidenceEntry.ts

import type { EvidenceLabel } from "./EvidenceLabel";
import type { EvidenceValue } from "./EvidenceValue";

export type EvidenceEntry = {
    label: EvidenceLabel;
    value: EvidenceValue;
};