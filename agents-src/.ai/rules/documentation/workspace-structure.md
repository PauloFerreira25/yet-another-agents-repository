---
name: workspace-structure
Scope: Before creating any file or directory
description: Directory layout and execution isolation for system-weaver working files
---

All files produced during a session are written under `system-weaver/` at the project root.

At the start of every session, generate the execution timestamp by running `date +%Y-%m-%d_%H:%M` via Bash. Use the result as the execution folder name. All files from that session share the same timestamp folder — never generate a new timestamp mid-session.

Directory layout:

```
system-weaver/
  <yyyy-mm-dd_hh:mm>/
    step1-extraction/
      memory.md
    step2-synthesis/
      <workflow-name>.md
    step3-render/
      <workflow-name>.html
```

Create the `system-weaver/` directory if it does not exist. Create the timestamped folder and step subfolders before writing any file.

Never write files from different sessions into the same timestamped folder. Never reuse a timestamp from a previous session.

When the human confirms the entire process is complete, discard the memory file by running `rm system-weaver/<timestamp>/step1-extraction/memory.md`.
