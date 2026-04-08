// src/toolingLayer/pageObjects/validator/cli.ts

import { normalizeArgv } from "@utils/argv";
import { printCommandTitle } from "@utils/cliFormat";
import { createLogger } from "@utils/logger";

import { usage } from "./validatorHelp";
import { runValidateCommand } from "./commands/validate";

let log = createLogger({
    prefix: "[page-object-validator]",
    logLevel: "info",
    withTimestamp: true,
});

function isHelp(argv: string[]): boolean {
    const args = normalizeArgv(argv);

    return (
        args.length === 0 ||
        args[0] === "help" ||
        args.includes("--help") ||
        args.includes("-h")
    );
}

async function main() {
    printCommandTitle("PAGE OBJECT VALIDATOR", "validateIcon");

    const argv = normalizeArgv(process.argv.slice(2));

    if (isHelp(argv)) {
        log.info(usage());
        return;
    }

    const command = argv[0];
    const args = argv.slice(1);

    switch (command) {
        case "validate":
            await runValidateCommand(args);
            return;

        default:
            log.error(`Unknown command: ${command}`);
            log.info("");
            log.info(usage());
            process.exit(1);
    }
}

main().catch((error) => {
    log.error(error?.message || String(error));
    process.exit(1);
});