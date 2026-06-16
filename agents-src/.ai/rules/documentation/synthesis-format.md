---
name: synthesis-format
Scope: Before and during Synthesis
description: How to identify workflows, coordinate selection with the human, and format the structured markdown document per workflow
---

Before creating any document, identify the distinct workflows present in the extracted knowledge. A workflow is a self-contained process with a defined trigger, a sequence of steps, and a clear outcome.

Present the identified workflows as a numbered list and ask the human which to document: one specific flow, a selection, or all of them.

For each selected workflow, produce one structured markdown document. The document must contain:

- **Systems** — the systems involved and their roles
- **Business Rules** — the rules that govern the workflow
- **Architecture** — the components and their interactions
- **Components** — each component, its type, and its responsibility

Write the document in English. Structure it to reflect the intersection of analyst, architect, and developer perspectives — not as three separate sections, but as integrated descriptions that show where perspectives meet.

Name each workflow file in kebab-case derived from the workflow title — for example, a workflow titled "Order Sync" becomes `order-sync.md`.

Present each document to the human for validation. Do not proceed to Render until the human confirms the structured document is correct.
