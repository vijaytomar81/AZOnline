# Playwright Page Automation Framework

This repository contains a **scalable page-object automation framework** built on top of **Playwright**.

The framework provides a structured toolchain that automatically:

- scans web pages
- generates page objects
- validates framework consistency
- repairs structural issues

The architecture ensures automation code remains **deterministic, maintainable, and scalable**.

---

# Framework Architecture

The automation system is built around **four core tools**.

| Tool | Responsibility |
|-----|----------------|
| page-scanner | Extract page structure and generate page maps |
| page-object-generator | Generate page-object artifacts |
| page-object-validator | Validate framework structure |
| page-object-repair | Automatically repair framework drift |

---

# Toolchain Flow

```mermaid
flowchart LR

    A[Browser Session] --> B[Page Scanner]
    B --> C[Page Maps]

    C --> D[Page Object Generator]
    D --> E[Page Object Artifacts]

    E --> F[Page Object Validator]

    F -->|errors| G[Page Object Repair]
    G --> F
```

---

# Validator ↔ Repair ↔ Generator Parity

To ensure long-term stability, the framework maintains strict alignment between:

- Generator (builds artifacts)
- Validator (detects issues)
- Repair (fixes issues)

---

## Parity Matrix

| Contract | Generator | Validator | Repair | Notes |
|----------|----------|----------|--------|------|
| elements → aliases.generated | ✔ | ✔ | ✔ | fully auto-managed |
| aliases.generated → aliases | ✔ | ✔ | ✔ | fully auto-managed |
| aliases → PageObject methods | ✔ | ✔ | ✔ | managed region only |
| PageObject structure | ✔ | ✔ | ✔ | enforced |
| PageObject readiness | ✔ | ✔ | ✔ | metadata-driven |
| page-map schema | ✔ | ✔ | ✖ | source-of-truth |
| manifest metadata | ✔ | ✔ | ✔ | repair rebuilds |
| index.ts exports | ✔ | ✔ | ✔ | registry sync |
| pageManager.ts | ✔ | ✔ | ✔ | registry sync |

---

# Pre-Execution Quality Gate

The framework enforces a **quality gate before test execution**.

```mermaid
flowchart LR

    A[Generator] --> B[Validator]
    B -->|FAIL| C[Repair]
    C --> B
    B -->|PASS| D[Test Execution]
```

---

## Recommended Script

```json
"test:e2e": "npm run generator:elements && npm run validator:check || (npm run repair:run && npm run validator:check) && npm run headers:fix && playwright test"
```

---

## Strict Mode (CI)

```json
"test:e2e:ci": "npm run generator:elements && npm run validator:check:strict && playwright test"
```

---

# Project Structure

```
src
├── pageObjects
│   ├── maps
│   ├── objects
│   ├── index.ts
│   └── pageManager.ts
│
├── pageObjectTools
│   ├── page-scanner
│   ├── page-object-generator
│   ├── page-object-validator
│   ├── page-object-repair
│   └── page-object-common
│
└── utils
```

---

# Page Object Chain

Generated automation code follows a strict dependency chain.

```mermaid
flowchart TD

    A[elements.ts]
    B[aliases.generated.ts]
    C[aliases.ts]
    D[PageObject.ts]

    A --> B
    B --> C
    C --> D
```

Each layer builds on the previous one.

---

# Manifest System

The framework maintains metadata about page objects in:

```
src/pages/.manifest
```

Structure:

```
.manifest
├── index.json
└── pages
    ├── <pageKey>.json
```

Example manifest entry:

```json
{
  "pageKey": "athena.common.login-or-registration",
  "className": "LoginOrRegistrationPage",
  "pageObjectImportPath": "@pageObjectsObjects/athena/common/login-or-registration/LoginOrRegistrationPage",
  "elementCount": 4,
  "urlPath": "/",
  "title": "Login page"
}
```

The manifest is used for:

- incremental generation
- validation checks
- repair operations

