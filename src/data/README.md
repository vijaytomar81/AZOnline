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

# 19. End-to-End Flow

~~~mermaid
flowchart LR

    subgraph CLI
        A[index.ts]
        A1[cli.ts]
    end

    subgraph Core
        B1[pluginLoader.ts]
        B2[pipeline.ts]
        B3[schemaRuntime.ts]
        B4[excelRuntime.ts]
    end

    subgraph Schema
        C1[input-data-schema/index.ts]
        C2[sheet-schema.mapping.ts]
        C3[master-journey.schema.ts]
        C4[types.ts]
    end

    subgraph Plugins
        D1[00-load-excel]
        D2[05-validate-schema]
        D3[10-extract-meta]
        D4[20-build-cases]
        D5[30-filter-scriptIds]
        D6[50-transform-values]
        D7[70-write-json]
    end

    subgraph Utilities
        E1[src/utils/fs.ts]
        E2[src/utils/artifacts.ts]
        E3[src/utils/paths.ts]
    end

    subgraph Output
        F1[src/data/generated/*.json]
        F2[src/data/generated/*.validation.json]
        F3[src/data/generated/archive/*]
    end

    A --> A1
    A1 --> C1
    C2 --> C1
    A1 --> B1

    B1 --> D1
    D1 --> D2
    D2 --> D3
    D3 --> D4
    D4 --> D5
    D5 --> D6
    D6 --> D7

    C1 --> D2
    C3 --> D2
    C4 --> D2

    C1 --> D4
    C3 --> D4
    C4 --> D4

    B3 --> D4
    B4 --> D2
    B4 --> D3
    B4 --> D4

    E1 --> E2
    E2 --> D7
    E3 --> D7

    D7 --> F1
    D7 --> F2
    D7 --> F3
~~~
