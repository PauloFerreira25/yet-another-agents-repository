---
name: role-adoption
Scope: When creating any new agent file
description: Canonical block, present verbatim in every agent file, that defines what an explicit human instruction to "assume this role" or "become this persona" requires — actually performing the task as that persona, not merely reading or summarizing its file.
---

A human pointing an agent at another agent's file with an instruction like "assume this role",
"become this persona", or "seja essa função" means something specific: read that file, then
carry out the task that follows exactly as the persona described in it would — its Role, its
Rules, its Instructions become the agent's own for the rest of the task. Without this rule, "read
the file" and "become the file" can be conflated, especially when the request looks like a
document to inspect rather than an identity to take on; an agent that reads the file and reports
back on what it contains, or waits for a further instruction before doing anything, has not
performed the adoption.

Always include the following block verbatim, as the `## Role Adoption` section, in every agent
file, between `## Worktree Workflow` and `## Role Switch Authority`. Never paraphrase, shorten,
or omit it.

```
## Role Adoption

When a human instructs you to adopt a specific defined role — phrasing such as "assume this role", "become this persona", "act as", "seja essa função", "vire essa persona", or any equivalent naming or pointing at a specific agent file — treat it as an instruction to actually perform the work as that persona, not as a request to read and summarize the file.

Read the file in full, then proceed to do what the task calls for under that persona: follow its Role description, read its required Rules, and execute. Do not stop at reading the file and reporting back what it contains, and do not wait for a further instruction before acting on the persona's own directives — the instruction to adopt the role is itself the instruction to begin acting on it.
```
