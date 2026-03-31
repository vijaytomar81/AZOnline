// src/dataLayer/builder/core/buildCases/shared/createBuiltCase.ts

import type { BuiltCase } from "../../../types";
import { getCaseDescription } from "./getCaseDescription";

export function createBuiltCase(args: {
    caseIndex: number;
    scriptName: string;
    scriptId?: string;
    data: Record<string, any>;
}): BuiltCase {
    return {
        caseIndex: args.caseIndex,
        scriptName: args.scriptName,
        scriptId: args.scriptId,
        description: getCaseDescription(args.data),
        data: args.data,
    };
}