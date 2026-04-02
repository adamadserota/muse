# Breadcrumb

Hierarchical navigation path showing current location.

## Structure

`Home / Section / Current Page`

Separator: `/` or chevron icon in `text-white-40`.

## Tokens

- **Text (link):** `text-sm font-bold` `rgba(51,255,255,0.8)` — Tailwind: `text-primary-80`
- **Text (current):** `text-sm font-bold text-white-100` — non-clickable
- **Hover:** full opacity `text-primary-100`
- **Gap:** `gap-2` (8px)
- **Separator:** `text-white-40`

## States

- **Default:** cyan text at 80% opacity
- **Hover:** full cyan opacity + underline
- **Active/current:** white, no link behavior
- **Focus:** `outline-2 outline-primary-100 outline-offset-2`

## Rules

- Max depth: 3-4 levels. Collapse middle with `...` if deeper.
- Last item is always non-interactive (current page).
- Truncate long labels with `truncate max-w-[200px]`.
