// src/page-scanner/scannerHelp.ts

export function usage(): string {
    return `
Page Scanner CLI

Usage:
  npm run scan -- --connectCdp <wsUrl> --pageKey <key> [options]
  node -r ts-node/register src/page-scanner/cli.ts scan [options]

Commands:
  scan       Scan a page via CDP and write a page-map JSON
  help       Show this help

------------------------------------------------------------
scan

Required:
  --connectCdp <wsUrl>      CDP websocket URL
                            Example:
                              ws://localhost:9222/devtools/browser/<id>

  --pageKey <key>           Page key used as filename and folder mapping
                            Example:
                              motor.car-details

Optional:
  --outDir <path>           Output folder for page-maps
                            Default:
                              src/page-scanner/page-maps

  --tabIndex <n>            Which browser tab to scan (0-based)
                            Default:
                              0

  --merge                   Merge into existing <pageKey>.json (keeps keys stable)
                            Default:
                              false

  --verbose                 Extra logs

  --logToFile               Write logs to file too

  --logFilePath <path>      Log file path
                            Default:
                              scanner.log

  --help, -h                Show scan help

------------------------------------------------------------
Examples

# 1) Minimal scan (writes new JSON)
npm run scan -- --connectCdp "$CDP" --pageKey motor.car-details

# 2) Scan + merge (recommended; keeps stable keys)
npm run scan -- --connectCdp "$CDP" --pageKey motor.car-details --merge

# 3) Scan a different tab (tabIndex=1 means 2nd tab)
npm run scan -- --connectCdp "$CDP" --pageKey motor.car-details --merge --tabIndex 1

# 4) Write page-map into a custom folder
npm run scan -- --connectCdp "$CDP" --pageKey motor.car-details --merge --outDir ./tmp/page-maps

# 5) Verbose mode (debug logs)
npm run scan -- --connectCdp "$CDP" --pageKey motor.car-details --merge --verbose

# 6) Log to file (plus console)
npm run scan -- --connectCdp "$CDP" --pageKey motor.car-details --merge --logToFile --logFilePath ./scanner.log

# Windows PowerShell examples:
npm run scan -- --connectCdp "$CDP" --pageKey motor.car-details --merge --verbose
npm run scan -- --connectCdp "$CDP" --pageKey motor.car-details --merge --tabIndex 1

------------------------------------------------------------
Notes

- Page maps are written to: src/page-scanner/page-maps (by default)
- Use --merge to keep stable keys across scans.
- If npm eats your args, ensure you include the extra "--" after the script:
    npm run scan -- --connectCdp "$CDP" --pageKey motor.car-details

`.trim();
}