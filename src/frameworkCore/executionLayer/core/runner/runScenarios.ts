// src/frameworkCore/executionLayer/core/runner/runScenarios.ts

import { createRuntimeInfo } from "@utils/runtimeInfo";
import type { RuntimeBrowserInfo } from "@utils/runtimeInfo";
import { executionConfig } from "@configLayer/execution.config";
import { resolveRunId } from "@frameworkCore/executionLayer/runtime/resolveRunId";
import {
    formatDuration,
    renderExecutionHeader,
    renderExecutionSummary,
} from "@frameworkCore/executionLayer/logging";
import { countExecutionStatuses } from "./countExecutionStatuses";
import { expandScenarios } from "./expandScenarios";
import { runScenarioBatch } from "./runScenarioBatch";
import { runScenarioWorker } from "./runScenarioWorker";
import type { RunScenariosArgs } from "./types";
import { EvidenceFactory } from "@evidenceFactory";

export async function runScenarios(
    args: RunScenariosArgs
): Promise<void> {
    const startedAtMs = Date.now();
    const startedAt = new Date().toISOString();

    const parallel = Math.max(1, args.parallel ?? 1);

    // ✅ FIX 1: ensure iterations is always number
    const iterations = args.iterations ?? 1;

    const runs = expandScenarios(args.scenarios, iterations);
    const runId = args.runId ?? resolveRunId();

    const suiteName =
        args.suiteName ??
        `${args.platform ?? "default"}-${args.application ?? "app"}`;

    const evidenceFactory = new EvidenceFactory({
        rootDir: process.env.EVIDENCE_ROOT_DIR ?? "artifacts",
        fileNaming: {
            includeTimestamp: true,
            timestampSource: "payload",
        },
        archive: {
            olderThanDays: 14,
            zip: true,
            maxCurrentExecutionsPerSuite: 30,
        },
    });

    console.log(
        renderExecutionHeader({
            mode: args.mode,
            environment: args.environment,
            iterations, // ✅ FIX 2
            parallel,
            schema: args.schema,
            source: args.source,
            sheet: args.sheet,
            totalCases: args.mode === "data" ? runs.length : undefined,
            totalScenarios: args.mode === "e2e" ? runs.length : undefined,
            platform: args.platform,
            application: args.application,
            product: args.product,

            // ✅ FIX 3: cast journeyContext
            journeyContext:
                args.journeyContext as { type: string } | undefined,
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
                    suiteName,
                    evidenceFactory,
                },
            })
    );

    outputs.forEach((item) => {
        console.log(item.block);
    });

    const { passed, failed } = countExecutionStatuses(outputs);

    const totalTime = formatDuration(startedAtMs);
    const finishedAt = new Date().toISOString();

    if (executionConfig.generatedEvidenceArtifacts.enabled) {
        const browserInfo = outputs.find((o) => o.browser)?.browser as
            | RuntimeBrowserInfo
            | undefined;

        const runtimeInfo = createRuntimeInfo({
            browser: browserInfo,
        });

        await evidenceFactory.finalizeExecution({
            executionId: runId,
            suiteName,
            metaPayload: {
                mode: args.mode,
                environment: args.environment,
                totalTime,
                startedAt,
                finishedAt,
                totalItems: runs.length,
                passedCount: passed,
                failedCount: failed,
                notExecutedCount: runs.length - (passed + failed),
                runtimeInfo,
            },
        });
    }

    console.log(
        renderExecutionSummary({
            total: runs.length,
            passed,
            failed,
            totalTime,
            runId,
            evidenceDir: `artifacts/current/${suiteName}/${runId}`,
        })
    );
}