File 'c:/Users/tp70707/OneDrive - Allianz/My Documents/Automation/AZOnline/src/pages/common/auth-entry/AuthEntryPage.ts' is not a module.

# to kille browser: taskkill /IM msedge.exe /F

# to get tree outcome: tree -L 6 -I "node_modules|.git"

# 🧱 Page scanner command — from Powershell VS Code

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
