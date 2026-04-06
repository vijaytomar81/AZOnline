// src/executionLayer/mode/e2e/help.ts

export function printE2EModeHelp(): void {
    console.log(`
E2E Mode Usage

Required:
  --mode e2e
  --excel <path>
  --sheet <sheetName>

Optional:
  --scenario <ScenarioId[,ScenarioId...]>
  --includeDisabled
  --app <AzOnline|Ferry|Britannia>
  --product <Motor|Home>
  --iterations <number>
  --parallel <number>
  --verbose

Notes:
  - Application is resolved from "Application" column first, otherwise from --app.
  - Product is resolved from "Product" column first, otherwise from --product.
  - If either cannot be resolved, execution fails.

Example:
  npm run execution -- --mode e2e --excel "sampleData/E2E Scenarios.xlsx" --sheet "Scenarios" --app AzOnline --product Motor
`.trim());
}
