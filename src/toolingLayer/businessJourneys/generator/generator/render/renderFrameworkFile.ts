// src/toolingLayer/businessJourneys/generator/generator/render/renderFrameworkFile.ts

import { toRepoRelative } from "@utils/paths";

export function renderFrameworkFile(args: {
    filePath: string;
    kind: "types" | "runJourney" | "index" | "rootIndex";
}): string {
    const header = `// ${toRepoRelative(args.filePath)}\n\n`;

    if (args.kind === "types") {
        return `${header}import type { PageActionContext } from "@businessLayer/pageActions";

export type BusinessJourneyContext = {
    pageActionContext: PageActionContext;
    logScope: string;
};

export type BusinessJourneyArgs<TPayload = Record<string, unknown>> = {
    context: BusinessJourneyContext;
    payload?: TPayload;
};

export type BusinessJourney<TPayload = Record<string, unknown>> = (
    args: BusinessJourneyArgs<TPayload>
) => Promise<void>;
`;
    }

    if (args.kind === "runJourney") {
        return `${header}export async function runJourney(args: {
    steps: Array<() => Promise<void>>;
}): Promise<void> {
    for (const step of args.steps) {
        await step();
    }
}
`;
    }

    if (args.kind === "index") {
        return `${header}export * from "./types";
export * from "./runJourney";
`;
    }

    return `${header}export * from "./framework";
`;
}
