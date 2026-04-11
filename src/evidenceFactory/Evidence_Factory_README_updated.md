# Evidence Factory (consumer-only)

A config-driven evidence writer for AZOnline.

This package is intentionally a **consumer only**. It does **not** define evidence fields.  
It consumes the evidence configuration already defined in:

- src/configLayer/models/evidence/types.ts
- src/configLayer/models/evidence/views/*
- src/configLayer/models/evidence/fields/*

---

## Design

- executionLayer builds payload objects that already match your evidence config keys  
- evidenceFactory only:
  - projects configured fields
  - writes JSON / XML / CSV
  - logs console evidence
  - appends NDJSON manifest events
  - generates final Excel workbook
  - archives old execution folders

---

## Important rule

Do NOT add fields inside src/evidenceFactory.

Add or change fields only in:

src/configLayer/models/evidence

---

## Expected payload shape

Your execution layer should send payload keys that match config keys directly.

Example:
```
{
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
  testCaseRef: "TC001",
  startedAt: new Date().toISOString(),
  finishedAt: new Date().toISOString(),
  calculatedEmail: "test@example.com",
  quoteNumber: "Q-10001",
  policyNumber: "P-10001"
}
```
---

## Factory setup (executionLayer)

Example:
```
const factory = new EvidenceFactory({
  rootDir: process.env.EVIDENCE_ROOT_DIR ?? "artifacts",
  fileNaming: {
    includeTimestamp: true,
    timestampSource: "payload"
  },
  archive: {
    olderThanDays: 14,
    zip: true,
    maxCurrentExecutionsPerSuite: 30
  }
});
```
---

## Write evidence during execution
```
await factory.writeEvidence({
      executionId: 'RUN-001',
      suiteName: 'motor-regression',
      artifactId: 'TC001',
      artifactName: 'create-quote',
      status: 'passed',
      consoleMode: 'e2e',
      outputFormats: ['json', 'console'],
      payload: {
        scenarioId: 'SCN-001',
        scenarioName: 'Create Quote',
        platform: 'Athena',
        application: 'AzOnline',
        product: 'Motor',
        journeyStartWith: 'NewBusiness',
        description: 'Create quote and verify premium',
        status: 'passed',
        itemNo: 1,
        action: 'Create Quote',
        subType: 'HappyPath',
        portal: 'AzOnline',
        testCaseRef: 'TC001',
        startedAt: startedAt.toISOString(),
        finishedAt: new Date(startedAt.getTime() + 2_500).toISOString(),
        message: '',
        errorDetails: '',
        blockedBy: '',
        calculatedEmail: 'test@example.com',
        calculatedEmailId: 'test',
        quoteNumber: 'Q-10001',
        policyNumber: 'P-10001',
      },
    });
```
---

## Finalize execution / Execution Summary
```
await factory.finalizeExecution({
  executionId: "RUN-001",
  suiteName: "motor-regression",
  metaPayload: {
      run: {
        runId: 'test-run-20260410_114949',
        mode: 'e2e',
        environment: 'test',
        evidenceDirectory: 'results/evidence/test-run-20260410_114949',
      },
      runtime: {
        machineName: 'Vijays-MacBook-Air.local',
        user: 'vijaytomar',
        platform: 'darwin',
        osVersion: '25.3.0',
      },
      browser: {
        browser: 'chromium',
        browserChannel: 'msedge',
        browserVersion: '146.0.3856.97',
        headless: true,
      },
      results: {
        totalItems: 2,
        passedCount: 1,
        failedCount: 1,
        errorCount: 0,
        notExecutedCount: 0,
        passRate: '50.00%',
      },
      timing: {
        executionTime: '7.74s',
        startedAt: '2026-04-10T09:49:49.351Z',
        finishedAt: '2026-04-10T09:49:57.086Z',
      },

      // Optional flat keys too, if your current META_EVIDENCE_FIELDS still use them
      runId: 'RUN-001',
      mode: 'e2e',
      environment: 'qa',
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      totalCount: 2,
      passedCount: 1,
      failedCount: 1,
      errorCount: 0,
      notExecutedCount: 0,
      cleanupWorkerArtifacts: false,
      finalizedAt: finishedAt.toISOString(),
      artifactTimestamp: finishedAt.toISOString(),
      outputRoot: 'artifacts',
      evidenceDir: 'artifacts/current/motor-regression/RUN-001',
      promotedPageScanCount: 0,
    },
});
```
---

## Output structure
```
artifacts/
  current/
    motor-regression/
      RUN-001/
        json/passed/TC001_create-quote_2026-04-10T09-15-00-000Z.json
        xml/passed/TC001_create-quote_2026-04-10T09-15-00-000Z.xml
        csv/passed/TC001_create-quote_2026-04-10T09-15-00-000Z.csv
        manifests/events.ndjson
        excel/motor-regression_RUN-001_2026-04-10T09-20-00-000Z.xlsx
```
---

## File naming strategy

Without timestamp:
TC001_create-quote.json

With timestamp:
TC001_create-quote_2026-04-10T09-15-00-000Z.json

---

## Output formats

Controlled via:

outputFormats: ["json", "xml", "csv", "console"]

Excel is generated only during finalizeExecution.

---

## Parallel execution

- Each test writes separate files
- NDJSON is append-only
- Excel generated once at end

---

## Archiving strategy

Configurable:

- olderThanDays → move old runs
- zip → compress archived runs
- maxCurrentExecutionsPerSuite → keep limited runs

Archive structure:
```
artifacts/archive/YYYY-MM/<suite>/<executionId>.zip
```
---

## Useful commands
```
npm run check:types
```
---

# Flow

That is a **plain code block**, not a Mermaid block.

---

## Correct syntax


The opening fence must be on **one line**:

````mermaid
flowchart TD

A[Execution Layer] --> B[Build Payload based on Evidence Config]
B --> C[writeEvidence]
C --> D[outputFormats]

D -->|json| E1[Write JSON File]
D -->|xml| E2[Write XML File]
D -->|csv| E3[Write CSV File]
D -->|console| E4[Console Log]

C --> F[Append NDJSON Manifest]

subgraph Parallel Execution
  E1
  E2
  E3
  F
end

F --> G[All Test Cases Completed]
G --> H[finalizeExecution]
H --> I[Read All Manifest Events]
I --> J[Generate Excel Report]
J --> K[Save Excel File]
K --> L[Return Metadata Response]
L --> M[Archive Old Executions]
````
---
