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

A["Scanner CLI<br/>page-scanner"] --> B["Scan Command<br/>commands/scan.ts"] --> C["Scan Runner<br/>scanner/runner.ts"]

subgraph P1["Phase 1 · Browser Session"]
direction LR
D["Connect to browser<br/>via CDP"]
E["Select context / tab"]
F["Read page URL + title"]
end

C --> D --> E --> F

subgraph P2["Phase 2 · DOM Discovery"]
direction RL
G["Define scan root<br/>root + modal containers"]
H["Collect candidate nodes"]
I["Filter unsupported / footer nodes"]
J["Extract raw DOM metadata"]
end

F --> J
J --> I
I --> H
H --> G

subgraph P3["Phase 3 · Semantic Enrichment"]
direction LR
K["Resolve labels<br/>for / wrapped / aria-labelledby"]
L["Resolve parent form-group context"]
M["Capture meta fields"]
N["Build smart business key"]
end

G --> K --> L --> M --> N

subgraph P4["Phase 4 · Selector Modeling"]
direction RL
O["Classify element type"]
P["Build selector candidates"]
Q["Rank preferred selector"]
R["Collect fallback selectors"]
end

N --> R
R --> Q
Q --> P
P --> O

subgraph P5["Phase 5 · Page Map Assembly"]
direction LR
S["Merge with existing map<br/>if merge mode enabled"]
T["Assemble page-map JSON"]
U["Write page-map file"]
V["page-maps/*.json"]
end

O --> S --> T --> U --> V
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


