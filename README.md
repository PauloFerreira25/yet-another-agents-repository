# YAAR — Yet Another Agents Repository

A repository of specialized Claude Code subagents, installable across projects via the `@pauloferreira25/yaar` CLI.

## How it works

Each agent is a Markdown file with a YAML frontmatter block, a system prompt, and a Rules table. When installed, the agent lives in `.claude/agents/` and Claude Code loads it automatically as a subagent.

Rules are separate Markdown files referenced in the agent's Rules table. The agent reads them on demand using the `Read` tool — only when the task scope matches. This keeps token usage minimal while keeping the agent's knowledge precise.

```
agents-src/agents/<category>/<name>.md   ← agent file
agents-src/.ia/.rules/<category>/<name>.md   ← rule file (read on demand)
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
| <rule-name> | <action trigger>                   | .ia/rules/<category>/<name>.md   |
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
| `YAAR_SOURCE` | `PauloFerreira25/yet-another-agents-repository` | Default GitHub source (`owner/repo`) used when `--source` is not specified |
| `YAAR_REF` | `main` | Default branch or tag used when `--ref` is not specified |

## Multiple sources

Each agent tracks its own source repository and ref. You can install agents from different repositories in the same project using `--source` and `--ref`:

```bash
yaar add core/master-of-puppets
yaar add backend/custom-agent --source my-org/agents --ref main

# List agents from a specific repository
yaar list remote --source my-org/agents --ref main
```

`yaar list local` shows the source for each installed agent:

```
Installed agents:
  - core/master-of-puppets (PauloFerreira25/yet-another-agents-repository@main)
  - backend/custom-agent (my-org/agents@main)
```

`yaar update` re-downloads each agent from the source it was originally installed from, so mixed-source projects stay consistent.

Projects created with an older version of YAAR (where `source` and `ref` were stored at the top of `.yaar.json`) are migrated automatically on the next command — no manual changes required.

## Repository structure

```
agents-src/
  agents/
    <category>/
      <name>.md          ← agent file: frontmatter + system prompt + Rules table
    yaar/
      ...                ← internal agents (excluded from yaar list remote)
  .ia/rules/
    <category>/
      <name>.md          ← rule file: frontmatter + directives, read on demand
cli/
  src/                   ← TypeScript source for @pauloferreira25/yaar
  tests/                 ← Vitest test suite
```

The `yaar/` category is intentionally excluded from `yaar list remote` — those agents are tools for authoring this repository, not for general use.

## Master of Puppets

Master of Puppets is the orchestrator agent. It routes tasks to the right specialist instead of executing them directly.

```bash
yaar add core/master-of-puppets
```

When installed, it automatically adds itself to `CLAUDE.md`:

```
@.claude/agents/core/master-of-puppets.md
```

This makes it the default behavior for the project. When you give Claude Code a task, the master reads `.yaar.json` to discover what agents are installed, reads the frontmatter of each one to understand their scope, matches the task to the right agent, and delegates.

It never executes the task itself. If no installed agent matches, it tells you what is available.

When removed with `yaar remove core/master-of-puppets`, the reference is also removed from `CLAUDE.md`.

### Entrypoint agents

Master of Puppets uses `entrypoint: true` in its frontmatter to signal this behavior to the CLI. Any agent with this field will be injected into `CLAUDE.md` on install and removed on uninstall.

## What gets installed in your project

```
your-project/
  .yaar.json             ← tracks installed agents and their files
  .claude/
    agents/
      <category>/
        <name>.md
  .ia/rules/
    <category>/
      <name>.md
```

Rules are shared across agents. If two agents reference the same rule file, it is downloaded once and reused.

## Contributing

To add a new agent:

1. Create `agents-src/agents/<category>/<name>.md` with the frontmatter, system prompt, and Rules table
2. Add any new rule files to `agents-src/.ia/.rules/<path>.md`
3. Rule files must start with a frontmatter block: `name`, `Scope`, and `description`

The `yaar/agent-author` agent knows the full format and can help write both agents and rules files.
