// src/dataLayer/builder/core/transformValues/transformCasesFile.ts

import type { CasesFile } from "../../types";
import { transformNode } from "./transformNode";

export function transformCasesFile(casesFile: CasesFile): {
    casesFile: CasesFile;
    transformedCount: number;
} {
    let transformedCount = 0;

    const transformedCases = casesFile.cases.map((builtCase) => {
        transformedCount += 1;

        return {
            ...builtCase,
            data: transformNode(builtCase.data) as Record<string, any>,
        };
    });

    return {
        transformedCount,
        casesFile: {
            ...casesFile,
            cases: transformedCases,
            caseCount: Number(casesFile.caseCount),
        },
    };
}