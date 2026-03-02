# 🧱 Page scanner command — from Powershell VS Code

# 1) Launch Edge with remote debugging (Windows powershell (Edge example))

$profile = Join-Path $env:TEMP ("edge-cdp-" + (Get-Date -Format "yyyyMMdd-HHmmss"))
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" `
  --remote-debugging-port=9222 `
  --user-data-dir="$profile"

# 2) Save CDP URL once (VERY IMPORTANT)

Invoke-RestMethod http://localhost:9222/json/version
webSocketDebuggerUrl
" $CDP = "ws://localhost:9222/devtools/browser/9449de56-396e-4b57-b6e0-9d6e18c64c11"


# 3) All commands below are run via **npm scripts**

## Quick glossary

- **Page maps**: JSON snapshots of UI selectors stored under `src/page-maps/<pageKey>.json`.
- **Elements generation**: Converts page-map JSON into strongly-typed `elements.ts` files inside `src/pages/**/<page>/elements.ts`.
- **State file**: Tracks hashes of page-map JSON files so we can auto-detect changes.
  - Stored at: `src/.scanner-state/page-maps-state.json`

---

These commands use the scanner CLI:
- `src/scanner/cli.ts`
- They scan the **currently open tab** in a browser launched with `--remote-debugging-port`
- Output goes to: `src/page-maps/<pageKey>.json`



$profile = Join-Path $env:TEMP ("edge-cdp-" + (Get-Date -Format "yyyyMMdd-HHmmss")); `
Start-Process "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "--remote-debugging-port=9222 --user-data-dir=$profile"; `
Start-Sleep -Seconds 2; `
$CDP = (Invoke-RestMethod http://localhost:9222/json/version).webSocketDebuggerUrl;

npm run scan:page:merge -- --connectCdp="$CDP" --pageKey="motor.car-details"

npm run scan:page:merge -- --connectCdp=$CDP --pageKey=motor.car-details


available npm command:

    "scan:page": "ts-node src/scanner/cli.ts",
    "scan:page:verbose": "ts-node src/scanner/cli.ts -- --verbose",
    "scan:page:merge": "ts-node src/scanner/cli.ts -- --merge",
    "scan:page:merge:verbose": "ts-node src/scanner/cli.ts -- --merge --verbose",
