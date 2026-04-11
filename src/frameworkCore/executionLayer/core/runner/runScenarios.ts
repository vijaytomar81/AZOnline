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
import { buildEvidenceMetaPayload } from "@frameworkCore/executionLayer/reporting/buildEvidenceMetaPayload";
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
    const iterations = args.iterations ?? 1;
    const runs = expandScenarios(args.scenarios, iterations);
    const runId = args.runId ?? resolveRunId();

    const suiteName =
        args.suiteName ??
        `${args.platform ?? "default"}-${args.application ?? "app"}`;

    const rootDir = process.env.EVIDENCE_ROOT_DIR ?? "artifacts";
    const evidenceDir = `${rootDir}/current/${suiteName}/${runId}`;

    const evidenceFactory =
        args.evidenceFactory ??
        new EvidenceFactory({
            rootDir,
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
            iterations,
            parallel,
            schema: args.schema,
            source: args.source,
            sheet: args.sheet,
            totalCases: args.mode === "data" ? runs.length : undefined,
            totalScenarios: args.mode === "e2e" ? runs.length : undefined,
            platform: args.platform,
            application: args.application,
            product: args.product,
            journeyContext: args.journeyContext as { type: string } | undefined,
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
    const notExecutedCount = runs.length - (passed + failed);
    const errorCount = 0;
    const totalCount = runs.length;
    const passedCount = passed;
    const failedCount = failed;
    const passRate =
        totalCount > 0
            ? `${((passedCount / totalCount) * 100).toFixed(2)}%`
            : "0.00%";

    if (executionConfig.generatedEvidenceArtifacts.enabled) {
        const browserInfo = outputs.find((o) => o.browser)?.browser as
            | RuntimeBrowserInfo
            | undefined;

        const runtimeInfo = createRuntimeInfo({
            browser: browserInfo,
        });

        const runtimeSystem =
            runtimeInfo && typeof runtimeInfo === "object" && "system" in runtimeInfo
                ? (runtimeInfo.system as Record<string, unknown>)
                : {};
        const runtimeBrowser =
            runtimeInfo && typeof runtimeInfo === "object" && "browser" in runtimeInfo
                ? (runtimeInfo.browser as Record<string, unknown>)
                : {};

        const finalizedAt = finishedAt;
        const artifactTimestamp = finishedAt;

        const metaSource: Record<string, unknown> = {
            runId,
            mode: args.mode,
            environment: args.environment,

            startedAt,
            finishedAt,
            totalTime,

            totalItems: runs.length,
            passedItems: passedCount,
            failedItems: failedCount,
            notExecutedItems: notExecutedCount,

            totalCount,
            passedCount,
            failedCount,
            errorCount,
            notExecutedCount,

            passRate,
            executionTime: totalTime,

            machineName: runtimeSystem.machineName,
            user: runtimeSystem.user,
            platform: runtimeSystem.platform,
            osVersion: runtimeSystem.osVersion,

            browser: runtimeBrowser.name,
            browserChannel: runtimeBrowser.channel,
            browserVersion: runtimeBrowser.version,
            headless: runtimeBrowser.headless,

            cleanupWorkerArtifacts: false,
            finalizedAt,
            artifactTimestamp,

            outputRoot: rootDir,
            evidenceDir,
            evidenceDirectory: evidenceDir,

            workerArtifactCount: 0,
            mergedCaseCount: runs.length,
            corruptedArtifactCount: 0,
            duplicateCaseCount: 0,

            passedEvidencePath: "",
            failedEvidencePath: "",
            notExecutedEvidencePath: "",

            pageScansDir: "",
            promotedPageScanCount: 0,
        };

        await evidenceFactory.finalizeExecution({
            executionId: runId,
            suiteName,
            outputFormats: ["excel"],
            metaPayload: buildEvidenceMetaPayload({
                source: metaSource,
            }),
        });
    }

    console.log(
        renderExecutionSummary({
            total: runs.length,
            passed,
            failed,
            totalTime,
            runId,
            evidenceDir,
        })
    );
}