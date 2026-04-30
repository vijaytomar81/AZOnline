// src/toolingLayer/pageActions/validator/validate/rules/registry/checkPageActionRegistry.ts

import fs from "node:fs";
import path from "node:path";
import {
    PAGE_ACTIONS_ACTIONS_DIR,
    PAGE_ACTIONS_REGISTRY_DIR,
    PAGE_ACTIONS_REGISTRY_INDEX_FILE,
    PAGE_ACTIONS_RUNTIME_REGISTRY_FILE,
    toRepoRelative,
} from "@utils/paths";
import type {
    ValidationCheckResult,
    ValidationNode,
} from "../../pipeline/types";
import {
    loadPageObjectManifestIndex,
    loadPageObjectManifestPage,
} from "@toolingLayer/pageActions/common";
import { toCamelCase } from "@toolingLayer/pageActions/generator/shared/naming";

function buildActionIndexFile(args: {
    platform: string;
    application: string;
    product: string;
}): string {
    return path.join(
        PAGE_ACTIONS_ACTIONS_DIR,
        args.platform,
        args.application,
        args.product,
        "index.ts"
    );
}

function buildRegistryLeafFile(args: {
    platform: string;
    application: string;
    product: string;
}): string {
    return path.join(
        PAGE_ACTIONS_REGISTRY_DIR,
        args.platform,
        args.application,
        `${args.product}.ts`
    );
}

function buildApplicationIndexFile(args: {
    platform: string;
    application: string;
}): string {
    return path.join(
        PAGE_ACTIONS_REGISTRY_DIR,
        args.platform,
        args.application,
        "index.ts"
    );
}

function buildPlatformIndexFile(platform: string): string {
    return path.join(PAGE_ACTIONS_REGISTRY_DIR, platform, "index.ts");
}

