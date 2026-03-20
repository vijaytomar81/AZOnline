// src/execution/journeys/mta/handlers.ts

import type { MtaHandler } from "./types";

const notImplemented: MtaHandler = async ({ step }) => {
    throw new Error(
        `MTA executor not implemented for subType="${step.subType ?? ""}".`
    );
};

export const mtaHandlers: Record<string, MtaHandler> = {};
export const getMtaHandler = (): MtaHandler => notImplemented;