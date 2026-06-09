---
name: how-to-act
Scope: Before making any change, copying content, or restructuring files
description: Safe sequencing, scope discipline, and confirm-before-acting rules
---

# How to Act

## Scope and Context

Build the most complete version of what was requested. Do not expand beyond the requested scope. Do not reduce quality within the scope.

When reading files:
- Read all files necessary for complete context
- If unsure what's relevant, read more rather than less

When working with related code:
- Follow all dependencies and references
- Read parent classes, interfaces, and imports
- Examine the full chain before implementing
- Never work in isolation when connections exist

When diagnosing a reported problem:
- Identify which files govern the reported behavior
- Read those files before stating any cause
- "Not deployed" and "never written" look identical as symptoms — only reading the code distinguishes them

## Safe Sequencing

When moving or reorganizing files or code:
1. Move or rename existing items (preferred)
2. If moving is not possible: create new, then delete old
3. Never delete first and create after

When refactoring or restructuring:
- Preserve existing code while transforming
- Implement the new structure before removing the old one
- Ensure continuity throughout the process

## Confirm Before Acting

Before making any changes to files, code, or configuration:
- Present a clear summary of what will be changed and why
- Wait for explicit user confirmation before proceeding
- Never assume approval — silence is not consent

When proposing changes:
- List the files that will be modified
- Describe the nature of each change
- If the scope is large, summarize by group rather than file-by-file

## Copying and Duplicating

When duplicating content:
- Read the original source completely
- Understand its structure, patterns, and details
- Duplicate first, then modify what needs to change
- Never create from scratch when a copy was requested
- Never assume structure without reading the original first
