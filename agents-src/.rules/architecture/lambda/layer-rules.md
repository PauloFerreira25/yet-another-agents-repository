---
name: layer-rules
Scope: Before implementing or reviewing any import between layers
description: Import rules per layer, inviolable constraints, and enforcement approach
---

# Layer Rules

## Import Table

| Layer | May import | Never imports |
|---|---|---|
| `schema` | nothing from this project | any other layer |
| `port/repository` | schema (same domain), AWS SDK (`TransactWriteItem`) | repository, service, lambda |
| `port/service` | schema (same domain), AWS SDK (`TransactWriteItem`) | repository, service, lambda |
| `infra-dynamo` | AWS SDK | schema, port, repository, service, lambda |
| `error` | nothing from this project | any other layer |
| `util` | error | schema, port, repository, service |
| `repository` | port/repository, schema, infra-dynamo, AWS SDK | service, lambda |
| `service (domain)` | port/repository, port/service, schema, error | repository, infra-dynamo, AWS SDK, lambda |
| `service (orchestrator)` | port/service (any domain), error, infra-dynamo (`Transact` only) | repository, AWS SDK, lambda |
| `lambdas/` | service/*, repository/*, infra-dynamo, util | inline business logic, factory instantiation inside handler |

## Inviolable Rules

Never allow a service to import a repository — only port types.

Never allow an orchestrator service to import a repository — only service ports from other domains.

Never instantiate factories inside the handler function — only at module level.

## Why Ports Import TransactWriteItem Directly from the AWS SDK

`TransactWriteItem` is used as-is without transformation. Re-exporting it via `infra-dynamo` creates indirection without abstraction. When an infrastructure type is not encapsulated, import it from its source directly.

See [infra-dynamo.md](infra-dynamo.md) for the full rule and for the intentional exception where orchestrator services import `Transact` from `infra-dynamo`.

## Enforcement

The rule "service never imports a repository from another domain" is enforced by convention and code review — not by tooling. Separate npm packages prevent ESLint from distinguishing whether an import from another package is a repository or a service, because the package path does not carry that semantic. Code review is the gate.
