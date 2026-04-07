// src/tools/pageActions/generator/generator/generatePageActionsFromManifest.ts

import fs from "node:fs";
import path from "node:path";
import {
    info,
    printSection,
    printStatus,
    success,
} from "@utils/cliFormat";
import { ICONS } from "@utils/icons";
import { toRepoRelative } from "@utils/paths";
import type { PageActionManifestIndex } from "../manifest/types";
import type { GenerateSummary } from "../shared/types";
import { buildActionName } from "./buildActionName";
import { buildActionPath } from "./buildActionPath";
import { buildPageActionManifestEntry } from "./buildPageActionManifestEntry";
import { classifyPageObjectMethods } from "./classifyPageObjectMethods";
import { ensurePageActionIndexes } from "./ensurePageActionIndexes";
import { extractPageObjectMethods } from "./extractPageObjectMethods";
import { loadPageActionManifestIndex } from "./loadPageActionManifestIndex";
import { loadPageObjectManifestIndex } from "./loadPageObjectManifestIndex";
import { loadPageObjectManifestPage } from "./loadPageObjectManifestPage";
import { readPageObjectFile } from "./readPageObjectFile";
import { renderPageActionFile } from "./renderPageActionFile";
import { writePageActionManifestEntry } from "./writePageActionManifestEntry";
import { writePageActionManifestIndex } from "./writePageActionManifestIndex";

function printArrowLine(text: string): void {
    console.log(`   → ${text}`);
}

export function generatePageActionsFromManifest(args: {
    verbose?: boolean;
} = {}): GenerateSummary {
    const verbose = !!args.verbose;
    const pageObjectIndex = loadPageObjectManifestIndex();
    const pageActionIndex = loadPageActionManifestIndex();

    const nextIndex: PageActionManifestIndex = {
        ...pageActionIndex,
        generatedAt: new Date().toISOString(),
        actions: { ...pageActionIndex.actions },
    };

    let generatedActions = 0;
    let skippedActions = 0;
    const generatedPageKeys: string[] = [];

    printSection("Generation details");

    for (const pageKey of Object.keys(pageObjectIndex.pages).sort()) {
        if (nextIndex.actions[pageKey]) {
            skippedActions++;

            if (verbose) {
                printStatus(
                    ICONS.hintIcon,
                    `${info(pageKey)}`
                );
                printArrowLine(
                    `${info("skipped")} ${info("(already exists in manifest)")}`
                );
            }

            continue;
        }

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

        fs.mkdirSync(path.dirname(paths.actionFile), { recursive: true });
        fs.writeFileSync(paths.actionFile, content);

        ensurePageActionIndexes({ naming, paths });

        const entry = buildPageActionManifestEntry({
            page,
            naming,
            paths,
        });

        writePageActionManifestEntry({
            filePath: paths.manifestEntryFile,
            entry,
        });

        nextIndex.actions[page.pageKey] = path.basename(paths.manifestEntryFile);

        writePageActionManifestIndex({
            filePath: paths.manifestIndexFile,
            index: nextIndex,
        });

        generatedActions++;
        generatedPageKeys.push(page.pageKey);

        if (verbose) {
            printStatus(
                ICONS.successIcon,
                `${success(page.pageKey)}`
            );
            printArrowLine(`action : ${success(naming.actionName)}`);
            printArrowLine(
                `fields : active=${classified.activeValueMethods.length} | conditional=${classified.conditionalIndexedValueMethods.length} | todo=${classified.todoValueMethods.length} | suggestions=${classified.suggestionMethods.length}`
            );
            printArrowLine(`file   : ${toRepoRelative(paths.actionFile)}`);
        } else {
            printStatus(
                ICONS.successIcon,
                `${success(page.pageKey)}`
            );
        }
    }

    if (!verbose && generatedPageKeys.length === 0) {
        printStatus(
            ICONS.hintIcon,
            info("No new page actions generated")
        );
    }

    return {
        totalPages: Object.keys(pageObjectIndex.pages).length,
        existingActions: Object.keys(pageActionIndex.actions).length,
        generatedActions,
        skippedActions,
    };
}
