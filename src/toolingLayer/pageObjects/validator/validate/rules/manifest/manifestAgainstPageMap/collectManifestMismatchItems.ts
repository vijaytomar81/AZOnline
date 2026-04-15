// src/toolingLayer/pageObjects/validator/validate/rules/manifest/manifestAgainstPageMap/collectManifestMismatchItems.ts

import { buildManifestExpectedValues } from "./buildManifestExpectedValues";
import { mismatchText } from "./manifestAgainstPageMapFormatters";
import type { ManifestComparisonInputs } from "./manifestAgainstPageMapTypes";

export function collectManifestMismatchItems(
    input: ManifestComparisonInputs
): string[] {
    if (!input.manifestEntry) {
        return [];
    }

    const expected = buildManifestExpectedValues(
        input.pageObjectsDir,
        input.pageMapItem
    );
    const mismatchItems: string[] = [];

    if (input.manifestEntry.className !== expected.className) {
        mismatchItems.push(
            mismatchText("className", input.manifestEntry.className, expected.className)
        );
    }

    if (input.manifestEntry.paths.pageObjectImport !== expected.pageObjectImport) {
        mismatchItems.push(
            mismatchText(
                "paths.pageObjectImport",
                input.manifestEntry.paths.pageObjectImport,
                expected.pageObjectImport
            )
        );
    }

    if (input.manifestEntry.elementCount !== expected.elementCount) {
        mismatchItems.push(
            mismatchText("elementCount", input.manifestEntry.elementCount, expected.elementCount)
        );
    }

    if ((input.manifestEntry.urlPath ?? undefined) !== expected.urlPath) {
        mismatchItems.push(
            mismatchText("urlPath", input.manifestEntry.urlPath, expected.urlPath)
        );
    }

    if ((input.manifestEntry.title ?? undefined) !== expected.title) {
        mismatchItems.push(
            mismatchText("title", input.manifestEntry.title, expected.title)
        );
    }

    return mismatchItems;
}
