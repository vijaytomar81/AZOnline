// src/executionLayer/runtime/itemData/resolve/findExecutionItemCase.ts

import type { CasesFile } from "@dataLayer/builder/types";

export function findExecutionItemCase(args: {
    casesFile: CasesFile;
    testCaseRef: string;
}) {
    return args.casesFile.cases.find(
        (item) =>
            item.scriptId === args.testCaseRef ||
            item.scriptName === args.testCaseRef
    );
}
