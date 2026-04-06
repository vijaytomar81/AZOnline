<!-- src/pageActionTools/page-action-validator/README.md -->

# Page Action Validator

Validates page action structure against page objects, manifests, and exports.

---

## 🎯 Purpose

The validator ensures that **page actions stay structurally in sync** with page objects and manifests.

It focuses only on **safe, non-destructive checks** and never modifies files.

---

## 🧭 Source of truth

- Page Objects → primary source of truth  
- Page Actions → must align with page objects via manifest + naming conventions  

---

## 🔍 Validator scope

The validator checks:

### 1. Environment
- required directories exist  
- manifest files are accessible  

### 2. Coverage
- every page object has a corresponding page action  

### 3. Files
- missing action files  
- unexpected (orphan) action files  

### 4. Manifest
- manifest index points to valid entry files  
- no stale or missing references  
- manifest ↔ file consistency  
- actionKey naming correctness  
- action file path consistency  
- index path consistency  

### 5. Registry
- root exports  
- platform-level exports  
- index consistency  

### 6. Hygiene
- generated header path  
- action function naming  
- duplicate keys / names  

---

## 🚫 Out of scope

Validator does NOT validate:
- business logic inside page actions  
- QA custom code  
- TODO / conditional logic sections  
- data correctness  

👉 These remain QA-owned areas  

---

## 📊 Output behavior

- ✔ Passed rules → compact output  
- ⚠ Warning rules → detailed output  
- ✖ Failed rules → detailed output  

Each issue includes:
- file path  
- actual value  
- correct value  
- message  

---

## ▶️ Usage

npm run pageactions:validate  
npm run pageactions:validate:verbose  
npm run pageactions:validate:strict  

---

## 🔁 Typical workflow

npm run pageactions:validate  
npm run pageactions:repair:verbose  
npm run pageactions:validate:verbose  

---

## 🧠 Mental model

Page Objects → Manifest → Page Actions → Exports  
(source of truth → validated chain)

---

## ⚡ Result summary meaning

- Rules run → total rules executed  
- Passed checks → rules with no issues  
- Warn checks → rules with warnings  
- Failed checks → rules with errors  
- Total warnings → number of warning items  
- Total errors → number of error items  

---

## 🚀 Suggested action

If issues are found:

npm run pageactions:repair:verbose  
npm run pageactions:validate:verbose  

---

## 🔧 Extensibility

Validator uses a rule-based pipeline:

validate/  
  rules/  
    environment/  
    coverage/  
    files/  
    manifest/  
    registry/  
    hygiene/  

You can:
- add new rules  
- disable rules  
- extend reporting  

---

## ✅ Final note

Validator guarantees **structural integrity**, not business correctness.

