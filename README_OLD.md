## 📚 Documentation

This framework includes detailed architecture and workflow documentation.

- 🏗 **Architecture Overview**  
  [View Architecture](docs/architecture.md)

- ⚙️ **Automation Toolchain**  
  [View Toolchain](docs/toolchain.md)

- ▶️ **Test Execution Flow**  
  [View Execution Flow](docs/execution-flow.md)
  

```mermaid
flowchart LR

A["Scan CLI"] --> B["Runner"]
B --> C["Browser Session"]
C --> D["DOM Extraction"]
D --> E["Metadata Resolution"]
E --> F["Smart Key Generation"]
F --> G["Classification"]
G --> H["Selector Pipeline"]
H --> I["Merge / Write"]
I --> J["page-map.json"]
```