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

When using shadcn/ui, build each field with the `Field` primitives — `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup` from `@/component/ui/field` (install with `npx shadcn@latest add field`) — wrapping the control in a React Hook Form `Controller`. This is the current shadcn/ui pattern for the Base UI style; it replaces the older `Form`/`FormField`/`FormItem`/`FormMessage` API from the retired Radix-based style, which the shadcn registry no longer ships.

```tsx
import { Controller } from 'react-hook-form'
import { Field, FieldLabel, FieldError } from '@/component/ui/field'
import { Input } from '@/component/ui/input'

<Controller
  name="nome"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

Each field in the form gets its own `Controller` — never bind `Field` directly to `register()`. Use `FieldGroup` to wrap multiple fields when spacing between them needs to stay consistent, and `FieldDescription` for helper text that is not a validation error.

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
