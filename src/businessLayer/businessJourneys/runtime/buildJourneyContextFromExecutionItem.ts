// src/businessLayer/businessJourneys/runtime/buildJourneyContextFromExecutionItem.ts

import { AppError } from "@utils/errors";
import type { ExecutionItem } from "@frameworkCore/executionLayer/contracts";
import {
    JOURNEY_TYPES,
    MTA_TYPES,
    type JourneyContext,
    type MtaType,
} from "@configLayer/models/journeyContext.config";

function isMtaType(value: string): value is MtaType {
    return Object.values(MTA_TYPES).includes(value as MtaType);
}

export function buildJourneyContextFromExecutionItem(
    item: ExecutionItem
): JourneyContext {
    if (item.action === JOURNEY_TYPES.NEW_BUSINESS) {
        return {
            type: JOURNEY_TYPES.NEW_BUSINESS,
        };
    }

    if (item.action === JOURNEY_TYPES.RENEWAL) {
        return {
            type: JOURNEY_TYPES.RENEWAL,
        };
    }

    if (item.action === JOURNEY_TYPES.MTC) {
        return {
            type: JOURNEY_TYPES.MTC,
        };
    }

    if (item.action === JOURNEY_TYPES.MTA) {
        if (!item.subType || !isMtaType(item.subType)) {
            throw new AppError({
                code: "INVALID_MTA_SUBTYPE",
                stage: "business-journey",
                source: "buildJourneyContextFromExecutionItem",
                message:
                    `Invalid MTA SubType "${item.subType ?? ""}". ` +
                    `Allowed: ${Object.values(MTA_TYPES).join(", ")}.`,
                context: {
                    itemNo: item.itemNo,
                    action: item.action,
                    subType: item.subType ?? "",
                },
            });
        }

        return {
            type: JOURNEY_TYPES.MTA,
            subType: item.subType,
        };
    }

    throw new AppError({
        code: "INVALID_JOURNEY_ACTION",
        stage: "business-journey",
        source: "buildJourneyContextFromExecutionItem",
        message: `Unsupported execution item action "${item.action}".`,
        context: {
            itemNo: item.itemNo,
            action: item.action,
        },
    });
}
