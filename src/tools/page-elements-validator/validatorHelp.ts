// src/tools/page-elements-validator/validatorHelp.ts

type HelpTopic = "root" | "validate" | "repair" | "doctor";

export function usage(topic: HelpTopic = "root"): string {
    switch (topic) {
        case "validate":
            return validateHelp();
        case "repair":
            return repairHelp();
        case "doctor":
            return doctorHelp();
        default:
            return rootHelp();
    }
}

function rootHelp(): string {
    return `
Page Elements Validator CLI

Usage:
  npm run validate -- <command> [options]
  node -r ts-node/register src/page-elements-validator/cli.ts <command> [options]

Commands:
  validate   Validate page-maps ↔ generated outputs (elements/aliases/page objects)
  repair     Recreate missing outputs / resync page objects when needed
  doctor     Diagnose environment & config for validator/generator
  help       Show help (global or for a command)

Help:
  npm run validate -- help
  npm run validate -- help validate
  npm run validate -- validate --help
  npm run validate -- repair --help

Common examples:
  # Validate everything
  npm run validate -- validate

  # Verbose output
  npm run validate -- validate --verbose

  # Strict mode (fail on warnings)
  npm run validate -- validate --strict

  # Skip index hygiene checks
  npm run validate -- validate --noIndexHygiene

  # Repair missing outputs and resync page objects
  npm run validate -- repair --verbose

  # Environment checks
  npm run validate -- doctor --verbose
`.trim();
}

function validateHelp(): string {
    return `
validate — checks consistency between page-maps and generated outputs

Usage:
  npm run validate -- validate [options]

Options:
  --mapsDir <path>       Page-maps directory
                         (default: src/page-scanner/page-maps)

  --pagesDir <path>      Pages output directory
                         (default: src/pages)

  --noIndexHygiene       Skip src/pages index/pageManager hygiene checks
  --strict               Fail if warnings exist
  --verbose              Extra logs
  --help, -h             Show this help

Examples:
  npm run validate -- validate
  npm run validate -- validate --verbose
  npm run validate -- validate --strict
  npm run validate -- validate --noIndexHygiene
  npm run validate -- validate --mapsDir src/page-scanner/page-maps --pagesDir src/pages
`.trim();
}

function repairHelp(): string {
    return `
repair — recreate missing outputs / re-sync page objects

Usage:
  npm run validate -- repair [options]

What it does:
  - Recreates missing generated outputs (aliases.ts, aliases.generated.ts, Page.ts stubs, etc.)
  - Re-syncs Page object methods from aliases.ts when aliases.ts changed
  - Updates state hash file (if configured)

Options:
  --mapsDir <path>       (default: src/page-scanner/page-maps)
  --pagesDir <path>      (default: src/pages)

  --stateDir <path>      State directory (hash cache)
                         (default: src/page-elements-generator/.state)

  --stateFile <path>     State file path
                         (default: <stateDir>/page-maps-state.json)

  --merge                (informational; forwarded)
  --changedOnly          Only process changed page-maps, but still recreates missing outputs
  --stateOnly            Only update state hashes (no elements.ts writes)
  --noScaffold           Do not create create-only files (aliases.ts / Page.ts stubs)
  --verbose
  --help, -h

Examples:
  npm run validate -- repair
  npm run validate -- repair --verbose
  npm run validate -- repair --changedOnly --verbose
  npm run validate -- repair --noScaffold --verbose
`.trim();
}

function doctorHelp(): string {
    return `
doctor — diagnose environment & config

Usage:
  npm run validate -- doctor [options]

Checks:
  - mapsDir/pagesDir/stateDir/stateFile exist
  - directories are writable
  - page-maps count > 0

Options:
  --mapsDir <path>       (default: src/page-scanner/page-maps)
  --pagesDir <path>      (default: src/pages)
  --stateDir <path>      (default: src/page-elements-generator/.state)
  --stateFile <path>     (default: <stateDir>/page-maps-state.json)
  --verbose
  --help, -h

Examples:
  npm run validate -- doctor
  npm run validate -- doctor --verbose
`.trim();
}