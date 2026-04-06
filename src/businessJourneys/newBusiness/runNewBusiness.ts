// src/businessJourneys/newBusiness/runNewBusiness.ts

import { AppError } from "@utils/errors";
import type { BusinessJourneyExecutor } from "@businessJourneys/shared";

export const runNewBusiness: BusinessJourneyExecutor = async ({ context }) => {
    if (!context.page) {
        throw new AppError({
            code: "PAGE_MISSING",
            stage: "business-journey",
            source: "runNewBusiness",
            message: "Browser page is missing in execution context.",
        });
    }
};
