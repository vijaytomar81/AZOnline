// src/tools/page-elements-validator/cli.ts
import { createLogger } from "../../utils/logger";
import { normalizeArgv } from "../../utils/argv";
import { usage } from "./validatorHelp";

import { runValidateCommand } from "./commands/validate";
import { runRepairCommand } from "./commands/repair";
import { runDoctorCommand } from "./commands/doctor";

type CommandName = "validate" | "repair" | "doctor" | "help";

// Help topics are the real commands + "root" (general help)
type HelpTopic = "root" | Exclude<CommandName, "help">;

function isCommand(x: string | undefined): x is CommandName {
    return x === "validate" || x === "repair" || x === "doctor" || x === "help";
}

function isHelpTopic(x: string | undefined): x is HelpTopic {
    return x === "root" || x === "validate" || x === "repair" || x === "doctor";
}

const log = createLogger({
    prefix: "[validator]",
    withTimestamp: true,
});

async function main() {
    const argv = normalizeArgv(process.argv.slice(2));
    const cmd = argv[0];

    // support:
    //   node .../cli.ts help
    //   node .../cli.ts help validate
    if (cmd === "help") {
        const topicArg = argv[1];
        const topic: HelpTopic = isHelpTopic(topicArg) ? topicArg : "root";
        log.info(usage(topic));
        return;
    }

    if (!isCommand(cmd)) {
        log.error(`Unknown or missing command: ${cmd ?? "(none)"}`);
        log.info(usage("root"));
        process.exit(1);
    }

    const args = argv.slice(1);

    // If user does: validate --help (or repair/doctor --help), show command help here
    if (args.includes("--help") || args.includes("-h")) {
        // cmd cannot be "help" here, so it's safe to treat as HelpTopic
        log.info(usage(cmd as Exclude<CommandName, "help">));
        return;
    }

    switch (cmd) {
        case "validate":
            await runValidateCommand(args);
            return;
        case "repair":
            await runRepairCommand(args);
            return;
        case "doctor":
            await runDoctorCommand(args);
            return;
    }
}

main().catch((e) => {
    log.error(e?.message || String(e));
    process.exit(1);
});