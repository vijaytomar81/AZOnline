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

Defined under:

```
src/data/data-definitions
```

---

# 5. Outputs

## Test Data JSON

```
src/data/generated/new-business/<schema>/<Sheet>.json
src/data/generated/new-business/<schema>/<Sheet>_<timestamp>.json
```

---

## Validation Report

```
src/data/generated/new-business/<schema>/<Sheet>.validation.json
src/data/generated/new-business/<schema>/<Sheet>.validation_<timestamp>.json
```

---

## Generated Manifest

```
src/data/generated/index.json
```

Stores:

- logical key
- sheet name
- schema name
- generated JSON path
- validation report path
- case count
- generated timestamp

---

# 6. Artifact Handling

## Timestamp Mode

```
<name>_yyyymmdd_hhmmss_mmm.json
```

---

## Archive Folder

```
src/data/generated/archive/
```

Organized by:

```
new-business/<schema>/
```

---

## Config

Defined in:

```
src/config/execution.config.ts
```

---

# 7. Manifest Design

Key format:

```
<domain>:<schemaName>:<sheetName>
```

Example:

```
new-business:direct:FlowNB
new-business:pcw_tool:PCW-Tool
```

---

# 8. Runtime Resolution

Execution resolves generated data in this order:

1. explicit `CASES_FILE`
2. manifest lookup via runtime module

The manifest is the **single source of truth**.

---

# 9. Schema System

Defined under:

```
src/data/data-definitions
```

Supports:

- nested groups
- repeated groups
- required/optional fields
- section-based validation

---

# 10. Data Builder Pipeline (Plugin-Based)

~~~mermaid
flowchart TD

    A1[Tabular Layout]
    A2[Vertical Layout]

    A1 --> B[load-excel]
    A2 --> B

    B --> C[validate-schema]
    C --> D[extract-meta]
    D --> E[build-cases]
    E --> F[filter-scriptIds]
    F --> G[transform-values]
    G --> H[write-json]

    H --> I[Generated JSON]
    H --> J[Validation Report]
    H --> K[Manifest]
~~~

---

# 11. Validation System

~~~json
{
  "errors": [],
  "missingSchemaFieldsInExcel": {},
  "missingExcelFieldsInSchema": {},
  "summary": {}
}
~~~

Detects:

- missing fields
- duplicate fields (strict mode)
- schema mismatches

---

# 12. CLI Usage

```
npm run data -- --excel file.xlsx --sheet FlowNB
```

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

Adds:

- duplicate checks
- stricter schema enforcement
- stronger consistency guarantees

---

# 16. Example Commands

```
npm run data -- --excel file.xlsx --sheet FlowNB
npm run data -- --excel "sampleData/New Business.xlsx" --sheet "PCW-Tool"
npm run data:build:strict
npm run data:build:noEmpty:strict
```

---

# 17. Adding New Journeys

1. add or update schema
2. update sheet alias mapping
3. run builder
4. verify JSON + validation + manifest

---

# 18. Utilities

```
src/utils
```

Includes:

- logging
- CLI parsing
- timers
- file utilities
- path helpers

---

# 19. Design Principles

The Data Builder is:

- schema-driven
- plugin-based
- modular
- scalable
- business-friendly
- automation-ready
- manifest-backed

---

# 20. Plugin Architecture

The Data Builder runs as a **plugin pipeline**.

Each plugin:

- declares `requires`
- declares `provides`
- executes in dependency order
- runs with shared context

Core flow:

```
pluginDiscovery → pluginOrder → pluginExecutor
```

---

# 21. Data Builder + Runtime Resolution Flow

~~~mermaid
flowchart LR

    subgraph Business_Data_Layouts
        A0[Tabular Layout]
        A00[Vertical Layout]
    end

    subgraph CLI
        A[index.ts]
        A1[cli/index.ts]
    end

    subgraph Core
        B1[pluginDiscovery.ts]
        B2[pluginOrder.ts]
        B3[pluginExecutor.ts]
        B4[pipeline.ts]

        B5[spreadsheet/*]
        B6[schemaValidation/*]
        B7[extractMeta/*]
        B8[buildCases/*]
        B9[writeJson/*]
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

    subgraph Runtime
        R1[manifest/*]
        R2[cases/*]
    end

    subgraph Output
        F1[generated JSON]
        F2[validation JSON]
        F3[archive]
        F4[index.json]
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

    D7 --> F1
    D7 --> F2
    D7 --> F3
    D7 --> F4

    F4 --> R1
    R1 --> R2
~~~

---