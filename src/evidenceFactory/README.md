# README.md
# Evidence Factory

A reusable Node.js + TypeScript evidence layer for car and home insurance test execution.

## What it does
- Writes JSON, XML, CSV, and console evidence per test case during execution
- Supports parallel test execution in the same run by writing one file set per test case
- Tracks execution events in an append-only NDJSON manifest
- Builds one final Excel report at the end with these tabs:
  - Summary
  - Passed
  - Failed
  - Error
  - Not Executed
- Archives old execution folders
- Returns metadata to the calling layer or app
- Works well with Playwright, Jenkins, and Docker

## Install
```bash
npm install
```

## Libraries used
These are already in `package.json`.
```bash
npm install typescript ts-node @types/node exceljs fast-xml-parser csv-stringify
```

## Build
```bash
npm run build
```

## Run examples
```bash
npm run example:car
npm run example:home
```

## Public API
```ts
const factory = new EvidenceFactory();
await factory.writeEvidence(schema, request);
await factory.finalizeExecution(finalizeRequest);
await factory.archiveOldExecutions({ olderThanDays: 14 });
```

## Where to add new fields
Add or change fields in:
- `src/examples/schemas.ts`

Example:
```ts
export const carInsuranceSchema = defineSchema<CarInsurancePayload>({
  name: 'car-insurance',
  fields: {
    policyId: { type: 'string', required: true },
    premium: { type: 'number', required: true },
    approved: { type: 'boolean', required: true },
    quoteDate: { type: 'date', required: true }
  }
});
```

## How it writes files
For a single run:
```text
artifacts/
  current/
    car-regression/
      EXEC-001/
        json/passed/TC001_create-policy.json
        xml/passed/TC001_create-policy.xml
        csv/passed/TC001_create-policy.csv
        manifests/events.ndjson
        excel/car-regression_EXEC-001.xlsx
```

## Parallel execution model
- Each test case writes its own files
- Shared run state is stored as one NDJSON line per event
- Excel is generated only once at the end

## Playwright example
```ts
const response = await factory.writeEvidence(carInsuranceSchema, request);
await attachArtifacts(testInfo, response.artifacts);
```

## Notes
- This project is designed for local filesystem artifact storage
- Old run folders can be moved to `artifacts/archive`
- The Excel formatter is in `src/writers/excel/excel-formatter.ts`
