// src/toolingLayer/pageActions/generator/core/render/buildSuggestionBlock.ts

import type { PageObjectManifestPage } from "../../manifest/types";
import type { ExtractedMethod } from "../../shared/types";
import { buildSuggestionLines } from "./buildSuggestionLines";
import { indentLines } from "./indentLines";

export function buildSuggestionBlock(args: {
    page: PageObjectManifestPage;
    methods: ExtractedMethod[];
}): string[] {
    if (!args.methods.length) {
        return [];
    }

    const rawLines = buildSuggestionLines(args);

    return [
        "    /*",
        "     --------------------------------------------------------------------------- ",
        "     TODO: review and enable click / radio / link interactions if needed:",
        "     --------------------------------------------------------------------------- ",
        "    ",
        ...indentLines(rawLines),
        "    */",
        "",
    ];
}
