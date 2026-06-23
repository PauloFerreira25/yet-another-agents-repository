---
name: toast
Scope: When displaying feedback for user actions or showing temporary notifications
description: Sonner for transient action feedback; useErrorStore for persistent page-level business errors
---

Use `sonner` for transient feedback. It is the official toast component for shadcn/ui.

```bash
npm install sonner
```

Add `<Toaster />` once inside the root layout component:

```tsx
// src/component/layout/appLayout.tsx
import { Toaster } from 'sonner'

export function AppLayout() {
  return (
    <>
      <Header />
      <main><Outlet /></main>
      <Toaster position="bottom-right" richColors />
    </>
  )
}
```

## Usage

Call `toast` directly — no hook, no context. All strings must go through `t()` from `react-i18next`:

```ts
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()

toast.success(t('page.produto.saveSuccess'))
toast.error(t('page.produto.deleteError'))
toast.info(t('page.produto.syncInProgress'))
```

For async actions, use `toast.promise` to show loading → success/error automatically:

```ts
toast.promise(produtoService.delete(id), {
  loading: t('page.produto.deleting'),
  success: t('page.produto.deleteSuccess'),
  error: t('page.produto.deleteError'),
})
```

## Toast vs useErrorStore

Use the right tool for the right context:

| Situation | Use |
|---|---|
| Feedback imediato de uma ação do usuário (salvar, excluir, copiar) | `toast` |
| Erro de negócio persistente visível na página (campo inválido, regra violada) | `useErrorStore` |
| Erro de 422 mapeado para campo de formulário | `useFormError` |
| Sessão expirada | `UnauthenticatedError` → error boundary |

Never push action feedback to `useErrorStore` — it is for business errors that need to remain visible until the user resolves them. Toast messages are ephemeral and dismiss automatically.
