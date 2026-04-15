// src/toolingLayer/pageActions/generator/core/action/renderPageActionFile.ts

import { toRepoRelative } from "@utils/paths";
import type { PageObjectManifestPage } from "../../manifest/types";
import type { ActionNaming, ClassifiedMethods } from "../../shared/types";
import { buildConditionalIndexedBlocks } from "../render/buildConditionalIndexedBlocks";
import { buildSuggestionBlock } from "../render/buildSuggestionBlock";
import { buildTodoValueBlock } from "../render/buildTodoValueBlock";
import { buildValueLines } from "../render/buildValueLines";

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
        ? `import {\n    requireRecordValue,\n    requireStringValue,\n    logPageActionInfo,\n} from "@businessLayer/pageActions/shared";`
        : `import { logPageActionInfo } from "@businessLayer/pageActions/shared";`;

    const body: string[] = [
        `// ${toRepoRelative(args.actionFilePath)}`,
        "",
        `import type { PageAction } from "@businessLayer/pageActions/shared";`,
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
