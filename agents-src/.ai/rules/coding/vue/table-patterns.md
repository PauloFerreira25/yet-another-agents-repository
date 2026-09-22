---
name: vue-table-patterns
Scope: When creating a data table with sorting, filtering, pagination, or row selection
description: Use the UI library's data table, and choose between server-driven and in-memory operation from the backend contract.
---

Use the UI library's own data table. Never assemble a table from raw markup, and never add a second table library — see [[coding/vue/ui-library-extension]].

## Choosing the mode

The decision follows the backend contract and the size of the data, not convenience:

**Server-driven.** The table reports the page, sort and filters it wants, and the service passes them to the backend. Use this whenever the full set is large enough that fetching it would be wasteful, or when the backend is the only thing that can order or filter correctly.

**In-memory.** The service fetches the full set once and the table sorts, filters and paginates locally. Use this only for sets that are bounded and small — reference data, administrative lists with a known ceiling.

State which mode a table uses where it is defined. A table that looks in-memory but silently refetches, or the reverse, is a recurring source of confusion.

Never fetch the full set to operate in memory without first establishing that it is bounded. "It is small today" is not a bound.

## Structure

Columns are declared as data, not as markup repeated per column.

Column headers and empty-state text are translated — see [[coding/vue/i18n]].

The table receives data from a query and never fetches for itself — see [[coding/vue/query-patterns]].

Give every row a stable identity from the domain, never the array index, so selection and sorting survive a refetch.

## Actions

A row action calls a mutation, which invalidates the table's query on completion. Never mutate the displayed rows locally to reflect a write.

Destructive row actions confirm before executing, and the confirmation names what is being acted on.
