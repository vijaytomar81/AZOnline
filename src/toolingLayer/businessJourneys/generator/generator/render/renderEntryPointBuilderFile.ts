// src/toolingLayer/businessJourneys/generator/generator/render/renderEntryPointBuilderFile.ts

import { toRepoRelative } from "@utils/paths";

export function renderEntryPointBuilderFile(args: {
    filePath: string;
    kind: "direct" | "pcw" | "pcwTool";
}): string {
    const exportName =
        args.kind === "direct"
            ? "buildDirectEntrySteps"
            : args.kind === "pcwTool"
              ? "buildPcwToolEntrySteps"
              : "buildPcwEntrySteps";

    const todoLine =
        args.kind === "direct"
            ? "// TODO: review direct-entry pre-navigation steps"
            : args.kind === "pcwTool"
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