export function checkPageActionRegistry(): ValidationCheckResult {
    try {
        const pageObjectIndex = loadPageObjectManifestIndex();
        const issues: ValidationNode[] = [];

        const platforms = new Set<string>();
        const applicationMap = new Map<string, Set<string>>();
        const productMap = new Map<string, Set<string>>();
        const leafEntryMap = new Map<
            string,
            Array<{ actionName: string; memberName: string; actionIndexFile: string }>
        >();

        for (const relativePath of Object.values(pageObjectIndex.pages)) {
            const page = loadPageObjectManifestPage(relativePath);
            const platform = page.scope.platform;
            const application = page.scope.application;
            const product = page.scope.product;
            const memberName = toCamelCase(page.scope.name);
            const actionName = `${memberName}Action`;

            platforms.add(platform);

            const platformApplications =
                applicationMap.get(platform) ?? new Set<string>();
            platformApplications.add(application);
            applicationMap.set(platform, platformApplications);

            const applicationKey = `${platform}/${application}`;
            const applicationProducts =
                productMap.get(applicationKey) ?? new Set<string>();
            applicationProducts.add(product);
            productMap.set(applicationKey, applicationProducts);

            const leafFile = buildRegistryLeafFile({
                platform,
                application,
                product,
            });
            const entries = leafEntryMap.get(leafFile) ?? [];
            entries.push({
                actionName,
                memberName,
                actionIndexFile: buildActionIndexFile({
                    platform,
                    application,
                    product,
                }),
            });
            leafEntryMap.set(leafFile, entries);
        }

        if (!fs.existsSync(PAGE_ACTIONS_REGISTRY_INDEX_FILE)) {
            issues.push({
                severity: "error",
                title: toRepoRelative(PAGE_ACTIONS_REGISTRY_INDEX_FILE),
                summary: "missing registry index file",
            });
        } else {
            const content = fs.readFileSync(
                PAGE_ACTIONS_REGISTRY_INDEX_FILE,
                "utf8"
            );
            if (!content.includes('export * from "./pageActionsRegistry";')) {
                issues.push({
                    severity: "error",
                    title: toRepoRelative(PAGE_ACTIONS_REGISTRY_INDEX_FILE),
                    summary: "missing pageActionsRegistry export",
                });
            }
        }

        if (!fs.existsSync(PAGE_ACTIONS_RUNTIME_REGISTRY_FILE)) {
            issues.push({
                severity: "error",
                title: toRepoRelative(PAGE_ACTIONS_RUNTIME_REGISTRY_FILE),
                summary: "missing runtime registry file",
            });
        } else {
            const content = fs.readFileSync(
                PAGE_ACTIONS_RUNTIME_REGISTRY_FILE,
                "utf8"
            );

            for (const platform of [...platforms].sort()) {
                if (!content.includes(`import { ${platform} } from "./${platform}";`)) {
                    issues.push({
                        severity: "error",
                        title: toRepoRelative(PAGE_ACTIONS_RUNTIME_REGISTRY_FILE),
                        summary: `missing platform import: ${platform}`,
                    });
                }

                if (!content.includes(`${platform},`)) {
                    issues.push({
                        severity: "error",
                        title: toRepoRelative(PAGE_ACTIONS_RUNTIME_REGISTRY_FILE),
                        summary: `missing platform member: ${platform}`,
                    });
                }
            }
        }

        for (const platform of [...platforms].sort()) {
            const platformIndexFile = buildPlatformIndexFile(platform);
            const applications = [...(applicationMap.get(platform) ?? new Set())].sort();

            if (!fs.existsSync(platformIndexFile)) {
                issues.push({
                    severity: "error",
                    title: toRepoRelative(platformIndexFile),
                    summary: "missing platform registry file",
                });
                continue;
            }

            const content = fs.readFileSync(platformIndexFile, "utf8");

            for (const application of applications) {
                if (!content.includes(`import { ${application} } from "./${application}";`)) {
                    issues.push({
                        severity: "error",
                        title: toRepoRelative(platformIndexFile),
                        summary: `missing application import: ${application}`,
                    });
                }

                if (!content.includes(`${application},`)) {
                    issues.push({
                        severity: "error",
                        title: toRepoRelative(platformIndexFile),
                        summary: `missing application member: ${application}`,
                    });
                }
            }
        }

        for (const [applicationKey, productsSet] of productMap.entries()) {
            const [platform, application] = applicationKey.split("/");
            const applicationIndexFile = buildApplicationIndexFile({
                platform,
                application,
            });
            const products = [...productsSet].sort();

            if (!fs.existsSync(applicationIndexFile)) {
                issues.push({
                    severity: "error",
                    title: toRepoRelative(applicationIndexFile),
                    summary: "missing application registry file",
                });
                continue;
            }

            const content = fs.readFileSync(applicationIndexFile, "utf8");

            for (const product of products) {
                if (!content.includes(`import { ${product} } from "./${product}";`)) {
                    issues.push({
                        severity: "error",
                        title: toRepoRelative(applicationIndexFile),
                        summary: `missing product import: ${product}`,
                    });
                }

                if (!content.includes(`${product},`)) {
                    issues.push({
                        severity: "error",
                        title: toRepoRelative(applicationIndexFile),
                        summary: `missing product member: ${product}`,
                    });
                }
            }
        }

        for (const [leafFile, entries] of leafEntryMap.entries()) {
            if (!fs.existsSync(leafFile)) {
                issues.push({
                    severity: "error",
                    title: toRepoRelative(leafFile),
                    summary: "missing registry leaf file",
                });
                continue;
            }

            const content = fs.readFileSync(leafFile, "utf8");

            for (const entry of entries) {
                const relativeImport = path
                    .relative(path.dirname(leafFile), entry.actionIndexFile)
                    .replace(/\\/g, "/")
                    .replace(/\/index\.ts$/, "")
                    .replace(/\.ts$/, "");

                if (!content.includes(`import * as actions from "${relativeImport}";`)) {
                    issues.push({
                        severity: "error",
                        title: toRepoRelative(leafFile),
                        summary: `missing action index import: ${relativeImport}`,
                    });
                }

                if (!content.includes(`${entry.memberName}: actions.${entry.actionName},`)) {
                    issues.push({
                        severity: "error",
                        title: toRepoRelative(leafFile),
                        summary: `missing action member: ${entry.memberName}`,
                    });
                }
            }
        }

        return {
            id: "checkPageActionRegistry",
            severity: issues.length === 0 ? "success" : "error",
            summary:
                issues.length === 0
                    ? "no issues"
                    : `${issues.length} issue(s)`,
            nodes: issues,
        };
    } catch {
        return {
            id: "checkPageActionRegistry",
            severity: "error",
            summary: "unable to inspect page action registry",
        };
    }
}
