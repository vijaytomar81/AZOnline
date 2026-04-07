// src/tools/pageObjects/validator/validate/rules/pageChain/pageObjectStructure/collectMissingPageObjectStructureItems.ts

import {
    hasAliasesImport,
    hasBasePageImport,
    hasClassDeclaration,
    hasClosingMarker,
    hasOpeningMarker,
    hasPageKeyConstant,
    hasPageMetaImport,
} from "./pageObjectStructureChecks";
import {
    hasClickAliasKeyHelper,
    hasFillAliasKeyHelper,
    hasSelectAliasKeyHelper,
    hasSetCheckedAliasKeyHelper,
} from "./pageObjectStructureHelpers";

type CollectMissingPageObjectStructureItemsArgs = {
    pageObjectTs: string;
    pageKey: string;
    className: string;
};

export function collectMissingPageObjectStructureItems(
    args: CollectMissingPageObjectStructureItemsArgs
): string[] {
    const missingItems: string[] = [];

    if (!hasOpeningMarker(args.pageObjectTs)) {
        missingItems.push("openingMarker");
    }

    if (!hasClosingMarker(args.pageObjectTs)) {
        missingItems.push("closingMarker");
    }

    if (!hasBasePageImport(args.pageObjectTs)) {
        missingItems.push("basePageImport");
    }

    if (!hasAliasesImport(args.pageObjectTs)) {
        missingItems.push("aliasesImport");
    }

    if (!hasPageMetaImport(args.pageObjectTs)) {
        missingItems.push("pageMetaImport");
    }

    if (!hasPageKeyConstant(args.pageObjectTs, args.pageKey)) {
        missingItems.push("pageKeyConstant");
    }

    if (!hasClassDeclaration(args.pageObjectTs, args.className)) {
        missingItems.push("classDeclaration");
    }

    if (!hasClickAliasKeyHelper(args.pageObjectTs)) {
        missingItems.push("clickAliasKeyHelper");
    }

    if (!hasFillAliasKeyHelper(args.pageObjectTs)) {
        missingItems.push("fillAliasKeyHelper");
    }

    if (!hasSelectAliasKeyHelper(args.pageObjectTs)) {
        missingItems.push("selectAliasKeyHelper");
    }

    if (!hasSetCheckedAliasKeyHelper(args.pageObjectTs)) {
        missingItems.push("setCheckedAliasKeyHelper");
    }

    return missingItems;
}
