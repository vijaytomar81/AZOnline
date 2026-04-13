// src/toolingLayer/businessJourneys/generator/generator/render/renderEntryPointBuilderFile.ts

import { JOURNEY_ENTRY_POINTS, type JourneyEntryPoint } from "@configLayer/domain/journeyEntryPoints";
import { toRepoRelative } from "@utils/paths";

export function renderEntryPointBuilderFile(args: {
    filePath: string;
    kind: JourneyEntryPoint;
}): string {
    const exportName =
        args.kind === JOURNEY_ENTRY_POINTS.DIRECT
            ? "buildDirectEntrySteps"
            : args.kind === JOURNEY_ENTRY_POINTS.PCW_TOOL
                ? "buildPcwToolEntrySteps"
                : "buildPcwEntrySteps";

    const todoLine =
        args.kind === JOURNEY_ENTRY_POINTS.DIRECT
            ? "// TODO: review direct-entry pre-navigation steps"
            : args.kind === JOURNEY_ENTRY_POINTS.PCW_TOOL
                ? "// TODO: review pcw-tool entry preparation steps"
                : "// TODO: review partner-entry steps before Athena handoff";

    return `// ${toRepoRelative(args.filePath)}

import type { JourneyStep } from "@businessLayer/businessJourneys/shared/types";
import { stepOpenStartUrl } from "../steps/common/stepOpenStartUrl";

export function ${exportName}(): JourneyStep[] {
    return [
        stepOpenStartUrl,
        ${todoLine}
    ];
}
`;
}