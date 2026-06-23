---
name: accessibility
Scope: When creating interactive components, forms, modals, or page layouts
description: Semantic HTML first; ARIA only for custom widgets; shadcn handles most patterns automatically
---

## Semantic HTML first

Use native elements whenever they exist. Never use `<div>` or `<span>` with click handlers when a semantic element fits:

```tsx
// correct
<button onClick={handle}>Salvar</button>
<a href="/produtos">Ver produtos</a>
<nav>, <main>, <header>, <footer>, <section>, <article>

// wrong
<div onClick={handle}>Salvar</div>
<span onClick={navigate}>Ver produtos</span>
```

ARIA does not add behavior — only semantics. If you add `role="button"` to a `<div>`, you still must implement keyboard handling (`onKeyDown` for Enter/Space). Use `<button>` instead.

## ARIA: when to use

Use ARIA only for custom widgets that have no semantic HTML equivalent. shadcn/ui components (Dialog, Select, Form, Tabs) already implement the correct ARIA patterns — do not add ARIA attributes on top of them.

Use `aria-label` only when there is no visible text to reference:

```tsx
// icon-only button — no visible text
<button aria-label="Fechar menu"><XIcon /></button>

// button with visible text — no aria-label needed
<button><XIcon /> Fechar</button>

// visible heading labels a dialog — use aria-labelledby, not aria-label
<dialog aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirmar exclusão</h2>
</dialog>
```

## Forms

Always associate labels with inputs. shadcn `<FormField>` + `<FormLabel>` + `<FormMessage>` handle this automatically — use them for all forms.

When writing custom inputs outside shadcn, use `htmlFor`/`id` and `aria-describedby` for error messages:

```tsx
<label htmlFor="nome">Nome</label>
<input id="nome" aria-describedby="nome-error" />
<div id="nome-error" role="alert">{error}</div>
```

Never use `placeholder` as a label — it disappears on input and fails contrast requirements.

## Focus management in SPAs

Route changes do not reset focus automatically in SPAs. On navigation, move focus to `<main>` so keyboard and screen-reader users know the page changed:

```tsx
// src/component/layout/appLayout.tsx
const mainRef = useRef<HTMLElement>(null)
const location = useLocation()

useEffect(() => {
  mainRef.current?.focus()
}, [location.pathname])

return (
  <>
    <Header />
    <main ref={mainRef} tabIndex={-1} className="outline-none">
      <Outlet />
    </main>
  </>
)
```

`tabIndex={-1}` allows programmatic focus without adding the element to the tab order.

## Images

Every `<img>` must have an `alt` attribute. Decorative images get `alt=""`:

```tsx
// meaningful image — describe content and intent
<img src="grafico.png" alt="Receita Q1 2026 por região: Norte 45%, Sul 30%, Oeste 25%" />

// decorative — empty alt, never omit it
<img src="divider.png" alt="" />

// icon SVG used decoratively inside a labeled button
<button aria-label="Excluir item">
  <TrashIcon aria-hidden="true" />
</button>
```

Always add `aria-hidden="true"` to decorative SVGs inside labeled interactive elements.

## Testing

`jsx-a11y` in ESLint catches static issues. For runtime verification:

- Keyboard only: Tab through every interactive element, verify focus order and visible focus ring
- Screen reader: test critical flows with VoiceOver (macOS) or NVDA (Windows)
- Zoom to 200%: verify layout does not break
