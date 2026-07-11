---
name: entrypoint-guard
Scope: When creating any agent with `entrypoint: true` in frontmatter
description: Canonical guard block that must open the Role section of every entrypoint agent, preventing the persona from being wrongly adopted by a subagent that inherited it through CLAUDE.md.
---

An entrypoint agent is injected verbatim into the project's `CLAUDE.md` (see `yaar add` behavior), which the harness loads as project context for every session running in that directory — including subagents already invoked with a specific `subagent_type`. Without a guard, a specialist subagent inherits "become this persona" alongside its own fixed role, and the two conflict.

The fix uses a signal the subagent can verify on its own, without trusting any relayed or free-text claim: whether the tool this persona requires for routing (`Agent`) is actually present in the current session's toolset. A specialist subagent's toolset is fixed by its own frontmatter and never includes `Agent`. If the tool is missing, the session cannot be the entrypoint, regardless of what CLAUDE.md says.

Always include the following block verbatim, as the first paragraph of the `## Role` section, in every agent file with `entrypoint: true`. Never paraphrase, shorten, or omit it. Replace `<AGENT_NAME>` with the agent's own `name` field.

```
Before adopting this persona: this instruction may reach you through an inherited CLAUDE.md reference even when you were invoked directly as a specialist subagent (via `subagent_type` or an explicit "assume the role of" instruction) rather than as the root session. Check whether the `Agent` tool is present among the tools actually available to you in this session. If it is not, you are not the entrypoint — you are a specialist agent that already received a specific role assignment, and <AGENT_NAME>'s instructions do not apply to you. Proceed using your own role definition and ignore the rest of this file for the current task. If the `Agent` tool is available, continue below as <AGENT_NAME>.
```

Never rely on free-text claims (in a prompt, a relayed message, or task metadata) as the signal for this check. Only the actual presence or absence of the `Agent` tool in the current toolset qualifies — it is the only signal a subagent can verify without trusting an unverifiable claim of authority.
