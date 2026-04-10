# Evidence Factory (consumer-only)

A config-driven evidence writer for AZOnline.

This package is intentionally a **consumer only**. It does **not** define evidence fields.
It consumes the evidence configuration already defined in:

- `src/configLayer/models/evidence/types.ts`
- `src/configLayer/models/evidence/views/*`
- `src/configLayer/models/evidence/fields/*`

## Design

- **executionLayer** builds payload objects that already match your evidence config keys
- **evidenceFactory** only:
  - projects configured fields
  - writes JSON / XML / CSV
  - logs console evidence
  - appends NDJSON manifest events
  - generates final Excel workbook
  - archives old execution folders

## Important rule

Do **not** add fields inside `src/evidenceFactory`.

Add or change fields only in:

- `src/configLayer/models/evidence`

## Expected payload shape

Your execution layer should send payload keys that match config keys directly.

Example payload:

```ts
const payload = {
  scenarioId: "SCN-001",
  scenarioName: "Create Quote",
  platform: "Athena",
  application: "AzOnline",
  product: "Motor",
  journeyStartWith: "NewBusiness",
  description: "Create quote and verify premium",
  status: "passed",
  itemNo: 1,
  action: "Create Quote",
  subType: "HappyPath",
  portal: "AzOnline",
  testCaseRef: "TC001",
  startedAt: new Date().toISOString(),
  finishedAt: new Date().toISOString(),
  message: "",
  errorDetails: "",
  calculatedEmail: "test@example.com",
  calculatedEmailId: "test",
  quoteNumber: "Q-10001",
  policyNumber: "P-10001",
  runtimeInfo: {
    system: { platform: process.platform, node: process.version },
    browser: { name: "chromium", headless: true }
  }
};
```

Because your config also supports nested keys like `runtimeInfo.browser`, nested objects are fine.

## Write evidence during execution

```ts
import { EvidenceFactory } from "@evidenceFactory";

const factory = new EvidenceFactory();

await factory.writeEvidence({
  executionId: "RUN-001",
  suiteName: "motor-regression",
  artifactId: "TC001",
  artifactName: "create-quote",
  status: "passed",
  outputFormats: ["json", "xml", "csv", "console"],
  consoleMode: "e2e",
  payload
});
```

## Finalize execution after the run

`metaPayload` should also follow your configured meta keys.

```ts
await factory.finalizeExecution({
  executionId: "RUN-001",
  suiteName: "motor-regression",
  metaPayload: {
    runId: "RUN-001",
    mode: "e2e",
    environment: "qa",
    startedAt: "2026-04-10T08:00:00.000Z",
    finishedAt: "2026-04-10T08:10:00.000Z",
    totalTime: "600000",
    totalItems: 10,
    passedItems: 8,
    failedItems: 1,
    errorItems: 1,
    notExecutedItems: 0,
    totalCount: 10,
    passedCount: 8,
    failedCount: 1,
    errorCount: 1,
    notExecutedCount: 0,
    finalizedAt: new Date().toISOString(),
    artifactTimestamp: new Date().toISOString()
  }
});
```

## Output structure

```text
artifacts/
  current/
    motor-regression/
      RUN-001/
        json/passed/TC001_create-quote.json
        xml/passed/TC001_create-quote.xml
        csv/passed/TC001_create-quote.csv
        manifests/events.ndjson
        excel/motor-regression_RUN-001.xlsx
```

## Parallel execution

This supports same-run parallel execution because:

- each test case writes separate JSON/XML/CSV files
- the manifest is append-only NDJSON
- Excel is generated once at the end

## Integrating in executionLayer

Recommended flow:

1. executionLayer builds payload from evidence config fields
2. call `writeEvidence(...)` per item/scenario/test case
3. call `finalizeExecution(...)` once after the run
4. optionally call `archiveOldExecutions(...)`

## Example commands

```bash
npm run check:types
```

If you want a quick smoke test after wiring:

```bash
node -r ts-node/register -r tsconfig-paths/register src/evidenceFactory/examples/example-usage.ts
```
