// src/tools/page-object-repair/repairHelp.ts

export function usage(): string {
    return `
Usage:
  npm run repair -- repair [options]

Commands:
  repair              Repair page-object chain and generated registry files

Options:
  --mapsDir           Override pages maps directory
  --pageObjectsDir    Override page objects directory
  --pageRegistryDir   Override pages registry directory
  --manifestFile      Override manifest file path
  --verbose           Print per-rule lifecycle logs
  --help, -h          Show help

Repair chain:
  1. elements.ts           -> aliases.generated.ts
  2. aliases.generated.ts  -> aliases.ts
  3. aliases.ts            -> PageObject.ts
  4. page maps/artifacts   -> page-objects.manifest.json
  5. actual page objects   -> src/pages/index.ts
  6. actual page objects   -> src/pages/pageManager.ts

Notes:
  - Repair is cleanup-capable and may remove stale child entries
  - Repair does not modify page-map source files
  - Custom code outside managed page-object regions is preserved
`.trim();
}