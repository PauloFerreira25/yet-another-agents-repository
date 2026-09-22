---
name: vue-form-patterns
Scope: When creating a form
description: Schema first with zod, bound to vee-validate through Standard Schema, with no adapter package.
---

Every form starts from a schema. The schema is the single statement of what valid input is; the form binds to it and never restates a rule in its own markup.

```ts
const schema = z.object({
  name: z.string().min(1),
  email: z.email(),
})
```

Pass the schema straight to the form. vee-validate consumes it through Standard Schema, which zod implements natively.

**Never install an adapter package**, and never wrap the schema in a conversion helper. Those belong to the previous major of vee-validate. On the line this stack uses they are unnecessary, and reaching for one pins the project to a superseded major of zod.

## Why the form library is a pinned exception, and when it ends

This is a deliberate exception to [[common/dependency-version-matrix]], which otherwise requires a stable release.

The forcing reason: only the major of vee-validate that consumes Standard Schema works with the current major of zod without an adapter. The previous major reaches zod through a companion adapter package whose declared peer range stops at the older zod major — so using it would mean holding the whole project on a superseded schema library. That Standard Schema major has not yet reached stable.

**Always re-check the release status before pinning a version in any project.** If the Standard Schema major has reached stable, use it and this exception is over. Until it has, take the most recent pre-release of that line.

Never resolve the discomfort by dropping to the previous major. That reintroduces the adapter package and pins the project to the older zod, which is a worse position than the one the exception buys out of — an older major of two libraries instead of a pre-release of one.

Record the reason and this revisit condition in the project itself, per [[common/dependency-version-matrix]], so it is visible to whoever updates dependencies next.

Derive the form's value type from the schema. Never declare it separately, which creates two definitions that drift.

## Submission

Submission calls a mutation, which delegates to a service — see [[coding/vue/query-patterns]]. A form never calls the backend directly.

Disable submission while it is in flight, driven by the mutation's own pending state rather than by a hand-managed flag.

Never clear or navigate on submit; do it on success. A failed submission that has already cleared the form has destroyed the user's input.

## Errors

Field-level messages come from the schema. Never write a second copy of a validation message in the template.

A failure returned by the backend is surfaced through the form, not through a toast that leaves the user looking at an unchanged form with no indication of what to fix. See [[coding/vue/error-handling]].

Messages shown to the user are translated — see [[coding/vue/i18n]].
