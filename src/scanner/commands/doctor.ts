// src/scanner/commands/doctor.ts
import { createLogger } from "../logger";

export async function runDoctorCommand(argv: string[]) {
    void argv;
    const log = createLogger({ prefix: "[scanner]", verbose: true, withTimestamp: true });
    log.info("Command: doctor");
    log.info("TODO: diagnose environment (CDP reachable, dirs exist, permissions, etc.) (not implemented yet).");
}