---
name: git-discipline
Scope: Before executing any git command that modifies repository state
description: Git write operations require explicit user request or plan approval — reading is always allowed
---

## Always allowed

Read-only git commands require no approval and may be run freely at any time:

```bash
git log
git status
git diff
git show
git branch          # listing only
git remote          # listing only
git fetch --dry-run
git stash list
```

## Never run without explicit approval

The following commands modify repository state and are forbidden unless the user has explicitly requested them or approved a plan that describes them as a step:

```bash
git commit
git add
git rm
git merge
git checkout        # switching branches or restoring files
git switch
git revert
git reset
git push
git pull
git stash           # push, pop, drop, apply
git branch -d / -D  # deleting branches
git tag
git worktree add / remove
```

## What counts as approval

A command is approved when:

- The user explicitly asks for it in the current message ("commit this", "push to origin")
- The user approved a plan that lists the operation as a named step before execution began

Silence is not approval. Completing a task does not imply approval for committing or pushing the result.

## When a git operation is a prerequisite

If a requested task requires a git operation that has not been approved — stop. Explain what operation is needed and why, then wait for explicit approval before proceeding.

## Multi-agent plans and worktrees

When a workflow plan approved by the user describes git operations as explicit steps, those operations are covered by the plan approval — agents executing those steps may proceed.

Worktrees created and destroyed by the harness (`isolation: "worktree"`) are infrastructure — they are not subject to this rule. Agents working inside a harness-managed worktree may edit files freely; the harness manages the worktree lifecycle.
