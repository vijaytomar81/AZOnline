// src/frameworkCore/executionLayer/core/runner/runScenarios.ts

import { createRuntimeInfo } from "@utils/runtimeInfo";
import type { RuntimeBrowserInfo } from "@utils/runtimeInfo";
import { executionConfig } from "@configLayer/execution/execution.config";
import { evidenceConfig } from "@configLayer/execution/evidence.config";
import { EXECUTION_MODES } from "@configLayer/core/executionModes";
import { resolveRunId } from "@frameworkCore/executionLayer/runtime/resolveRunId";
import {
    formatDuration,
    renderExecutionHeader,
    renderExecutionSummary,
} from "@frameworkCore/executionLayer/logging";
import { buildEvidenceMetaPayload } from "@frameworkCore/executionLayer/reporting/buildEvidenceMetaPayload";
import {
    EVIDENCE_ENTRY_TYPE,
    EVIDENCE_OUTPUT_FORMAT,
    EVIDENCE_TIMESTAMP_SOURCE,
} from "@evidenceFactory/contracts/types";
import { countExecutionStatuses } from "./countExecutionStatuses";
import { expandScenarios } from "./expandScenarios";
import { runScenarioBatch } from "./runScenarioBatch";
import { runScenarioWorker } from "./runScenarioWorker";
import type { RunScenariosArgs } from "./types";
import { EvidenceFactory } from "@evidenceFactory";

function buildSuiteName(args: RunScenariosArgs): string {
    if (args.suiteName) {
        return args.suiteName;
    }

    return [args.platform, args.application, args.product]
        .filter(Boolean)
        .join("-");
}

export async function runScenarios(
    args: RunScenariosArgs
): Promise<void> {
    const startedAtMs = Date.now();
    const startedAt = new Date().toISOString();

    const parallel = Math.max(1, args.parallel ?? 1);
    const iterations = args.iterations ?? 1;
    const runs = expandScenarios(args.scenarios, iterations);
    const runId = args.runId ?? resolveRunId(args.environment, args.mode);
    const suiteName = buildSuiteName(args);

    const rootDir = process.env.EVIDENCE_CREATION_ROOT_DIR;

    const evidenceFactory =
        args.evidenceFactory ??
        new EvidenceFactory({
            ...(rootDir ? { rootDir } : {}),
            fileNaming: {
                includeTimestamp: evidenceConfig.fileNaming.includeTimestamp,
                timestampSource: EVIDENCE_TIMESTAMP_SOURCE.PAYLOAD,
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
            totalCases:
                args.mode === EXECUTION_MODES.DATA ? runs.length : undefined,
            totalScenarios:
                args.mode === EXECUTION_MODES.E2E ? runs.length : undefined,
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

    let evidenceDir: string | undefined;
    let archiveMessage: string | undefined;

    if (executionConfig.generatedEvidenceArtifacts.enabled) {
        const browserInfo = outputs.find((o) => o.browser)?.browser as
            | RuntimeBrowserInfo
            | undefined;

        const runtimeInfo = createRuntimeInfo({
            browser: browserInfo,
        });

        const runtimeSystem =
            runtimeInfo &&
                typeof runtimeInfo === "object" &&
                "system" in runtimeInfo
                ? (runtimeInfo.system as Record<string, unknown>)
                : {};

        const runtimeBrowser =
            runtimeInfo &&
                typeof runtimeInfo === "object" &&
                "browser" in runtimeInfo
                ? (runtimeInfo.browser as Record<string, unknown>)
                : {};

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

            finalizedAt: finishedAt,
            artifactTimestamp: finishedAt,

            mergedCaseCount: runs.length,
        };

        await evidenceFactory.writeEvidence({
            entryType: EVIDENCE_ENTRY_TYPE.SUMMARY,
            executionId: runId,
            suiteName,
            workerId: args.workerId,
            outputFormats: [EVIDENCE_OUTPUT_FORMAT.EXCEL],
            metaPayload: buildEvidenceMetaPayload({
                source: metaSource,
            }),
        });

        const finalResult = await evidenceFactory.finalizeExecution({
            executionId: runId,
            suiteName,
        });

        const archiveResult = await evidenceFactory.archiveOldExecutions();

        evidenceDir = finalResult.executionRootRelativePath;
        archiveMessage = archiveResult.message;
    }

    console.log(
        renderExecutionSummary({
            total: runs.length,
            passed,
            failed,
            totalTime,
            runId,
            evidenceDir,
            archiveMessage,
        })
    );
}