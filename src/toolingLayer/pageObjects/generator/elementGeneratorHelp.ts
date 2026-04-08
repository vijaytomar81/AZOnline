// src/toolingLayer/pageObjects/generator/elementGeneratorHelp.ts

export function usage(): string {
  return `
Page Elements Generator CLI

Usage:
  npm run generator -- generate [options]

Description:
  Generates and incrementally syncs:
    - elements.ts
    - aliases.generated.ts
    - aliases.ts
    - <PageName>Page.ts
  from page-map JSON files.

Options

  --mapsDir <path>         Page-maps directory
                           (default: src/pages/maps)

  --pageObjectsDir <path>  Page objects output directory
                           (default: src/pages/objects)

  --pageRegistryDir <path> Page registry directory
                           (default: src/pages)

  --merge                  Incremental merge/update mode

  --changedOnly            Only process page-maps whose hash differs
                           from src/pages/.manifest/pages/<pageKey>.json

  --verbose                Enable debug logging

  --logToFile              Write logs to file

  --logFilePath <path>     Custom log file path

  --help, -h               Show this help

Examples

  npm run generator:elements
  npm run generator:elements:verbose
  npm run generator:elements:changed
  npm run generator:elements:changed:verbose

Notes

  - Change detection uses manifest page files, not a state file.
  - elements.ts includes stableKey when present in page-map.
  - aliases.ts preserves business-friendly LHS alias names.
  - PageObject.ts syncs managed methods from aliases.ts.
`.trim();
}