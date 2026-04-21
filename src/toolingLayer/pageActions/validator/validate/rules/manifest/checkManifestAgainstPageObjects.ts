// src/toolingLayer/pageActions/validator/validate/rules/manifest/checkManifestAgainstPageObjects.ts

import type { ValidationCheckResult, ValidationNode } from "../../pipeline/types";
import { loadPageActionManifestIndex } from "../../../shared/loadPageActionManifestIndex";
import { loadPageObjectManifestIndex } from "../../../shared/loadPageObjectManifestIndex";

export function checkManifestAgainstPageObjects(): ValidationCheckResult {
    try {
        const actionIndex = loadPageActionManifestIndex();
        const pageIndex = loadPageObjectManifestIndex();

        const pageKeys = new Set(Object.keys(pageIndex.pages));
        const extraActionKeys = Object.keys(actionIndex.actions).filter(
            (key) => !pageKeys.has(key)
        );

        const nodes: ValidationNode[] = extraActionKeys.map((pageKey) => ({
            severity: "error",
            title: pageKey,
            children: [
                {
                    severity: "error",
                    title: ".manifest/index.json",
                    summary: "extra pageAction manifest entry",
                },
            ],
        }));

        return {
            id: "checkManifestAgainstPageObjects",
            severity: nodes.length === 0 ? "success" : "error",
            summary: nodes.length === 0 ? "no issues" : `${nodes.length} extra entr${nodes.length === 1 ? "y" : "ies"}`,
            nodes,
        };
    } catch {
        return {
            id: "checkManifestAgainstPageObjects",
            severity: "error",
            summary: "unable to compare manifest indexes",
        };
    }
}
