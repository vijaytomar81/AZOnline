<!-- src/toolingLayer/pageActions/generator/README.md -->

# Page Action Generator

---

# 1. Overview

The **Page Action Generator** creates and synchronizes draft page-action files from the **Page Object manifest**.

It converts page-object metadata and page-object methods into action-level scaffolding that Automation QA can refine into real business automation flows.

The generator currently produces and maintains:

- page action files under `src/businessLayer/pageActions/actions`
- page action manifest entries under `src/businessLayer/pageActions/.manifest`
- deterministic registry `index.ts` files for page actions

The generator is designed to be:

- deterministic
- repeatable
- idempotent
- aligned with the `pageScanner → pageObjects → pageActions` toolchain

---

# 2. Purpose

The Page Action Generator exists to bridge the gap between:

- low-level page-object methods
- higher-level business interaction flows

Instead of manually creating every action file from scratch, the generator produces a starter scaffold based on the available page objects.

Its main goals are:

- create initial action files for each page object
- keep pageActions aligned with the current pageObjects manifest
- generate a predictable folder structure
- create stable registry exports
- reduce repetitive scaffolding work for QA
- preserve a path toward validator and repair tooling

---

# 3. Toolchain Context

Within the automation architecture, the generator acts as the **action scaffolding layer**.

```text
Page Scanner
    ↓
Page Maps
    ↓
Page Object Generator
    ↓
Page Objects + Page Object Manifest
    ↓
Page Action Generator
    ↓
Draft Page Actions
    ↓
QA refinement
```

The Page Action Generator does **not** scan pages and does **not** generate page objects.

It depends on the output of the **Page Object Generator**.

---

# 4. Inputs

The generator reads from the Page Object manifest and Page Object files.

## Page Object Manifest Index

Location:

```text
src/businessLayer/pageObjects/.manifest/index.json
```

This index tells the generator which page objects currently exist.

Example:

```json
{
  "version": 1,
  "generatedAt": "2026-04-21T10:20:26.653Z",
  "pages": {
    "athena.azonline.common.insurance-type-selection": "athena/azonline/common/insurance-type-selection.json",
    "athena.azonline.common.login-or-registration": "athena/azonline/common/login-or-registration.json",
    "athena.azonline.motor.car-details": "athena/azonline/motor/car-details.json"
  }
}
```

## Page Object Manifest Entries

Each page entry contains the page scope and page-object metadata.

Example fields used by the generator:

- `pageKey`
- `scope.platform`
- `scope.application`
- `scope.product`
- `scope.name`
- `className`
- `paths.pageObjectFile`
- `paths.pageObjectImport`

## Page Object Source Files

The generator reads the actual page object TypeScript files so it can extract available methods.

That extracted method list is then classified into generated action sections such as:

- active value mappings
- conditional indexed mappings
- TODO low-confidence mappings
- TODO click/radio/link suggestions

---

# 5. Outputs

The generator creates and maintains three major output areas.

## A. Action Files

Location:

```text
src/businessLayer/pageActions/actions
```

Example generated structure:

```text
src/businessLayer/pageActions/actions
└── athena
    └── azonline
        ├── common
        │   ├── insuranceTypeSelection.action.ts
        │   ├── loginOrRegistration.action.ts
        │   ├── manageCookies.action.ts
        │   └── index.ts
        └── motor
            ├── carDetails.action.ts
            ├── phDrivingLicenceDetails.action.ts
            └── index.ts
```

## B. Page Action Manifest

Location:

```text
src/businessLayer/pageActions/.manifest
```

The generator writes:

- manifest entry per page action
- manifest index file

## C. Registry Files

The generator also creates deterministic `index.ts` registry files, including:

```text
src/businessLayer/pageActions/index.ts
src/businessLayer/pageActions/actions/index.ts
src/businessLayer/pageActions/actions/athena/index.ts
src/businessLayer/pageActions/actions/athena/azonline/index.ts
src/businessLayer/pageActions/actions/athena/azonline/common/index.ts
src/businessLayer/pageActions/actions/athena/azonline/motor/index.ts
```

---

# 6. Current Folder Strategy

The Page Action Generator is now aligned with the same business hierarchy used by pageScanner and pageObjects:

- `platform`
- `application`
- `product`
- `name`

Generated action files follow this path model:

```text
src/businessLayer/pageActions/actions/<platform>/<application>/<product>/<camelPageName>.action.ts
```

Example:

```text
src/businessLayer/pageActions/actions/athena/azonline/motor/carDetails.action.ts
```

This means pageActions now align properly with pageObjects and pageScanner.

---

# 7. Naming Strategy

