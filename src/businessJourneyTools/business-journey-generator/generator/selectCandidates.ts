// src/businessJourneyTools/business-journey-generator/generator/selectCandidates.ts

import type {
    JourneyGenerationInputs,
    PageActionEntry,
    JourneyTarget,
} from "./types";

function matchesProduct(actionKey: string, product: string): boolean {
    return (
        actionKey.includes(`.${product}.`) ||
        actionKey.includes(".common.")
    );
}

function matchesNamespace(actionKey: string, application: string): boolean {
    return (
        actionKey.startsWith(`${application}.`) ||
        actionKey.startsWith("athena.")
    );
}

export function selectCandidates(
    target: JourneyTarget,
    inputs: JourneyGenerationInputs
): PageActionEntry[] {
    return inputs.pageActions.filter((entry) => {
        return (
            matchesProduct(entry.actionKey, target.product) &&
            matchesNamespace(entry.actionKey, target.application)
        );
    });
}
