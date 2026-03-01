// src/scanner/commands/validate.ts
import { createLogger } from "../logger";

export async function runValidateCommand(argv: string[]) {
    void argv;
    const log = createLogger({ prefix: "[scanner]", verbose: true, withTimestamp: true });
    log.info("Command: validate");
    log.info("TODO: validate page-maps ↔ generated outputs consistency (not implemented yet).");
}