The current naming strategy is intentionally simple.

## Action file name

Generated from page scope name:

```text
<camelPageName>.action.ts
```

Examples:

```text
insuranceTypeSelection.action.ts
loginOrRegistration.action.ts
manageCookies.action.ts
carDetails.action.ts
phDrivingLicenceDetails.action.ts
```

## Action export name

Generated as:

```text
<camelPageName>Action
```

Examples:

```ts
insuranceTypeSelectionAction
loginOrRegistrationAction
manageCookiesAction
carDetailsAction
phDrivingLicenceDetailsAction
```

## Action key

Generated as:

```text
<pageKey>.action
```

Example:

```text
athena.azonline.motor.car-details.action
```

This neutral naming strategy is simpler and more stable than earlier `handle...` / `fill...` prefixes.

---

# 8. Generator Responsibilities

The generator currently owns:

## 1. Action file creation
Creates a page action file for each page object.

## 2. Page action manifest sync
Creates a page action manifest entry for each page action and keeps the manifest index synchronized.

## 3. Registry generation
Builds deterministic `index.ts` files for page action exports.

## 4. Action scaffolding
Builds initial action code using extracted page-object methods.

## 5. Idempotent reruns
A second immediate run should produce:

- `Created: 0`
- `Updated: 0`
- `Unchanged: N`

provided inputs have not changed.

---

# 9. What the Generator Does Not Own

The generator does **not** own final business automation logic.

It does **not**:

- define final payload schema
- decide all business conditions
- resolve nested mapping edge cases
- finalize manual interaction flows
- replace QA-authored logic
- validate action correctness
- repair action files

Those responsibilities belong to:

- Automation QA
- future validator
- future repair tool

---

# 10. Action File Generation Strategy

Generated files are meant to be **draft scaffolds**.

The generator infers action content from extracted page-object methods.

Current categories include:

## Active value mappings
Methods with strong confidence that they should map from payload values.

Typical examples:

- `inputRegistrationNumber(...)`
- `selectTitle(...)`

These become active generated lines using:

- `requireRecordValue`
- `requireStringValue`

## Conditional indexed mappings
For repeated data families such as:

- convictions
- claims
- additional drivers

The generator may emit indexed conditional blocks such as:

```ts
const convictionCount = Math.min(Number(data.convictionCount ?? 0), 5);
```

followed by conditional blocks for each repeated index.

## TODO low-confidence mappings
Methods with weaker confidence are grouped into TODO sections rather than made active automatically.

## TODO interaction suggestions
Buttons, links, and radio-style methods are grouped into a TODO block for later QA review.

---

# 11. Current Generated File Structure

A generated action file typically contains:

1. file path header
2. imports
3. action function declaration
4. payload validation
5. start logging
6. active value mappings
7. conditional indexed sections
8. TODO value-mapping block
9. TODO interaction block
10. completion logging

Example structure:

```ts
// src/businessLayer/pageActions/actions/athena/azonline/motor/carDetails.action.ts

import type { PageAction } from "@businessLayer/pageActions/shared";
import {
    requireRecordValue,
    requireStringValue,
    logPageActionInfo,
} from "@businessLayer/pageActions/shared";

export const carDetailsAction: PageAction = async ({
    context,
    payload,
}) => {
    const data = requireRecordValue({
        value: payload,
        fieldName: "payload",
        source: "CarDetailsPage",
    });

    logPageActionInfo({
        scope: context.logScope,
        message: "carDetailsAction started.",
    });

    // generated scaffold...

    logPageActionInfo({
        scope: context.logScope,
        message: "carDetailsAction completed.",
    });
};
```

---

# 12. Runtime Access Shape

Generated page actions call into page objects using the current page manager access model.

Example runtime access:

```ts
context.pages.common.insuranceTypeSelection
context.pages.motor.carDetails
```

Important note:

Although pageActions are stored under:

```text
actions/<platform>/<application>/<product>
```

the runtime page-manager accessor currently uses:

```text
context.pages.<product>.<page>
```

So the generated action calls intentionally use:

- `product`
- `page`

and not `platform/application/product/page`.

This matches the current `PageManager` implementation.

---

# 13. Manifest Strategy

The Page Action Generator maintains its own manifest.

Location:

```text
src/businessLayer/pageActions/.manifest
```

This manifest is used to track current generated actions.

## Manifest index

The manifest index keeps a mapping of:

- `pageKey` → relative manifest entry path

## Manifest entry

Each manifest entry contains:

- `pageKey`
- `actionKey`
- `actionName`
- `scope`
- output paths

Example fields:

