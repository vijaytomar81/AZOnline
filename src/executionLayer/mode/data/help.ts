// src/executionLayer/mode/data/help.ts

export function printDataModeHelp(): void {
    console.log(`
Data Mode Usage

Required:
  --mode data
  --source <sourceName>

Optional:
  --schema <schemaName>
  --app <AzOnline|Ferry|Britannia>
  --product <Motor|Home>
  --iterations <number>
  --parallel <number>
  --verbose

Notes:
  - Application is resolved from --app first, otherwise inferred from source.
  - Product is resolved from --product first, otherwise inferred from source/schema.
  - If either cannot be resolved, execution fails.

Example:
  npm run execution -- --mode data --source FlowNB --app AzOnline --product Motor
`.trim());
}