---

# Registry System

Two registry files expose page objects to tests.

```
src/pageObjects/index.ts
src/pageObjects/pageManager.ts
```

### index.ts

Exports all page objects.

Example:

```ts
export { PageManager } from "./pageManager"

export * from "@pageObjectsObjects/athena/common/login-or-registration/LoginOrRegistrationPage"
```

---

### pageManager.ts

Provides central access to page objects.

Example usage:

```ts
pageManager.athena.loginOrRegistration
```

---

# Tool 1 — Page Scanner

The **Page Scanner** discovers page elements from a running browser session.

It connects to a browser via **Chrome DevTools Protocol (CDP)** and extracts page structure.

---

## Scanner Flow

```mermaid
flowchart TD

    A[Browser Running in CDP Mode]
    B[Open Target Page]
    C[Page Scanner]

    D[Extract DOM Elements]
    E[Classify Elements]
    F[Generate Element Keys]
    G[Generate Selectors]
    H[Build Page Map]

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
```

---

## Scanner Output

```
src/pages/maps/<pageKey>.json
```

Example:

```json
{
  "pageKey": "athena.common.login-or-registration",
  "urlPath": "/",
  "title": "Login page",
  "elements": {
    "loginButton": {
      "type": "button",
      "preferred": "css=#login",
      "fallbacks": ["role=button[name=/login/i]"]
    }
  }
}
```

---

## Start Browser (CDP Mode)

```powershell
$profile = Join-Path $env:TEMP ("edge-cdp-" + (Get-Date -Format "yyyyMMdd-HHmmss"))
Start-Process "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "--remote-debugging-port=9222 --user-data-dir=$profile"
Start-Sleep -Seconds 2
$CDP = (Invoke-RestMethod http://localhost:9222/json/version).webSocketDebuggerUrl
```

---

## Run Scanner

```
npm run scan:page:verbose -- --connectCdp="$CDP" --pageKey="athena.motor.car-details"
```

---

## Kill Browser Session

```
taskkill /IM msedge.exe /F
```

---

# Tool 2 — Page Object Generator

The **Page Object Generator** converts page maps into automation code.

Generated artifacts include:

```
elements.ts
aliases.generated.ts
aliases.ts
<PageName>Page.ts
```

---

## Generator Flow

```mermaid
flowchart TD

    A[Page Map JSON]
    B[elements.ts]
    C[aliases.generated.ts]
    D[aliases.ts]
    E[PageObject.ts]

    A --> B
    B --> C
    C --> D
    D --> E
```

---

## Generator Commands

```
npm run generator:elements
npm run generator:elements:changed
npm run generator:elements:verbose
```

---

# Tool 3 — Page Object Validator

The **Page Object Validator** ensures the framework structure remains consistent.

Validator rule groups:

```
environment
source
outputs
pageChain
manifest
registry
hygiene
conventions
```

---

## Validator Commands

```
npm run validator:check
npm run validator:check:verbose
npm run validator:check:strict
```

---

# Tool 4 — Page Object Repair

The **Page Object Repair Tool** automatically fixes framework inconsistencies.

It repairs:

- manifest metadata
- registry exports
- page-object structure

---

## Repair Commands

```
npm run repair:run
npm run repair:run:verbose
```

---

# Typical Workflow

```
npm run scan:page
npm run generator:elements
npm run validator:check
```

If validator reports errors:

```
npm run repair:run
```

---

# Example End-to-End Flow

```mermaid
flowchart LR

    A[Browser Session]
    B[Page Scanner]
    C[Page Maps]
    D[Page Object Generator]
    E[Page Objects]
    F[Validator]
    G[Repair Tool]

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F -->|errors| G
    G --> F
```

---

# Benefits of This Architecture

- automatic page discovery  
- deterministic page-object generation  
- strict validation layer  
- automated repair capability  
- scalable automation architecture  

This framework keeps automation **stable, maintainable, and future-proof**.

---