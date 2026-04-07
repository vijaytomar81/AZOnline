// src/tools/businessJourneys/generator/generator/render/renderStepFile.ts

import { toRepoRelative } from "@utils/paths";
import type { StepMapping } from "../types";

export function renderStepFile(args: {
    filePath: string;
    mapping: StepMapping;
}): string {
    return `// ${toRepoRelative(args.filePath)}

import type { JourneyStep } from "@businessLayer/businessJourneys/shared/types";
import { ${args.mapping.actionImportName} } from "${args.mapping.actionImportSource}";

export const ${args.mapping.stepExportName}: JourneyStep = {
    stepKey: "${args.mapping.stepName}",
    run: async ({ context, data }) => {
        await ${args.mapping.actionImportName}({
            context: context.pageActionContext,
            payload: ${args.mapping.payloadExpression},
        });

        // TODO: refine payload source path if needed
        void data;
    },
};
`;
}
