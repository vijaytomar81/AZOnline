# 🧱 Page scanner command — from Powershell VS Code
1) Open Browser:

$profile = Join-Path $env:TEMP ("edge-cdp-" + (Get-Date -Format "yyyyMMdd-HHmmss"))

& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" `
  --remote-debugging-port=9222 `
  --user-data-dir="$profile"

2) Verify CDP (quick check):

Invoke-RestMethod http://localhost:9222/json/version

output be like below:

{
  "Browser": "Edg/...",
  "webSocketDebuggerUrl": "ws://..."
}

3) Scan current open page:

npx ts-node .\src\scanner\cli.ts `
  --connectCdp "ws://localhost:9222/devtools/browser/41fa169d-8934-45c1-9ce2-b47046a75ec9" `
  --pageKey "common.auth-entry" `
  --verbose


# 🧱 Page scanner command — from Mac VS Code

1) Open Browser:

/Applications/Microsoft\ Edge.app/Contents/MacOS/Microsoft\ Edge \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/edge-scan-profile

2) Scan current open page:

npx ts-node src/scanner/cli.ts \
  --connectCdp http://localhost:9222 \
  --pageKey common.auth-entry \
  --verbose

#end