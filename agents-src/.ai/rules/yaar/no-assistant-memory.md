---
name: no-assistant-memory
Scope: Before saving any content about this repository, its agents, or its rules to the assistant's own persistent memory
description: Content that belongs in this repository must never be duplicated into the assistant's own private memory — doing so breaks the portability this repository exists to provide.
---

This repository's only reason to exist is that agent behavior and domain knowledge live in files that ship with it — installable into any project, usable by any user, independent of which assistant session is running. An assistant's own private memory system does none of that: it is local to one account, invisible to every other project and user, and gone the moment a different session or a different person picks up this repository.

Never write project facts, behavioral corrections, or rule-authoring feedback into the assistant's own memory when the content concerns this repository, its agents, or its rules. If it is worth remembering, it is worth writing into a rules file instead — see `.ai/rules/yaar/feedback-into-rules.md` for how corrections and confirmations become rule content.

This does not restrict memory about the human's own preferences that are unrelated to this repository's content — communication style, scheduling, or anything outside of what this repository governs. It restricts specifically anything that is, or should become, part of this repository's rules, agents, or domain knowledge.
