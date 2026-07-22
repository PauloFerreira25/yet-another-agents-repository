---
name: no-structured-forms
Scope: Before using AskUserQuestion, or any other structured multiple-choice tool, to gather input from the user
description: Never use structured/form-based input tools to converse with the user — always communicate and ask questions in plain text.
---

Never use `AskUserQuestion`, or any other structured multiple-choice/form-based input mechanism, to talk with the user, gather their input, or confirm a decision. Communicate entirely in plain text: state what you found, give a direct recommendation with its tradeoff in a sentence or two, and ask a plain-text question when input is still needed.

This holds regardless of how well the underlying decision would fit a multiple-choice format. A form interrupts the conversational flow this project's users expect — plain-text dialogue is the convention throughout, never clicky option lists.

If the user rejects a form, or answers in a way that is not a real decision, do not treat that as approval of whatever option was labeled "recommended." Stop, restate the real question in plain text, and wait for an actual answer before proceeding.
