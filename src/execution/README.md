# Execution Layer

---

# 1. Overview

The **Execution Layer** is responsible for running automated test flows using either:

- **Data Mode**
- **E2E Mode**

It orchestrates:

- CLI input parsing
- scenario/case preparation
- bootstrap and registry setup
- runtime data resolution
- step execution
- journey handler execution
- structured logging
- final execution summary

The Execution Layer is the runtime engine of the framework.

---

# 2. Purpose

The Execution Layer exists to:

- execute automated insurance journeys
- support multiple execution modes
- separate test data from execution flow
- allow both business-driven and QA-driven testing
- centralize execution orchestration
- provide clean, structured logs
- support scalable execution patterns

---

# 3. Execution Modes

The framework currently supports two execution modes.

## Data Mode

Used when execution should run directly from **generated JSON test data**.

Flow:

    Generated JSON + Manifest → Execution

Typical use case:

- business data maintained in Excel
- converted by Data Builder into JSON
- executed one case at a time

Examples:

- FlowNB
- PCW-Tool

---

## E2E Mode

Used when execution should run from an **E2E scenario sheet**.

Flow:

    E2E Scenario Sheet → Execution

Typical use case:

- step-based test flow
- multi-step scenario execution
- direct orchestration from Excel scenario sheet

Examples:

- New Business only
- NB → MTA
- NB → MTC
- Renewal

---

# 4. Toolchain Context

~~~mermaid
flowchart LR

    subgraph Data_Mode
        A1[Generated JSON]
        A2[index.json Manifest]
    end

    subgraph E2E_Mode
        B1[E2E Scenario Sheet]
    end

    A1 --> C[Execution Layer]
    A2 --> C
    B1 --> C

    C --> D[Journey Handlers]
    D --> E[Test Execution Result]
~~~

---

# 5. Inputs

## Data Mode Inputs

Data Mode requires:

- source
- schema resolution
- generated JSON
- manifest lookup

Example:

    npm run execution -- --mode data --source "FlowNB"

or

    npm run execution -- --mode data --source "PCW-Tool"

---

## E2E Mode Inputs

E2E Mode requires:

- Excel scenario workbook
- sheet name
- optional scenario filters
- optional disabled scenario inclusion

Example:

    npm run execution -- --mode e2e --excel "sampleData/E2E Scenarios.xlsx" --sheet "Scenarios"

---

# 6. Mode Resolution

Execution mode is resolved from CLI.

Supported values:

- `data`
- `e2e`

Defined in:

    src/execution/runtime/cli.ts

---

# 7. Data Mode Flow

Data Mode execution flow:

1. read `--source`
2. resolve schema from source
3. resolve generated JSON from manifest
4. load cases file
5. convert cases into execution scenarios
6. bootstrap execution runtime
7. execute one case per scenario
8. print structured data-mode logs

Data mode is optimized for running **generated business data cases**.

---

# 8. E2E Mode Flow

E2E Mode execution flow:

1. read scenario Excel file
2. load target sheet
3. normalize headers and values
4. validate structure
5. parse scenarios
6. filter selected scenarios
7. bootstrap execution runtime
8. execute scenario by scenario
9. print structured E2E logs

E2E mode is optimized for running **step-driven scenario pipelines**.

---

# 9. Execution Bootstrap

Before running anything, execution performs bootstrap.

Bootstrap responsibilities:

- create executor registry
- create step data resolver registry
- register default step data sources
- register default step executors

Defined in:

    src/execution/core/bootstrap.ts

---

# 10. Core Execution Responsibilities

The core execution layer is responsible for:

- creating execution context
- opening/closing browser session
- resolving step executors
- resolving step data
- running steps
- aggregating scenario result
- aggregating run summary
- producing logs

---

# 11. Execution Pipeline

~~~mermaid
flowchart TD

    A[CLI Input] --> B[Mode Resolution]

    B --> C1[Data Mode]
    B --> C2[E2E Mode]

    C1 --> D1[getCasesFile]
    D1 --> E1[Build Execution Scenarios]

    C2 --> D2[loadScenarioSheet]
    D2 --> E2[parseScenarios]

    E1 --> F[Execution Bootstrap]
    E2 --> F

    F --> G[runCases]
    G --> H[runScenario]
    H --> I[runStep]
    I --> J[Journey Handler]

    J --> K[Scenario Result]
    K --> L[Execution Summary]
~~~

---

# 12. Runtime Resolution

## Data Mode

