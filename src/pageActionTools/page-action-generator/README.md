<!-- src/pageActionTools/page-action-generator/README.md -->

# Page Action Generator

Generates draft page action files from page object manifest entries.

---

## 🎯 Purpose

The generator creates **initial page action scaffolding** aligned with page objects.

It accelerates development by producing:
- ready-to-use structure
- consistent naming
- predictable patterns

---

## 🧭 What it owns

Generator is responsible for:

### 1. Files
- create missing page action files  
- keep file structure aligned with page objects  

### 2. Manifest
- create page action manifest entries  
- maintain manifest index consistency  

### 3. Registry
- create/update page action index exports  
- ensure all actions are properly exported  

### 4. Code generation
- generate structured action functions  
- inject logging and validation helpers  
- build consistent method invocation patterns  

### 5. Output readability
- compact logs  
- predictable formatting  
- consistent structure  

---

## 🚫 What it does NOT own

Generator does NOT handle:

- final business-data mapping  
- QA custom logic  
- nested schema decisions  
- conditional business rules  
- edge-case handling  

👉 These are handled by **Automation QA after generation**

---

## 🧱 Output strategy

Each page object produces **one page action file**

Generated output includes:

### ✅ Active (high confidence)
- direct input/select/search mappings  
- strongly inferred field bindings  

### ✅ Active conditional scaffolding
- numeric-index-based handling (e.g., conviction1, conviction2, …)  
- capped with safe defaults (e.g., max = 5)  

Example pattern:
- `const convictionCount = Math.min(Number(data.convictionCount ?? 0), 5);`
- conditional blocks per index  

### 📝 TODO (bulk commented)

#### 1. Low-confidence value mappings
- grouped inside a single TODO block  
- no single-line comments  

#### 2. Interaction mappings
- buttons  
- radio groups  
- links  

👉 Always bulk-commented for easy QA enablement  

---

## 🧠 Design principles

- single responsibility per file  
- predictable naming conventions  
- no duplicate logic  
- clear separation:
  - generator logic vs QA logic  
- safe defaults over assumptions  

---

## 📊 Output structure

Generated file includes:

1. Imports  
2. payload validation (`requireRecordValue`)  
3. logging start  
4. active mappings  
5. conditional indexed mappings  
6. TODO blocks  
7. logging end  

---

## ▶️ Usage

npm run pageactions:generate  
npm run pageactions:generate:verbose  

---

## 🔁 Typical workflow

npm run pageactions:generate  
npm run pageactions:validate  
npm run pageactions:repair (if needed)  

---

## 👨‍🔧 QA follow-up expectation

After generation, Automation QA should refine:

- payload source paths  
- fieldName debug paths  
- business conditions  
- nested schema mapping  
- enable required TODO sections  
- remove unnecessary mappings  

---

## 🔧 Extensibility

Generator is modular and supports:

generator/  
  naming/  
  manifest/  
  rendering/  
  classification/  

You can:
- add new naming strategies  
- improve classification logic  
- enhance conditional grouping  
- extend TODO generation rules  

---

## ⚡ Mental model

Page Objects → Generator → Page Actions → QA refinement → Validator → Repair  

---

## ✅ Final note

Generator provides **scaffolding**, not final automation logic.

