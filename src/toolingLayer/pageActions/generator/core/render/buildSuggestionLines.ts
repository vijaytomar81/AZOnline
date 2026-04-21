// src/toolingLayer/pageActions/generator/core/render/buildSuggestionLines.ts

import type { PageObjectManifestPage } from "../../manifest/types";
import type { ExtractedMethod } from "../../shared/types";
import { toCamelCase } from "../../shared/naming";

export function buildSuggestionLines(args: {
    page: PageObjectManifestPage;
    methods: ExtractedMethod[];
}): string[] {
    const pageAccessor = toCamelCase(args.page.scope.name);
    const platformAccessor = toCamelCase(args.page.scope.platform);
    const productAccessor = toCamelCase(args.page.scope.product);

    return args.methods.flatMap((method) => [
        `await context.pages.${platformAccessor}.${productAccessor}.${pageAccessor}.${method.name}();`,
    ]);
}
