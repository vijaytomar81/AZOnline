// src/frameworkCore/executionLayer/mode/data/help.ts

export function printDataModeHelp(): void {
    console.log(`
Data Mode Usage

Required:
  --mode data
  --platform <Athena|PCW|PCWTool>
  --application <AzOnline|Ferry|Britannia|CTM|CNF|MSM|GoCo>
  --product <Motor|Home>
  --journeyContext <NewBusiness|MTA|Renewal|MTC>

Optional:
  --journeySubType <ChangeAddress|ChangeVehicle|AddDriver|RemoveDriver>
  --iterations <number>
  --parallel <number>
  --verbose

Notes:
  - Data mode resolves generated data using:
    platform + application + product + journeyContext
  - When journeyContext is MTA, journeySubType is required.
  - No source or schema argument is required.

Example:
  npm run execution -- --mode data --platform Athena --application AzOnline --product Motor --journeyContext NewBusiness
`.trim());
}
