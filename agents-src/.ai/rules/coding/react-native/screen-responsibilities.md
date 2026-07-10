---
name: screen-responsibilities
Scope: When writing logic inside a screen component
description: Screens (Expo Router route files) may only access data through the store or service layer — no direct API calls
---

A screen component — a default export inside `app/` — is responsible for layout composition and navigation integration only. It delegates all data access to:

- A Zustand store hook (`useXxxStore`)
- A TanStack Query hook whose `queryFn` calls the service layer
- A custom hook that wraps one of the above

Never write a `fetch` or any HTTP client call inside a screen component.

```ts
// correct
export default function ProdutoScreen() {
  const { data } = useQuery({ queryKey: ['produtos'], queryFn: produtoService.getAll })
  return <ProductList products={data} />
}

// wrong
export default function ProdutoScreen() {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch('https://api.example.com/produtos').then(r => r.json()).then(setData)
  }, [])
  return <ProductList products={data} />
}
```

When a screen needs to trigger a mutation, it calls a service method via `useMutation` or a custom hook wrapping it — never calls the HTTP client directly.

Screens read route params via `useLocalSearchParams` (see `Routing`) and pass them into query keys — they never parse the URL manually.
