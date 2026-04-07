// src/evidence/runtime/createEvidenceContext.ts

import { createEvidenceStore } from "../core/createEvidenceStore";
import type { EvidenceContext } from "./EvidenceContext";
import type { EvidenceRunInfo } from "./EvidenceRunInfo";

export function createEvidenceContext(runInfo: EvidenceRunInfo): EvidenceContext {
    return {
        runInfo,
        store: createEvidenceStore(),
    };
}