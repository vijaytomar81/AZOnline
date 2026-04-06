<!-- src/pageActionTools/page-action-repair/README.md -->

# Page Action Repair

Repairs safe structural inconsistencies for page action tooling.

---

## 🎯 Purpose

The repair tool ensures that **page actions remain structurally aligned** with page objects, manifests, and exports.

It applies **safe, automated fixes** without impacting QA-written logic.

---

## 🔧 Repair scope

Repair only applies **non-destructive fixes**:

### 1. Files
- regenerate missing page action files from page objects

### 2. Manifest
- create missing manifest entries  
- fix stale or incorrect manifest paths  
- repair actionKey mismatches  
- ensure manifest index consistency  

### 3. Registry
- add missing root exports  
- fix platform-level index exports  
- ensure all actions are properly exported  

### 4. Hygiene
- fix incorrect generated header path comments  

---

## 🚫 Out of scope

Repair does NOT modify:
- business logic inside page actions  
- QA custom code  
- TODO / conditional sections  
- field mappings or test data  

👉 These remain QA-owned areas  

---

## 🧠 Safety model

Repair operates with a **non-destructive contract**:

- only fixes structural issues  
- never overwrites manual logic  
- only updates predictable/generated areas  

---

## 📊 Output behavior

- ✔ Fix applied → detailed output with before/after  
- ℹ No fix needed → compact output  

Each fix includes:
- file path  
- incorrect value found  
- fix replaced value  
- message  

---

## ▶️ Usage

npm run pageactions:repair  
npm run pageactions:repair:verbose  

---

## 🔁 Typical workflow

npm run pageactions:validate  
npm run pageactions:repair:verbose  
npm run pageactions:validate:verbose  

---

## 🧭 Mental model

Page Objects → Manifest → Page Actions → Exports  
(source → repaired → validated)

---

## ⚡ Result summary meaning

- Rules run → total repair rules executed  
- Applied fixes → number of fixes applied  
- Warnings → non-blocking issues  
- Errors → blocking failures (rare)  

---

## 🚀 Recommended flow

Always run repair after validation failures:

npm run pageactions:repair:verbose  

Then verify:

npm run pageactions:validate:verbose  

---

## 🔧 Extensibility

Repair uses a rule-based pipeline:

repair/  
  rules/  
    files/  
    manifest/  
    registry/  
    hygiene/  

You can:
- add new repair rules  
- extend existing fix logic  
- control safe vs aggressive fixes  

---

## ✅ Final note

Repair guarantees **structural correctness**, not business correctness.

