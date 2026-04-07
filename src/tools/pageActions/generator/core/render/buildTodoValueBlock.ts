// src/tools/pageActions/generator/core/render/buildTodoValueBlock.ts

import type { PageObjectManifestPage } from "../../manifest/types";
import type { ExtractedMethod } from "../../shared/types";
import { buildValueLines } from "./buildValueLines";
import { indentLines } from "./indentLines";

export function buildTodoValueBlock(args: {
    page: PageObjectManifestPage;
    methods: ExtractedMethod[];
}): string[] {
    if (!args.methods.length) {
        return [];
    }

    const rawLines = buildValueLines(args);

    return [
        "    /*",
        "     --------------------------------------------------------------------------- ",
        "     TODO: review and enable conditional / low-confidence mappings if needed:",
        "     --------------------------------------------------------------------------- ",
        "    ",
        ...indentLines(rawLines),
        "    */",
        "",
    ];
}
