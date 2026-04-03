// src/pageActionTools/page-action-generator/generator/renderPageActionFile.ts

import { toRepoRelative } from "@utils/paths";
import type { PageObjectManifestPage } from "../manifest/types";
import type {
    ActionNaming,
    ClassifiedMethods,
    ExtractedMethod,
} from "../shared/types";
import {
    normalizeFieldNameFromMethod,
    toCamelCase,
} from "../shared/naming";

function hasNumericToken(value: string): boolean {
    return /\d+/.test(value);
}

function inferRepeatedFamilyFromValueField(fieldName: string): string | null {
    const lower = fieldName.toLowerCase();

    if (lower.includes("additionaldriver")) {
        return "additionalDriver";
    }

    if (lower.includes("conviction")) {
        return "conviction";
    }

    if (lower.includes("claim")) {
        return "claim";
    }

    const match = fieldName.match(/^([a-z]+(?:[A-Z][a-z]+)*?)(\d+)/);

    return match ? match[1] : null;
}

function inferRepeatedFamilyFromControlName(methodName: string): string | null {
    const lower = methodName.toLowerCase();

    if (lower.includes("additionaldriver")) {
        return "additionalDriver";
    }

    if (lower.includes("conviction")) {
        return "conviction";
    }

    if (lower.includes("claim")) {
        return "claim";
    }

    const match = methodName.match(/^([A-Za-z]+?)(\d+)/);

    return match ? match[1] : null;
}

function buildValueLines(args: {
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

function buildSuggestionLines(args: {
    page: PageObjectManifestPage;
    methods: ExtractedMethod[];
}): string[] {
    const pageAccessor = toCamelCase(args.page.name);

    return args.methods.flatMap((method) => [
        `    await context.pages.athena.${pageAccessor}.${method.name}();`,
        "",
    ]);
}

function indentLines(lines: string[]): string[] {
    return lines.map((line) => (line ? `     ${line.trimEnd()}` : ""));
}

function buildConditionalIndexedBlocks(args: {
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
                const pageAccessor = toCamelCase(args.page.name);
                lines.push(
                    `        await context.pages.athena.${pageAccessor}.${entry.addAnotherControl.name}();`,
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

function buildTodoValueBlock(args: {
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

function buildSuggestionBlock(args: {
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

export function renderPageActionFile(args: {
    page: PageObjectManifestPage;
    naming: ActionNaming;
    classified: ClassifiedMethods;
    actionFilePath: string;
}): string {
    const hasValueMethods =
        args.classified.activeValueMethods.length > 0 ||
        args.classified.conditionalIndexedValueMethods.length > 0 ||
        args.classified.todoValueMethods.length > 0;

    const imports = hasValueMethods
        ? `import {\n    requireRecordValue,\n    requireStringValue,\n    logPageActionInfo,\n} from "@pageActions/shared";`
        : `import { logPageActionInfo } from "@pageActions/shared";`;

    const body: string[] = [
        `// ${toRepoRelative(args.actionFilePath)}`,
        "",
        `import type { PageAction } from "@pageActions/shared";`,
        imports,
        "",
        `export const ${args.naming.actionName}: PageAction = async ({`,
        "    context,",
        "    payload,",
        "}) => {",
    ];

    if (hasValueMethods) {
        body.push(
            "    const data = requireRecordValue({",
            "        value: payload,",
            '        fieldName: "payload",',
            `        source: "${args.page.className}",`,
            "    });",
            ""
        );
    }

    body.push(
        "    logPageActionInfo({",
        "        scope: context.logScope,",
        `        message: "${args.naming.actionName} started.",`,
        "    });",
        ""
    );

    body.push(
        ...buildValueLines({
            page: args.page,
            methods: args.classified.activeValueMethods,
        })
    );

    body.push(
        ...buildConditionalIndexedBlocks({
            page: args.page,
            valueMethods: args.classified.conditionalIndexedValueMethods,
            controlMethods: args.classified.conditionalIndexedControlMethods,
        })
    );

    body.push(
        ...buildTodoValueBlock({
            page: args.page,
            methods: args.classified.todoValueMethods,
        })
    );

    body.push(
        ...buildSuggestionBlock({
            page: args.page,
            methods: args.classified.suggestionMethods,
        })
    );

    body.push(
        "    logPageActionInfo({",
        "        scope: context.logScope,",
        `        message: "${args.naming.actionName} completed.",`,
        "    });",
        "};",
        ""
    );

    return body.join("\n");
}
