---
# Core Runtime Engine

The `core` module provides the runtime execution engine for UI automation.

This layer handles:

- Test case execution
- Page object orchestration
- Locator resolution
- Page interactions
- Self-healing locator updates

---

# Main Components

| File | Purpose |
|----|----|
| basePage.ts | base class for all page objects |
| caseRunner.ts | executes test case flows |
| locatorEngine.ts | resolves selectors |
| pageFx.ts | reusable page utilities |
| selfHealWriter.ts | records locator healing |

---

# Runtime Execution Flow

```mermaid
sequenceDiagram

participant Test
participant Runner
participant PageManager
participant Page
participant Browser

Test->>Runner: start test
Runner->>PageManager: get page
PageManager->>Page: create instance
Runner->>Page: execute step
Page->>Browser: interact
Browser-->>Page: DOM response
Page-->>Runner: result