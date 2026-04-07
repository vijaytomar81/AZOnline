// src/tools/pageActions/generator/generator/ensurePageActionIndexes.ts

import fs from "node:fs";
import path from "node:path";
import type { ActionNaming, ActionPathInfo } from "../shared/types";

function upsertLine(filePath: string, line: string): void {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const existing = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, "utf8")
        : "";

    const lines = existing
        .split("\n")
        .map((item) => item.trimEnd())
        .filter(Boolean);

    if (!lines.includes(line)) {
        lines.push(line);
    }

    fs.writeFileSync(filePath, `${lines.join("\n")}\n`);
}

export function ensurePageActionIndexes(args: {
    naming: ActionNaming;
    paths: ActionPathInfo;
}): void {
    const actionImportPath =
        `./${args.paths.group}/` +
        args.naming.actionFileName.replace(".ts", "");

    upsertLine(
        args.paths.rootIndexFile,
        `export * from "./shared";`
    );

    upsertLine(
        args.paths.rootIndexFile,
        `export * from "./actions";`
    );

    upsertLine(
        path.join(path.dirname(args.paths.platformIndexFile), "..", "index.ts"),
        `export * from "./${args.paths.platform}";`
    );

    upsertLine(
        args.paths.platformIndexFile,
        `export { ${args.naming.actionName} } from "${actionImportPath}";`
    );
}
