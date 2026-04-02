# Chart

Data visualization — bar, line, area, pie/donut charts.

## Library

Use `recharts` (lightweight, React-native). No other chart library.

## Color Palette (data series order)

1. `#33FFFF` (primary)
2. `#33BBFF` (secondary)
3. `#6B6BD6` (premium)
4. `#FF8133` (warning)
5. `#FF3333` (error)
6. `#29CFD1` (primary-80)

## Tokens

- **BG (chart area):** `bg-white-10` (`#192931`) or transparent
- **Grid lines:** `stroke-white-20` (`#334148`)
- **Axis text:** `text-xs text-white-60`
- **Tooltip BG:** `bg-white-10` (`#192931`) `border border-white-20`
- **Tooltip text:** `text-xs text-white-100`
- **Legend text:** `text-xs text-white-80`
- **Cursor line:** `stroke-white-40`

## Rules

- Always include axis labels and legend
- Tooltip on hover with formatted values
- Responsive: `<ResponsiveContainer width="100%" height={300}>`
- No 3D effects, no gradients on bars
- Animate on mount: `animationDuration={300}`
- Empty state: centered message "No data available"
