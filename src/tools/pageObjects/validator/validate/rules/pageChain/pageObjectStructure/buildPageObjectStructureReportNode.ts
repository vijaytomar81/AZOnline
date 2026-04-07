// src/tools/pageObjects/validator/validate/rules/pageChain/pageObjectStructure/buildPageObjectStructureReportNode.ts

import type { TreeNode } from "@utils/cliTree";
import { formatPageObjectStructureItems } from "./formatPageObjectStructureItems";

type BuildPageObjectStructureReportNodeArgs = {
    pageKey: string;
    className: string;
    missingItems: string[];
};

export function buildPageObjectStructureReportNode(
    args: BuildPageObjectStructureReportNodeArgs
): TreeNode {
    return {
        title: args.pageKey,
        children: [
            {
                title: args.className + ".ts".replace(".ts.ts", ".ts"),
                children: [
                    {
                        severity: "error",
                        title: "Missing",
                        summary: formatPageObjectStructureItems(args.missingItems),
                    },
                ],
            },
        ],
    };
}
