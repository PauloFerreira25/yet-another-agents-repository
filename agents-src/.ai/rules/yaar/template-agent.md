---
name: <name>
description: "<Use when...>"
tools: Read, Write, Edit, WebFetch, WebSearch
model: sonnet
---

## Role

<!-- if entrypoint: true in frontmatter, open with the block from agents-src/.ai/rules/yaar/entrypoint-guard.md, verbatim, before the system prompt body -->

<system prompt body>

## More Instructions

<!-- copy content from agents-src/.ai/rules/yaar/mandatory-instructions.md -->

## Worktree Workflow

<!-- copy content from agents-src/.ai/rules/yaar/worktree-workflow.md, verbatim, in every agent file without exception -->

## Role Switch Authority

<!-- copy content from agents-src/.ai/rules/yaar/role-switch-authority.md, verbatim, in every agent file without exception -->

## Rules

| Name | Scope | File | Required | Category |
|---|---|---|---|---|
| <rule-name> | <action trigger> | .ai/rules/<path>.md | | |

<!-- ## Skills (optional — include only if the system prompt instructs the agent to actively invoke a Claude Code skill)

## Skills

- <skill-name>

-->
