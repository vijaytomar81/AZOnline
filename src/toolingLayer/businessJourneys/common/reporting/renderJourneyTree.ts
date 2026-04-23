// src/toolingLayer/businessJourneys/common/reporting/renderJourneyTree.ts

import {
    failure,
    info,
    success,
    warning,
} from "@utils/cliFormat";
import type {
    JourneyGenerationStatus,
    JourneyTreeLeaf,
} from "./types";

type TreeNode = {
    label: string;
    children: Map<string, TreeNode>;
    leaf?: JourneyTreeLeaf;
};

function colorIcon(status: JourneyGenerationStatus): string {
    if (status === "failed") return failure("✖");
    if (status === "updated") return warning("↻");
    if (status === "created") return success("✔");
    return info("ℹ");
}

function colorSummary(
    text: string,
    status: JourneyGenerationStatus
): string {
    if (status === "failed") return failure(text);
    if (status === "updated") return warning(text);
    if (status === "created") return success(text);
    return info(text);
}

function insertLeaf(root: TreeNode, leaf: JourneyTreeLeaf): void {
    let current = root;

    for (const segment of leaf.segments) {
        const next =
            current.children.get(segment) ??
            {
                label: segment,
                children: new Map<string, TreeNode>(),
            };

        current.children.set(segment, next);
        current = next;
    }

    current.leaf = leaf;
}

function renderNode(
    node: TreeNode,
    prefix: string,
    isLast: boolean
): void {
    const branch = isLast ? "└─" : "├─";
    const nextPrefix = `${prefix}${isLast ? "   " : "│  "}`;

    if (node.leaf) {
        console.log(
            `${prefix}${branch} ${colorIcon(node.leaf.status)} ${node.label}  (${colorSummary(node.leaf.summary, node.leaf.status)})`
        );
    } else {
        console.log(`${prefix}${branch} ${success("✔")} ${node.label}`);
    }

    const children = [...node.children.values()].sort((left, right) =>
        left.label.localeCompare(right.label)
    );

    children.forEach((child, index) => {
        renderNode(child, nextPrefix, index === children.length - 1);
    });
}

export function renderJourneyTree(leaves: JourneyTreeLeaf[]): void {
    const root: TreeNode = {
        label: "__root__",
        children: new Map<string, TreeNode>(),
    };

    leaves.forEach((leaf) => {
        insertLeaf(root, leaf);
    });

    const topLevel = [...root.children.values()].sort((left, right) =>
        left.label.localeCompare(right.label)
    );

    topLevel.forEach((node, index) => {
        renderNode(node, "", index === topLevel.length - 1);
    });
}
