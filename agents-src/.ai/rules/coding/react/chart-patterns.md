---
name: chart-patterns
Scope: When creating charts or data visualizations
description: Recharts via shadcn/ui chart components; never import Recharts directly
---

Use the shadcn/ui chart layer built on Recharts. Never import from `recharts` directly — always use the shadcn wrappers.

```bash
npm install recharts
npx shadcn@latest add chart
```

This adds `src/component/ui/chart.tsx` with `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, and `ChartLegendContent`.

## Usage pattern

Define chart config outside the component — it maps data keys to labels and colors:

```ts
import { type ChartConfig } from '@/component/ui/chart'

const chartConfig = {
  receita: { label: 'Receita', color: 'hsl(var(--chart-1))' },
  despesa: { label: 'Despesa', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig
```

Wrap the chart in `ChartContainer`, passing the config:

```tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/component/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

<ChartContainer config={chartConfig} className="h-64 w-full">
  <BarChart data={data}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="mes" />
    <YAxis />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="receita" fill="var(--color-receita)" radius={4} />
    <Bar dataKey="despesa" fill="var(--color-despesa)" radius={4} />
  </BarChart>
</ChartContainer>
```

## Colors

Always use CSS variables from the chart config (`var(--color-<key>)`) for fill and stroke. Never use hardcoded hex or Tailwind color classes inside chart elements — this ensures dark mode and theme consistency.

## Data shape

Chart data comes from the service layer via `useQuery`. Never transform data inside the chart component — do it in a `useMemo` before passing to the chart:

```ts
const { data: vendas } = useQuery({ queryKey: ['vendas'], queryFn: vendasService.getAll })

const chartData = useMemo(
  () => vendas?.map(v => ({ mes: v.mes, receita: v.receita, despesa: v.despesa })) ?? [],
  [vendas]
)
```

## Component location

Chart components are organisms — place domain-specific charts under `src/component/organism/<domain>/`:

```
src/component/organism/venda/receitaMensalChart.tsx
src/component/organism/produto/estoquePorCategoriaChart.tsx
```
