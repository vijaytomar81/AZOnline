// src/businessJourneys/newBusiness/index.ts

import type { ExecutionItemExecutorArgs } from "@frameworkCore/executionLayer/core/registry";

export async function runNewBusiness(
    _args: ExecutionItemExecutorArgs
): Promise<void> {
    throw new Error(
        [
            "runNewBusiness is not yet wired to generated business journeys.",
            "",
            "Next step:",
            "Complete business journey generator output and route execution here.",
        ].join("\n")
    );
}
