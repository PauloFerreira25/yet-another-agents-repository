---
name: html-output
Scope: Before and during Render
description: Output format requirements and source constraints for the Render stage
---

Work exclusively from the validated structured markdown document produced in Synthesis. Never re-read raw sources or the memory file during Render.

The document output is always a single self-contained HTML file.

Include all CSS inline — no external stylesheets. Typography should be clean and readable without visual clutter.

Never produce Markdown, plain text, or multi-file output. The HTML file must render completely in a browser without additional assets.

## Diagram libraries

Always include the following three CDN resources in the `<head>`:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@panzoom/panzoom/dist/panzoom.min.js"></script>
```

Initialize Mermaid with neutral theme:

```html
<script>mermaid.initialize({ startOnLoad: true, theme: 'neutral' });</script>
```

Apply panzoom to every diagram container after Mermaid renders. Remove the `max-width` constraint Mermaid injects into the SVG before applying panzoom:

```javascript
setTimeout(function() {
  const wrap = document.getElementById('diagram-id');
  const svg = wrap && wrap.querySelector('svg');
  if (svg) svg.style.maxWidth = 'none';
  if (wrap) {
    const pz = Panzoom(wrap, { maxScale: 4, minScale: 0.3, contain: false });
    wrap.closest('.diagram-container').addEventListener('wheel', function(e) {
      e.preventDefault();
      pz.zoomWithWheel(e);
    });
  }
}, 1500);
```

## Diagram types

Choose the diagram type based on the flow's characteristics — never force all flows into the same format.

Use a **sequence diagram** when the flow is linear with multiple named participants exchanging messages. Avoid `alt/else` blocks with more than two branches — they become unreadable regardless of library.

Use a **flowchart** when the flow has conditional logic. Conditionals become natural decision nodes (`{}`). Prefer top-to-bottom (`TD`) for process detail, left-to-right (`LR`) for architecture overviews.

When a flow has both linear messaging and complex conditionals, split into two diagrams: one sequence for the message flow, one flowchart for the conditional logic.

## Font Awesome icons in diagrams

Always use Font Awesome icons in diagram nodes. Icons provide visual differentiation that shape alone cannot. Use the `fa:fa-iconname` prefix inside node labels:

```
A("fa:fa-bolt Lambda Processor")
B(["fa:fa-cloud ExternalAPI"])
```

Do not use FA icons inside hexagon nodes (`{{"text"}}`) — the double-brace syntax conflicts with the parser. Use rounded rectangle `("text")` or stadium `(["text"])` instead.

Suggested icons by component type:

- Lambda / function: `fa:fa-bolt`
- Scheduled trigger: `fa:fa-clock`
- Fan-out / branch: `fa:fa-code-branch`
- Queue: `fa:fa-envelope` (trigger) · `fa:fa-inbox` (processing)
- External API: `fa:fa-cloud`
- External system / server: `fa:fa-server`
- Database: `fa:fa-database`
- Error / retry: `fa:fa-rotate-left`
- Success / done: `fa:fa-check`

## Recommended document sections

These sections are a starting model. Each workflow has its own characteristics — use judgment to decide which sections apply, how to present the content within them, and whether additional sections are needed.

**Context** — why this document exists. What problem or need the system, integration, or process addresses. Establishes the reader's frame before any detail.

**Flow** — the main sequence or process. The visual representation of how things move from trigger to outcome. Prefer a diagram when the sequence has more than two participants.

**Intersection Points** — where business rules meet architectural decisions meet implementation behavior. This is the core section of the format: document what each perspective contributes and where they converge, not each perspective in isolation.

**Contracts** — the touch points between systems. The APIs, messages, events, or data structures that cross system boundaries.

**Components** — the building blocks. What exists, what type each component is, and what it is responsible for.
