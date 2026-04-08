// src/toolingLayer/businessJourneys/generator/generator/render/renderIndexFile.ts

import { toRepoRelative } from "@utils/paths";

export function renderIndexFile(args: {
    filePath: string;
    exports: Array<{ exportName?: string; from: string }>;
}): string {
    const body = args.exports
        .map((item) =>
            item.exportName
                ? `export { ${item.exportName} } from "./${item.from}";`
                : `export * from "./${item.from}";`
        )
        .join("\n");

    return `// ${toRepoRelative(args.filePath)}

${body}
`;
}
