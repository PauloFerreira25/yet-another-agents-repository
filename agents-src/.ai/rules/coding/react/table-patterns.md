---
name: table-patterns
Scope: When creating a data table with sorting, filtering, pagination, or row selection
description: TanStack Table for table logic; shadcn/ui Table for rendering; simple display-only tables use shadcn Table directly
---

Use `@tanstack/react-table` for tables that require sorting, filtering, pagination, or row selection. For display-only tables with no interactivity, use the shadcn/ui `Table` component directly without TanStack Table.

```bash
npm install @tanstack/react-table
```

## Column definition

Define columns with `createColumnHelper` typed to the domain entity from `src/type/`:

```ts
import { createColumnHelper } from '@tanstack/react-table'
import type { Produto } from '@/type/produto/produto.type'

const col = createColumnHelper<Produto>()

const columns = [
  col.accessor('nome', { header: 'Nome', enableSorting: true }),
  col.accessor('preco', { header: 'Preço', enableSorting: true }),
  col.display({ id: 'actions', cell: ({ row }) => <RowActions produto={row.original} /> }),
]
```

## Table instance

```ts
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel } from '@tanstack/react-table'

const table = useReactTable({
  data: produtos,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})
```

## Rendering with shadcn/ui

TanStack Table handles logic only — always render with shadcn/ui `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`:

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/component/ui/table'
import { flexRender } from '@tanstack/react-table'

<Table>
  <TableHeader>
    {table.getHeaderGroups().map(hg => (
      <TableRow key={hg.id}>
        {hg.headers.map(header => (
          <TableHead key={header.id}>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        ))}
      </TableRow>
    ))}
  </TableHeader>
  <TableBody>
    {table.getRowModel().rows.map(row => (
      <TableRow key={row.id}>
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## Server-side pagination and sorting

The pagination strategy follows the backend contract. Choose the pattern that matches what the API provides.

### Page-based (pageIndex + pageSize)

Backend returns one page at a time. TanStack Table manages pagination with the total page count from the response:

```ts
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })
const [sorting, setSorting] = useState<SortingState>([])

const { data } = useQuery({
  queryKey: ['produto', pagination, sorting],
  queryFn: () => produtoService.getPage({ page: pagination.pageIndex, pageSize: pagination.pageSize, sorting }),
  staleTime: staleTime.short,
})

const table = useReactTable({
  data: data?.items ?? [],
  columns,
  pageCount: data?.totalPages ?? -1,
  state: { pagination, sorting },
  onPaginationChange: setPagination,
  onSortingChange: setSorting,
  manualPagination: true,
  manualSorting: true,
  getCoreRowModel: getCoreRowModel(),
})
```

### Cursor-based (fetch-all + in-memory)

When the backend paginates by cursor, the service fetches all pages by looping through cursors until exhausted. The full dataset is loaded into memory and TanStack Table handles all pagination, sorting, and filtering client-side:

```ts
// service loops through all cursor pages and returns a flat array
// src/service/produto/produto.service.ts
getAll: async (): Promise<Produto[]> => {
  const result: Produto[] = []
  let cursor: string | null = null
  do {
    const page = await mainClient.get<{ data: ProdutoApiResponse[]; nextCursor: string | null }>(
      `/produtos${cursor ? `?cursor=${cursor}` : ''}`
    )
    result.push(...page.data.map(toProduto))
    cursor = page.nextCursor
  } while (cursor)
  return result
},
```

```ts
// page receives the full flat array — useQuery, not useInfiniteQuery
const { data: produtos = [] } = useQuery({
  queryKey: ['produto'],
  queryFn: produtoService.getAll,
  staleTime: staleTime.medium,
})

const table = useReactTable({
  data: produtos,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})
```

No manual pagination state needed — TanStack Table controls everything in memory.