Generated data resolution happens through:

    src/data/runtime/getCasesFile.ts

Resolution order:

1. explicit `CASES_FILE`
2. generated manifest (`src/data/generated/index.json`)

Folder scanning fallback has been removed.  
Manifest is now the **single source of truth** for generated data lookup.

---

## E2E Mode

Scenario sheet loading happens through:

    src/execution/runtime/loadScenarioSheet.ts

This includes:

- workbook loading
- worksheet resolution
- header normalization
- template validation
- row mapping

---

# 13. Execution Context

Each scenario runs with its own execution context.

Context stores:

- scenario metadata
- outputs
- step results
- browser instance
- browser context
- active page
- current quote / policy / transaction references

Defined in:

    src/execution/core/executionContext.ts

---

# 14. Scenario Model

Execution scenarios are the normalized runtime representation used by the engine.

A scenario contains:

- scenarioId
- scenarioName
- journey
- policyContext
- entryPoint
- totalSteps
- steps
- description
- execute flag

E2E scenarios come from scenario sheet parsing.  
Data mode scenarios are constructed from generated cases.

---

# 15. Step Execution

Each step is executed through:

    src/execution/core/stepRunner.ts

Responsibilities:

- resolve executor
- resolve step data
- execute handler
- capture failure
- store step result
- return structured status

Possible step statuses:

- passed
- failed
- skipped

---

# 16. Journey Handlers

Business actions are handled by journey-specific handlers.

Current journey areas include:

- newBusiness
- mta
- mtc
- renewal

Examples:

    src/execution/journeys/newBusiness
    src/execution/journeys/mta
    src/execution/journeys/mtc
    src/execution/journeys/renewal

These handlers contain the action-specific runtime logic.

---

# 17. EntryPoint vs Journey

The framework distinguishes between:

## Journey

Represents **where the user/test is coming from**.

Examples:

- Direct
- CTM
- CNF
- MSM
- GoCo

## EntryPoint

Represents **how the flow starts**.

Examples:

- Direct
- PCW
- PCWTool

This distinction is important because:

- Journey defines business route
- EntryPoint defines starting mechanism

---

# 18. Output System

Execution stores runtime outputs in a centralized output map.

Examples:

- quote number
- policy number
- calculated email
- PCW request type
- payment mode
- request message

These outputs are then consumed by:

- structured log renderers
- downstream steps
- future runtime features

Output keys are centralized in:

    src/execution/constants/outputKeys.ts

Example:

~~~ts
export const OUTPUT_KEYS = {
    NEW_BUSINESS: {
        CALCULATED_EMAIL: "newBusiness.calculatedEmailId",
        QUOTE: "newBusiness.quoteNumber",
        POLICY: "newBusiness.policyNumber"
    }
}
~~~

---

# 19. Logging Architecture

Execution logging is centralized and mode-aware.

Current logging split:

- execution header / summary renderer
- data case renderer
- E2E scenario renderer
- shared formatting helpers

Files:

    src/execution/core/logging/executionLogRenderer.ts
    src/execution/core/logging/dataCaseLogRenderer.ts
    src/execution/core/logging/e2eScenarioLogRenderer.ts
    src/execution/core/logging/shared.ts

This makes it easy to:

- add/remove log fields
- adjust formatting
- keep logs consistent across modes

---

# 20. Logging Principles

The logging design follows these principles:

- execution-mode aware
- human-readable
- Jenkins-friendly
- grouped by case/scenario
- aligned field formatting
- minimal noise
- centralized formatting logic

Examples:

## Data Mode

- header
- per data case
- summary

## E2E Mode

- header
- per scenario
- per step
- scenario footer
- summary

---

# 21. Parallel Execution

Execution supports configurable parallelism.

Parallelism is applied at:

- case level for data mode
- scenario level for E2E mode

Configured through:

    --parallel <n>

Current behavior:

- scenarios/cases are executed in batches
- each block is rendered after scenario completion
- final summary aggregates all results

Parallel support is implemented in:

    src/execution/core/caseRunner.ts

---

# 22. Error Handling

Execution uses structured application errors.

Errors include:

- code
- stage
- source
- message
- context

Examples:

- missing source
- missing Excel
- missing generated JSON
- missing scenario sheet
- unsupported journey input
- missing step data
- missing PCW required field

Top-level execution error printing happens in:

    src/execution/index.ts

---

# 23. CLI Usage

