---
# Automation Toolchain

The `tools` module contains automation engineering utilities used to generate and validate page automation code.

---

# Tools

| Tool | Purpose |
|----|----|
| page-scanner | scans application pages |
| page-elements-generator | generates page automation code |
| page-elements-validator | validates structure |
| file-header-checker | ensures consistent file headers |

---

# Automation Lifecycle

```mermaid
flowchart LR

UI --> Scanner
Scanner --> PageMap
PageMap --> Generator
Generator --> PageObjects
PageObjects --> Tests
Tests --> Reports
Validator --> PageObjects