// src/evidence/artifacts/paths/buildEvidenceArtifactPath.ts

import path from "node:path";
import type { EvidenceArtifactPaths } from "../contracts/EvidenceArtifactPaths";
import type { EvidenceRunInfo } from "../../runtime/EvidenceRunInfo";

const DEFAULT_OUTPUT_ROOT = "results/evidence";

function sanitizePathSegment(value: string): string {
    return value.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "unknown";
}

function buildRetrySegment(retryIndex?: number): string | null {
    if (retryIndex === undefined) {
        return null;
    }

    return `retry-${retryIndex}`;
}

export function buildEvidenceArtifactPath(
    runInfo: EvidenceRunInfo,
): EvidenceArtifactPaths {
    const outputRoot = runInfo.outputRoot ?? DEFAULT_OUTPUT_ROOT;
    const retrySegment = buildRetrySegment(runInfo.retryIndex);

    const segments = [
        outputRoot,
        sanitizePathSegment(runInfo.runId),
        sanitizePathSegment(runInfo.workerId),
        sanitizePathSegment(runInfo.testCaseId),
    ];

    if (retrySegment) {
        segments.push(retrySegment);
    }

    const baseDir = path.join(...segments);

    return {
        baseDir,
        evidenceJsonPath: path.join(baseDir, "evidence.json"),
        metadataJsonPath: path.join(baseDir, "metadata.json"),
    };
}