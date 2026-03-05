// src/page-elements-generator/elementGeneratorHelp.ts

export function usage(): string {
    return `
Page Elements Generator CLI

Usage:
  npm run generate -- [options]
  node -r ts-node/register src/page-elements-generator/cli.ts [options]

Description:
  Generates:
    - elements.ts
    - aliases.generated.ts
    - aliases.ts (create-only)
    - <PageName>Page.ts (create-only stub)
  from page-map JSON files.

------------------------------------------------------------
Options

  --mapsDir <path>       Page-maps directory
                         (default: src/page-scanner/page-maps)

  --pagesDir <path>      Pages output directory
                         (default: src/pages)

  --stateDir <path>      State directory (hash cache)
                         (default: src/page-elements-generator/.state)

  --stateFile <path>     State file path
                         (default: <stateDir>/page-maps-state.json)

  --merge                Overwrite-safe generation (normal mode)

  --changedOnly          Only process page-maps whose JSON changed
                         (still repairs missing outputs & resyncs)

  --stateOnly            Only update state hashes (no elements.ts writes)

  --noScaffold           Do NOT create create-only files
                         (aliases.ts / Page.ts stubs)

  --verbose              Enable debug logging

  --logToFile            Write logs to file

  --logFilePath <path>   Custom log file path
                         (default: page-elements-generator.log)

  --help, -h             Show this help

------------------------------------------------------------
Examples

  # Normal generation
  npm run generate -- --merge

  # Verbose
  npm run generate -- --merge --verbose

  # Only changed page-maps
  npm run generate -- --changedOnly --merge --verbose

  # Only update hash state
  npm run generate -- --stateOnly --verbose

  # Custom directories
  npm run generate -- --mapsDir ./custom-maps --pagesDir ./custom-pages

------------------------------------------------------------
Notes

  - Default page-maps location:
      src/page-scanner/page-maps

  - State (hash cache) is stored in:
      src/page-elements-generator/.state

  - --changedOnly still recreates missing outputs and
    resyncs page objects if aliases.ts changed.

`.trim();
}