## 📚 Documentation

This repository includes detailed documentation explaining the architecture, toolchain, and workflows used in the automation framework.

### Architecture

- 🏗 **Architecture Overview**  
  High-level design of the automation framework.  
  [View Architecture](docs/architecture.md)

### Toolchain

- ⚙️ **Automation Toolchain**  
  Overview of the four core tools used in the framework.  
  [View Toolchain](docs/toolchain.md)

### Workflows

- ▶️ **Test Execution Flow**  
  How automated tests run using the framework.  
  [View Execution Flow](docs/execution-flow.md)

### Framework Guidelines

- 📖 **Tooling Guidelines (Dos & Don'ts)**  
  Best practices and rules when working with the internal automation tools.  
  [View Guidelines](src/tools/README_GUIDELINES.md)

### Tool Documentation

Detailed documentation for each internal tool.

- 🔎 **Page Scanner**  
  Extracts page structure and generates page maps.  
  [View Scanner Docs](src/tools/page-scanner/README.md)

- 🧩 **Page Object Generator**  
  Generates page-object artifacts from page maps.  
  [View Generator Docs](src/tools/page-object-generator/README.md)

- ✅ **Page Object Validator**  
  Validates structural consistency of the framework.  
  [View Validator Docs](src/tools/page-object-validator/README.md)

- 🛠 **Page Object Repair**  
  Repairs framework inconsistencies when detected.  
  [View Repair Docs](src/tools/page-object-repair/README.md)