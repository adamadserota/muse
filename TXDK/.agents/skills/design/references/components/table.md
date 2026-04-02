# Data Table

Display structured data in rows and columns with sorting, pagination, and row selection.

## Guidelines

**When to use:** Display lists of structured records that users need to scan, sort, filter, or act upon (entity lists, search results, logs, investigation items).

**When NOT to use:** Not for key-value pairs — use a description list. Not for 1-3 items — use cards. Not for non-tabular content.

**Do:**
- Always include column headers
- Make columns sortable when the data type supports it
- Show row count and pagination for large datasets
- Provide a clear empty state

**Don't:**
- Don't exceed 8 visible columns — use a detail view for overflow
- Don't wrap long text in cells — truncate with tooltip
- Don't nest tables inside tables
- Don't use horizontal scroll as default — reduce columns first

## Anatomy

```
┌──────────────────────────────────────────────────────────────────┐
│ Toolbar (optional)          │ Search │ Filters │ Bulk actions    │
├────────┬────────┬───────────┬────────┬───────────────────────────┤
│ ☐      │ Name ▲ │ Type      │ Status │ Actions                  │  ← Header
├────────┼────────┼───────────┼────────┼───────────────────────────┤
│ ☐      │ Cell   │ Cell      │ Badge  │ Icon buttons             │  ← Row
├────────┼────────┼───────────┼────────┼───────────────────────────┤
│ ☐      │ Cell   │ Cell      │ Badge  │ Icon buttons             │  ← Row
├────────┴────────┴───────────┴────────┴───────────────────────────┤
│ Showing 1-10 of 42                        ◄ 1  2  3  4  5  ►    │  ← Footer
└──────────────────────────────────────────────────────────────────┘
```

## Variants

| Variant | Use case |
|---|---|
| Standard | Read-only data display |
| Selectable | Rows can be selected for bulk actions |
| Interactive | Rows are clickable — navigate to detail view |
| Compact | Denser layout for data-heavy views |

## States (Dark)

### Table Container
| Property | Value |
|---|---|
| BG | `#00111A` |
| Border | `1px solid #334148` |
| Border radius | 0 (sharp) |
| Shadow | none |

### Header Row
| Property | Value |
|---|---|
| BG | `#0D1D25` |
| Text | `#CCCFD1` (text-xs uppercase bold, font-family: Chakra Petch) |
| Border bottom | `1px solid #334148` |
| Padding | `8px 16px` |
| Sort icon (inactive) | `#667076` |
| Sort icon (active) | `#33FFFF` |

### Body Rows
| State | BG | Border bottom | Text |
|---|---|---|---|
| Default | `#00111A` | `1px solid #334148` | `#F5F5F5` |
| Hover | `#192931` | `1px solid #334148` | `#F5F5F5` |
| Selected | `#052931` | `1px solid #33FFFF` | `#F5F5F5` |
| Focused | `#00111A` | `2px solid #33FFFF` | `#F5F5F5` |
| Disabled | `#00111A` | `1px solid #334148` | `#667076` (opacity 0.5) |

### Striped Variant (optional)
| Row | BG |
|---|---|
| Even | `#00111A` |
| Odd | `#0D1D25` |

## States (Light)

### Header Row
| Property | Value |
|---|---|
| BG | `#F5F5F5` |
| Text | `#313F46` |
| Sort icon (active) | `#147076` |

### Body Rows
| State | BG | Text |
|---|---|---|
| Default | `#CCCFD1` | `#00111A` |
| Hover | `#A7F9F9` | `#00111A` |
| Selected | `#CEF7F7` | `#00111A` |

## Sizing

| Property | Default | Compact |
|---|---|---|
| Row height | 48px | 36px |
| Cell padding | `8px 16px` | `4px 8px` |
| Header padding | `8px 16px` | `4px 8px` |
| Font size (cells) | 14px (sm) | 12px (xs) |
| Font size (header) | 12px (xs) | 12px (xs) |
| Checkbox column width | 48px | 36px |
| Actions column width | content-driven | content-driven |
| Min column width | 80px | 60px |

## Sorting

- Click column header to sort ascending, click again for descending, third click to clear
- Sort indicator: `▲` ascending, `▼` descending (color `#33FFFF` when active)
- Only one column sorted at a time (unless explicitly multi-sort)
- Default sort: first sortable column, ascending

## Pagination (Footer)

| Property | Value |
|---|---|
| BG | `#0D1D25` |
| Text | `#CCCFD1` text-xs |
| Border top | `1px solid #334148` |
| Padding | `8px 16px` |
| Page button (default) | `bg-transparent text-white-60 border border-white-20` |
| Page button (active) | `bg-primary-20 text-primary-100 border border-primary-100` |
| Page button (hover) | `bg-white-10 text-white-100` |
| Nav arrows | icon-button ghost style |
| Info text | "Showing {start}-{end} of {total}" |
| Page sizes | `[10, 25, 50, 100]` — select component for page size |

## Row Selection

- Checkbox in first column (use checkbox component tokens)
- Header checkbox: select/deselect all on current page
- Indeterminate state when some rows selected
- Selection count shown in toolbar: "{n} selected"
- Bulk action buttons appear in toolbar when rows are selected

## Empty State

```
┌──────────────────────────────────────────────────┐
│ Header row (still visible)                       │
├──────────────────────────────────────────────────┤
│                                                  │
│          No results found                        │  ← text-sm text-white-60
│          Try adjusting your filters              │  ← text-xs text-white-40
│                                                  │
└──────────────────────────────────────────────────┘
```

## Loading State

- Use skeleton rows (see skeleton component) matching table row dimensions
- Show 5 skeleton rows by default
- Header row remains visible and non-skeleton

## Toolbar (optional)

| Property | Value |
|---|---|
| BG | `#0D1D25` |
| Padding | `8px 16px` |
| Border bottom | `1px solid #334148` |
| Gap | `8px` between items |
| Alignment | search left, filters center, actions right |

## Accessibility

- Use `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` — semantic HTML required
- `<th scope="col">` for column headers
- Sortable headers: `aria-sort="ascending"`, `"descending"`, or `"none"`
- Selectable rows: checkbox `aria-label="Select {row identifier}"`
- Header checkbox: `aria-label="Select all rows"`
- Interactive rows: `role="link"` or wrap content in `<a>`, keyboard Enter to navigate
- Pagination: `nav` with `aria-label="Table pagination"`
- Page buttons: `aria-current="page"` on active page
- Empty state: `aria-live="polite"` for dynamic updates
- Focus: Tab through interactive elements (checkboxes, sort headers, action buttons, pagination)
