# DatePicker

Calendar-based date selection — single date or range.

## Structure

Input trigger → dropdown calendar grid. Header with month/year nav. 7-column day grid.

## Tokens

- **Input:** same as `input.md` — `bg-white-5 border border-white-20 text-white-100`
- **Dropdown BG:** `bg-neutral-100` (`#00111A`)
- **Dropdown shadow:** `shadow-[0_8px_20px_0_rgba(0,0,0,0.4)]`
- **Header text:** `text-sm font-bold text-white-100`
- **Day cell (default):** `text-sm text-white-80` `p-2`
- **Day cell (hover):** `bg-white-20` (`#334148`)
- **Day cell (selected):** `bg-primary-100 text-neutral-100` (`#33FFFF` bg, `#00111A` text)
- **Day cell (range):** `bg-primary-20` (`#0A4148`)
- **Day cell (today):** `border border-primary-100`
- **Day cell (disabled):** `text-white-20 cursor-not-allowed`
- **Weekday headers:** `text-xs font-bold uppercase text-white-40`
- **Nav arrows:** icon button style, `text-white-60` hover `text-white-100`

## States

- **Closed:** input with calendar icon
- **Open:** dropdown with calendar grid
- **Range mode:** start/end highlighted, in-between days use range BG
- **Focus:** `border-primary-100` on input

## Rules

- Close on outside click or Escape
- Arrow keys navigate days, Enter selects
- Format display: `DD/MM/YYYY` or `YYYY-MM-DD` (configurable)
- Month/year navigation via arrows in header
