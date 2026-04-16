// src/toolingLayer/pageObjects/generator/generator/reporting/buildGenerationReportTree.ts

import type { TreeNode } from "@utils/cliTree";
import { info, strong } from "@utils/cliFormat";
import type { GenerationTreeInput } from "./types";

function fileSeverity(status: string): "success" | "warning" | "error" {
    if (status === "generated" || status === "added-to-both" || status === "added-to-index" || status === "added-to-page-manager") {
        return "success";
    }

    if (status === "unchanged" || status === "already-registered") {
        return "success";
    }

    return "warning";
}

function fileSummary(status: string): string {
    if (status === "generated") return info("(generated)");
    if (status === "unchanged") return info("(unchanged)");
    if (status === "already-registered") return info("(already registered)");
    if (status === "added-to-both") return info("(added to both)");
    if (status === "added-to-index") return info("(added to index)");
    if (status === "added-to-page-manager") return info("(added to page manager)");
    return info(`(${status})`);
}

function buildPageNode(page: GenerationTreeInput["pageReports"][number]): TreeNode {
    const children: TreeNode[] = [
        {
            severity: fileSeverity(page.elementsStatus),
            title: "elements.ts",
            summary: fileSummary(page.elementsStatus),
        },
        {
            severity: fileSeverity(page.aliasesGeneratedStatus),
            title: "aliases.generated.ts",
            summary: fileSummary(page.aliasesGeneratedStatus),
        },
        {
            severity: fileSeverity(page.pageObjectStatus),
            title: "pageObject.ts",
            summary: fileSummary(page.pageObjectStatus),
        },
        {
            severity: fileSeverity(page.registryStatus),
            title: "registry",
            summary: fileSummary(page.registryStatus),
        },
    ];

    return {
        severity: page.changed ? "success" : "success",
        title: page.pageKey,
        summary: info(page.changed ? "(changed)" : "(unchanged)"),
        children,
    };
}

function buildInvalidNode(item: GenerationTreeInput["invalidPages"][number]): TreeNode {
    return {
        severity: "error",
        title: item.pageKey,
        children: [
            {
                severity: "error",
                title: "invalid-page",
                summary: item.reason,
            },
        ],
    };
}

function buildErrorNode(item: GenerationTreeInput["errorPages"][number]): TreeNode {
    return {
        severity: "error",
        title: item.pageKey,
        children: [
            {
                severity: "error",
                title: "generation-error",
                summary: item.reason,
            },
        ],
    };
}

export function buildGenerationReportTree(input: GenerationTreeInput): TreeNode[] {
    const nodes: TreeNode[] = [];

    if (input.pageReports.length > 0) {
        nodes.push({
            severity: "success",
            title: strong("pages"),
            summary: info(`(${input.pageReports.length} page(s))`),
            children: input.pageReports.map(buildPageNode),
        });
    }

    if (input.invalidPages.length > 0) {
        nodes.push({
            severity: "error",
            title: strong("invalid"),
            summary: info(`(${input.invalidPages.length} page(s))`),
            children: input.invalidPages.map(buildInvalidNode),
        });
    }

    if (input.errorPages.length > 0) {
        nodes.push({
            severity: "error",
            title: strong("errors"),
            summary: info(`(${input.errorPages.length} page(s))`),
            children: input.errorPages.map(buildErrorNode),
        });
    }

    return nodes;
}
