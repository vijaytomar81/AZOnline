// src/toolingLayer/pageActions/repair/help.ts

export function printPageActionRepairHelp(): void {
    console.log(`
PAGE ACTION REPAIR

Usage:
npm run pageactions:repair
npm run pageactions:repair:verbose

Flags:
--strict   fail when repair cannot fully restore
--verbose  show detailed output
--help     show help
`);
}
