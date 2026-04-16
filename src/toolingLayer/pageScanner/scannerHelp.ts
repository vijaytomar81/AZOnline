// src/toolingLayer/pageScanner/scannerHelp.ts

export function usage(): string {
    return `
Page Scanner CLI

Usage:
  npm run scan -- --connectCdp <wsUrl> --pageKey <key> [options]
  node -r ts-node/register src/toolingLayer/pageScanner/cli.ts scan [options]

Commands:
  scan       Scan a page via CDP and synchronize page-map JSON
  help       Show this help

------------------------------------------------------------
scan

Required:
  --connectCdp <wsUrl>      CDP websocket URL
                            Example:
                              ws://localhost:9222/devtools/browser/<id>

  --pageKey <key>           Page key format:
                              <platform>.<application>.<product>.<name>
                            Example:
                              athena.azonline.motor.car-details

Optional:
  --outDir <path>           Scanner output root
                            Default:
                              src/businessLayer/pageScanner

  --tabIndex <n>            Which browser tab to scan (0-based)
                            Default:
                              0

  --verbose                 Extra logs

  --logToFile               Write logs to file too

  --logFilePath <path>      Log file path
                            Default:
                              page-scanner.log

  --help, -h                Show scan help

------------------------------------------------------------
Behavior

- If page-map file does not exist -> operation = created
- If page-map file exists and content changes -> operation = merged
- If page-map file exists and no meaningful change is found -> operation = unchanged
- Invalid pageKey or runtime failure -> operation = failed

------------------------------------------------------------
Examples

npm run scan -- --connectCdp "$CDP" --pageKey athena.azonline.motor.car-details
npm run scan -- --connectCdp "$CDP" --pageKey athena.azonline.motor.car-details --tabIndex 1
npm run scan -- --connectCdp "$CDP" --pageKey athena.azonline.motor.car-details --verbose
npm run scan -- --connectCdp "$CDP" --pageKey athena.azonline.motor.car-details --logToFile --logFilePath ./page-scanner.log

------------------------------------------------------------
Output

Page maps are written as:

  src/businessLayer/pageScanner/<platform>/<application>/<product>/<name>.json

Scanner manifest index is written as:

  src/businessLayer/pageScanner/.manifest/index.json

`.trim();
}
