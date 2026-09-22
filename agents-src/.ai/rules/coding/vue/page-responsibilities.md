---
name: vue-page-responsibilities
Scope: When writing logic inside a page component
description: A page composes and routes; it does not fetch, transform or decide.
---

A page in `app/pages/` reads route parameters, calls queries and mutations, and composes organisms and molecules. That is its entire job.

**Never call the backend from a page.** A page calls a query, which delegates to a service — see [[coding/vue/query-patterns]]. Under server-side rendering a page may instead use the framework's own fetching composable for render-critical data, which delegates to a service in exactly the same way; which of the two applies is decided by [[architecture/frontend/vue/nuxt/data-fetching-ownership]]. What is never permitted is the page building a request itself.

**Never put business rules in a page.** Validation lives in the form schema, mapping lives in the service, derivation lives in a `computed` or a store getter. A rule written in a page is invisible to every other screen that needs it and is duplicated the first time one does.

**Never build markup of any complexity in a page.** When a section of a page acquires its own structure, extract it into an organism — see [[architecture/frontend/vue/component-structure]].

A page that has grown past roughly a screen of script is signalling that something inside it belongs elsewhere. Extract before continuing rather than after.

Page-level metadata — access requirements, layout, title — is declared through page meta, not computed in setup. See [[architecture/frontend/vue/routing]].
