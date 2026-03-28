// src/evidence/config/resolveEvidenceArtifactConfig.ts

import type { EvidenceArtifactConfig } from "./EvidenceArtifactConfig";

const DEFAULT_OUTPUT_ROOT = "results/evidence";

function parseBoolean(value: string | undefined): boolean {
    if (!value) {
        return false;
    }

    return value.trim().toLowerCase() === "true";
}

export function resolveEvidenceArtifactConfig(): EvidenceArtifactConfig {
    return {
        outputRoot: process.env.EVIDENCE_OUTPUT_ROOT?.trim() || DEFAULT_OUTPUT_ROOT,
        cleanupWorkerArtifacts: parseBoolean(
            process.env.CLEANUP_WORKER_ARTIFACTS,
        ),
    };
}