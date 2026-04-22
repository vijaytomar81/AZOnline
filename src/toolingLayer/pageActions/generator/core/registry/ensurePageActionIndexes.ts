// src/toolingLayer/pageActions/generator/core/registry/ensurePageActionIndexes.ts

import {
    buildActionsIndexContent,
    buildApplicationIndexContent,
    buildPlatformIndexContent,
    buildProductIndexContent,
    buildRootIndexContent,
    writeIfChanged,
} from "@toolingLayer/pageActions/common";
import type { ActionRegistryEntry } from "../../shared/types";

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

export function ensurePageActionIndexes(args: {
    entries: ActionRegistryEntry[];
}): RegistryWriteResult {
    const { entries } = args;
    const result: RegistryWriteResult = {
        createdFiles: 0,
        updatedFiles: 0,
    };

    if (entries.length === 0) {
        return result;
    }

    const rootIndexFile = entries[0].paths.rootIndexFile;
    const actionsIndexFile = entries[0].paths.actionsIndexFile;

    trackWrite(
        result,
        writeIfChanged(
            rootIndexFile,
            buildRootIndexContent(rootIndexFile)
        )
    );

    const platforms = [...new Set(entries.map((entry) => entry.scope.platform))]
        .sort((a, b) => a.localeCompare(b));

    trackWrite(
        result,
        writeIfChanged(
            actionsIndexFile,
            buildActionsIndexContent(actionsIndexFile, platforms)
        )
    );

    for (const platform of platforms) {
        const platformEntries = entries.filter(
            (entry) => entry.scope.platform === platform
        );
        const platformIndexFile = platformEntries[0].paths.platformIndexFile;
        const applications = [
            ...new Set(platformEntries.map((entry) => entry.scope.application)),
        ].sort((a, b) => a.localeCompare(b));

        trackWrite(
            result,
            writeIfChanged(
                platformIndexFile,
                buildPlatformIndexContent(platformIndexFile, applications)
            )
        );

        for (const application of applications) {
            const applicationEntries = platformEntries.filter(
                (entry) => entry.scope.application === application
            );
            const applicationIndexFile =
                applicationEntries[0].paths.applicationIndexFile;
            const products = [
                ...new Set(applicationEntries.map((entry) => entry.scope.product)),
            ].sort((a, b) => a.localeCompare(b));

            trackWrite(
                result,
                writeIfChanged(
                    applicationIndexFile,
                    buildApplicationIndexContent(
                        applicationIndexFile,
                        products
                    )
                )
            );

            for (const product of products) {
                const productEntries = applicationEntries.filter(
                    (entry) => entry.scope.product === product
                );
                const productIndexFile =
                    productEntries[0].paths.productIndexFile;

                trackWrite(
                    result,
                    writeIfChanged(
                        productIndexFile,
                        buildProductIndexContent(
                            productIndexFile,
                            productEntries
                        )
                    )
                );
            }
        }
    }

    return result;
}
