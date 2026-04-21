// src/toolingLayer/pageObjects/generator/elementGeneratorHelp.ts

export function usage(): string {
  return `
Page Elements Generator CLI

Usage:
  npm run pageobjects:generate
  npm run pageobjects:generate -- [options]

Description:
  Generates and incrementally syncs:
    - elements.ts
    - aliases.generated.ts
    - aliases.ts
    - <PageName>Page.ts
  from page-map JSON files.

Behavior:
  The generator uses a single command path and determines the result per page:

    - created   : generated outputs were missing and created
    - updated   : existing outputs were updated from changed page-map input
    - unchanged : no updates were required
    - failed    : generation failed for that page

Options

  --mapsDir <path>         Page-maps directory
                           (default: src/businessLayer/pageScanner)

  --pageObjectsDir <path>  Page objects output directory
                           (default: src/businessLayer/pageObjects/objects)

  --pageRegistryDir <path> Page registry directory
                           (default: src/businessLayer/pageObjects)

  --verbose                Enable debug logging

  --logToFile              Write logs to file

  --logFilePath <path>     Custom log file path

  --help, -h               Show this help

Examples

  npm run pageobjects:generate
  npm run pageobjects:generate -- --verbose

Notes

  - Change detection uses manifest page files, not a state file.
  - elements.ts includes stableKey when present in page-map.
  - aliases.ts preserves business-friendly LHS alias names.
  - PageObject.ts syncs managed methods from aliases.ts.
  - There is no separate changed-only or merge command.
`.trim();
}
