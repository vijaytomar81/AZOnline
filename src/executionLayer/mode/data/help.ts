// src/executionLayer/mode/data/help.ts

export function printDataModeHelp(): void {
    console.log(`
Data Mode Usage

Required:
  --mode data
  --source <sourceName>

Optional:
  --schema <schemaName>
  --iterations <number>
  --parallel <number>
  --verbose

Example:
  npm run execution -- --mode data --source FlowNB --schema direct
`.trim());
}
