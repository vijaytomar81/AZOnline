# Data Builder

---

# 1. Overview

The **Data Builder** converts structured **Excel test data** into normalized **JSON test cases** used by the automation framework.

It reads Excel sheets maintained by business or QA users and transforms them into a consistent JSON structure driven by **journey-based schema selection**.

The generated JSON files become the **runtime data source for automated tests**.

The Data Builder ensures that:

- Excel remains **human-friendly for business users**
- JSON remains **automation-friendly for test execution**
- generated artifacts remain **traceable and discoverable**
- execution can resolve the latest generated data via **manifest lookup**
- schema selection follows the **new business model**
- generated data is organized by **journey, platform, application, and product**

---

# 2. Purpose

The Data Builder automates the transformation of Excel test sheets into structured JSON test data.

Its primary goals are:

- convert Excel test data into structured JSON
- support multiple insurance journeys
- support multiple platforms, applications, and products
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
        A1[Journey Data Sheet]
        A2[PCW Tool Message Sheet]
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

## Business Selection Inputs

Required:

- platform
- application
- product
- journeyContext

---

## Sheet Name

Used only for:

- selecting worksheet
- naming output files

NOT used for schema selection.

---

## Schema Resolution (IMPORTANT)

Schema is resolved from:

1. journeyContext
2. platform

Defined in:

src/dataLayer/data-definitions/schemaSelection.config.ts

Examples:

| Journey Context | Platform | Selected Schema |
|----------------|----------|-----------------|
| NewBusiness | Athena | new_business_journey |
| NewBusiness | PCW | new_business_journey |
| NewBusiness | PCWTool | new_business_pcw_tool_message |

---

# 5. Outputs

## Test Data JSON

src/dataLayer/generated/<journey>/<platform>/<application>/<product>/<Sheet>.json  
src/dataLayer/generated/<journey>/<platform>/<application>/<product>/<Sheet>_<timestamp>.json  

Example:

src/dataLayer/generated/newbusiness/athena/azonline/motor/FlowNB.json

---

## Validation Report

src/dataLayer/generated/<journey>/<platform>/<application>/<product>/<Sheet>.validation.json  
src/dataLayer/generated/<journey>/<platform>/<application>/<product>/<Sheet>.validation_<timestamp>.json  

---

## Generated Manifest

src/dataLayer/generated/index.json

Stores:

- platform
- application
- product
- journeyContext
- sheet name
- schema name
- generated JSON path
- validation report path
- case count
- generated timestamp

---

# 6. Artifact Handling

## Timestamp Mode

<name>_yyyymmdd_hhmmss_mmm.json

---

## Archive Folder

src/dataLayer/generated/archive/

---

## Config

src/configLayer/execution.config.ts

---

# 7. Manifest Design

Key format:

<platform>:<application>:<product>:<journeyContext>:<sheetName>

Example:

Athena:AzOnline:Motor:NewBusiness:FlowNB  
PCWTool:CTM:Motor:NewBusiness:PCW-Tool  

---

# 8. Runtime Resolution

Resolution order:

1. explicit CASES_FILE
2. manifest lookup

Manifest is the single source of truth.

---

# 9. Schema System

Defined under:

src/dataLayer/data-definitions

Supports:

- nested groups
- repeated groups
- required fields
- optional fields
- section-based validation

---

# 10. Data Builder Pipeline

~~~mermaid
flowchart TD

    A1[Journey Data Sheet]
    A2[PCW Tool Message Sheet]

    A1 --> B[load-excel]
    A2 --> B

    B --> C[validate-schema]
    C --> D[extract-meta]
    D --> E[build-cases]
    E --> F[filter-scriptIds]
    F --> G[transform-values]
    G --> H[write-json]
~~~

---

# 11. Validation System

{
  "errors": [],
  "missingSchemaFieldsInExcel": {},
  "missingExcelFieldsInSchema": {},
  "summary": {}
}

---

# 12. CLI Usage

npm run data -- --excel file.xlsx --sheet FlowNB --platform Athena --application AzOnline --product Motor --journeyContext NewBusiness

---

# 13. Required Arguments

| Argument | Description |
|----------|------------|
| --excel | Excel file |
| --sheet | Sheet |
| --platform | Platform |
| --application | Application |
| --product | Product |
| --journeyContext | Journey |

---

# 14. Optional Arguments

| Argument | Description |
|----------|------------|
| --ids | Filter IDs |
| --excludeEmptyFields | Remove empty |
| --strictValidation | Strict mode |
| --out | Custom output |
| --verbose | Logs |

---

# 15. Strict Validation

Adds:

- duplicate detection
- stricter schema checks

---

# 16. Example Commands

npm run data -- --excel "sample.xlsx" --sheet "FlowNB" --platform "Athena" --application "AzOnline" --product "Motor" --journeyContext "NewBusiness"

---

# 17. Adding New Journeys

1. add schema  
2. register in registry.ts  
3. update schemaSelection.config.ts  
4. run builder  

---

# 18. Design Principles

- journey-driven
- schema-driven
- plugin-based
- modular
- scalable
- manifest-backed

---

# 19. Plugin Architecture

pluginDiscovery → pluginOrder → pluginExecutor

---

# 20. Flow

~~~mermaid
flowchart LR

    A[Excel] --> B[Builder]
    B --> C[JSON]
    B --> D[Validation]
    B --> E[Manifest]
    E --> F[Runtime]
~~~

---