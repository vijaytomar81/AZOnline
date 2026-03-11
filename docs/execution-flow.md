
# Test Execution Flow

This document explains how tests are executed in the framework.

Execution is powered by:

- Playwright
- Case Runner
- Page Manager
- Page Objects

---

# Test Execution Flow

```mermaid

sequenceDiagram
    participant User
    participant Script as package.json / scripts/e2e.js
    participant PW as Playwright
    participant Runner as caseRunner
    participant Data as Case JSON
    participant PM as pageManager
    participant Page as PageObject
    participant Base as basePage
    participant Browser as Browser
    participant Report as results/reports

    User->>Script: Run test command
    Script->>PW: Start execution
    PW->>Runner: Execute test case
    Runner->>Data: Load case data
    Data-->>Runner: Case payload
    Runner->>PM: Get page object
    PM-->>Runner: Page instance
    Runner->>Page: Execute business flow
    Page->>Base: Reusable actions
    Base->>Browser: Interact with UI
    Browser-->>Base: DOM/state response
    Base-->>Page: Action result
    Page-->>Runner: Step completion
    Runner->>Report: Publish result
    PW->>Report: Generate artifacts
```
---


# Execution Flow (Simplified)

```mermaid

flowchart LR

CMD["npm run e2e"] --> PW["Playwright"]
PW --> TEST["Test Spec"]
TEST --> DATA["Case JSON"]
TEST --> RUN["caseRunner"]

RUN --> PM["pageManager"]
PM --> PO["Page Object"]
PO --> BASE["basePage"]
BASE --> LOC["locatorEngine"]
BASE --> FX["pageFx"]
BASE --> UI["Browser UI"]

RUN --> RES["results/"]
RUN --> REP["reports/"]
```