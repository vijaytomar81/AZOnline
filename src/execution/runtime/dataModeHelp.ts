// src/execution/runtime/dataModeHelp.ts

import path from "node:path";
import { dataDefinitionRegistry } from "../../data/data-definitions/registry";
import { toKebabFromSnake } from "../../utils/text";

function safeSheetFilename(name: string): string {
    return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim() || "Sheet";
}

function preferredAlias(aliases: string[], fallback: string): string {
    return aliases.find((alias) => !alias.toLowerCase().includes("template")) ?? aliases[0] ?? fallback;
}

export function printDataModeHelp(): void {
    const rows = Object.values(dataDefinitionRegistry)
        .filter((item) => item.schema.dataDefinitionGroup === "newBusiness")
        .map((item) => {
            const source = preferredAlias(item.sheetAliases ?? [], item.name);
            return {
                source,
                schema: item.name,
                jsonPath: path.join(
                    "src",
                    "data",
                    "generated",
                    "new-business",
                    toKebabFromSnake(item.name),
                    `${safeSheetFilename(source)}.json`
                ),
            };
        })
        .sort((a, b) => a.source.localeCompare(b.source));

    const maxSource = Math.max("Source Name".length, ...rows.map((r) => r.source.length));
    const maxSchema = Math.max("Schema Name".length, ...rows.map((r) => r.schema.length));

    console.log("Usage:");
    console.log("  npm run execution -- --mode data --source <name> [options]");
    console.log("");
    console.log("Options:");
    console.log("  --source <name>         Data source name");
    console.log("  --schema <name>         Optional schema override");
    console.log("  --iterations <n>        Number of iterations (default: 1)");
    console.log("  --verbose               Enable debug logging");
    console.log("  --help                  Show help");
    console.log("");
    console.log("Available data sources:");
    console.log(`  ${"Source Name".padEnd(maxSource)}  -> ${"Schema Name".padEnd(maxSchema)}  -> Generated JSON Path`);
    console.log(`  ${"-".repeat(maxSource + maxSchema + 28)}`);

    rows.forEach((row) => {
        console.log(
            `  - ${row.source.padEnd(maxSource)}  -> ${row.schema.padEnd(maxSchema)}  -> ${row.jsonPath}`
        );
    });

    console.log("");
    console.log("Next step:");
    console.log('  If JSON is missing, build data first using your data-builder command and the matching sheet/source.');
}