// src/dataLayer/builder/help.ts

import { listSchemas } from "../data-definitions";

export function usage(): string {
    const schemas = listSchemas().join(", ");

    return `
Data Builder CLI

Usage:
  ts-node src/data/builder/index.ts --excel <path> --sheet <name> --platform <name> --application <name> --product <name> --journeyContext <name> [options]

Required:
  --excel <path>              Path to Excel file
  --sheet <name>              Sheet name to process
  --platform <name>           Platform
  --application <name>        Application
  --product <name>            Product
  --journeyContext <name>     Journey context

Optional:
  --journeySubType <name>     Required when journeyContext=MTA
                              Allowed: ChangeAddress, ChangeVehicle, AddDriver, RemoveDriver

  --schema <name>             Schema name
                              Available: ${schemas}

  --out <path>                Output file OR folder
  --ids <id1,id2>             Filter by script IDs
  --excludeEmptyFields        Remove empty mapped fields from JSON
  --strictValidation          Enable strict validation checks
  --verbose                   Enable debug logs
  --help, -h                  Show help

Environment variable equivalents:
  EXCEL_PATH
  SHEET
  SCHEMA
  OUT_PATH
  SCRIPT_IDS
  EXCLUDE_EMPTY_FIELDS
  STRICT_VALIDATION
  VERBOSE
  PLATFORM
  APPLICATION
  PRODUCT
  JOURNEY_CONTEXT
  JOURNEY_SUB_TYPE
`.trim();
}
