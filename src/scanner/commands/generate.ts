import path from "node:path";
import { createLogger } from "../logger";
import { runElementsGenerator } from "../elements-generator/runner";

function hasFlag(name: string) {
    return process.argv.includes(name);
}

export async function runGenerateCommand() {
    const log = createLogger({
        prefix: "[scanner]",
        verbose: hasFlag("--verbose"),
        withTimestamp: true,
    });

    await runElementsGenerator({
        mapsDir: path.join(process.cwd(), "src", "page-maps"),
        pagesDir: path.join(process.cwd(), "src", "pages"),
        merge: hasFlag("--merge"),
        verbose: hasFlag("--verbose"),
        changedOnly: hasFlag("--changedOnly"),
        stateOnly: hasFlag("--stateOnly"),
        scaffold: !hasFlag("--noScaffold"),
        log,
    });
}