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
    const actualMeta = input.manifestEntry.pageMeta ?? {};

    if (input.manifestEntry.className !== expected.className) {
        mismatchItems.push(
            mismatchText(
                "className",
                input.manifestEntry.className,
                expected.className
            )
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

    if (actualMeta.elementCount !== expected.elementCount) {
        mismatchItems.push(
            mismatchText(
                "elementCount",
                actualMeta.elementCount,
                expected.elementCount
            )
        );
    }

    if ((actualMeta.urlPath ?? undefined) !== expected.urlPath) {
        mismatchItems.push(
            mismatchText("urlPath", actualMeta.urlPath, expected.urlPath)
        );
    }

    if ((actualMeta.title ?? undefined) !== expected.title) {
        mismatchItems.push(
            mismatchText("title", actualMeta.title, expected.title)
        );
    }

    return mismatchItems;
}
