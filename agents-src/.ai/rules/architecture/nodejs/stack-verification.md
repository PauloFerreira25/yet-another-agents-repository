---
name: nodejs-stack-verification
Scope: Before writing code that depends on an HTTP framework, database, or message queue technology
description: Never assume which HTTP framework, database, or message queue technology a Node.js project uses — verify it from the project's own documentation, or ask.
---

Never assume or default to a specific HTTP framework, database, or message queue technology when writing or reviewing code in a Node.js project. This project's own rules are deliberately agnostic of all three — the choice belongs to each project, not to this rule set.

Before writing any code that depends on one of these three (a route registration, a query, a queue subscription), find documentation that states the choice for the specific package or service being worked on — its own README, architecture notes, an ADR, or an equivalent document. In a monorepo, never assume a choice documented for one package applies to another — each package may use a different framework, database, or queue technology; confirm the documentation actually covers the package in scope.

If no such documentation exists, ask the human which technology to use. Never pick one based on familiarity, popularity, or what appears most often in training data.

If the human states a choice verbally without pointing to documentation, use it for the current task, but tell them the choice is not documented anywhere yet and ask them to add it — a verbal answer in one conversation does not carry to the next session or the next agent that touches this project.

Never infer the choice from a partial or ambiguous signal (e.g. a single dependency in `package.json` that could serve multiple purposes) without confirming it explicitly matches the package's own documentation or the human's direct statement.
