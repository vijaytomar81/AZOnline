// src/executionLayer/reporting/writeScenarioEvidence.ts

import {
    createEvidenceContext,
    writeEvidenceJsonArtifact,
    writeWorkerEvidenceArtifact,
    type EvidenceArtifactWriteResult,
    type EvidenceContext,
} from "@/evidence";
import type {
    ExecutionContext,
    ExecutionScenarioResult,
} from "@executionLayer/contracts";
import { buildEvidenceRunInfo } from "./buildEvidenceRunInfo";
import { populateEvidenceStore } from "./populateEvidenceStore";

export type WriteScenarioEvidenceArgs = {
    context: ExecutionContext;
    result: ExecutionScenarioResult;
    runId: string;
    workerId?: string;
    outputRoot?: string;
    startedAt?: string;
    finishedAt?: string;
};

export type WriteScenarioEvidenceResult = {
    evidenceContext: EvidenceContext;
    jsonArtifact: EvidenceArtifactWriteResult;
    workerArtifact: {
        filePath: string;
    };
};

export async function writeScenarioEvidence(
    args: WriteScenarioEvidenceArgs
): Promise<WriteScenarioEvidenceResult> {
    const evidenceContext = createEvidenceContext(
        buildEvidenceRunInfo({
            context: args.context,
            result: args.result,
            runId: args.runId,
            workerId: args.workerId,
            outputRoot: args.outputRoot,
        })
    );

    populateEvidenceStore({
        evidenceContext,
        context: args.context,
        result: args.result,
    });

    const jsonArtifact = await writeEvidenceJsonArtifact({
        context: evidenceContext,
        metadata: {
            status: args.result.status,
            startedAt: args.startedAt,
            finishedAt: args.finishedAt,
        },
    });

    const workerArtifact = await writeWorkerEvidenceArtifact({
        context: evidenceContext,
    });

    return {
        evidenceContext,
        jsonArtifact,
        workerArtifact,
    };
}
