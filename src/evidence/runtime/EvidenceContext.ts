// src/evidence/runtime/EvidenceContext.ts

import type { EvidenceStore } from "../contracts/EvidenceStore";
import type { EvidenceRunInfo } from "./EvidenceRunInfo";

export type EvidenceContext = {
    readonly runInfo: EvidenceRunInfo;
    readonly store: EvidenceStore;
};