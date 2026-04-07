# Logging

## Architecture

```mermaid
flowchart LR
    A[Log Creator] --> B[Log Collector / Orchestrator]
    B --> C1[Console Publisher]
    B --> C2[Logger Publisher]
    B --> C3[File Publisher]
```

### Layers

1. **Log Creator**  
   Produces logs from framework, technical, business, page action, pipeline, validation, artifact, API, or diagnostic areas.

2. **Log Collector / Orchestrator**  
   Collects logs, applies visibility rules, groups logs by scope, and decides what should be published.

3. **Log Publisher**  
   Sends logs to console, logger, or file output.

---

## Console controls

LOG_VERBOSE=true  
LOG_CATEGORIES=framework,business,technical  

or

LOG_CATEGORIES=all  

### Behavior

- INFO → always shown  
- DEBUG → shown only when `LOG_VERBOSE=true`  
- ERROR → always shown  
- Category-based filtering applies  

---

## File controls

LOG_WRITE_TO_FILE=true  
LOG_FILE_CATEGORIES=technical,api  
LOG_FILE_DIR=results/logs  
LOG_RUN_ID=my_run_id  

### Behavior

- Logs are written as JSON lines  
- File logging is category-based  
- Supports parallel execution safely  
- Each run generates its own folder using `runId`  
- Each process writes using `pid`  

---

## Example Output Structure

```text
results/logs/
  20260325_182934_12345/
    technical/
      technical_pid12345.log
    api/
      api_pid12345.log
```

---

## Notes

- Console and file logging are independent  
- You can:
  - show fewer logs in console  
  - store detailed logs in files  
- Designed for:
  - execution layer  
  - data builder  
  - tools (scanner, generator, validator, repair)
  - API integrations  

---

## Future Extensions

- Central log orchestrator
- Action-level logging (page actions, API calls)
- Structured reporting / analytics
- Per-app logging policies

---

## Architecture (Detailed)

```mermaid
flowchart TD

    subgraph Creators["Log Creators"]
        A1[Framework Logs]
        A2[Technical Logs]
        A3[Business Logs]
        A4[Page Actions]
        A5[API Logs]
        A6[Validation / Pipeline]
    end

    subgraph Orchestrator["Log Collector / Orchestrator"]
        B1[Normalize Event]
        B2[Attach Scope<br/>scenario / step / tool]
        B3[Apply Category Filter]
        B4[Apply Level Filter<br/>INFO / DEBUG / ERROR]
        B5[Apply Verbose Flag]
        B6[Route to Publishers]
    end

    subgraph Publishers["Log Publishers"]
        C1[Console Publisher]
        C2[Logger Publisher]
        C3[File Publisher]
    end

    subgraph Config["Config / Controls"]
        D1[LOG_CATEGORIES]
        D2[LOG_VERBOSE]
        D3[LOG_WRITE_TO_FILE]
        D4[LOG_FILE_CATEGORIES]
    end

    subgraph Output["Outputs"]
        E1[Terminal Logs]
        E2[Structured Logs]
        E3[Log Files]
    end

    A1 --> B1
    A2 --> B1
    A3 --> B1
    A4 --> B1
    A5 --> B1
    A6 --> B1

    B1 --> B2
    B2 --> B3
    B3 --> B4
    B4 --> B5
    B5 --> B6

    D1 --> B3
    D2 --> B5
    D3 --> B6
    D4 --> B6

    B6 --> C1
    B6 --> C2
    B6 --> C3

    C1 --> E1
    C2 --> E2
    C3 --> E3
```

---
