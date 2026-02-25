# 🧱 Page scanner command — from Powershell VS Code

& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" `
  --remote-debugging-port=9222 `
  --user-data-dir="$env:TEMP\edge-scan-profile"



# 🧱 Page scanner command — from Mac VS Code

/Applications/Microsoft\ Edge.app/Contents/MacOS/Microsoft\ Edge \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/edge-scan-profile
