# YAAR — Yet Another Agents Repository

A repository of specialized Claude Code subagents, installable across projects via the `@pauloferreira25/yaar` CLI.

## How it works

Each agent is a Markdown file with a YAML frontmatter block, a system prompt, and a Rules table. When installed, the agent lives in `.claude/agents/` and Claude Code loads it automatically as a subagent.

Rules are separate Markdown files referenced in the agent's Rules table. The agent reads them on demand using the `Read` tool — only when the task scope matches. This keeps token usage minimal while keeping the agent's knowledge precise.

```
agents-src/agents/<category>/<name>.md   ← agent file
agents-src/.rules/<category>/<name>.md   ← rule file (read on demand)
```

### Agent file format

```markdown
---
name: <name>
description: "Use when <trigger context>."
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
---

System prompt body.

## Rules

| Name        | Scope                              | File                          |
|-------------|------------------------------------|-------------------------------|
| <rule-name> | <action trigger>                   | .rules/<category>/<name>.md   |
```

The `description` field is what Claude Code uses to decide when to invoke the agent — write it as a trigger sentence starting with `"Use when..."`.

## CLI

### With npx (no install required)

```bash
npx @pauloferreira25/yaar list remote
npx @pauloferreira25/yaar add <category/agent>
```

### Global install

```bash
npm install -g @pauloferreira25/yaar
```

### Commands

```bash
# Install an agent into the current project
yaar add <category/agent>

# Update all installed agents (or a specific one)
yaar update
yaar update <category/agent>

# Remove an agent
yaar remove <category/agent>

# List available agents in the repository
yaar list remote

# List agents installed in the current project
yaar list local
```

Installing an agent also downloads all rules files referenced in its Rules table. Everything is tracked in `.yaar.json` at the project root.

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `YAAR_SOURCE` | `PauloFerreira25/yet-another-agents-repository` | GitHub source (`owner/repo`) |
| `YAAR_REF` | `main` | Branch or tag to install from |

## Repository structure

```
agents-src/
  agents/
    <category>/
      <name>.md          ← agent file: frontmatter + system prompt + Rules table
    yaar/
      ...                ← internal agents (excluded from yaar list remote)
  .rules/
    <category>/
      <name>.md          ← rule file: frontmatter + directives, read on demand
cli/
  src/                   ← TypeScript source for @pauloferreira25/yaar
  tests/                 ← Vitest test suite
```

The `yaar/` category is intentionally excluded from `yaar list remote` — those agents are tools for authoring this repository, not for general use.

## What gets installed in your project

```
your-project/
  .yaar.json             ← tracks installed agents and their files
  .claude/
    agents/
      <category>/
        <name>.md
  .rules/
    <category>/
      <name>.md
```

Rules are shared across agents. If two agents reference the same rule file, it is downloaded once and reused.

## Contributing

To add a new agent:

1. Create `agents-src/agents/<category>/<name>.md` with the frontmatter, system prompt, and Rules table
2. Add any new rule files to `agents-src/.rules/<path>.md`
3. Rule files must start with a frontmatter block: `name`, `Scope`, and `description`

The `yaar/agent-author` agent knows the full format and can help write both agents and rules files.
