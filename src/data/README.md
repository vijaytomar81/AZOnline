# Data Builder

---

# 1. Overview

The **Data Builder** converts structured **Excel test data** into normalized **JSON test cases** used by the automation framework.

It reads Excel sheets maintained by business or QA users and transforms them into a consistent JSON structure driven by **schema definitions**.

The generated JSON files become the **runtime data source for automated tests**.

The Data Builder ensures that:

- Excel remains **human-friendly for business users**
- JSON remains **automation-friendly for test execution**
- generated artifacts remain **traceable and discoverable**
- execution can resolve the latest generated data via **manifest lookup**

---

# 2. Purpose

The Data Builder automates the transformation of Excel test sheets into structured JSON test data.

Its primary goals are:

- convert Excel test data into structured JSON
- support multiple insurance journeys and entry points
- enforce consistent data structure
- reduce manual JSON maintenance
- allow business teams to maintain test data
- enable scalable automated testing
- maintain a generated data manifest for runtime lookup

---

# 3. Toolchain Context

~~~mermaid
flowchart LR

    subgraph Business Data Layouts
        A1[Tabular Layout<br/>Direct / FlowNB]
        A2[Vertical Layout<br/>PCW Tool]
    end

    subgraph Scenario Layout
        A3[E2E Scenario Sheet]
    end

    A1 --> B[Data Builder]
    A2 --> B

    B --> C[Generated JSON]
    B --> V[Validation Report JSON]
    B --> D[Manifest index.json]

    C --> E[Test Execution]
    D --> E

    V --> F[Debug / QA Analysis]

    A3 --> E
~~~

---

# 4. Inputs

## Excel Test Data

Each column = **test case**  
Each row = **field**

---

## Sheet Name

Examples:

- FlowNB
- PCW-Tool
- Direct
- CNF
- CTM
- GoCo
- MSM

---

## Schema Resolution (IMPORTANT)

Schema is auto-resolved from sheet name.

Priority:

1. CLI (`--schema`)
2. ENV (`SCHEMA`)
3. Sheet → Schema resolution

Example:

| Sheet | Schema |
|------|--------|
| FlowNB | direct |
| Direct | direct |
| PCW-Tool | pcw_tool |
| CNF | cnf |

Defined in the current schema registry / resolver under:

    src/data/data-definitions

---

# 5. Outputs

## Test Data JSON

Generated under schema-specific folders:

    src/data/generated/new-business/<schema>/<Sheet>.json
    src/data/generated/new-business/<schema>/<Sheet>_<timestamp>.json

Example:

    src/data/generated/new-business/direct/FlowNB_20260324_124611_785.json
    src/data/generated/new-business/pcw-tool/PCW-Tool_20260324_183426_963.json

---

## Validation Report

Generated alongside the JSON:

    src/data/generated/new-business/<schema>/<Sheet>.validation.json
    src/data/generated/new-business/<schema>/<Sheet>.validation_<timestamp>.json

Example:

    src/data/generated/new-business/direct/FlowNB.validation_20260324_124611_786.json
    src/data/generated/new-business/pcw-tool/PCW-Tool.validation_20260324_183426_963.json

---

## Generated Manifest

A central manifest is also maintained:

    src/data/generated/index.json

This stores:

- logical key
- sheet name
- schema name
- generated JSON path
- validation report path
- case count
- generated timestamp

Execution now uses this manifest as the **source of truth** for locating generated data.

---

# 6. Artifact Handling

## Modes

### Timestamp Mode

If enabled:

    <name>_yyyymmdd_hhmmss_mmm.json

Example:

    FlowNB_20260324_124611_785.json

### Non-Timestamp Mode

If disabled:

    FlowNB.json

---

## Archive Folder

Archived artifacts are stored under:

    src/data/generated/archive/

In practice, archive is organized by domain and schema.

Example:

    src/data/generated/archive/new-business/direct/
    src/data/generated/archive/new-business/pcw-tool/

Behavior:

- existing active files are moved to archive before new write
- archive folders are auto-created
- matching archive files may be replaced
- only latest N archived files are retained

---

## Config

Defined in:

    src/config/execution.config.ts

Current shape:

    executionConfig.generatedArtifacts = {
      withTimestamp: boolean,
      maxToKeep: number
    }

ENV:

    ARTIFACTS_WITH_TIMESTAMP=true
    MAX_ARTIFACTS_TO_KEEP=30

---

# 7. Manifest Design

The generated manifest is key-based, not array-based.

Example key:

    new-business:pcw_tool:PCW-Tool

Example structure:

~~~json
{
  "generatedAt": "2026-03-24T23:23:05.165Z",
  "data": {
    "new-business:pcw_tool:PCW-Tool": {
      "key": "new-business:pcw_tool:PCW-Tool",
      "domain": "new-business",
      "sheetName": "PCW-Tool",
      "schemaName": "pcw_tool",
      "filePath": "src/data/generated/new-business/pcw-tool/PCW-Tool_20260325_002225_270.json",
      "validationReportPath": "src/data/generated/new-business/pcw-tool/PCW-Tool.validation_20260325_002225_271.json",
      "caseCount": 2,
      "generatedAt": "2026-03-24T23:22:25.271Z"
    }
  }
}
~~~

