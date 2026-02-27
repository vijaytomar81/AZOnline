
# to kille browser: taskkill /IM msedge.exe /F

# to get tree outcome: tree -L 6 -I "node_modules|.git"

# 🧱 Page scanner command — from Powershell VS Code

STEP 1 — Save CDP URL once (VERY IMPORTANT)

Invoke-RestMethod http://localhost:9222/json/version
webSocketDebuggerUrl
$CDP = "ws://localhost:9222/devtools/browser/YOUR-ID"


STEP 2 — COMMON Pages

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
  --pageKey "motor.decline" `
  --merge `
  --verbose

  