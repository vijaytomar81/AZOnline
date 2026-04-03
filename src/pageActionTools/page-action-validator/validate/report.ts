// src/pageActionTools/page-action-validator/validate/report.ts

import path from "node:path";
import fs from "node:fs";
import {
    failure,
    printCommandTitle,
    printEnvironment,
    printSummary,
    success,
    warning,
} from "@utils/cliFormat";
import {
    PAGE_ACTIONS_ACTIONS_DIR,
    PAGE_ACTIONS_MANIFEST_DIR,
    PAGE_MANIFEST_DIR,
} from "@utils/paths";
import type {
    PageActionManifestEntry,
    ValidationContext,
} from "./types";
import { getPageActionValidationRules } from "./pipeline/registry";
import { runValidationPipeline } from "./pipeline/runner";
import { buildValidationResultText } from "./report/buildValidationResultText";
import { buildValidationSummaryRows } from "./report/buildValidationSummaryRows";
import { printSuggestedAction } from "./report/printSuggestedAction";

function walk(dir: string, matcher: RegExp): string[] {
    if (!fs.existsSync(dir)) {
        return [];
    }

    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            return walk(full, matcher);
        }

        return matcher.test(entry.name) ? [full] : [];
    });
}

function readJson<T>(filePath: string, fallback: T): T {
    return fs.existsSync(filePath)
        ? (JSON.parse(fs.readFileSync(filePath, "utf8")) as T)
        : fallback;
}

function createContext(verbose: boolean, strict: boolean): ValidationContext {
    const pageObjectIndexFile = path.join(PAGE_MANIFEST_DIR, "index.json");
    const pageActionIndexFile = path.join(PAGE_ACTIONS_MANIFEST_DIR, "index.json");

    const pageObjectIndex = readJson<{ pages: Record<string, string> }>(
        pageObjectIndexFile,
        { pages: {} }
    ).pages;

    const pageActionIndex = readJson<{ actions: Record<string, string> }>(
        pageActionIndexFile,
        { actions: {} }
    ).actions;

    const pageActionEntries: Record<string, PageActionManifestEntry> = {};

    Object.entries(pageActionIndex).forEach(([pageKey, fileName]) => {
        const filePath = path.join(PAGE_ACTIONS_MANIFEST_DIR, "actions", fileName);

        pageActionEntries[pageKey] = readJson<PageActionManifestEntry>(
            filePath,
            {} as PageActionManifestEntry
        );
    });

    return {
        verbose,
        strict,
        pageObjectManifestDir: PAGE_MANIFEST_DIR,
        pageActionManifestDir: PAGE_ACTIONS_MANIFEST_DIR,
        pageActionActionsDir: PAGE_ACTIONS_ACTIONS_DIR,
        pageObjectIndex,
        pageActionIndex,
        pageActionEntries,
        actionFiles: walk(PAGE_ACTIONS_ACTIONS_DIR, /\.action\.ts$/),
    };
}

function buildColoredResultText(summary: {
    rows: Array<[string, string | number]>;
    exitCode: number;
    resultText: string;
}): string {
    if (summary.resultText === "ALL GOOD") {
        return success(summary.resultText);
    }

    if (summary.resultText === "WARNINGS FOUND") {
        return warning(summary.resultText);
    }

    return failure(summary.resultText);
}

export function runPageActionValidation(args: {
    verbose: boolean;
    strict: boolean;
}): number {
    printCommandTitle("PAGE ACTION VALIDATOR", "validateIcon");

    printEnvironment([
        ["pageObjectsManifest", path.resolve(PAGE_MANIFEST_DIR)],
        ["pageActionsDir", path.resolve(PAGE_ACTIONS_ACTIONS_DIR)],
        ["manifestDir", path.resolve(PAGE_ACTIONS_MANIFEST_DIR)],
        ["strict", args.strict],
        ["verbose", args.verbose],
    ]);

    const context = createContext(args.verbose, args.strict);

    const pipeline = runValidationPipeline({
        context,
        rules: getPageActionValidationRules(),
    });

    console.log(buildValidationResultText(pipeline.results));

    const summary = buildValidationSummaryRows(pipeline.results);

    printSummary(
        "VALIDATE SUMMARY",
        summary.rows,
        buildColoredResultText(summary)
    );

    printSuggestedAction(pipeline.results);

    return summary.exitCode;
}
