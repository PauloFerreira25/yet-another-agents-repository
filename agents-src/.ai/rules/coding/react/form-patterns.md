---
name: form-patterns
Scope: When creating a form
description: Schema-first with Zod, connected to React Hook Form via resolver — no manual validation
---

Always define the Zod schema before writing the form component. The schema is the source of truth for validation.

```ts
import { z } from 'zod'

const produtoSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  preco: z.number().positive('Preço deve ser positivo'),
})

type ProdutoFormData = z.infer<typeof produtoSchema>
```

Connect the schema to React Hook Form via `@hookform/resolvers/zod`:

```ts
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const form = useForm<ProdutoFormData>({
  resolver: zodResolver(produtoSchema),
})
```

Never write manual validation logic inside the form component. Never use `onChange` handlers to validate fields. All validation lives in the Zod schema.

When submitting, pass the service call inside `handleSubmit`:

```ts
const onSubmit = form.handleSubmit(async (data) => {
  await produtoService.create(data)
})
```

When using shadcn/ui, use `<Form>`, `<FormField>`, `<FormItem>`, and `<FormMessage>` from `@/component/ui/form` — these components integrate with React Hook Form context automatically.

## API validation errors (422)

When a mutation returns a `ValidationError`, use `useFormError` to map the API field errors to the form automatically:

```ts
// src/hook/error/useFormError.ts
import { useEffect } from 'react'
import { type FieldValues, type Path, type UseFormReturn } from 'react-hook-form'
import { ValidationError } from '@/service/api/main.httpClient'

export function useFormError<T extends FieldValues>(form: UseFormReturn<T>, error: Error | null) {
  useEffect(() => {
    if (!error || !(error instanceof ValidationError)) return
    const body = error.body as { fields?: Record<string, string> } | null
    if (body?.fields) {
      Object.entries(body.fields).forEach(([field, message]) => {
        form.setError(field as Path<T>, { type: 'server', message })
      })
    }
  }, [error, form])
}
```

Usage in a form component:

```ts
const mutation = useMutation({ mutationFn: produtoService.create })
const form = useForm<ProdutoFormData>({ resolver: zodResolver(produtoSchema) })

useFormError(form, mutation.error)

const onSubmit = form.handleSubmit((data) => mutation.mutate(data))
```

The hook expects the API to return a body with a `fields` key mapping field names to error messages. Field names in the API response must match the Zod schema field names for `setError` to target the correct input.
