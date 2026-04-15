// src/toolingLayer/pageObjects/validator/validate/rules/hygiene/moduleHygiene/buildModuleHygieneReportNodes.ts

import type { TreeNode } from "@utils/cliTree";

export function buildModuleHygieneReportNodes(
    indexNode?: TreeNode,
    pageManagerNode?: TreeNode
): TreeNode[] {
    return [indexNode, pageManagerNode].filter(
        (node): node is TreeNode => Boolean(node)
    );
}
