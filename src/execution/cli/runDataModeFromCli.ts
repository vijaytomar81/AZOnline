// src/execution/cli/runDataModeFromCli.ts

import { AppError } from "@utils/errors";
import { runDataMode } from "@execution/modes/data/runner";

export async function runDataModeFromCli(args: {
    source: string;
    schemaArg?: string;
    iterations: number;
    parallel: number;
    verbose: boolean;
}): Promise<void> {
    if (!args.source) {
        throw new AppError({
            code: "EXECUTION_MISSING_SOURCE",
            stage: "cli-parse",
            source: "execution-index",
            message: "Missing --source for data mode.",
        });
    }

    await runDataMode({
        source: args.source,
        schemaArg: args.schemaArg || undefined,
        iterations: args.iterations,
        parallel: args.parallel,
        verbose: args.verbose,
    });
}