## Data Mode

    npm run execution -- --mode data --source "FlowNB"
    npm run execution -- --mode data --source "PCW-Tool" --verbose
    npm run execution -- --mode data --source "FlowNB" --parallel 2

## E2E Mode

    npm run execution -- --mode e2e --excel "sampleData/E2E Scenarios.xlsx" --sheet "Scenarios"
    npm run execution -- --mode e2e --excel "sampleData/E2E Scenarios.xlsx" --sheet "Scenarios" --scenario SC001
    npm run execution -- --mode e2e --excel "sampleData/E2E Scenarios.xlsx" --sheet "Scenarios" --parallel 2

---

# 24. Required Arguments

## Data Mode

| Argument | Description |
|----------|------------|
| `--mode data` | Data mode |
| `--source` | Source / sheet name |

## E2E Mode

| Argument | Description |
|----------|------------|
| `--mode e2e` | E2E mode |
| `--excel` | Scenario workbook |
| `--sheet` | Scenario sheet |

---

# 25. Optional Arguments

| Argument | Description |
|----------|------------|
| `--schema` | Override schema in data mode |
| `--scenario` | Filter E2E scenarios |
| `--includeDisabled` | Include disabled E2E scenarios |
| `--iterations` | Repeat execution |
| `--parallel` | Parallel cases/scenarios |
| `--verbose` | Debug logs |
| `--help` | Show help |

---

# 26. Calculated Email

Execution generates a calculated email for New Business flows.

Format:

    test+<env>_<startfrom>_<testcaseid>_<timestamp>@mail.com

Example:

    test+azonlinetest_pcwtool_tc001_20260325_004351_149@mail.com

Configured using:

- base email from `src/config/environments.ts`
- timestamp from `src/utils/time.ts`
- shared helper from calculated email utility

This works across:

- direct data mode
- PCW data mode
- E2E New Business

---

# 27. Design Principles

The Execution Layer is designed to be:

- mode-driven
- runtime-focused
- scalable
- composable
- registry-based
- handler-based
- logging-friendly
- CI/Jenkins-friendly

---

# 28. Summary

The Execution Layer provides a scalable runtime engine for both:

- data-driven automation
- scenario-driven automation

It enables:

- deterministic data resolution
- clean scenario/case execution
- centralized outputs
- structured logs
- parallel execution support
- extensible journey handling

---

# 29. Data Mode Execution Flow

~~~mermaid
flowchart LR

    subgraph Data_Mode
        A1[Generated JSON]
        A2[index.json Manifest]
    end

    subgraph Execution
        B1[getCasesFile.ts]
        B2[data runner.ts]
        B3[bootstrap.ts]
        B4[caseRunner.ts]
        B5[scenarioRunner.ts]
        B6[stepRunner.ts]
    end

    subgraph Journey_Handlers
        C1[newBusiness handlers]
    end

    A2 --> B1
    A1 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B4 --> B5
    B5 --> B6
    B6 --> C1
~~~

---

# 30. E2E Execution Flow

~~~mermaid
flowchart LR

    subgraph Scenario_Layout
        A0[E2E Scenario Sheet]
    end

    subgraph CLI
        A[index.ts]
        A1[cli.ts]
    end

    subgraph Runtime
        B1[loadScenarioSheet.ts]
        B2[parser.ts]
        B3[normalizer.ts]
        B4[validator.ts]
    end

    subgraph Execution_Core
        C1[bootstrap.ts]
        C2[caseRunner.ts]
        C3[scenarioRunner.ts]
        C4[stepRunner.ts]
        C5[registry.ts]
        C6[executionContext.ts]
        C7[result.ts]
    end

    subgraph Journeys
        D1[newBusiness]
        D2[mta]
        D3[mtc]
        D4[renewal]
    end

    subgraph Logging
        E1[executionLogRenderer.ts]
        E2[dataCaseLogRenderer.ts]
        E3[e2eScenarioLogRenderer.ts]
        E4[shared.ts]
    end

    A0 --> B1

    A --> A1
    A1 --> B1

    B1 --> B2
    B2 --> B3
    B3 --> B4

    B4 --> C1
    C1 --> C2
    C2 --> C3
    C3 --> C4
    C4 --> C5
    C4 --> C6
    C3 --> C7

    C5 --> D1
    C5 --> D2
    C5 --> D3
    C5 --> D4

    C2 --> E1
    C2 --> E2
    C2 --> E3
    E1 --> E4
    E2 --> E4
    E3 --> E4
~~~