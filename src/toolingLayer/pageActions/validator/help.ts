// src/toolingLayer/pageActions/validator/help.ts

export function printPageActionValidatorHelp(): void {
    console.log(`
PAGE ACTION VALIDATOR

Usage:
  npm run pageactions:validate
  npm run pageactions:validate -- --verbose
  npm run pageactions:validate -- --strict
  npm run pageactions:validate -- --strict --verbose

Flags:
  --strict     Treat warnings as failures
  --verbose    Show detailed output
  --help       Show this help
`.trim());
}
