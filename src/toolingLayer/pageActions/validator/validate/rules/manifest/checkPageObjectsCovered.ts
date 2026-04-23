// src/toolingLayer/pageActions/validator/validate/rules/manifest/checkPageObjectsCovered.ts

import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";
import {
    loadPageActionManifestIndex,
    loadPageObjectManifestIndex,
} from "@toolingLayer/pageActions/common";

export function checkPageObjectsCovered(): ValidationCheckResult {
    try {
        const actionIndex = loadPageActionManifestIndex();
        const pageIndex = loadPageObjectManifestIndex();

        const actionKeys = new Set(Object.keys(actionIndex.actions));
        const missingActionKeys = Object.keys(pageIndex.pages).filter(
            (key) => !actionKeys.has(key)
        );

        const nodes: ValidationNode[] = missingActionKeys.map((pageKey) => ({
            severity: "error",
            title: pageKey,
            children: [
                {
                    severity: "error",
                    title: ".manifest/index.json",
                    summary: "missing pageAction manifest entry",
                },
            ],
        }));

        return {
            id: "checkPageObjectsCovered",
            severity: nodes.length === 0 ? "success" : "error",
            summary: nodes.length === 0 ? "no issues" : `${nodes.length} missing entr${nodes.length === 1 ? "y" : "ies"}`,
            nodes,
        };
    } catch {
        return {
            id: "checkPageObjectsCovered",
            severity: "error",
            summary: "unable to compare manifest indexes",
        };
    }
}
