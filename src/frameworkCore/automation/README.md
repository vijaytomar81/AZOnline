# Automation Layer

This layer sits above `src/core` and below page objects / page actions.

Its responsibilities are:

- reusable page-level actions
- reusable waits
- reusable reads
- navigation helpers
- diagnostics on failure
- future-safe Playwright interaction conventions

It should remain:

- thin
- composable
- SOLID-friendly
- safe for parallel execution
- independent from business flow logic

## Phase 1 Scope

- BasePage
- BaseActions
- BaseWaits
- BaseReads
- waitForPageReady
- dismissKnownOverlays
- failure diagnostics with page-scan hook support

## Relationship with src/core

`src/core` remains the low-level engine layer.

`src/automation` is the higher-level interaction/policy layer.
