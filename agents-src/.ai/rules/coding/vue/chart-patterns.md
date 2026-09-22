---
name: vue-chart-patterns
Scope: When creating charts or data visualizations
description: Charts use vue-chartjs over Chart.js, receive prepared data, and read their colors from the theme.
---

Use `vue-chartjs`, the Vue wrapper over Chart.js. Never introduce a second charting library, and never hand-build a chart in SVG that an existing chart type covers.

Chart.js is modular: register only the controllers, elements and plugins a chart actually uses. Never register everything to avoid deciding — it defeats tree-shaking and inflates the bundle for every user.

## Data

A chart component receives data already shaped for display. Aggregation, grouping, bucketing by period and unit conversion happen before the chart — in the service where the backend cannot do it, or in a `computed` where it derives from data already loaded.

Never transform data inside the chart component. A chart that aggregates is doing the work of a layer that can be tested without rendering.

Never fetch inside a chart component. It receives data from its parent, which got it from a query.

## Presentation

Chart colors come from the theme, not from literals — see [[coding/vue/theming]]. A chart with hard-coded colors is unreadable the moment the theme switches to dark.

Never encode meaning in color alone. Distinguish series by an additional channel — shape, dash pattern, direct labelling — so the chart survives being read by someone who cannot distinguish the hues.

Every axis that is not self-evident is labelled, with its unit. Never leave a reader to infer whether a number is a count, a currency or a percentage.

All chart text is translated, including axis labels, legend entries and tooltips — see [[coding/vue/i18n]].

Give the chart a text alternative conveying its conclusion, so it is not lost to a reader using a screen reader — see [[coding/vue/accessibility]].

## Choosing the chart

Match the form to the question: trend over time is a line, comparison across categories is a bar, part-to-whole is a stacked bar rather than a pie beyond a couple of slices. Never choose a form for visual interest over legibility.

Never start a bar chart's value axis anywhere but zero. Truncating it exaggerates differences and misrepresents the data.
