---
name: feedback-into-rules
Scope: When the user gives feedback about how an agent should behave or how work should be done
description: Feedback from the user must become a change to a rules file in this repository, not an entry in the assistant's own private memory.
---

This repository exists so that behavioral guidance is portable — shipped in rules files that travel with the repository across every project and every user, not trapped in one assistant's private, per-project memory that nobody else can read or reuse.

When the user gives feedback — a correction ("don't do X"), a confirmation that an approach worked, or any other guidance about how an agent should behave — capture it as a change to the relevant rules file, or a new rules file, under `agents-src/.ai/rules/`. Do not store it in the assistant's own memory system instead.

Only `agent-author` (`agents-src/agents/yaar/agent-author.md`) may create or edit files under `.ai/rules/` — see the Rule Authority section of `.ai/rules/common/how-to-act.md`. If the current agent is not `agent-author`, do not write the rule directly. Report the feedback to the human as a candidate rule — a tentative name, the scope trigger, and the directive it would encode — so it can be handed to `agent-author` to write.

Never rely on private memory to preserve this kind of guidance for a future session. If it is not written into a rules file, it does not exist for any other agent, project, or user relying on this repository.
