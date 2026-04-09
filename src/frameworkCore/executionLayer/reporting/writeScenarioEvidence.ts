// src/frameworkCore/executionLayer/reporting/writeScenarioEvidence.ts

import {
    createEvidenceContext,
    writeWorkerEvidenceArtifact,
} from "@evidenceLayer";
import type {
    ExecutionContext,
    ExecutionScenarioResult,
} from "@frameworkCore/executionLayer/contracts";
import { populateEvidenceStore } from "./populateEvidenceStore";
import { buildEvidenceRunInfo } from "./buildEvidenceRunInfo";

export type WriteScenarioEvidenceArgs = {
    result: ExecutionScenarioResult;
    context: ExecutionContext;
    runId?: string;
    workerId?: string;
    outputRoot?: string;
};

export type WriteScenarioEvidenceResult = {
    filePath: string;
};

export async function writeScenarioEvidence(
    args: WriteScenarioEvidenceArgs
): Promise<WriteScenarioEvidenceResult> {
    // 1️⃣ Build run info
    const runInfo = buildEvidenceRunInfo({
        context: args.context,
        result: args.result,
        runId: args.runId ?? "local-run",
        workerId: args.workerId,
        outputRoot: args.outputRoot,
    });

    // 2️⃣ Create evidence context (store + metadata)
    const evidenceContext = createEvidenceContext(runInfo);

    // 3️⃣ Populate scenario-level fields
    populateEvidenceStore({
        evidenceContext: evidenceContext.store as any,
        scenario: args.context.scenario,
    });

    // 4️⃣ Add execution result details
    evidenceContext.store.set("status", args.result.status);
    evidenceContext.store.set("scenarioId", args.result.scenarioId);
    evidenceContext.store.set("itemResults", args.result.itemResults);
    evidenceContext.store.set("outputs", args.result.outputs ?? {});

    // 5️⃣ Write worker artifact (CRITICAL STEP)
    const { filePath } = await writeWorkerEvidenceArtifact({
        context: evidenceContext,
    });

    return { filePath };
}