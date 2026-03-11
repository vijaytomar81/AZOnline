---
# Page Elements Validator

The validator ensures consistency across the entire page automation chain.

---

# Validation Rule

Rule                        | Purpose
----------------------------|-----------------------
pageMapToElements           | check element coverage
elementsToGeneratedAliases  | ensure alias generation
generatedToBusinessAliases  | verify alias mapping
businessAliasesToPageObject | check usage
pageObjectStructure         | validate page object
----------------------------|-----------------------

# Validation Rule
Validate:
    npm run validator:validate

Doctor:
    npm run validator:doctor

Repair:
    npm run validator:repair

# Validation Chain

```mermaid
flowchart TD

PageMap --> Elements
Elements --> GeneratedAliases
GeneratedAliases --> BusinessAliases
BusinessAliases --> PageObject
PageObject --> Registry