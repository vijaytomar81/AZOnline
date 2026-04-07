// src/businessJourneyTools/business-journey-generator/generator/write/writeTargetFiles.ts

import path from "node:path";
import { BUSINESS_JOURNEYS_DIR } from "@utils/paths";
import type {
    JourneyGenerationInputs,
    JourneyTarget,
} from "../types";
import { buildJourneyNames } from "../naming/buildJourneyNames";
import { selectCandidates } from "../selectCandidates";
import { mapActionToStep } from "../mapActionToStep";
import { renderBuildStepsFile } from "../render/renderBuildStepsFile";
import { renderEntryPointBuilderFile } from "../render/renderEntryPointBuilderFile";
import { renderIndexFile } from "../render/renderIndexFile";
import { renderOpenStartUrlStepFile } from "../render/renderOpenStartUrlStepFile";
import { renderRunJourneyFile } from "../render/renderRunJourneyFile";
import { renderStepFile } from "../render/renderStepFile";
import { writeFileIfMissing } from "./writeFileIfMissing";

function resolveEntryPointFileName(entryPoint: string): string {
    if (entryPoint === "direct") {
        return "buildDirectEntrySteps.ts";
    }

    if (entryPoint === "pcwTool") {
        return "buildPcwToolEntrySteps.ts";
    }

    return "buildPcwEntrySteps.ts";
}

function resolveEntryPointKind(
    entryPoint: string
): "direct" | "pcw" | "pcwTool" {
    if (entryPoint === "direct") {
        return "direct";
    }

    if (entryPoint === "pcwTool") {
        return "pcwTool";
    }

    return "pcw";
}

export function writeTargetFiles(
    target: JourneyTarget,
    inputs: JourneyGenerationInputs
): { filesCreated: number } {
    const names = buildJourneyNames(target);
    const candidates = selectCandidates(target, inputs);
    const mappings = candidates.map(mapActionToStep);

    const baseDir = path.join(
        BUSINESS_JOURNEYS_DIR,
        "journeys",
        names.applicationFolderName,
        names.productFolderName,
        names.journeyFolderName
    );

    let filesCreated = 0;

    const runFile = path.join(baseDir, names.runFileName);
    const buildStepsFile = path.join(baseDir, names.buildStepsFileName);
    const journeyIndexFile = path.join(baseDir, "index.ts");
    const entryPointFileName = resolveEntryPointFileName(target.entryPoint);
    const entryPointFile = path.join(baseDir, "entryPoints", entryPointFileName);
    const entryPointIndexFile = path.join(baseDir, "entryPoints", "index.ts");
    const commonStepFile = path.join(baseDir, "steps", "common", "stepOpenStartUrl.ts");
    const commonIndexFile = path.join(baseDir, "steps", "common", "index.ts");
    const stepsIndexFile = path.join(baseDir, "steps", "index.ts");

    if (writeFileIfMissing(runFile, renderRunJourneyFile({ filePath: runFile, target, names }))) filesCreated++;
    if (writeFileIfMissing(buildStepsFile, renderBuildStepsFile({ filePath: buildStepsFile, target, names }))) filesCreated++;

    if (
        writeFileIfMissing(
            entryPointFile,
            renderEntryPointBuilderFile({
                filePath: entryPointFile,
                kind: resolveEntryPointKind(target.entryPoint),
            })
        )
    ) filesCreated++;

    if (writeFileIfMissing(commonStepFile, renderOpenStartUrlStepFile(commonStepFile))) filesCreated++;

    for (const mapping of mappings) {
        const stepFile = path.join(baseDir, "steps", mapping.stepFolder, mapping.stepFileName);
        if (writeFileIfMissing(stepFile, renderStepFile({ filePath: stepFile, mapping }))) {
            filesCreated++;
        }
    }

    const stepExports = mappings.map((mapping) => ({
        exportName: mapping.stepExportName,
        from: `${mapping.stepFolder}/${mapping.stepFileName.replace(".ts", "")}`,
    }));

    if (writeFileIfMissing(stepsIndexFile, renderIndexFile({ filePath: stepsIndexFile, exports: stepExports }))) filesCreated++;

    if (
        writeFileIfMissing(
            commonIndexFile,
            renderIndexFile({
                filePath: commonIndexFile,
                exports: [{ exportName: "stepOpenStartUrl", from: "stepOpenStartUrl" }],
            })
        )
    ) filesCreated++;

    if (
        writeFileIfMissing(
            entryPointIndexFile,
            renderIndexFile({
                filePath: entryPointIndexFile,
                exports: [{ from: entryPointFileName.replace(".ts", "") }],
            })
        )
    ) filesCreated++;

    if (
        writeFileIfMissing(
            journeyIndexFile,
            renderIndexFile({
                filePath: journeyIndexFile,
                exports: [{ exportName: names.runExportName, from: names.runFileName.replace(".ts", "") }],
            })
        )
    ) filesCreated++;

    return { filesCreated };
}
