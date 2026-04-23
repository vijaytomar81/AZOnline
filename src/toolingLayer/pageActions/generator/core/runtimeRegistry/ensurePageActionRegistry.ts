// src/toolingLayer/pageActions/generator/core/runtimeRegistry/ensurePageActionRegistry.ts

import path from "node:path";
import {
    PAGE_ACTIONS_ACTIONS_DIR,
    PAGE_ACTIONS_REGISTRY_DIR,
    PAGE_ACTIONS_REGISTRY_INDEX_FILE,
    PAGE_ACTIONS_RUNTIME_REGISTRY_FILE,
} from "@utils/paths";
import {
    buildRegistryBranchContent,
    buildRegistryLeafContent,
    buildRuntimeRegistryContent,
    buildRuntimeRegistryIndexContent,
    writeIfChanged,
} from "@toolingLayer/pageActions/common";
import type { ActionRuntimeRegistryEntry } from "../../shared/types";

type RegistryWriteResult = {
    createdFiles: number;
    updatedFiles: number;
};

function trackWrite(
    current: RegistryWriteResult,
    write: { changed: boolean; created: boolean; updated: boolean }
): void {
    if (!write.changed) {
        return;
    }

    if (write.created) {
        current.createdFiles++;
        return;
    }

    if (write.updated) {
        current.updatedFiles++;
    }
}

export function ensurePageActionRegistry(args: {
    entries: ActionRuntimeRegistryEntry[];
}): RegistryWriteResult {
    const { entries } = args;
    const result: RegistryWriteResult = {
        createdFiles: 0,
        updatedFiles: 0,
    };

    if (entries.length === 0) {
        return result;
    }

    const platforms = [
        ...new Set(entries.map((entry) => entry.scope.platform)),
    ].sort((a, b) => a.localeCompare(b));

    for (const platform of platforms) {
        const platformEntries = entries.filter(
            (entry) => entry.scope.platform === platform
        );

        const applications = [
            ...new Set(
                platformEntries.map((entry) => entry.scope.application)
            ),
        ].sort((a, b) => a.localeCompare(b));

        for (const application of applications) {
            const applicationEntries = platformEntries.filter(
                (entry) => entry.scope.application === application
            );

            const products = [
                ...new Set(
                    applicationEntries.map((entry) => entry.scope.product)
                ),
            ].sort((a, b) => a.localeCompare(b));

            for (const product of products) {
                const productEntries = applicationEntries.filter(
                    (entry) => entry.scope.product === product
                );

                const registryLeafFile = path.join(
                    PAGE_ACTIONS_REGISTRY_DIR,
                    platform,
                    application,
                    `${product}.ts`
                );
                const actionIndexFile = path.join(
                    PAGE_ACTIONS_ACTIONS_DIR,
                    platform,
                    application,
                    product,
                    "index.ts"
                );

                trackWrite(
                    result,
                    writeIfChanged(
                        registryLeafFile,
                        buildRegistryLeafContent({
                            filePath: registryLeafFile,
                            objectName: product,
                            entries: productEntries,
                            actionIndexFile,
                        })
                    )
                );
            }

            const applicationIndexFile = path.join(
                PAGE_ACTIONS_REGISTRY_DIR,
                platform,
                application,
                "index.ts"
            );

            trackWrite(
                result,
                writeIfChanged(
                    applicationIndexFile,
                    buildRegistryBranchContent({
                        filePath: applicationIndexFile,
                        objectName: application,
                        childNames: products,
                    })
                )
            );
        }

        const platformIndexFile = path.join(
            PAGE_ACTIONS_REGISTRY_DIR,
            platform,
            "index.ts"
        );

        trackWrite(
            result,
            writeIfChanged(
                platformIndexFile,
                buildRegistryBranchContent({
                    filePath: platformIndexFile,
                    objectName: platform,
                    childNames: applications,
                })
            )
        );
    }

    trackWrite(
        result,
        writeIfChanged(
            PAGE_ACTIONS_RUNTIME_REGISTRY_FILE,
            buildRuntimeRegistryContent({
                filePath: PAGE_ACTIONS_RUNTIME_REGISTRY_FILE,
                platformNames: platforms,
            })
        )
    );

    trackWrite(
        result,
        writeIfChanged(
            PAGE_ACTIONS_REGISTRY_INDEX_FILE,
            buildRuntimeRegistryIndexContent(
                PAGE_ACTIONS_REGISTRY_INDEX_FILE
            )
        )
    );

    return result;
}
