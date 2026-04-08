// src/frameworkCore/executionLayer/mode/e2e/help.ts

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
  --platform <Athena|PCW|PCWTool>
  --application <AzOnline|Ferry|Britannia|CTM|CNF|MSM|GoCo>
  --product <Motor|Home>
  --iterations <number>
  --parallel <number>
  --verbose

Notes:
  - Platform can be provided in the sheet or via --platform.
  - Application can be provided in the sheet or via --application.
  - Product can be provided in the sheet or via --product.
  - JourneyStartWith is read from the sheet using values: newPolicy | existingPolicy.

Example:
  npm run execution -- --mode e2e --excel "sampleData/E2E Scenarios.xlsx" --sheet "Scenarios" --platform Athena --application AzOnline --product Motor
`.trim());
}
