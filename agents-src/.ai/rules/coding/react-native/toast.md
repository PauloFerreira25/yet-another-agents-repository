---
name: react-native-toast
Scope: When displaying feedback for user actions or showing temporary notifications
description: gluestack-ui Toast for transient action feedback; useErrorStore for persistent screen-level business errors
---

Use gluestack-ui's `useToast` for transient feedback — it is the design system already in use, so no separate toast library (no Sonner equivalent) is installed.

```tsx
import { useToast, Toast, ToastTitle } from '@/component/ui/toast'

const toast = useToast()

toast.show({
  placement: 'bottom',
  render: ({ id }) => (
    <Toast nativeID={`toast-${id}`} action="success" variant="solid">
      <ToastTitle>{t('page.produto.saveSuccess')}</ToastTitle>
    </Toast>
  ),
})
```

All strings must go through `t()` from `react-i18next`, exactly like the web stack.

## Async actions

There is no `toast.promise` equivalent in gluestack-ui — show the loading state explicitly, then call `toast.show` in the mutation's `onSuccess`/`onError`:

```ts
const mutation = useMutation({
  mutationFn: () => produtoService.delete(id),
  onSuccess: () => toast.show({ render: () => <SuccessToast message={t('page.produto.deleteSuccess')} /> }),
  onError: () => toast.show({ render: () => <ErrorToast message={t('page.produto.deleteError')} /> }),
})
```

## Toast vs useErrorStore

Same division of responsibility as the web stack:

| Situation | Use |
|---|---|
| Feedback imediato de uma ação do usuário (salvar, excluir, copiar) | `toast` |
| Erro de negócio persistente visível na tela (campo inválido, regra violada) | `useErrorStore` |
| Erro de 422 mapeado para campo de formulário | `useFormError` |
| Sessão expirada | redirect via `useQueryError` (see `Error Handling`) |

Never push action feedback to `useErrorStore` — toasts are ephemeral and dismiss automatically; `useErrorStore` is for errors that must remain visible until the user resolves them.
