# Page Objects

This folder contains generated Page Objects used by Playwright tests.

Page objects are automatically generated from **page-map JSON files**.

---

# Structure

Each page folder contains:
---

# File Responsibilities

| File                 | Purpose
|----------------------|-----------
| elements.ts          | selectors 
| aliases.generated.ts | generated alias mapping 
| aliases.ts           | human-maintained aliases 
| Page.ts              | page object methods 

---

# Page Registry

Two files manage page registration:
pages/index.ts
pages/pageManager.ts
