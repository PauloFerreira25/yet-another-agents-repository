---
name: vue-error-handling
Scope: When handling errors from a query, a mutation, or unexpected runtime errors in a page
description: Every failure reaches a surface the user can act on; nothing is swallowed and no raw error text is shown.
---

Every failure has a visible destination. Never catch an error and continue as if nothing happened, and never leave a failed query rendering an empty state indistinguishable from "no data".

## Queries

A query exposes its error state; render it. The three states — pending, error, loaded — are distinct, and the error state says that loading failed and offers a retry.

Never render an empty list for a failed fetch. The user reads it as "there is nothing here" and stops looking.

## Mutations

A failed write surfaces where the user was working. A failed form submission shows its error on the form, with the input preserved — see [[coding/vue/form-patterns]]. A failed row action surfaces near the table, not on a screen the user has already left.

Never navigate away or clear input on a failure.

## Unexpected errors

An error boundary at the layout level catches what escapes, so a failure in one section does not blank the application. Below it, sections that can fail independently get their own boundary rather than taking the whole page down.

## What the user sees

Never show a raw error object, a stack trace or a status code. Translate the failure into something actionable: what failed, and what the user can do.

Never invent detail the application does not have. "Could not load products" is honest; a guess at the cause is not.

Log the technical detail for diagnosis — see [[coding/vue/logger]] — and keep it out of the interface.

Normalization into the application's own error type happens in the service layer, so callers handle one shape — see [[architecture/frontend/vue/service-layer]] and [[coding-principles/error-handling]].
