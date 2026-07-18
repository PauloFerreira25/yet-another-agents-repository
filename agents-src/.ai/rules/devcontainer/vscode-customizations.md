---
name: vscode-customizations
Scope: When configuring VS Code extensions or settings for a devcontainer
description: Baseline extension set, stack-specific additions, and required file explorer/watcher exclusions.
---

Every devcontainer's `customizations.vscode.extensions` includes this baseline, regardless of
stack:

```json
[
  "Anthropic.claude-code",
  "ms-azuretools.vscode-docker",
  "mhutchie.git-graph",
  "donjayamanne.githistory"
]
```

Add stack-specific extensions on top of the baseline, based on which specialist agents are
active in the project — e.g. `vscjava.vscode-java-pack` and `vmware.vscode-boot-dev-pack` for a
Spring Boot backend. Never remove the baseline to make room for stack-specific ones.

`.data-volumes/` (see `Service Structure`) must always be excluded from the file explorer and
file watcher — it holds caches and generated state, not project source, and indexing it wastes
resources and clutters the explorer:

```json
{
  "files.exclude": { "**/.data-volumes": true },
  "files.watcherExclude": { "**/.data-volumes/**": true }
}
```

Also exclude any stack-specific build/metadata output the same way when it lives under a
bind-mounted source directory (e.g. Java's `**/.metadata/**`, `**/archetype-resources/**` for a
Maven/Gradle workspace).
