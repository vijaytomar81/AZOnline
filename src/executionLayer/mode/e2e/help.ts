// src/executionLayer/mode/e2e/help.ts

export function printE2EModeHelp(): void {
    console.log(`
E2E Mode Usage

Required:
  --mode e2e
  --excel <filePath>
  --sheet <sheetName>

Optional:
  --scenario <scenarioId1,scenarioId2>
  --includeDisabled
  --iterations <number>
  --parallel <number>
  --verbose

Example:
  npm run execution -- --mode e2e --excel ./results/test.xlsx --sheet Regression
`.trim());
}
