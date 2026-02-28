
# to kille browser: taskkill /IM msedge.exe /F

# tfor error checking: npx tsc -p tsconfig.json --noEmit

# to get tree outcome: tree -L 6 -I "node_modules|.git"

# 2) Test execution commands

### `npm run e2e`
Runs:
1) `npm run data:build`
2) then `npm run test:e2e`

**What it does**:
- One-shot “build data then execute tests”.

**Important**:
- If you need specific data-builder params (sheet / verbose / includeEmptyChildFields),
  run those variants first OR create another combined script.

---

Launch Edge with remote debugging:

$profile = Join-Path $env:TEMP ("edge-cdp-" + (Get-Date -Format "yyyyMMdd-HHmmss"))

& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" `
  --remote-debugging-port=9222 `
  --user-data-dir="$profile"

# Save CDP URL once (VERY IMPORTANT)

Invoke-RestMethod http://localhost:9222/json/version
webSocketDebuggerUrl
$CDP = "ws://localhost:9222/devtools/browser/9449de56-396e-4b57-b6e0-9d6e18c64c11"


# Pages scanner command

npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "common.auth-entry" `
  --merge `
  --verbose


  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "common.insurance-product-type-selection" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "motor.car-details" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "motor.driving-licence" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "motor.personal-details" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "motor.claims-and-convictions" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "motor.no-claim-discount" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "motor.add-additional-driver" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "motor.additional-driver" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "motor.additional-driver-personal-details" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "motor.additional-driver-claims" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "motor.car-usage" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "motor.policy-start-date" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "motor.your-quote" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "motor.your-quote-summary" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "common.account-registration" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "common.email-verification" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "common.direct-debit-setup" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "common.pay-deposit" `
  --merge `
  --verbose

  npx ts-node .\src\scanner\cli.ts `
  --connectCdp $CDP `
  --pageKey "motor.dashboard" `
  --merge `
  --verbose
