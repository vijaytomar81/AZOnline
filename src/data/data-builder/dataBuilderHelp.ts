// src/data/data-builder/dataBuilderHelp.ts
import { listSchemas } from "../input-data-schema";

export function usage(): string {
    const schemas = listSchemas().join(", ");

    return `
Data Builder CLI

Usage:
  ts-node src/data/data-builder/index.ts --excel <path> --sheet <name> [options]

Required:
  --excel <path>        Path to Excel file
  --sheet <name>        Sheet name to process

Optional:
  --schema <name>       Schema / journey name
                        (default: master)
                        Available: ${schemas}

  --out <path>          Output file OR folder
                        (default: src/data/generated/<sheet>.json)

  --ids <id1,id2>       Filter by script IDs
                        Supports:
                        1
                        1,2,5
                        1-10
                        1,3-10,15

  --excludeEmptyFields     Remove empty Excel fields from JSON
  
  --verbose             Enable debug logs
  --help, -h            Show help

Environment variable equivalents:
  EXCEL_PATH
  SHEET
  SCHEMA
  OUT_PATH
  SCRIPT_IDS
  INCLUDE_EMPTY_CHILD_FIELDS
  VERBOSE
`.trim();
}