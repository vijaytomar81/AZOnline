# 🧱 Page scanner command — from Powershell VS Code

$env:SCAN_BASE_URL="target page full url"
npx ts-node .\src\scanner\cli.ts --pageKey common.auth-entry --url "/" --verbose
npx ts-node .\src\scanner\cli.ts --pageKey common.insurance-product-type-selection --url "/insurance-product-selection" --verbose
npx ts-node .\src\scanner\cli.ts --pageKey motor.car-details --url "/car-details" --verbose
npx ts-node .\src\scanner\cli.ts --pageKey motor.driving-licence --url "/driving-licence" --verbose
npx ts-node .\src\scanner\cli.ts --pageKey motor.personal-details --url "/personal-details" --verbose
npx ts-node .\src\scanner\cli.ts --pageKey motor.claims-and-convictions --url "/claims-and-convictions" --verbose
npx ts-node .\src\scanner\cli.ts --pageKey motor.no-claim-discount --url "/no-claim-discount" --verbose
npx ts-node .\src\scanner\cli.ts --pageKey motor.add-additional-driver --url "/add-additional-driver" --verbose
npx ts-node .\src\scanner\cli.ts --pageKey motor.additional-driver --url "/additional-driver" --verbose
npx ts-node .\src\scanner\cli.ts --pageKey motor.additional-driver-personal-details --url "/additional-driver-personal-details" --verbose
npx ts-node .\src\scanner\cli.ts --pageKey motor.additional-driver-claims --url "/additional-driver-claims" --verbose
npx ts-node .\src\scanner\cli.ts --pageKey motor.car-usage --url "/car-usage" --verbose
npx ts-node .\src\scanner\cli.ts --pageKey motor.policy-start-date --url "/policy-start-date" --verbose
npx ts-node .\src\scanner\cli.ts --pageKey motor.decline --url "/decline" --verbose

# 🧱 Page scanner command — from Mac VS Code

npx ts-node src/scanner/cli.ts --pageKey common.auth-entry --url "/" --verbose
npx ts-node src/scanner/cli.ts --pageKey common.insurance-product-type-selection --url "/insurance-product-selection" --verbose
npx ts-node src/scanner/cli.ts --pageKey motor.car-details --url "/car-details" --verbose
npx ts-node src/scanner/cli.ts --pageKey motor.driving-licence --url "/driving-licence" --verbose
npx ts-node src/scanner/cli.ts --pageKey motor.personal-details --url "/personal-details" --verbose
npx ts-node src/scanner/cli.ts --pageKey motor.claims-and-convictions --url "/claims-and-convictions" --verbose
npx ts-node src/scanner/cli.ts --pageKey motor.no-claim-discount --url "/no-claim-discount" --verbose
npx ts-node src/scanner/cli.ts --pageKey motor.add-additional-driver --url "/add-additional-driver" --verbose
npx ts-node src/scanner/cli.ts --pageKey motor.additional-driver --url "/additional-driver" --verbose
npx ts-node src/scanner/cli.ts --pageKey motor.additional-driver-personal-details --url "/additional-driver-personal-details" --verbose
npx ts-node src/scanner/cli.ts --pageKey motor.additional-driver-claims --url "/additional-driver-claims" --verbose
npx ts-node src/scanner/cli.ts --pageKey motor.car-usage --url "/car-usage" --verbose
npx ts-node src/scanner/cli.ts --pageKey motor.policy-start-date --url "/policy-start-date" --verbose
npx ts-node src/scanner/cli.ts --pageKey motor.decline --url "/decline" --verbose