Manifest key format:

    <domain>:<schemaName>:<sheetName>

Example:

    new-business:direct:FlowNB
    new-business:pcw_tool:PCW-Tool

---

# 8. Runtime Resolution

Execution resolves generated data in this order:

1. explicit `CASES_FILE`
2. generated manifest (`src/data/generated/index.json`)

Folder scanning fallback has been removed.  
This means the manifest is now the authoritative lookup mechanism for generated test data.

---

# 9. Schema System

The schema system supports:

- field mapping
- nested structure
- repeated groups
- section-aware validation
- schema-driven case building

Defined under:

    src/data/data-definitions

---

# 10. Data Builder Pipeline

~~~mermaid
flowchart TD

    subgraph Business Data Layouts
        A1[Tabular Layout<br/>Direct / FlowNB]
        A2[Vertical Layout<br/>PCW Tool]
    end

    A1 --> B[load-excel]
    A2 --> B

    B --> C[validate-schema]
    C --> D[extract-meta]
    D --> E[build-cases]
    E --> F[filter-scriptIds]
    F --> G[transform-values]
    G --> H[write-json]

    H --> I[Generated JSON]
    H --> J[Validation Report JSON]
    H --> K[index.json Manifest]
~~~

---

# 11. Validation System

Validation report structure:

~~~json
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
~~~

Validation helps detect:

- schema mismatches
- missing required Excel fields
- unused Excel fields
- structural issues before runtime

---

# 12. CLI Usage

Basic usage:

    npm run data -- --excel file.xlsx --sheet FlowNB

Examples:

    npm run data -- --excel "sampleData/New Business.xlsx" --sheet FlowNB
    npm run data -- --excel "sampleData/New Business.xlsx" --sheet "PCW-Tool"

---

# 13. Required Arguments

| Argument | Description |
|----------|------------|
| `--excel` | Excel file path |
| `--sheet` | Sheet name |

---

# 14. Optional Arguments

| Argument | Description |
|----------|------------|
| `--schema` | Override schema |
| `--ids` | Filter Script IDs |
| `--excludeEmptyFields` | Remove empty values |
| `--strictValidation` | Enable strict validation |
| `--out` | Custom output path |
| `--verbose` | Debug logs |

---

# 15. Strict Validation

Normal validation includes:

- required field validation
- mapping validation
- schema vs Excel consistency checks

Strict validation can additionally enforce:

- duplicate checks
- repeated group consistency
- stricter schema completeness rules

---

# 16. Example Commands

    npm run data -- --excel file.xlsx --sheet FlowNB
    npm run data -- --excel "sampleData/New Business.xlsx" --sheet "PCW-Tool"
    npm run data:build:strict
    npm run data:build:noEmpty:strict

---

# 17. Adding New Journeys

To add a new journey:

1. add or update schema definition
2. update schema resolution / aliases
3. run builder for the target sheet
4. verify generated JSON + validation report + manifest entry

---

# 18. Utilities

Common utility support lives under:

    src/utils

Includes:

- logging
- CLI parsing
- timers
- file helpers
- artifact handling
- path resolution

---

# 19. Design Principles

The Data Builder is designed to be:

- schema-driven
- plugin-based
- scalable
- business-friendly
- automation-ready
- manifest-backed for runtime resolution

---

# 20. Summary

The Data Builder provides a scalable pipeline for converting Excel test data into structured JSON.

It enables:

- business-friendly test data maintenance
- schema-driven automation
- consistent test structures
- scalable testing
- deterministic runtime resolution through manifest lookup

---

# 21. Data Builder + Runtime Resolution Flow

~~~mermaid
flowchart LR

    subgraph Business_Data_Layouts
        A0[Tabular Layout<br/>Direct / FlowNB]
        A00[Vertical Layout<br/>PCW Tool]
    end

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
        C1[data-definitions/index.ts]
        C2[data-definitions/registry.ts]
        C3[data-definitions/types.ts]
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

    subgraph Runtime
        R1[src/data/runtime/generatedManifest.ts]
        R2[src/data/runtime/getCasesFile.ts]
    end

    subgraph Output
        F1[src/data/generated/new-business/*/*.json]
        F2[src/data/generated/new-business/*/*.validation.json]
        F3[src/data/generated/archive/*]
        F4[src/data/generated/index.json]
    end

    A0 --> D1
    A00 --> D1

    A --> A1
    A1 --> C1
    A1 --> B1

    B1 --> D1
    D1 --> D2
    D2 --> D3
    D3 --> D4
    D4 --> D5
    D5 --> D6
    D6 --> D7

    C1 --> D2
    C2 --> D2
    C3 --> D2

    C1 --> D4
    C2 --> D4
    C3 --> D4

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
    D7 --> F4

    F4 --> R1
    R1 --> R2
~~~

---
