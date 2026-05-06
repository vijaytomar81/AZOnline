// src/businessLayer/businessJourneys/runtime/runBusinessJourney.ts

import type {
    ExecutionItemExecutor,
} from "@frameworkCore/executionLayer/core/registry";
import { createPageActionContext } from "@businessLayer/pageActions/shared";
import { buildJourneyContextFromExecutionItem } from "./buildJourneyContextFromExecutionItem";
import { resolveBusinessJourney } from "./resolveBusinessJourney";

export const runBusinessJourney: ExecutionItemExecutor = async ({
    context,
    item,
    itemData,
}) => {
    const journeyContext = buildJourneyContextFromExecutionItem(item);

    const journey = resolveBusinessJourney({
        platform: context.scenario.platform,
        application: context.scenario.application,
        product: context.scenario.product,
        journeyContext,
    });

    const pageActionContext = createPageActionContext({
        executionContext: context,
        source: "runBusinessJourney",
        logScope: [
            context.scenario.scenarioId,
            item.itemNo,
            item.action,
            item.subType ?? "",
        ]
            .filter(Boolean)
            .join(":"),
    });

    await journey({
        context: {
            executionContext: context,
            pageActionContext,
            logScope: [
                context.scenario.scenarioId,
                item.itemNo,
                item.action,
            ]
                .filter(Boolean)
                .join(":"),
        },
        payload: itemData ?? {},
    });
};
