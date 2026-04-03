// src/pageActionTools/page-action-generator/generator/render/buildValueLines.ts

import type { PageObjectManifestPage } from "../../manifest/types";
import type { ExtractedMethod } from "../../shared/types";
import {
    normalizeFieldNameFromMethod,
    toCamelCase,
} from "../../shared/naming";

export function buildValueLines(args: {
    page: PageObjectManifestPage;
    methods: ExtractedMethod[];
    indent?: string;
}): string[] {
    const pageAccessor = toCamelCase(args.page.name);
    const indent = args.indent ?? "    ";

    return args.methods.flatMap((method) => {
        const fieldName = normalizeFieldNameFromMethod(method.name);

        return [
            `${indent}const ${fieldName} = requireStringValue({`,
            `${indent}    value: data.${fieldName},`,
            `${indent}    fieldName: "${fieldName}",`,
            `${indent}    source: "${args.page.className}",`,
            `${indent}});`,
            `${indent}await context.pages.athena.${pageAccessor}.${method.name}(${fieldName});`,
            "",
        ];
    });
}
