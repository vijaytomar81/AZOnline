// src/evidence/core/createEvidenceStore.ts

import type { EvidenceStore } from "../contracts/EvidenceStore";
import { InMemoryEvidenceStore } from "./InMemoryEvidenceStore";

/**
 * Factory function (keeps creation logic isolated)
 */
export function createEvidenceStore(): EvidenceStore {
    return new InMemoryEvidenceStore();
}