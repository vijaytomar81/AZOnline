// src/utils/cliTree.ts
import { success, warning, failure } from "./cliFormat";
import { ICONS } from "./icons";

export type TreeSeverity = "success" | "warning" | "error" | "info";

export type TreeNode = {
    severity?: TreeSeverity;
    title: string;
    summary?: string;
    children?: TreeNode[];
};

function formatIcon(severity?: TreeSeverity): string {
    if (!severity) return "";

    if (severity === "success") {
        return `${success(ICONS.successIcon)} `;
    }

    if (severity === "warning") {
        return `${warning(ICONS.warningIcon)} `;
    }

    if (severity === "error") {
        return `${failure(ICONS.failIcon)} `;
    }

    return `${ICONS.hintIcon} `;
}

function printNode(
    node: TreeNode,
    prefix = "",
    isLast = true,
    isRoot = false
) {
    const icon = formatIcon(node.severity);

    if (isRoot) {
        if (node.summary) {
            console.log(`${icon}${node.title}  ${node.summary}`);
        } else {
            console.log(`${icon}${node.title}`);
        }
    } else {
        const branch = isLast ? "└─" : "├─";

        if (node.summary) {
            console.log(`${prefix}${branch} ${icon}${node.title}  ${node.summary}`);
        } else {
            console.log(`${prefix}${branch} ${icon}${node.title}`);
        }
    }

    const children = node.children ?? [];
    if (children.length === 0) return;

    const nextPrefix = isRoot
        ? ""
        : prefix + (isLast ? "   " : "│  ");

    children.forEach((child, index) => {
        printNode(child, nextPrefix, index === children.length - 1, false);
    });
}

export function printTree(nodes: TreeNode[]) {
    nodes.forEach((node, index) => {
        printNode(node, "", index === nodes.length - 1, true);
    });
}