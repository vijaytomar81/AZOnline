// src/businessLayer/businessJourneys/runtime/runNewBusiness.ts

import { createPageActionContext } from "@businessLayer/pageActions";
import type { ExecutionItemExecutor } from "@frameworkCore/executionLayer/core/registry";
import { resolveNewBusinessJourney } from "./resolveNewBusinessJourney";

export const runNewBusiness: ExecutionItemExecutor = async ({
    context,
    item,
    itemData,
}) => {
    const journey = resolveNewBusinessJourney(context.scenario);

    const logScope = [
        "businessJourney",
        context.scenario.platform,
        context.scenario.application,
        context.scenario.product,
        item.action,
    ].join(":");

    const pageActionContext = createPageActionContext({
        executionContext: context,
        source: "runNewBusiness",
        logScope,
    });

    await journey({
        context: {
            pageActionContext,
            logScope,
        },
        payload: itemData,
    });
};
