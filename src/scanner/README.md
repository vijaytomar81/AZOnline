# 🧱 Page scanner command — from Powershell VS Code
1) Open Browser:

& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" `
  --remote-debugging-port=9222 `
  --user-data-dir="$env:TEMP\edge-scan-profile"

2) Scan current open page:

npx ts-node .\src\scanner\cli.ts `
  --connectCdp "http://localhost:9222" `
  --pageKey "common.auth-entry" `
  --tabUrlRegex "/auth|login|register/" `
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
  --tabUrlRegex "/auth|login|register/" \
  --verbose

#end