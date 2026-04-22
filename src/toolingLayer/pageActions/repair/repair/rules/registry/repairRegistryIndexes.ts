// src/toolingLayer/pageActions/repair/repair/rules/registry/repairRegistryIndexes.ts

import {
    loadPageObjectManifestIndex,
    loadPageObjectManifestPage,
    buildExpectedActionState,
    buildRootIndexContent,
    buildActionsIndexContent,
    buildPlatformIndexContent,
    buildApplicationIndexContent,
    buildProductIndexContent,
    writeIfChanged,
} from "@toolingLayer/pageActions/common";

import type {
    ActionRegistryEntry,
} from "@toolingLayer/pageActions/generator/shared/types";

import type {
    RepairContext,
    RepairRuleResult,
} from "../../../types";

export function repairRegistryIndexes(
    _context: RepairContext
): RepairRuleResult {
    const manifest =
        loadPageObjectManifestIndex();

    const entries: ActionRegistryEntry[] = [];

    Object.values(manifest.pages).forEach(
        (relativePath) => {
            const page =
                loadPageObjectManifestPage(
                    relativePath
                );

            const expected =
                buildExpectedActionState(page);

            entries.push({
                pageKey: page.pageKey,
                scope: page.scope,
                actionName:
                    expected.actionName,
                actionFileName:
                    expected.actionFileName,
                paths: {
                    rootIndexFile:
                        expected.manifestEntry.paths.rootIndexFile,
                    actionsIndexFile:
                        expected.manifestEntry.paths.actionsIndexFile,
                    platformIndexFile:
                        expected.manifestEntry.paths.platformIndexFile,
                    applicationIndexFile:
                        expected.manifestEntry.paths.applicationIndexFile,
                    productIndexFile:
                        expected.manifestEntry.paths.productIndexFile,
                },
            });
        }
    );

    let changedFiles = 0;

    if (entries.length === 0) {
        return {
            group: "registry",
            name: "repairRegistryIndexes",
            status: "unchanged",
            changedFiles: 0,
            repairedItems: 0,
            warnings: 0,
            errors: 0,
            details: [],
        };
    }

    const root = entries[0].paths.rootIndexFile;
    const actions =
        entries[0].paths.actionsIndexFile;

    if (
        writeIfChanged(
            root,
            buildRootIndexContent(root)
        ).changed
    ) {
        changedFiles++;
    }

    const platforms = [
        ...new Set(
            entries.map(
                (item) =>
                    item.scope.platform
            )
        ),
    ].sort();

    if (
        writeIfChanged(
            actions,
            buildActionsIndexContent(
                actions,
                platforms
            )
        ).changed
    ) {
        changedFiles++;
    }

    for (const platform of platforms) {
        const platformEntries =
            entries.filter(
                (item) =>
                    item.scope.platform ===
                    platform
            );

        const platformFile =
            platformEntries[0].paths
                .platformIndexFile;

        const applications = [
            ...new Set(
                platformEntries.map(
                    (item) =>
                        item.scope
                            .application
                )
            ),
        ].sort();

        if (
            writeIfChanged(
                platformFile,
                buildPlatformIndexContent(
                    platformFile,
                    applications
                )
            ).changed
        ) {
            changedFiles++;
        }

        for (const application of applications) {
            const applicationEntries =
                platformEntries.filter(
                    (item) =>
                        item.scope
                            .application ===
                        application
                );

            const appFile =
                applicationEntries[0]
                    .paths
                    .applicationIndexFile;

            const products = [
                ...new Set(
                    applicationEntries.map(
                        (item) =>
                            item.scope
                                .product
                    )
                ),
            ].sort();

            if (
                writeIfChanged(
                    appFile,
                    buildApplicationIndexContent(
                        appFile,
                        products
                    )
                ).changed
            ) {
                changedFiles++;
            }

            for (const product of products) {
                const productEntries =
                    applicationEntries.filter(
                        (item) =>
                            item.scope
                                .product ===
                            product
                    );

                const file =
                    productEntries[0]
                        .paths
                        .productIndexFile;

                if (
                    writeIfChanged(
                        file,
                        buildProductIndexContent(
                            file,
                            productEntries
                        )
                    ).changed
                ) {
                    changedFiles++;
                }
            }
        }
    }

    return {
        group: "registry",
        name: "repairRegistryIndexes",
        status:
            changedFiles > 0
                ? "repaired"
                : "unchanged",
        changedFiles,
        repairedItems: changedFiles,
        warnings: 0,
        errors: 0,
        details: [],
    };
}
