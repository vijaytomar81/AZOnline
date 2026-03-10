// src/tools/file-header-checker/fileHeaderCheckerHelp.ts

export function usage(): string {
    return `
file-header-checker

Usage:
  npm run headers:check
  npm run headers:fix
  node -r ts-node/register src/tools/file-header-checker/cli.ts [options]

Options:
  --checkMode    Check headers only (no file changes)
  --help, -h     Show help

Examples:
  npm run headers:check
  npm run headers:fix
  node -r ts-node/register src/tools/file-header-checker/cli.ts --checkMode
`.trim();
}