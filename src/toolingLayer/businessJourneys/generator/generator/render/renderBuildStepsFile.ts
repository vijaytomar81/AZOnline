// src/tools/businessJourneys/generator/generator/render/renderBuildStepsFile.ts

import { toRepoRelative } from "@utils/paths";
import type { JourneyTarget } from "../types";
import type { JourneyNames } from "../naming/buildJourneyNames";

export function renderBuildStepsFile(args: {
    filePath: string;
    target: JourneyTarget;
    names: JourneyNames;
}): string {
    const entryBuilder =
        args.target.entryPoint === "direct"
            ? "buildDirectEntrySteps"
            : args.target.entryPoint === "pcwTool"
              ? "buildPcwToolEntrySteps"
              : "buildPcwEntrySteps";

    const entryImport =
        args.target.entryPoint === "direct"
            ? "./entryPoints/buildDirectEntrySteps"
            : args.target.entryPoint === "pcwTool"
              ? "./entryPoints/buildPcwToolEntrySteps"
              : "./entryPoints/buildPcwEntrySteps";

    return `// ${toRepoRelative(args.filePath)}

import type { JourneyStep } from "@businessLayer/businessJourneys/shared/types";
import { ${entryBuilder} } from "${entryImport}";

export function ${args.names.buildStepsExportName}(args: {
    entryPoint: string;
}): JourneyStep[] {
    const entrySteps = ${entryBuilder}();

    return [
        ...entrySteps,
        // TODO: add shared/common downstream steps
        // TODO: review athena continuation steps
        // TODO: review partner-specific navigation steps
    ];
}
`;
}
