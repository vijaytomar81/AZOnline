// src/execution/modes/e2e/help.ts

export function usage(): string {
    return [
        "Usage:",
        "  npm run execution -- --mode e2e --excel <path> --sheet <name> [options]",
        "",
        "Options:",
        "  --scenario <id,id2>     Run only selected ScenarioId values",
        "  --includeDisabled       Include rows where Execute != Y",
        "  --iterations <n>        Repeat selected scenarios",
        "  --verbose               Enable debug logging",
        "  --help                  Show help",
    ].join("\n");
}