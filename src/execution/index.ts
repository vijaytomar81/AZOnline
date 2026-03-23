// src/execution/index.ts

import { getArg, hasFlag, normalizeArgv } from "../utils/argv";
import { createLogger } from "../utils/logger";
import { startTimer } from "../utils/time";
import { normalizeSpaces } from "../utils/text";
import { createExecutionBootstrap } from "./runtime/bootstrap";
import { loadScenarioSheet } from "./runtime/loadScenarioSheet";
import { parseScenarios } from "./scenario/parser";
import { runScenario } from "./runners/scenarioRunner";
import type { ExecutionScenario } from "./scenario/types";

function usage(): string {
    return [
        "Usage:",
        "  ts-node src/execution/index.ts --excel <path> --sheet <name> [options]",
        "",
        "Options:",
        "  --scenario <id,id2>     Run only selected ScenarioId values",
        "  --includeDisabled       Include rows where Execute != Y",
        "  --verbose               Enable debug logging",
        "  --help                  Show help",
    ].join("\n");
}

function parseScenarioFilter(raw?: string): string[] {
    return normalizeSpaces(String(raw ?? ""))
        .split(",")
        .map((item) => normalizeSpaces(item))
        .filter(Boolean);
}

function filterScenarios(
    scenarios: ExecutionScenario[],
    selectedIds: string[]
): ExecutionScenario[] {
    if (!selectedIds.length) return scenarios;
    const wanted = new Set(selectedIds);
    return scenarios.filter((item) => wanted.has(item.scenarioId));
}

async function main(): Promise<void> {
    const argv = normalizeArgv(process.argv.slice(2));
    if (hasFlag(argv, "--help") || hasFlag(argv, "-h")) {
        console.log(usage());
        return;
    }

    const excelPath = normalizeSpaces(String(getArg(argv, "--excel") ?? ""));
    const sheetName = normalizeSpaces(String(getArg(argv, "--sheet") ?? ""));
    const selectedIds = parseScenarioFilter(String(getArg(argv, "--scenario") ?? ""));
    const includeDisabled = hasFlag(argv, "--includeDisabled");
    const verbose = hasFlag(argv, "--verbose");
    const timer = startTimer();

    if (!excelPath) throw new Error("Missing --excel");
    if (!sheetName) throw new Error("Missing --sheet");

    const log = createLogger({
        prefix: "[execution]",
        logLevel: verbose ? "debug" : "info",
        withTimestamp: true,
        logToFile: false,
    });

    log.info("Starting execution engine...");
    log.info(`Input -> excel=${excelPath}, sheet=${sheetName}`);
    log.debug(
        `Options -> includeDisabled=${includeDisabled}, selectedScenarios=${selectedIds.join(", ")}`
    );

    const bootstrap = createExecutionBootstrap({ log });
    const loaded = await loadScenarioSheet({
        excelPath,
        sheetName,
        log: log.child("loader"),
    });

    const parsed = parseScenarios(loaded.rows, {
        includeDisabled,
        failOnTemplateErrors: true,
        failOnValidationErrors: true,
    });

    const scenarios = filterScenarios(parsed.scenarios, selectedIds);
    if (!scenarios.length) {
        throw new Error("No scenarios selected for execution.");
    }

    log.info(`Scenarios ready for execution: ${scenarios.length}`);

    let passed = 0;
    let failed = 0;

    for (const scenario of scenarios) {
        const result = await runScenario({
            scenario,
            registry: bootstrap.executorRegistry,
            dataRegistry: bootstrap.stepDataRegistry,
            log: log.child(scenario.scenarioId),
        });

        if (result.status === "passed") passed++;
        else failed++;
    }

    log.info(
        `Execution completed -> total=${scenarios.length}, passed=${passed}, failed=${failed}`
    );
    log.info(`Total time -> ${timer.elapsedSecondsText()}`);
}

main().catch((error: unknown) => {
    const log = createLogger({
        prefix: "[execution]",
        logLevel: "debug",
        withTimestamp: true,
        logToFile: false,
    });

    const message = error instanceof Error ? error.message : String(error);
    log.error(message);
    process.exit(1);
});