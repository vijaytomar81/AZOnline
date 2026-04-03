// src/pageActionTools/page-action-generator/generator/render/buildSuggestionLines.ts

import type { PageObjectManifestPage } from "../../manifest/types";
import type { ExtractedMethod } from "../../shared/types";
import { toCamelCase } from "../../shared/naming";

export function buildSuggestionLines(args: {
    page: PageObjectManifestPage;
    methods: ExtractedMethod[];
}): string[] {
    const pageAccessor = toCamelCase(args.page.name);

    return args.methods.flatMap((method) => [
        `    await context.pages.athena.${pageAccessor}.${method.name}();`,
        "",
    ]);
}
