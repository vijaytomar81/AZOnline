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
    processed: boolean;
    validPageKey?: string;
    pageReport?: RepairPageReport;
    invalidPage?: InvalidPageReport;
    errorPage?: GenerationErrorReport;
};

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
            changedOnly: args.opts.changedOnly,
        });

        if (context.invalidPage) {
            return {
                processed: false,
                invalidPage: context.invalidPage,
            };
        }

        if (!context.artifact || !context.scope) {
            return {
                processed: false,
                errorPage: {
                    pageKey,
                    reason: `Missing page generation context for "${pageKey}"`,
                },
            };
        }

        buildRegistryEntry(pageKey, args.opts.pageObjectsDir);

        const report: RepairPageReport = {
            pageKey,
            changed: false,
            elementsStatus: "unchanged",
            aliasesGeneratedStatus: "unchanged",
            pageObjectStatus: "unchanged",
            registryStatus: "already-registered",
            scope: {
                platform: context.scope.platform,
                application: context.scope.application,
                product: context.scope.product,
                name: context.scope.name,
            },
        };

        if (context.shouldSkip) {
            return {
                processed: false,
                validPageKey: pageKey,
                pageReport: report,
            };
        }

        if (context.shouldScaffold) {
            ensureScaffoldFiles({
                pagesDir: args.opts.pageObjectsDir,
                pageMap: context.pageMap,
                verbose: args.opts.verbose,
                log: args.opts.log,
            });
            report.pageObjectStatus = "generated";
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

        syncAliasesHumanFile({
            aliasesHumanPath: context.artifact.aliasesHumanPath,
            renameMap: generatedRes.renameMap,
            newGeneratedKeys: generatedRes.addedKeys,
            log: args.opts.log,
        });

        syncAliasesIntoPageObject({
            pageTsPath: context.artifact.pageObjectPath,
            elementsTsPath: context.artifact.elementsPath,
            aliasesTsPath: context.artifact.aliasesHumanPath,
        });

        const manifestEntryResult = args.buildPageManifestEntry({
            pageMap: context.pageMap,
            artifact: context.artifact,
            pageMapFilePath: args.absPath,
            mapHash: context.hash,
        });

        if (!manifestEntryResult.ok) {
            return {
                processed: false,
                validPageKey: pageKey,
                invalidPage: {
                    pageKey: manifestEntryResult.pageKey,
                    reason: manifestEntryResult.reason,
                },
            };
        }

        const manifestChanged = args.savePageManifestEntry(
            args.pageKeyToManifestFile(args.manifestRoot, pageKey),
            manifestEntryResult.entry
        );

        report.elementsStatus = elementsRes.changed ? "generated" : "unchanged";
        report.aliasesGeneratedStatus = generatedRes.changed ? "generated" : "unchanged";
        report.changed =
            report.pageObjectStatus === "generated" ||
            report.elementsStatus === "generated" ||
            report.aliasesGeneratedStatus === "generated" ||
            manifestChanged;

        return {
            processed: true,
            validPageKey: pageKey,
            pageReport: report,
        };
    } catch (error) {
        return {
            processed: false,
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
