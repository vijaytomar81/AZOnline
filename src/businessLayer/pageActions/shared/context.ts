// src/businessLayer/pageActions/shared/context.ts

import { AppError } from "@utils/errors";
import { PageManager } from "@businessLayer/pageObjects/pageManager";
import type { ExecutionContext } from "@frameworkCore/executionLayer/contracts";
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

export function createPageActionContext(args: {
    executionContext: ExecutionContext;
    source: string;
    logScope: string;
}): PageActionContext {
    const page = requirePage(args.executionContext, args.source);

    return {
        executionContext: args.executionContext,
        page,
        pages: new PageManager(page),
        logScope: args.logScope,
    };
}
