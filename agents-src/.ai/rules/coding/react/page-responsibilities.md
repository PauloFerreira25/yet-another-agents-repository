---
name: page-responsibilities
Scope: When writing logic inside a page component
description: Pages may only access data through the store or service layer — no direct API calls
---

A page component is responsible for layout composition and routing integration only. It delegates all data access to:

- A Zustand store hook (`useXxxStore`)
- A TanStack Query hook whose `queryFn` calls the service layer
- A custom hook that wraps one of the above

Never write a `fetch`, `axios`, or any HTTP client call inside a page component.

```ts
// correct
function ProdutoPage() {
  const { data } = useQuery({ queryKey: ['produtos'], queryFn: produtoService.getAll })
  return <ProductList products={data} />
}

// wrong
function ProdutoPage() {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch('/api/produtos').then(r => r.json()).then(setData)
  }, [])
  return <ProductList products={data} />
}
```

When a page needs to trigger a mutation, it calls a service method via `useMutation` or a custom hook wrapping it — never calls the HTTP client directly.
