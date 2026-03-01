// src/scanner/elements-generator/builders/buildAliasesHumanTs.ts

import type { PageMap } from "../types";

export function buildAliasesHumanTs(pageMap: PageMap): string {
    const lines: string[] = [];

    lines.push(`// HUMAN-MAINTAINED FILE`);
    lines.push(`// pageKey: ${pageMap.pageKey}`);
    lines.push(`//`);
    lines.push(`// Put business-friendly aliases here. Example:`);
    lines.push(`// export const aliases = {`);
    lines.push(`//   continue: "next",`);
    lines.push(`//   vrn: "whatSYourCarRegistrationNumber",`);
    lines.push(`// } as const;`);
    lines.push(``);
    lines.push(`import type { ElementKey } from "./elements";`);
    lines.push(`import { aliasesGenerated } from "./aliases.generated";`);
    lines.push(``);
    lines.push(`// Start empty. You can map business names -> ElementKey.`);
    lines.push(`export const aliases = {`);
    lines.push(`  // example: continue: aliasesGenerated.next,`);
    lines.push(`} as Record<string, ElementKey>;`);
    lines.push(``);
    lines.push(`export const allAliases = { ...aliasesGenerated, ...aliases } as const;`);
    lines.push(`export type AliasKey = keyof typeof allAliases;`);

    return lines.join("\n");
}