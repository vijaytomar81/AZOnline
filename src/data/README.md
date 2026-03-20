# Data Builder

---

# 1. Overview

The **Data Builder** converts structured **Excel test data** into normalized **JSON test cases** used by the automation framework.

It reads Excel sheets containing business-maintained test data and transforms them into a consistent JSON structure driven by a **schema definition**.

The generated JSON files become the **runtime data source for automated tests**.

The Data Builder ensures that:

- Excel remains **human-friendly for business users**
- JSON remains **automation-friendly for test execution**

---

# 2. Purpose

The Data Builder automates the transformation of Excel test sheets into structured test data.

Its primary goals are:

- convert Excel test data into structured JSON
- support multiple insurance journeys
- enforce consistent data structure
- reduce manual JSON maintenance
- allow business teams to maintain test data
- enable scalable automated testing

---

# 3. Toolchain Context

~~~mermaid
flowchart LR
    A[Excel Test Data] --> B[Data Builder]
    B --> C[Generated JSON Test Cases]
    C --> D[Test Execution]
~~~

---

# 4. Inputs

## Excel Test Data

Each column = **test case**  
Each row = **field**

---

## Sheet Name

Example:  
Direct, CNF, CTM, GoCo, MSM, FlowNB

---

## Schema Resolution (IMPORTANT)

Schema is auto-resolved from sheet name.

Priority:

1. CLI (--schema)
2. ENV (SCHEMA)
3. Sheet → Schema mapping

Example:

| Sheet | Schema |
|------|--------|
| FlowNB | direct |
| Direct | direct |
| CNF | cnf |

Defined in:

    src/data/input-data-schema/sheet-schema.mapping.ts

---

# 5. Outputs

## Test Data JSON

    src/data/generated/<Sheet>.json

## Validation Report

    src/data/generated/<Sheet>.validation.json

---

# 6. Artifact Handling

## Modes

### Overwrite Mode (default)

- Existing files moved to archive
- New file created without timestamp

### Timestamp Mode

    <name>_yyyymmdd_hhmmss.json

---

## Archive Folder

    src/data/generated/archive/

Behavior:

- Existing files moved (no extra timestamp added)
- Archive auto-created
- Existing archive files replaced
- Keeps only latest N files

---

## Config

    executionConfig.generatedArtifacts = {
      withTimestamp: boolean,
      maxToKeep: number
    }

ENV:

    ARTIFACTS_WITH_TIMESTAMP=true
    MAX_ARTIFACTS_TO_KEEP=30

---

# 7. Schema System

- field mapping
- nested structure
- repeated groups

---

# 8. Data Builder Pipeline

~~~mermaid
flowchart TD
    A[Excel File] --> B[load-excel]
    B --> C[validate-schema]
    C --> D[extract-meta]
    D --> E[build-cases]
    E --> F[filter-scriptIds]
    F --> G[transform-values]
    G --> H[write-json]
    H --> I[generated JSON]
~~~

---

# 9. Validation System

Structure:

    {
      "errors": [],
      "missingSchemaFieldsInExcel": {
        "requiredFields": [],
        "bySection": {}
      },
      "missingExcelFieldsInSchema": {
        "unusedExcelFields": []
      },
      "summary": {
        "errorCount": 0,
        "missingSchemaFieldsInExcelCount": 0,
        "missingExcelFieldsInSchemaCount": 0
      }
    }

---

# 10. CLI Usage

    npm run data -- --excel file.xlsx --sheet FlowNB

---

# 11. Required Arguments

| Argument | Description |
|----------|------------|
| --excel | Excel file |
| --sheet | Sheet name |

---

# 12. Optional Arguments

| Argument | Description |
|----------|------------|
| --schema | Override schema |
| --ids | Filter Script IDs |
| --excludeEmptyFields | Remove empty values |
| --strictValidation | Enable strict validation |
| --out | Custom output |
| --verbose | Debug logs |

---

# 13. Strict Validation

Normal:
- required fields
- mapping validation

Strict:
- duplicates
- repeated group consistency
- schema completeness

---

# 14. Example Commands

    npm run data -- --excel file.xlsx --sheet FlowNB
    npm run data:build:strict
    npm run data:build:noEmpty:strict

---

# 15. Adding New Journeys

1. Add schema  
2. Add sheet mapping  
3. Run builder  

---

# 16. Utilities

    src/utils

Includes:

- logging
- CLI parsing
- timers
- artifact handling

---

# 17. Design Principles

- schema-driven
- plugin-based
- scalable
- business-friendly
- automation-ready

---

# 18. Summary

The Data Builder provides a scalable pipeline for converting Excel test data into structured JSON.

It enables:

- business-friendly test data
- schema-driven automation
- consistent test structures
- scalable testing