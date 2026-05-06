// src/frameworkCore/executionLayer/mode/e2e/scenario/validate/validateExecutionItem.ts

import type { ExecutionItem } from "@frameworkCore/executionLayer/contracts";
import {
    JOURNEY_TYPES,
    MTA_TYPES,
} from "@configLayer/models/journeyContext.config";
import { validateExecutionItemPortal } from "./validateExecutionItemPortal";

function allowedJourneyTypes(): string[] {
    return Object.values(JOURNEY_TYPES);
}

function allowedMtaTypes(): string[] {
    return Object.values(MTA_TYPES);
}

function isAllowedJourneyType(value: string): boolean {
    return allowedJourneyTypes().includes(value);
}

function isAllowedMtaType(value: string): boolean {
    return allowedMtaTypes().includes(value);
}

function validateAction(item: ExecutionItem): string[] {
    if (!item.action) {
        return [`Item${item.itemNo}: Missing Action`];
    }

    if (!isAllowedJourneyType(item.action)) {
        return [
            `Item${item.itemNo}: Invalid Action "${item.action}".`,
        ];
    }

    return [];
}

function validateMtaSubType(item: ExecutionItem): string[] {
    if (item.action !== JOURNEY_TYPES.MTA) {
        return [];
    }

    if (!item.subType) {
        return [
            `Item${item.itemNo}: Missing SubType for Action ${JOURNEY_TYPES.MTA}.`,
        ];
    }

    if (!isAllowedMtaType(item.subType)) {
        return [
            `Item${item.itemNo}: Invalid SubType "${item.subType}" for Action ${JOURNEY_TYPES.MTA}.`,
        ];
    }

    return [];
}

export function validateExecutionItem(
    item: ExecutionItem
): string[] {
    const errors: string[] = [];

    errors.push(...validateAction(item));

    if (!item.testCaseRef) {
        errors.push(`Item${item.itemNo}: Missing TestCaseRef`);
    }

    errors.push(...validateExecutionItemPortal(item));
    errors.push(...validateMtaSubType(item));

    return errors;
}

export function getExecutionItemValidationHelp(): string[] {
    return [
        `Allowed Action values: ${allowedJourneyTypes().join(", ")}`,
        `Allowed MTA SubType values: ${allowedMtaTypes().join(", ")}`,
        `SubType is required only when Action is ${JOURNEY_TYPES.MTA}.`,
        `SubType is ignored for ${JOURNEY_TYPES.NEW_BUSINESS}, ${JOURNEY_TYPES.RENEWAL}, and ${JOURNEY_TYPES.MTC}.`,
    ];
}
