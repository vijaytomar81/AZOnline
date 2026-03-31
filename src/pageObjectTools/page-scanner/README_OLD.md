---
# Page Scanner

Page Scanner extracts UI elements from a running browser page and generates page-map JSON files.

---

# Purpose

Automatically discover UI elements and build a normalized map of selectors.

---

# Output

Generated files:
src/tools/page-scanner/page-maps/*.json

---

# Workflow

1. connect to browser via CDP
2. extract DOM elements
3. classify element types
4. generate smart keys
5. create selector candidates
6. write page-map JSON

---

# Main Modules

| File                   | Responsibility 
|------------------------|------------------------
| domExtract.ts          | DOM extraction 
| classify.ts            | element classification 
| selectorPipeline.ts    | selector generation 
| getSmartElementsKey.ts | smart key generation 
| runner.ts              | scanning engine 
| writer.ts              | JSON writer 


