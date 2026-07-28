---
name: nodejs-dependency-updates
Scope: Before updating existing dependency versions in package.json
description: Use npm-check-updates (ncu) to discover available upgrades instead of researching packages one by one online
---

Never research package versions one by one on the web (npm page, GitHub releases, changelogs) to decide what to bump. Run `ncu` first and base the upgrade analysis on its output — it is faster and gives a complete picture in one pass.

```bash
npx npm-check-updates
```

This lists every outdated dependency with its current, wanted, and latest version, without modifying any file.

Use the listing to drive the analysis:
- Group results by the size of the version jump (patch, minor, major) — patch and minor bumps within the same major version are safe to batch and apply without individual research.
- For any package where the jump crosses a major version, check that package's changelog or release notes for breaking changes before applying it — `ncu` tells you an update exists, not whether it is safe to take.
- Skip a listed update only for a stated reason (e.g. a pinned peer dependency constraint, a known incompatibility) — never leave a package outdated silently.

Once the set of packages to update is decided:

```bash
npx npm-check-updates -u [package...]   # rewrites package.json
npm install                             # installs the new versions and updates the lockfile
```

Omit `[package...]` to rewrite every listed dependency, or name specific packages to update a subset.
