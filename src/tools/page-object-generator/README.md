<!-- src/tools/page-object-generator/README.md -->

# Page Elements Generator

The generator converts page-map JSON files into automation-ready page objects and keeps the page chain aligned incrementally.

## Generated Files

| File | Purpose |
|---|---|
| elements.ts | selectors and stableKey-aware element definitions |
| aliases.generated.ts | generated alias layer from elements.ts |
| aliases.ts | business alias layer, safe to edit |
| PageObject.ts | page methods synced from aliases.ts |

## Generation Flow

```mermaid
flowchart TD
    PageMap --> Elements
    Elements --> GeneratedAliases
    GeneratedAliases --> BusinessAliases
    BusinessAliases --> PageObject
    Manifest --> ChangedOnly
    PageMap --> Manifest