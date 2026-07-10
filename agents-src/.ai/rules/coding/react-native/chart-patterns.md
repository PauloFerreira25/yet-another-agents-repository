---
name: react-native-chart-patterns
Scope: When creating charts or data visualizations
description: Victory Native (Skia-rendered) for charts; never attempt to run a DOM/SVG charting library on React Native
---

Use `victory-native` (the Skia-rendered version, not the legacy SVG one) for all charts. Recharts and other DOM/SVG-based charting libraries do not run on React Native — never attempt to import them.

```bash
npx expo install victory-native @shopify/react-native-skia
```

`@shopify/react-native-skia` is a required peer — Victory Native renders through it rather than through SVG.

## Usage pattern

```tsx
import { CartesianChart, Bar } from 'victory-native'

<CartesianChart data={chartData} xKey="mes" yKeys={['receita', 'despesa']}>
  {({ points }) => (
    <>
      <Bar points={points.receita} chartBounds={{}} color="#4f46e5" />
      <Bar points={points.despesa} chartBounds={{}} color="#f97316" />
    </>
  )}
</CartesianChart>
```

## Colors

Reference the same semantic color tokens the app already defines for NativeWind/gluestack-ui theming (see `NativeWind / gluestack-ui`) rather than hardcoding hex values inline, so charts stay consistent with dark mode — Victory Native does not read Tailwind config automatically, so resolve the token to a value in JS before passing it as a `color` prop.

## Data shape

Chart data comes from the service layer via `useQuery`, identical to the web stack. Transform data in a `useMemo` before passing it to the chart — never inside the chart's render:

```ts
const { data: vendas } = useQuery({ queryKey: ['vendas'], queryFn: vendasService.getAll })

const chartData = useMemo(
  () => vendas?.map(v => ({ mes: v.mes, receita: v.receita, despesa: v.despesa })) ?? [],
  [vendas]
)
```

## Component location

Chart components are organisms — place domain-specific charts under `src/component/organism/<domain>/`, same convention as the web stack:

```
src/component/organism/venda/receitaMensalChart.tsx
```

## Performance

Skia-rendered charts are GPU-accelerated and handle re-renders far better than SVG, but still avoid re-rendering a chart on every parent re-render with unrelated state — the `useMemo` on chart data is what prevents that, not the rendering engine itself.
