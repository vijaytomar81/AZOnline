// src/evidence/artifacts/json/buildEvidenceJson.ts

import type { EvidenceContext } from "../../runtime/EvidenceContext";

export function buildEvidenceJson(context: EvidenceContext): Record<string, unknown> {
    return context.store.snapshot();
}