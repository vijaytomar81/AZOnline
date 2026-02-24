# 🧱 Page scanner command —

Windows VS Code:
$env:SCAN_BASE_URL="target page full url"
npx ts-node .\src\scanner\cli.ts --pageKey motor.car-details --url "/car-details" --verbose

Mac VS Code:
npx ts-node src/scanner/cli.ts --pageKey motor.car-details --url "/car-details" --verbose
