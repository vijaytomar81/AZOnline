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
  node -r ts-node/register src/tools/page-elements-validator/cli.ts <command> [options]

Commands:
  validate   Validate page-maps ↔ generated outputs and page registry
  repair     Recreate missing outputs / resync page objects and registry
  doctor     Diagnose environment & configuration issues
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

  # Skip module hygiene checks
  npm run validate -- validate --noModuleHygiene

  # Repair missing outputs and registry entries
  npm run validate -- repair --verbose

  # Environment diagnostics
  npm run validate -- doctor --verbose
`.trim();
}

function validateHelp(): string {
    return `
validate — checks consistency between page-maps and generated outputs

Validation includes:
  • elements.ts generation
  • aliases.ts / aliases.generated.ts integrity
  • Page object class sync
  • Page registry consistency:
      - src/pages/index.ts
      - src/pages/pageManager.ts
  • Module hygiene checks

Usage:
  npm run validate -- validate [options]

Options:
  --mapsDir <path>       Page-maps directory
                         (default: src/tools/page-scanner/page-maps)

  --pagesDir <path>      Pages output directory
                         (default: src/pages)

  --noModuleHygiene      Skip module hygiene checks for:
                         - src/pages/index.ts
                         - src/pages/pageManager.ts

  --strict               Fail if warnings exist
  --verbose              Extra logs
  --help, -h             Show this help

Examples:
  npm run validate -- validate
  npm run validate -- validate --verbose
  npm run validate -- validate --strict
  npm run validate -- validate --noModuleHygiene
  npm run validate -- validate --mapsDir src/tools/page-scanner/page-maps --pagesDir src/pages
`.trim();
}

function repairHelp(): string {
    return `
repair — recreate missing outputs / re-sync generated files

Repair includes:
  • Recreating missing generated files
      - elements.ts
      - aliases.generated.ts
      - aliases.ts (if missing)
      - Page object stub

  • Re-syncing page object methods if aliases.ts changed

  • Updating page registry entries:
      - src/pages/index.ts
      - src/pages/pageManager.ts

  • Updating state hash file

Usage:
  npm run validate -- repair [options]

Options:
  --mapsDir <path>       (default: src/tools/page-scanner/page-maps)
  --pagesDir <path>      (default: src/pages)

  --stateDir <path>      State directory (hash cache)
                         (default: src/tools/page-elements-generator/.state)

  --stateFile <path>     State file path
                         (default: <stateDir>/page-maps-state.json)

  --merge                Informational flag (forwarded to generator)
  --changedOnly          Only process changed page-maps
  --stateOnly            Only update state hashes (skip elements.ts write)
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
doctor — diagnose environment & configuration

Checks performed:
  • mapsDir exists
  • pagesDir exists
  • stateDir exists
  • stateFile exists
  • directories are writable
  • page-map count > 0

Usage:
  npm run validate -- doctor [options]

Options:
  --mapsDir <path>       (default: src/tools/page-scanner/page-maps)
  --pagesDir <path>      (default: src/pages)

  --stateDir <path>      (default: src/tools/page-elements-generator/.state)
  --stateFile <path>     (default: <stateDir>/page-maps-state.json)

  --verbose
  --help, -h

Examples:
  npm run validate -- doctor
  npm run validate -- doctor --verbose
`.trim();
}