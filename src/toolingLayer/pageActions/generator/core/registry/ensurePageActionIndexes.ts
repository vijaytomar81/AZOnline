// src/toolingLayer/pageActions/generator/core/registry/ensurePageActionIndexes.ts

import fs from "node:fs";
import path from "node:path";
import type { ActionRegistryEntry } from "../../shared/types";

type RegistryWriteResult = {
    changedFiles: number;
};

function ensureTrailingNewline(text: string): string {
    return text.endsWith("\n") ? text : `${text}\n`;
}

function writeIfChanged(filePath: string, content: string): boolean {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const next = ensureTrailingNewline(content);
    const current = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, "utf8")
        : "";

    if (current === next) {
        return false;
    }

    fs.writeFileSync(filePath, next, "utf8");
    return true;
}

function buildRootIndex(): string {
    return [
        `export * from "./shared";`,
        `export * from "./actions";`,
        ``,
    ].join("\n");
}

function buildActionsIndex(platforms: string[]): string {
    return [
        ...platforms.map((platform) => `export * from "./${platform}";`),
        ``,
    ].join("\n");
}

function buildPlatformIndex(applications: string[]): string {
    return [
        ...applications.map(
            (application) => `export * from "./${application}";`
        ),
        ``,
    ].join("\n");
}

function buildApplicationIndex(products: string[]): string {
    return [
        ...products.map((product) => `export * from "./${product}";`),
        ``,
    ].join("\n");
}

function buildProductIndex(entries: ActionRegistryEntry[]): string {
    const lines = entries
        .slice()
        .sort((a, b) => a.pageKey.localeCompare(b.pageKey))
        .map((entry) => {
            const importPath = `./${entry.actionFileName.replace(".ts", "")}`;
            return `export { ${entry.actionName} } from "${importPath}";`;
        });

    return [...lines, ``].join("\n");
}

export function ensurePageActionIndexes(args: {
    entries: ActionRegistryEntry[];
}): RegistryWriteResult {
    const { entries } = args;
    let changedFiles = 0;

    if (entries.length === 0) {
        return { changedFiles };
    }

    const rootIndexFile = entries[0].paths.rootIndexFile;
    const actionsIndexFile = entries[0].paths.actionsIndexFile;

    if (writeIfChanged(rootIndexFile, buildRootIndex())) {
        changedFiles++;
    }

    const platforms = [...new Set(entries.map((entry) => entry.scope.platform))]
        .sort((a, b) => a.localeCompare(b));

    if (writeIfChanged(actionsIndexFile, buildActionsIndex(platforms))) {
        changedFiles++;
    }

    for (const platform of platforms) {
        const platformEntries = entries.filter(
            (entry) => entry.scope.platform === platform
        );
        const platformIndexFile = platformEntries[0].paths.platformIndexFile;
        const applications = [
            ...new Set(platformEntries.map((entry) => entry.scope.application)),
        ].sort((a, b) => a.localeCompare(b));

        if (writeIfChanged(platformIndexFile, buildPlatformIndex(applications))) {
            changedFiles++;
        }

        for (const application of applications) {
            const applicationEntries = platformEntries.filter(
                (entry) => entry.scope.application === application
            );
            const applicationIndexFile =
                applicationEntries[0].paths.applicationIndexFile;
            const products = [
                ...new Set(applicationEntries.map((entry) => entry.scope.product)),
            ].sort((a, b) => a.localeCompare(b));

            if (
                writeIfChanged(
                    applicationIndexFile,
                    buildApplicationIndex(products)
                )
            ) {
                changedFiles++;
            }

            for (const product of products) {
                const productEntries = applicationEntries.filter(
                    (entry) => entry.scope.product === product
                );
                const productIndexFile = productEntries[0].paths.productIndexFile;

                if (
                    writeIfChanged(
                        productIndexFile,
                        buildProductIndex(productEntries)
                    )
                ) {
                    changedFiles++;
                }
            }
        }
    }

    return { changedFiles };
}
