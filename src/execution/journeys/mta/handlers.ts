// src/execution/journeys/mta/handlers.ts

import { AppError } from "../../../utils/errors";
import type { MtaHandler } from "./types";

const notImplemented: MtaHandler = async ({ step }) => {
    throw new AppError({
        code: "MTA_HANDLER_NOT_IMPLEMENTED",
        stage: "execution-handler",
        source: "mta-handlers",
        message: `MTA executor not implemented for subType="${step.subType ?? ""}".`,
        context: {
            subType: step.subType ?? "",
        },
    });
};

export const mtaHandlers: Record<string, MtaHandler> = {};
export const getMtaHandler = (): MtaHandler => notImplemented;