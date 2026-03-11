# Page Elements Generator

The generator converts page-map JSON files into automation-ready page objects.

---

# Generated Files

| File | Purpose |
|----|----|
| elements.ts | selectors |
| aliases.generated.ts | generated aliases |
| aliases.ts | business aliases |
| PageObject.ts | page methods |

---

# Generation Flow

```mermaid
flowchart TD

PageMap --> Elements
PageMap --> GeneratedAliases
PageMap --> BusinessAliases
PageMap --> PageObject

BusinessAliases --> PageObject
GeneratedAliases --> BusinessAliases
