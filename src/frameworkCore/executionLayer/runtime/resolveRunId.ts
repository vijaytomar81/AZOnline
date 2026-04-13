// src/frameworkCore/executionLayer/runtime/resolveRunId.ts

import { executionConfig } from "@configLayer/execution/execution.config";
import type { EnvKey } from "@configLayer/environments";

function resolveMode(): string {
    return process.env.RUN_MODE?.trim() || "run";
}

function buildTimestamp(): string {
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");

    return `${yyyy}${mm}${dd}_${hh}${min}${ss}`;
}

export function resolveRunId(environment: EnvKey): string {
    const mode = resolveMode();

    if (process.env.RUN_ID?.trim()) {
        return `${environment}-${mode}-${process.env.RUN_ID.trim()}`;
    }

    if (process.env.BUILD_NUMBER) {
        return `${environment}-${mode}-build-${process.env.BUILD_NUMBER}`;
    }

    if (!executionConfig.generatedEvidenceArtifacts.withTimestamp) {
        return `${environment}-${mode}`;
    }

    return `${environment}-${mode}-${buildTimestamp()}`;
}