```json
{
  "pageKey": "athena.azonline.motor.car-details",
  "actionKey": "athena.azonline.motor.car-details.action",
  "actionName": "carDetailsAction",
  "scope": {
    "platform": "athena",
    "application": "azonline",
    "product": "motor",
    "name": "car-details",
    "namespace": "athena.azonline.motor"
  }
}
```

The generator is now written so that manifest timestamps do not force unnecessary updates on unchanged reruns.

---

# 14. Registry Strategy

Registry generation is deterministic.

That means the generator does **not** append lines blindly.

Instead, it rebuilds index file content for:

- root
- actions root
- platform
- application
- product

This makes reruns predictable and prevents drift.

Generated registry files now also include their own file path header.

Example:

```ts
// src/businessLayer/pageActions/actions/athena/azonline/common/index.ts
// AUTO-GENERATED by pageActions generator
```

---

# 15. Summary Output

The generator now reports page-level outcomes:

- `Created`
- `Updated`
- `Unchanged`
- `Failed`

It also reports registry file changes split into:

- `Registry files created`
- `Registry files updated`

This makes first-run and rerun behavior easier to understand.

Example unchanged rerun:

```text
Available page objects   : 5
Created                  : 0
Updated                  : 0
Unchanged                : 5
Failed                   : 0
Registry files created   : 0
Registry files updated   : 0
Invalid pages            : 0
Exit code                : 0
Result                   : UP TO DATE
```

---

# 16. Current Commands

Current command:

```bash
npm run pageactions:generate
```

Verbose mode:

```bash
npm run pageactions:generate -- --verbose
```

Type check before generation:

```bash
npm run check:types && npm run pageactions:generate
```

---

# 17. Typical Workflow

Typical current workflow:

```bash
npm run pageobjects:generate
npm run pageactions:generate
```

Then:

- review generated action scaffolds
- let QA refine them
- later run validator/repair once those are implemented

---

# 18. Behavior with New Page Objects

When a new page object appears in:

```text
src/businessLayer/pageObjects/.manifest/index.json
```

the next pageActions generation run will automatically:

- create a new action file
- create a new pageActions manifest entry
- update registry files as needed

So pageActions follows pageObjects manifest as its source of truth.

---

# 19. Idempotency

The generator is now designed to be idempotent.

That means:

## first run
Creates missing outputs.

## second immediate run
Should normally produce:

- no new files
- no changed files
- all pages `unchanged`

This is an important quality property and is required before validator/repair are added.

---

# 20. Important Design Rule for Future Work

Generated action files are scaffolds that QA is expected to refine.

That means future generator and repair behavior should be careful not to overwrite QA-authored manual logic.

The intended long-term model is:

- generator creates missing files
- generator safely syncs only managed sections
- repair restores only generator-managed structure
- QA-owned custom logic remains untouched

This is especially important for:

- custom conditions
- payload transformation
- enabled TODO sections
- business-specific flow logic

---

# 21. Current Limitation

Today’s generator is already much more stable than before, but it is still primarily a **scaffolding generator**.

The next architectural improvement should be introducing a **managed-region contract** inside action files so that:

- reruns stay safe
- repair stays safe
- QA edits are preserved

That should happen before or alongside full repair implementation.

---

# 22. Recommended Sequence During Development

Recommended sequence:

```bash
npm run check:types
npm run pageobjects:generate
npm run pageactions:generate
```

Later, once validator exists:

```bash
npm run pageactions:validate
```

And eventually:

```bash
npm run pageactions:repair
```

---

# 23. Example Generated Structure

```text
src/businessLayer/pageActions
├── .manifest
│   ├── index.json
│   └── athena
│       └── azonline
│           ├── common
│           │   ├── insurance-type-selection.action.json
│           │   ├── login-or-registration.action.json
│           │   └── manage-cookies.action.json
│           └── motor
│               ├── car-details.action.json
│               └── ph-driving-licence-details.action.json
├── actions
│   └── athena
│       └── azonline
│           ├── common
│           │   ├── index.ts
│           │   ├── insuranceTypeSelection.action.ts
│           │   ├── loginOrRegistration.action.ts
│           │   └── manageCookies.action.ts
│           └── motor
│               ├── index.ts
│               ├── carDetails.action.ts
│               └── phDrivingLicenceDetails.action.ts
├── index.ts
└── shared
```

---

# 24. Final Notes

The Page Action Generator is now in a much healthier place than before.

It is:

- aligned with pageObjects scope
- using simple action naming
- producing deterministic registry output
- idempotent across reruns
- ready for the next stage: validator design

It should be treated as the **draft action scaffolding layer**, not the final authoring tool for business flows.
