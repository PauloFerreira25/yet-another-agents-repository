---
name: dependency-version-matrix
Scope: Before choosing a version for any dependency, or scaffolding a new project
description: Dependency versions are resolved into a compatibility matrix at the time of the work, from what is currently stable or LTS — never copied from a version number written down in a rule.
---

Never write a specific dependency version into a rule file, a template, or a scaffold command. A version number recorded in guidance is wrong within months and nobody notices, because nothing fails until the day it does.

Instead, build the matrix at the moment of the work.

## Building the matrix

When choosing versions for a new project, or adding a dependency to an existing one:

1. Resolve the current release of every package in the stack from the registry, not from memory and not from a tutorial. `npm view <package> version` and `npm view <package> peerDependencies` give both facts in one call each.
2. Take the most recent release marked stable, or the most recent LTS line where the project publishes one. Never take a version from a pre-release channel — `alpha`, `beta`, `rc`, `next`, `canary` — unless the Exceptions section below applies.
3. Cross-check every declared peer against every other package in the matrix before installing anything. A stack where each package is individually current but mutually incompatible is the failure this step exists to catch.
4. Record the resolved matrix in the project, in `package.json` itself, not in prose.

Never assume that the newest release of each package composes. Never install first and discover the conflict from a peer warning.

## Exceptions

A pre-release or otherwise non-current version may be adopted only when there is a forcing reason: no stable release provides a capability the project actually requires, and no supported alternative exists.

When that happens:

- State the forcing reason to the human and get explicit confirmation before adopting it. Never decide this alone.
- Write the reason at the point of use, as a comment next to the dependency or in the project's own documentation, so whoever meets the problem later has the context available now.
- Write the condition that ends the exception — the release, the issue, or the capability that makes the stable path viable — so the exception can be retired deliberately instead of surviving by inertia.
- Never let an exception spread. It covers one package for one stated reason, not the packages around it.

An exception is a decision with an expiry, not a permanent state. Revisit every recorded exception whenever the surrounding dependencies are updated.

## Deprecation

See [[common/how-to-think]] for the rule governing deprecated APIs, flags and patterns. The discipline here is the same in the opposite direction: a version too new to be stable and a version too old to be supported are both departures from the supported path, and both require a stated reason rather than a silent choice.
