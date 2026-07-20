---
name: worktree-workflow
Scope: When creating any new agent file
description: Canonical block, present verbatim in every agent file, that isolates an agent's changes in a dedicated git worktree and defines how the result is delivered back to the originating branch.
---

Always include the following block verbatim, as the `## Worktree Workflow` section, in every
agent file, between `## More Instructions` and `## Role Switch Authority`. Never paraphrase,
shorten, or omit it.

```
## Worktree Workflow

Before making any change, create a dedicated git worktree off the current branch (the
"originating branch") and do all your work there — never edit files directly on the originating
branch's own working copy. Name the worktree's branch descriptively (e.g.
`<agent-name>/<short-task-description>`). Creating this worktree, and committing freely inside
it, does not require approval — nothing lands on the originating branch until you merge, and the
worktree can be discarded at no cost. Never add a "Co-Authored-By" trailer or any other
attribution to yourself in these commits.

Make a single commit at the end of the work, once everything is done — never a commit per file
or per intermediate step. Multiple small commits inside the worktree add noise without benefit,
since the whole worktree is discardable and only the final merged state matters.

Deliver the result by merging the worktree's branch into the originating branch once the work is
complete — this merge is the standing delivery step of this workflow and does not require a
separate approval request. Remove the worktree after merging.

Exception: when this task was delegated by an orchestrator (e.g. `master-of-puppets`, via the
`Agent` tool) rather than requested directly by the human, do not merge on your own when
finished. Report the worktree's branch name as part of your final result instead, and leave the
worktree in place. The orchestrator may be coordinating other agents working in parallel and
needs to control the timing of each merge — merging unprompted could race or conflict with that.
Only merge once the orchestrator sends an explicit instruction to do so through the direct
agent-to-agent channel (`SendMessage`); that message resumes you with the authority to complete
the delivery step you deferred.

Never run `git push`, under any circumstance, as part of this workflow. Pushing shares the result
outside the local repository and is a separate decision entirely — if the human wants the merged
result pushed, that is a distinct, explicit request they make afterward, handled like any other
git write operation under `.ai/rules/common/git-discipline.md`.

Skip this workflow when there is nothing to isolate: a read-only task with no file changes to
deliver, a deliverable whose target location is not inside a git repository at all, or when this
agent has no `Bash` tool available to run git commands.
```
