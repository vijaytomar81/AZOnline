// src/data/data-builder/dataBuilderHelp.ts

export function usage(): string {
    return `
Data Builder CLI

Usage:
  ts-node src/data/data-builder/index.ts --excel <path> --sheet <name> [options]

Required:
  --excel <path>        Path to Excel file
  --sheet <name>        Sheet name to process

Optional:
  --out <path>          Output file OR folder
                        (default: src/data/generated/<sheet>.json)
  --ids <id1,id2>       Filter by script IDs (comma-separated, ranges supported)
  --includeEmptyChildFields <true|false>
  --verbose
  --help, -h

Environment variable equivalents:
  EXCEL_PATH
  SHEET
  OUT_PATH
  SCRIPT_IDS
  INCLUDE_EMPTY_CHILD_FIELDS
  VERBOSE
`.trim();
}