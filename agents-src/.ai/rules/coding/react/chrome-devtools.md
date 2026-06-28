---
name: chrome-devtools
Scope: Before using any chrome-devtools MCP tool
description: Restricts all chrome-devtools MCP tool usage to explicit human requests only.
---

Never invoke any chrome-devtools MCP tool unless the human has explicitly requested it in the current message.

Do not use chrome-devtools tools proactively — not to verify UI changes, not to check for console errors, not to take screenshots as part of your own workflow.

When the human requests chrome-devtools usage, use only the tools necessary to fulfill the specific request. Do not expand scope beyond what was asked.
