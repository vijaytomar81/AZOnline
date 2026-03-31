// src/executionLayer/core/runner/runScenarios.ts

import { createRuntimeInfo } from "@utils/runtimeInfo";
import type { RuntimeBrowserInfo } from "@utils/runtimeInfo";
import {
    cleanupOldEvidenceRuns,
    finalizeRunEvidence,
    resolveEvidenceArtifactConfig,
} from "@/evidence";
import { executionConfig } from "@config/execution.config";
import { resolveRunId } from "@executionLayer/runtime/resolveRunId";
import {
    formatDuration,
    renderExecutionHeader,
    renderExecutionSummary,
} from "@executionLayer/logging";
import { countExecutionStatuses } from "./countExecutionStatuses";
import { expandScenarios } from "./expandScenarios";
import { runScenarioBatch } from "./runScenarioBatch";
import { runScenarioWorker } from "./runScenarioWorker";
import type { RunScenariosArgs } from "./types";

export async function runScenarios(
    args: RunScenariosArgs
): Promise<void> {
    const startedAtMs = Date.now();                     // ✅ for duration
    const startedAt = new Date().toISOString();         // ✅ for summary

    const parallel = Math.max(1, args.parallel ?? 1);
    const runs = expandScenarios(args.scenarios, args.iterations);
    const runId = args.runId ?? resolveRunId();

    const evidenceConfig = resolveEvidenceArtifactConfig();
    const evidenceOutputRoot =
        args.evidenceOutputRoot ?? evidenceConfig.outputRoot;

    console.log(
        renderExecutionHeader({
            mode: args.mode,
            environment: args.environment,
            iterations: args.iterations,
            parallel,
            schema: args.schema,
            source: args.source,
            sheet: args.sheet,
            totalCases: args.mode === "data" ? runs.length : undefined,
            totalScenarios: args.mode === "e2e" ? runs.length : undefined,
        })
    );

    const outputs = await runScenarioBatch(
        runs,
        parallel,
        async (scenario) =>
            runScenarioWorker({
                scenario,
                runArgs: {
                    ...args,
                    runId,
                    workerId: args.workerId ?? "worker-0",
                    evidenceOutputRoot,
                },
            })
    );

    outputs.forEach((item) => {
        console.log(item.block);
    });

    const { passed, failed } = countExecutionStatuses(outputs);

    const totalTime = formatDuration(startedAtMs);      // ✅ computed here
    const finishedAt = new Date().toISOString();        // ✅ end timestamp

    let finalEvidence:
        | {
            baseDir: string;
            passedEvidencePath: string;
            failedEvidencePath?: string;
        }
        | undefined;

    if (executionConfig.generatedEvidenceArtifacts.enabled) {
        // ✅ STEP 1: extract browser
        const browserInfo = outputs.find((o) => o.browser)?.browser as
            | import("@utils/runtimeInfo").RuntimeBrowserInfo
            | undefined;

        // ✅ STEP 2: create runtimeInfo
        const runtimeInfo = createRuntimeInfo({
            browser: browserInfo,
        });

        // ✅ STEP 3: use it
        finalEvidence = await finalizeRunEvidence({
            runId,
            outputRoot: evidenceOutputRoot,
            cleanupTemporaryArtifacts:
                executionConfig.generatedEvidenceArtifacts.cleanupTemporaryFilesAfterMerge,
            keepFailedEvidenceFileOnlyWhenNeeded:
                executionConfig.generatedEvidenceArtifacts.keepFailedEvidenceFileOnlyWhenNeeded,

            metadata: {
                mode: args.mode,
                environment: args.environment,
                totalTime,
                startedAt,
                finishedAt,
                totalItems: runs.length,
                passedItems: passed,
                failedItems: failed,
                notExecutedItems:
                    runs.length - (passed + failed),

                runtimeInfo, // ✅ now defined
            },
        });

        await cleanupOldEvidenceRuns({
            outputRoot: evidenceOutputRoot,
            maxToKeep: executionConfig.generatedEvidenceArtifacts.maxToKeep,
            excludeRunIds: [runId],
        });
    }

    console.log(
        renderExecutionSummary({
            total: runs.length,
            passed,
            failed,
            totalTime,
            runId,
            evidenceDir: finalEvidence?.baseDir,
        })
    );
}