// src/toolingLayer/pageObjects/generator/generator/processPageGeneration.ts

import type { GenOptions } from "./types";
import { buildRegistryEntry } from "./changeDetection";
import { buildPageGenerationContext } from "./pageGenerationContext";
import { loadPageManifestEntry } from "./pageManifest";
import { ensureScaffoldFiles } from "./scaffold";
import { syncAliasesGeneratedFile } from "./syncAliasesGenerated";
import { syncAliasesHumanFile } from "./syncAliasesHuman";
import { syncAliasesIntoPageObject } from "./pageObject";
import { syncElementsTs } from "./syncElementsTs";
import type {
    GenerationErrorReport,
    InvalidPageReport,
    RepairPageReport,
} from "./report";

type ProcessPageGenerationArgs = {
    file: string;
    raw: string;
    absPath: string;
    pageMap: import("./types").PageMap;
    opts: GenOptions;
    manifestRoot: string;
    pageKeyToManifestFile: (manifestRoot: string, pageKey: string) => string;
    buildPageManifestEntry: typeof import("./pageManifest").buildPageManifestEntry;
    savePageManifestEntry: typeof import("./pageManifest").savePageManifestEntry;
};

export type ProcessPageGenerationResult = {
    validPageKey?: string;
    pageReport?: RepairPageReport;
    invalidPage?: InvalidPageReport;
    errorPage?: GenerationErrorReport;
};

function resolveOperation(args: {
    shouldScaffold: boolean;
    elementsStatus: RepairPageReport["elementsStatus"];
    aliasesGeneratedStatus: RepairPageReport["aliasesGeneratedStatus"];
    aliasesHumanStatus: RepairPageReport["aliasesHumanStatus"];
    pageObjectStatus: RepairPageReport["pageObjectStatus"];
}): RepairPageReport["operation"] {
    if (args.shouldScaffold) {
        return "created";
    }

    const hasVisibleChange =
        args.elementsStatus === "generated" ||
        args.aliasesGeneratedStatus === "generated" ||
        args.aliasesHumanStatus === "generated" ||
        args.pageObjectStatus === "generated";

    return hasVisibleChange ? "updated" : "unchanged";
}

export function processPageGeneration(
    args: ProcessPageGenerationArgs
): ProcessPageGenerationResult {
    const pageKey = args.pageMap.pageKey;

    try {
        const oldEntry = loadPageManifestEntry(
            args.pageKeyToManifestFile(args.manifestRoot, pageKey)
        );

        const context = buildPageGenerationContext({
            file: args.file,
            raw: args.raw,
            pageMap: args.pageMap,
            pageObjectsDir: args.opts.pageObjectsDir,
            oldHash: oldEntry?.source?.mapHash,
        });

        if (context.invalidPage) {
            return {
                invalidPage: context.invalidPage,
            };
        }

        if (!context.artifact || !context.scope) {
            return {
                errorPage: {
                    pageKey,
                    reason: `Missing page generation context for "${pageKey}"`,
                },
            };
        }

        buildRegistryEntry(pageKey, args.opts.pageObjectsDir);

        if (context.shouldSkip) {
            return {
                validPageKey: pageKey,
                pageReport: {
                    pageKey,
                    operation: "unchanged",
                    elementsStatus: "unchanged",
                    aliasesGeneratedStatus: "unchanged",
                    aliasesHumanStatus: "unchanged",
                    pageObjectStatus: "unchanged",
                    registryStatus: "already-registered",
                    scope: {
                        platform: context.scope.platform,
                        application: context.scope.application,
                        product: context.scope.product,
                        name: context.scope.name,
                    },
                },
            };
        }

        let aliasesGeneratedStatus: RepairPageReport["aliasesGeneratedStatus"] =
            "unchanged";
        let aliasesHumanStatus: RepairPageReport["aliasesHumanStatus"] =
            "unchanged";
        let pageObjectStatus: RepairPageReport["pageObjectStatus"] = "unchanged";

        const scaffold = context.shouldScaffold
            ? ensureScaffoldFiles({
                  pagesDir: args.opts.pageObjectsDir,
                  pageMap: context.pageMap,
                  verbose: args.opts.verbose,
                  log: args.opts.log,
              })
            : {
                  aliasesHumanCreated: false,
                  aliasesGeneratedCreated: false,
                  pageObjectCreated: false,
              };

        if (scaffold.aliasesGeneratedCreated) {
            aliasesGeneratedStatus = "generated";
        }

        if (scaffold.aliasesHumanCreated) {
            aliasesHumanStatus = "generated";
        }

        if (scaffold.pageObjectCreated) {
            pageObjectStatus = "generated";
        }

        const elementsRes = syncElementsTs(
            context.artifact.elementsPath,
            context.pageMap
        );

        const generatedRes = syncAliasesGeneratedFile(
            context.artifact.aliasesGeneratedPath,
            context.pageMap,
            elementsRes.renameMap,
            elementsRes.addedKeys
        );

        if (generatedRes.changed) {
            aliasesGeneratedStatus = "generated";
        }

        const aliasesHumanRes = syncAliasesHumanFile({
            aliasesHumanPath: context.artifact.aliasesHumanPath,
            renameMap: generatedRes.renameMap,
            newGeneratedKeys: generatedRes.addedKeys,
            log: args.opts.log,
        });

        if (aliasesHumanRes.changed) {
            aliasesHumanStatus = "generated";
        }

        const pageObjectChanged = syncAliasesIntoPageObject({
            pageTsPath: context.artifact.pageObjectPath,
            elementsTsPath: context.artifact.elementsPath,
            aliasesTsPath: context.artifact.aliasesHumanPath,
        });

        if (pageObjectChanged) {
            pageObjectStatus = "generated";
        }

        const manifestEntryResult = args.buildPageManifestEntry({
            pageMap: context.pageMap,
            artifact: context.artifact,
            pageMapFilePath: args.absPath,
            mapHash: context.hash,
        });

        if (!manifestEntryResult.ok) {
            return {
                validPageKey: pageKey,
                invalidPage: {
                    pageKey: manifestEntryResult.pageKey,
                    reason: manifestEntryResult.reason,
                },
            };
        }

        args.savePageManifestEntry(
            args.pageKeyToManifestFile(args.manifestRoot, pageKey),
            manifestEntryResult.entry
        );

        const elementsStatus = elementsRes.changed ? "generated" : "unchanged";

        return {
            validPageKey: pageKey,
            pageReport: {
                pageKey,
                operation: resolveOperation({
                    shouldScaffold: context.shouldScaffold,
                    elementsStatus,
                    aliasesGeneratedStatus,
                    aliasesHumanStatus,
                    pageObjectStatus,
                }),
                elementsStatus,
                aliasesGeneratedStatus,
                aliasesHumanStatus,
                pageObjectStatus,
                registryStatus: "already-registered",
                scope: {
                    platform: context.scope.platform,
                    application: context.scope.application,
                    product: context.scope.product,
                    name: context.scope.name,
                },
            },
        };
    } catch (error) {
        return {
            errorPage: {
                pageKey,
                reason:
                    error instanceof Error
                        ? error.message
                        : "Unknown generation failure",
            },
        };
    }
}
