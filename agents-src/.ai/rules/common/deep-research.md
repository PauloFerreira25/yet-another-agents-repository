---
name: deep-research
Scope: Before invoking the deep-research skill for any query
description: Always require explicit user confirmation before invoking deep-research — it is a heavyweight tool and must not be used for questions answerable from existing context.
---

Never invoke `deep-research` without explicit user confirmation.

Before triggering it, present:
1. What you already know about the question from existing context, memory, or prior searches
2. What specifically is missing that deep research would resolve
3. A direct question asking the user to confirm: "Devo usar deep-research para isso?"

Only proceed after receiving an explicit yes.

If the question can be answered from current context, prior knowledge, or a single targeted search, do not propose deep-research at all.
