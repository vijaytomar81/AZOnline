# Automation Toolchain

This document explains the internal automation toolchain used to build and maintain page objects.

The toolchain includes:

- Page Scanner
- Elements Generator
- Page Validator

---

# 1) Page Scanner Flow

```mermaid
flowchart TB

A["CLI: page-scanner"]
B["commands/scan.ts"]
C["scanner/runner.ts"]

A --> B --> C

subgraph S1["Browser Connection"]
direction LR
D["Connect to browser via CDP"]
E["Read active page / tab"]
end

C --> D --> E

subgraph S2["DOM Extraction"]
direction RL
F["domExtract.ts"]
G["Extract interactive elements"]
H["Resolve metadata"]
end

E --> H
H --> G
G --> F

subgraph S3["Smart Key Generation"]
direction LR
I["Parent form-group label discovery"]
J["getSmartElementsKey.ts"]
K["Generate smart keys"]
end

F --> I --> J --> K

subgraph S4["Selector Generation"]
direction RL
L["classify.ts"]
M["selectorPipeline.ts"]
N["Build selector candidates"]
O["Choose preferred + fallbacks"]
end

K --> O
O --> N
N --> M
M --> L

subgraph S5["Finalize Page Map"]
direction LR
P["merge.ts"]
Q["writer.ts"]
R["page-map.json"]
end

L --> P --> Q --> R
```

---
# 2) Elements Generator Flow

```mermaid
flowchart TD

A["page-map.json"] --> B["generator/runner.ts"]
B --> C["scaffold.ts"]

C --> D["buildElementsTs.ts"]
C --> E["buildAliasesGeneratedTs.ts"]
C --> F["buildAliasesHumanTs.ts"]
C --> G["buildPageTsStub.ts"]

D --> H["elements.ts"]
E --> I["aliases.generated.ts"]
F --> J["aliases.ts"]
G --> K["PageObject.ts"]

J --> L["syncAliasesHuman.ts"]
I --> L
L --> J

J --> M["pageObject.ts sync"]
M --> K

B --> N["syncPageRegistry.ts"]
N --> O["pages/index.ts"]
N --> P["pages/pageManager.ts"]
```

---
# 3) Validator Pipeline

```mermaid

flowchart TD

A["page-map.json"]
B["elements.ts"]
C["aliases.generated.ts"]
D["aliases.ts"]
E["PageObject.ts"]
F["pages/index.ts + pageManager.ts"]

A --> V1["checkPageMapToElements"]
V1 --> B

B --> V2["checkElementsToGeneratedAliases"]
V2 --> C

C --> V3["checkGeneratedToBusinessAliases"]
V3 --> D

D --> V4["checkBusinessAliasesToPageObject"]
V4 --> E

E --> V5["checkPageObjectStructure"]

F --> V6["pageRegistry validator"]
E --> V6

A --> V7["pageMetaValidator"]
E --> V7

E --> V8["moduleHygiene"]
F --> V8
```


