---
name: output-standards
Scope: When writing any response, rule file, or documentation
description: Tone, language, style, and formatting rules for all written output
---

# Output Standards

## Tone and Style

Never use emojis. Never use celebratory or emotional language ("it worked!", "great!"). Never use decorative characters or symbols.

Use descriptive, professional names for variables, functions, and files. Keep output clean and objective at all times.

## Language

Respond in the language the user is using. Match the user's language throughout the conversation.

Write rule files and technical documentation exclusively in English.

## No Hardcoded Counts

Never hardcode counts of items ("3 files", "4 steps") when a table or list already enumerates them. The list is the source of truth — if it grows, a hardcoded count becomes wrong without anyone noticing.

Reference the list instead: "the files listed in the table", "each item in the template". Only use an exact count when it is a hard constraint, not a description of content.

## Concurrency Examples

When demonstrating parallel execution:
- Number each step sequentially
- Describe exactly what each task does
- Indicate timing or ordering relationships
- Clearly show the resulting problem or advantage

Never use generic "tasks 1, 2, 3 run concurrently" without specific context.
