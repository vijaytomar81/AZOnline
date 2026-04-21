// src/toolingLayer/pageObjects/generator/generator/reporting/buildGenerationReportTree.ts

import type { TreeNode, TreeSeverity } from "@utils/cliTree";
import { info, strong, success } from "@utils/cliFormat";
import type { GenerationTreeInput } from "./types";

function successStatus(label: string): string {
    return success(`(${label})`);
}

function infoStatus(label: string): string {
    return info(`(${label})`);
}

function severityFromOperation(operation: string): TreeSeverity {
    if (operation === "created" || operation === "updated") {
        return "success" as TreeSeverity;
    }

    return "info" as TreeSeverity;
}

function severityFromStatus(status: string): TreeSeverity {
    if (
        status === "generated" ||
        status === "added-to-both" ||
        status === "added-to-index" ||
        status === "added-to-page-manager"
    ) {
        return "success" as TreeSeverity;
    }

    if (status === "unchanged" || status === "already-registered") {
        return "info" as TreeSeverity;
    }

    return "warning" as TreeSeverity;
}

function displayStatus(status: string): string {
    if (status === "added-to-both") {
        return "added to both";
    }

    if (status === "added-to-index") {
        return "added to index";
    }

    if (status === "added-to-page-manager") {
        return "added to page manager";
    }

    if (status === "already-registered") {
        return "already registered";
    }

    return status;
}

function statusSummary(status: string): string {
    const label = displayStatus(status);

    if (
        status === "generated" ||
        status === "added-to-both" ||
        status === "added-to-index" ||
        status === "added-to-page-manager"
    ) {
        return successStatus(label);
    }

    if (status === "unchanged" || status === "already-registered") {
        return infoStatus(label);
    }

    return info(`(${label})`);
}

function operationSummary(operation: string): string {
    if (operation === "created" || operation === "updated") {
        return success(`(${operation})`);
    }

    return info(`(${operation})`);
}

function buildChangedPageChildren(
    page: GenerationTreeInput["pageReports"][number]
): TreeNode[] {
    return [
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
            severity: severityFromStatus(page.aliasesHumanStatus),
            title: "aliases.ts",
            summary: statusSummary(page.aliasesHumanStatus),
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
    ];
}

function buildPageNode(page: GenerationTreeInput["pageReports"][number]): TreeNode {
    return {
        severity: severityFromOperation(page.operation),
        title: page.pageKey,
        summary: operationSummary(page.operation),
        children:
            page.operation === "unchanged"
                ? []
                : buildChangedPageChildren(page),
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
