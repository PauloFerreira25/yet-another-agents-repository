---
name: react-native-form-patterns
Scope: When creating a form
description: Same schema-first Zod + React Hook Form convention as the web stack; rendered with gluestack-ui form primitives instead of shadcn
---

The validation approach is unchanged from the web stack — follow `.ai/rules/coding/react/form-patterns.md` for the core convention: define the Zod schema first, connect it via `@hookform/resolvers/zod`, never write manual validation logic in the component.

```ts
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const produtoSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  preco: z.number().positive('Preço deve ser positivo'),
})

type ProdutoFormData = z.infer<typeof produtoSchema>

const form = useForm<ProdutoFormData>({ resolver: zodResolver(produtoSchema) })
```

## Rendering with gluestack-ui

Use `FormControl`, `FormControlLabel`, `FormControlLabelText`, `FormControlError`, and `FormControlErrorText` from `@/component/ui/form-control`, wired to React Hook Form's `Controller` — gluestack-ui inputs are controlled components without a native `<input>` DOM element, so they cannot be spread with `register()` the way an HTML input can:

```tsx
import { Controller } from 'react-hook-form'
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '@/component/ui/form-control'
import { Input, InputField } from '@/component/ui/input'

<Controller
  control={form.control}
  name="nome"
  render={({ field, fieldState }) => (
    <FormControl isInvalid={!!fieldState.error}>
      <FormControlLabel><FormControlLabelText>Nome</FormControlLabelText></FormControlLabel>
      <Input>
        <InputField value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} />
      </Input>
      {fieldState.error && (
        <FormControlError><FormControlErrorText>{fieldState.error.message}</FormControlErrorText></FormControlError>
      )}
    </FormControl>
  )}
/>
```

Never use `register()` with a gluestack-ui `Input` — it expects a ref-forwarding native text input; always use `Controller`.

## Submission

Identical to the web stack:

```ts
const onSubmit = form.handleSubmit(async (data) => {
  await produtoService.create(data)
})
```

## API validation errors (422)

`useFormError` is unchanged from the web stack — see `.ai/rules/coding/react/form-patterns.md` for the full hook implementation; it has no DOM dependency and ports as-is.
