// src/toolingLayer/pageObjects/generator/generator/reporting/buildGenerationReportTree.ts

import type { TreeNode } from "@utils/cliTree";
import { info, strong } from "@utils/cliFormat";
import type { GenerationTreeInput } from "./types";

function severityFromStatus(status: string): "success" | "warning" | "error" {
    if (
        status === "generated" ||
        status === "added-to-both" ||
        status === "added-to-index" ||
        status === "added-to-page-manager" ||
        status === "unchanged" ||
        status === "already-registered"
    ) {
        return "success";
    }

    return "warning";
}

function statusSummary(status: string): string {
    if (status === "generated") return info("(generated)");
    if (status === "unchanged") return info("(unchanged)");
    if (status === "already-registered") return info("(already registered)");
    if (status === "added-to-both") return info("(added to both)");
    if (status === "added-to-index") return info("(added to index)");
    if (status === "added-to-page-manager") return info("(added to page manager)");
    return info(`(${status})`);
}

function buildPageNode(page: GenerationTreeInput["pageReports"][number]): TreeNode {
    const changedChildren =
        page.elementsStatus === "generated" ||
        page.aliasesGeneratedStatus === "generated" ||
        page.pageObjectStatus === "generated" ||
        page.registryStatus !== "already-registered";

    return {
        severity: page.changed ? "success" : "success",
        title: page.pageKey,
        summary: info(page.changed ? "(changed)" : "(unchanged)"),
        children: [
            {
                severity: severityFromStatus(page.elementsStatus),
                title: "elements.ts",
                summary: statusSummary(page.elementsStatus),
            },
            {
                severity: severityFromStatus(page.aliasesGeneratedStatus),
                title: "aliases.generated.ts",
                summary: statusSummary(page.aliasesGeneratedStatus),
            },
            {
                severity: severityFromStatus(page.pageObjectStatus),
                title: "pageObject.ts",
                summary: statusSummary(page.pageObjectStatus),
            },
            {
                severity: severityFromStatus(page.registryStatus),
                title: "registry",
                summary: statusSummary(page.registryStatus),
            },
        ].filter(() => true && (page.changed || changedChildren || true)),
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
