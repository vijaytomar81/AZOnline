// src/tools/file-header-checker/cli.ts

import { normalizeArgv, hasFlag } from "@utils/argv";
import { runHeaderChecker } from "./checker";
import type { HeaderCheckMode } from "./checker";
import { usage } from "./fileHeaderCheckerHelp";

function main() {
    const argv = normalizeArgv(process.argv.slice(2));

    if (hasFlag(argv, "--help") || hasFlag(argv, "-h")) {
        console.log(usage());
        process.exit(0);
    }

    const mode: HeaderCheckMode = hasFlag(argv, "--checkMode")
        ? "checkMode"
        : "fixMode";

    runHeaderChecker(mode);
}

main();
