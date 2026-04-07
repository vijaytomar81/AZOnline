// src/tools/pageObjects/validator/validate/rules/hygiene/moduleHygiene/moduleHygieneTypes.ts

import type { TreeNode } from "@utils/cliTree";
import type { ValidationIssue } from "../../../types";

export type RegistryModuleReadResult = {
    exists: boolean;
    content: string;
};

export type ModuleHygieneRuleResult = {
    issues: ValidationIssue[];
    reportNode?: TreeNode;
};
