// src/toolingLayer/businessJourneys/generator/generator/selectCandidates.ts

import type {
    JourneyGenerationInputs,
    JourneyTarget,
    PageActionEntry,
} from "./types";

function normalize(value: string): string {
    return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function matchesDestinationScope(
    entry: PageActionEntry,
    target: JourneyTarget
): boolean {
    return (
        normalize(entry.scope.platform) ===
            normalize(target.destinationPlatform) &&
        normalize(entry.scope.application) ===
            normalize(target.destinationApplication)
    );
}

function isCandidateProduct(
    entry: PageActionEntry,
    target: JourneyTarget
): boolean {
    const product = normalize(entry.scope.product);

    return (
        product === "common" ||
        product === normalize(target.product)
    );
}

function rank(entry: PageActionEntry): number {
    return normalize(entry.scope.product) === "common" ? 0 : 1;
}

export function selectCandidates(
    target: JourneyTarget,
    inputs: JourneyGenerationInputs
): PageActionEntry[] {
    return inputs.pageActions
        .filter((entry) => matchesDestinationScope(entry, target))
        .filter((entry) => isCandidateProduct(entry, target))
        .sort((left, right) => {
            const rankDiff = rank(left) - rank(right);

            if (rankDiff !== 0) {
                return rankDiff;
            }

            return left.scope.name.localeCompare(right.scope.name);
        });
}
