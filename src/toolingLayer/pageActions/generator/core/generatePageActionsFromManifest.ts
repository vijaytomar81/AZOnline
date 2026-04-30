// src/toolingLayer/pageActions/generator/core/generatePageActionsFromManifest.ts

import fs from "node:fs";
import path from "node:path";
import {
    info,
    printSection,
    printStatus,
    success,
    failure,
} from "@utils/cliFormat";
import { ICONS } from "@utils/icons";
import {
    PAGE_ACTIONS_MANIFEST_DIR,
    PAGE_ACTIONS_MANIFEST_INDEX_FILE,
    toRepoRelative,
} from "@utils/paths";
import type { PageActionManifestIndex } from "../manifest/types";
import type {
    ActionRegistryEntry,
    ActionRuntimeRegistryEntry,
    GenerateSummary,
    PageActionOperation,
} from "../shared/types";
import { buildActionName } from "./action/buildActionName";
import { buildActionPath } from "./action/buildActionPath";
import { classifyPageObjectMethods } from "./action/classifyPageObjectMethods";
import { extractPageObjectMethods } from "./action/extractPageObjectMethods";
import { readPageObjectFile } from "./action/readPageObjectFile";
import { renderPageActionFile } from "./action/renderPageActionFile";
import {
    buildExpectedManifestEntry,
    loadPageActionManifestIndex,
    loadPageObjectManifestIndex,
    loadPageObjectManifestPage,
} from "@toolingLayer/pageActions/common";
import { writePageActionManifestEntry } from "./manifestSync/writePageActionManifestEntry";
import { writePageActionManifestIndex } from "./manifestSync/writePageActionManifestIndex";
import { ensurePageActionMetadataExports } from "./registry/ensurePageActionIndexes";
import { ensurePageActionRegistry } from "./runtimeRegistry/ensurePageActionRegistry";

function readTextIfExists(filePath: string): string | null {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

function printPageResult(
    pageKey: string,
    operation: PageActionOperation,
    verbose: boolean,
    details?: string[]
): void {
    const icon =
        operation === "failed"
            ? ICONS.failIcon
            : operation === "unchanged"
              ? ICONS.hintIcon
              : ICONS.successIcon;

    const text =
        operation === "failed"
            ? failure(pageKey)
            : operation === "unchanged"
              ? info(pageKey)
              : success(pageKey);

    const summary =
        operation === "failed"
            ? failure("(failed)")
            : operation === "unchanged"
              ? info("(unchanged)")
              : success(`(${operation})`);

    printStatus(icon, `${text} ${summary}`);

    if (!verbose || !details || details.length === 0) {
        return;
    }

    for (const detail of details) {
        console.log(`   → ${detail}`);
    }
}

export function generatePageActionsFromManifest(args: {
    verbose?: boolean;
} = {}): GenerateSummary {
    const verbose = !!args.verbose;
    const pageObjectIndex = loadPageObjectManifestIndex();
    const pageActionIndex = loadPageActionManifestIndex();
    const nextIndex: PageActionManifestIndex = {
        version: 1,
        generatedAt: pageActionIndex.generatedAt,
        actions: {},
    };

    const metadataExportEntries: ActionRegistryEntry[] = [];
    const runtimeRegistryEntries: ActionRuntimeRegistryEntry[] = [];
    const pageKeys = Object.keys(pageObjectIndex.pages).sort();
    let created = 0;
    let updated = 0;
    let unchanged = 0;
    let failed = 0;
    let invalidPages = 0;

    printSection("Generation details");

    for (const pageKey of pageKeys) {
        try {
            const page = loadPageObjectManifestPage(
                pageObjectIndex.pages[pageKey]
            );
            const naming = buildActionName(page);
            const paths = buildActionPath({ page, naming });
            const source = readPageObjectFile(page.paths.pageObjectFile);
            const methods = extractPageObjectMethods(source);
            const classified = classifyPageObjectMethods(methods);
            const content = renderPageActionFile({
                page,
                naming,
                classified,
                actionFilePath: paths.actionFile,
            });

            const entry = buildExpectedManifestEntry({
                page,
                naming,
                paths,
            });

            const manifestRelativePath = path
                .relative(PAGE_ACTIONS_MANIFEST_DIR, paths.manifestEntryFile)
                .replace(/\\/g, "/");

            const actionBefore = readTextIfExists(paths.actionFile);
            const manifestBefore = readTextIfExists(paths.manifestEntryFile);
            const manifestText = `${JSON.stringify(entry, null, 2)}\n`;

            const actionChanged = actionBefore !== content;
            const manifestChanged =
                manifestBefore !== manifestText ||
                pageActionIndex.actions[pageKey] !== manifestRelativePath;

            fs.mkdirSync(path.dirname(paths.actionFile), { recursive: true });

            if (actionChanged) {
                fs.writeFileSync(paths.actionFile, content, "utf8");
            }

            if (manifestChanged) {
                writePageActionManifestEntry({
                    filePath: paths.manifestEntryFile,
                    entry,
                });
            }

            nextIndex.actions[pageKey] = manifestRelativePath;

            const operation: PageActionOperation =
                actionBefore === null
                    ? "created"
                    : actionChanged || manifestChanged
                      ? "updated"
                      : "unchanged";

            if (operation === "created") {
                created++;
            } else if (operation === "updated") {
                updated++;
            } else {
                unchanged++;
            }

            metadataExportEntries.push({
                pageKey,
                scope: page.scope,
                actionName: naming.actionName,
                actionFileName: naming.actionFileName,
                paths: {
                    productIndexFile: paths.productIndexFile,
                    applicationIndexFile: paths.applicationIndexFile,
                    platformIndexFile: paths.platformIndexFile,
                    actionsIndexFile: paths.actionsIndexFile,
                    rootIndexFile: paths.rootIndexFile,
                },
            });

            runtimeRegistryEntries.push({
                pageKey,
                scope: page.scope,
                actionName: naming.actionName,
            });

            const details = [
                `action : ${success(naming.actionName)}`,
                `file   : ${toRepoRelative(paths.actionFile)}`,
                `fields : active=${classified.activeValueMethods.length} | conditional=${classified.conditionalIndexedValueMethods.length} | todo=${classified.todoValueMethods.length} | suggestions=${classified.suggestionMethods.length}`,
            ];

            printPageResult(pageKey, operation, verbose, details);
        } catch (error) {
            failed++;
            invalidPages++;

            const message =
                error instanceof Error
                    ? error.message
                    : "Unknown generation error";

            printPageResult(pageKey, "failed", true, [failure(message)]);
        }
    }

    if (
        writePageActionManifestIndex({
            filePath: PAGE_ACTIONS_MANIFEST_INDEX_FILE,
            index: nextIndex,
        })
    ) {
        // Manifest index changed, but this is not shown as a separate summary row.
    }

    const metadataExportsResult = ensurePageActionMetadataExports({
        entries: metadataExportEntries,
    });

    const registryResult = ensurePageActionRegistry({
        entries: runtimeRegistryEntries,
    });

    return {
        availablePages: pageKeys.length,
        existingActions: Object.keys(pageActionIndex.actions).length,
        created,
        updated,
        unchanged,
        failed,
        metadataExportFilesCreated: metadataExportsResult.createdFiles,
        metadataExportFilesUpdated: metadataExportsResult.updatedFiles,
        registryFilesCreated: registryResult.createdFiles,
        registryFilesUpdated: registryResult.updatedFiles,
        invalidPages,
        exitCode: failed > 0 ? 1 : 0,
    };
}
