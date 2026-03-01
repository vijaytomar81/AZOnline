import { runScanCommand } from "./commands/scan";
import { runGenerateCommand } from "./commands/generate";
import { createLogger } from "./logger";

async function main() {
    const command = process.argv[2];

    switch (command) {
        case "scan":
            await runScanCommand();
            break;

        case "generate":
            await runGenerateCommand();
            break;

        default:
            throw new Error(
                `Unknown command "${command}". Use: scan | generate`
            );
    }
}

main().catch((e) => {
    const log = createLogger({
        prefix: "[scanner]",
        verbose: true,
        withTimestamp: true,
    });

    log.error(e?.message || String(e));
    process.exit(1);
});