// src/execution/runtime/stepData/resolve/findStepCase.ts

import type { CasesFile } from "@data/builder/types";

export function findStepCase(args: {
    casesFile: CasesFile;
    testCaseId: string;
}) {
    return args.casesFile.cases.find(
        (item) =>
            item.scriptId === args.testCaseId ||
            item.scriptName === args.testCaseId
    );
}
