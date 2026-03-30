// src/pageActions/shared/context.ts

import { AppError } from "@utils/errors";
import type { ExecutionContext } from "@executionLayer/contracts";
import type { PageActionContext } from "./types";

export function requirePage(
    executionContext: ExecutionContext,
    source: string
): NonNullable<ExecutionContext["page"]> {
    if (executionContext.page) {
        return executionContext.page;
    }

    throw new AppError({
        code: "PAGE_ACTION_PAGE_MISSING",
        stage: "page-action",
        source,
        message: "Playwright page is not available in execution context.",
    });
}

export function createPageActionContext(
    executionContext: ExecutionContext,
    source: string
): PageActionContext {
    return {
        executionContext,
        page: requirePage(executionContext, source),
    };
}
