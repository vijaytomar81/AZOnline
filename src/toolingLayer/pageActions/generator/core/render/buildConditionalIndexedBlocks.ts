// src/toolingLayer/pageActions/generator/core/render/buildConditionalIndexedBlocks.ts

import type { PageObjectManifestPage } from "../../manifest/types";
import type { ExtractedMethod } from "../../shared/types";
import {
    normalizeFieldNameFromMethod,
    toCamelCase,
} from "../../shared/naming";
import { buildValueLines } from "./buildValueLines";
import {
    hasNumericToken,
    inferRepeatedFamilyFromControlName,
    inferRepeatedFamilyFromValueField,
} from "./repeatedFieldFamilies";

export function buildConditionalIndexedBlocks(args: {
    page: PageObjectManifestPage;
    valueMethods: ExtractedMethod[];
    controlMethods: ExtractedMethod[];
}): string[] {
    if (!args.valueMethods.length) {
        return [];
    }

    const familyMap = new Map<
        string,
        {
            byIndex: Map<number, ExtractedMethod[]>;
            addAnotherControl?: ExtractedMethod;
        }
    >();

    args.valueMethods.forEach((method) => {
        const fieldName = normalizeFieldNameFromMethod(method.name);
        const family = inferRepeatedFamilyFromValueField(fieldName);

        if (!family) {
            return;
        }

        const entry = familyMap.get(family) ?? {
            byIndex: new Map<number, ExtractedMethod[]>(),
        };

        const index = hasNumericToken(fieldName)
            ? Number(fieldName.match(/\d+/)?.[0] ?? 1)
            : 1;

        const current = entry.byIndex.get(index) ?? [];
        current.push(method);
        entry.byIndex.set(index, current);

        familyMap.set(family, entry);
    });

    args.controlMethods.forEach((method) => {
        const family = inferRepeatedFamilyFromControlName(method.name);

        if (!family || !familyMap.has(family)) {
            return;
        }

        const entry = familyMap.get(family)!;
        entry.addAnotherControl = method;
        familyMap.set(family, entry);
    });

    const lines: string[] = [];
    const pageAccessor = toCamelCase(args.page.scope.name);
    const platformAccessor = toCamelCase(args.page.scope.platform);
    const productAccessor = toCamelCase(args.page.scope.product);

    for (const family of Array.from(familyMap.keys()).sort()) {
        const entry = familyMap.get(family)!;
        const maxIndex = Math.max(...Array.from(entry.byIndex.keys()));
        const countField = `${family}Count`;

        lines.push(
            `    const ${countField} = Math.min(Number(data.${countField} ?? 0), 5);`,
            ""
        );

        for (let index = 1; index <= maxIndex; index++) {
            const methods = entry.byIndex.get(index) ?? [];

            if (!methods.length) {
                continue;
            }

            lines.push(`    if (${countField} >= ${index}) {`);

            if (index > 1 && entry.addAnotherControl) {
                lines.push(
                    `        await context.pages.${platformAccessor}.${productAccessor}.${pageAccessor}.${entry.addAnotherControl.name}();`,
                    ""
                );
            }

            lines.push(
                ...buildValueLines({
                    page: args.page,
                    methods,
                    indent: "        ",
                })
            );

            while (lines.length > 0 && lines[lines.length - 1] === "") {
                lines.pop();
            }

            lines.push("    }", "");
        }
    }

    return lines;
}
