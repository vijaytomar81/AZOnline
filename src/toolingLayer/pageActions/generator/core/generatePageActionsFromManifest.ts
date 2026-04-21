// src/toolingLayer/pageActions/generator/core/generatePageActionsFromManifest.ts

import fs from "node:fs";
import path from "node:path";
import {
    info,
    printSection,
    printStatus,
    success,
    warning,
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
    GenerateSummary,
    PageActionOperation,
} from "../shared/types";
import { buildActionName } from "./action/buildActionName";
import { buildActionPath } from "./action/buildActionPath";
import { classifyPageObjectMethods } from "./action/classifyPageObjectMethods";
import { extractPageObjectMethods } from "./action/extractPageObjectMethods";
import { readPageObjectFile } from "./action/readPageObjectFile";
import { renderPageActionFile } from "./action/renderPageActionFile";
import { buildPageActionManifestEntry } from "./manifestSync/buildPageActionManifestEntry";
import { loadPageActionManifestIndex } from "./manifestSync/loadPageActionManifestIndex";
import { loadPageObjectManifestIndex } from "./manifestSync/loadPageObjectManifestIndex";
import { loadPageObjectManifestPage } from "./manifestSync/loadPageObjectManifestPage";
import { writePageActionManifestEntry } from "./manifestSync/writePageActionManifestEntry";
import { writePageActionManifestIndex } from "./manifestSync/writePageActionManifestIndex";
import { ensurePageActionIndexes } from "./registry/ensurePageActionIndexes";

function readTextIfExists(filePath: string): string | null {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

function toJsonText(value: unknown): string {
    return `${JSON.stringify(value, null, 2)}\n`;
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
        generatedAt: new Date().toISOString(),
        actions: {},
    };

    const registryEntries: ActionRegistryEntry[] = [];
    const pageKeys = Object.keys(pageObjectIndex.pages).sort();
    let created = 0;
    let updated = 0;
    let unchanged = 0;
    let failed = 0;
    let filesGenerated = 0;
    const invalidPages = 0;

    printSection("Generation details");

    for (const pageKey of pageKeys) {
        try {
            const page = loadPageObjectManifestPage(pageObjectIndex.pages[pageKey]);
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

            const entry = buildPageActionManifestEntry({
                page,
                naming,
                paths,
            });

            const manifestRelativePath = path
                .relative(PAGE_ACTIONS_MANIFEST_DIR, paths.manifestEntryFile)
                .replace(/\\/g, "/");

            const actionBefore = readTextIfExists(paths.actionFile);
            const manifestBefore = readTextIfExists(paths.manifestEntryFile);
            const actionChanged = actionBefore !== content;
            const manifestText = toJsonText(entry);
            const manifestChanged =
                manifestBefore !== manifestText ||
                pageActionIndex.actions[pageKey] !== manifestRelativePath;

            fs.mkdirSync(path.dirname(paths.actionFile), { recursive: true });

            if (actionChanged) {
                fs.writeFileSync(paths.actionFile, content, "utf8");
                filesGenerated++;
            }

            if (manifestChanged) {
                writePageActionManifestEntry({
                    filePath: paths.manifestEntryFile,
                    entry,
                });
                filesGenerated++;
            }

            nextIndex.actions[pageKey] = manifestRelativePath;

            const operation: PageActionOperation =
                actionBefore === null ? "created" : actionChanged || manifestChanged
                    ? "updated"
                    : "unchanged";

            if (operation === "created") {
                created++;
            } else if (operation === "updated") {
                updated++;
            } else {
                unchanged++;
            }

            registryEntries.push({
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

            const details = [
                `action : ${success(naming.actionName)}`,
                `file   : ${toRepoRelative(paths.actionFile)}`,
                `fields : active=${classified.activeValueMethods.length} | conditional=${classified.conditionalIndexedValueMethods.length} | todo=${classified.todoValueMethods.length} | suggestions=${classified.suggestionMethods.length}`,
            ];

            printPageResult(pageKey, operation, verbose, details);
        } catch (error) {
            failed++;
            const message =
                error instanceof Error ? error.message : "Unknown generation error";

            printPageResult(pageKey, "failed", true, [failure(message)]);
        }
    }

    const currentIndexText = readTextIfExists(PAGE_ACTIONS_MANIFEST_INDEX_FILE);
    const nextIndexText = toJsonText(nextIndex);

    if (currentIndexText !== nextIndexText) {
        writePageActionManifestIndex({
            filePath: PAGE_ACTIONS_MANIFEST_INDEX_FILE,
            index: nextIndex,
        });
        filesGenerated++;
    }

    const registryResult = ensurePageActionIndexes({
        entries: registryEntries,
    });

    filesGenerated += registryResult.changedFiles;

    if (!verbose && created === 0 && updated === 0 && failed === 0) {
        printStatus(ICONS.hintIcon, info("No page action changes detected"));
    }

    return {
        availablePages: pageKeys.length,
        existingActions: Object.keys(pageActionIndex.actions).length,
        created,
        updated,
        unchanged,
        failed,
        filesGenerated,
        registryFilesUpdated: registryResult.changedFiles,
        invalidPages,
        exitCode: failed > 0 ? 1 : 0,
    };
}
