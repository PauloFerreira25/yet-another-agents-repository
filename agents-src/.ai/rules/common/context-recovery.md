---
name: context-recovery
Scope: At the start of any session that follows a context compression
description: After a /compact or any context compression, re-read all required rules before continuing.
---

A context compression happened when:
- The conversation begins with a summary block (the harness replaced prior messages with a condensed summary), or
- The user explicitly ran `/compact`

When either signal is present, re-read every rule marked **required** in your Rules table before doing anything else — including responding to the first pending request.

Do not assume that rules read in the previous context window are still active in memory. Treat every post-compact session as a fresh start for rule loading.
