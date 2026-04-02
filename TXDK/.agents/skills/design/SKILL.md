---
name: design
description: >
  Dark futuristic design system — colors, typography, spacing, shadows,
  and 28 UI components. Use when building or styling any UI element:
  components, pages, layouts, CSS, Tailwind classes, JSX/TSX styling,
  or when the user describes something visual. Design tokens always
  override infrastructure decisions for appearance.
---

# Design System

Dark futuristic theme. Font: Chakra Petch. Sharp edges (radius: 0). Primary: cyan. Tailwind CSS only.

## Quick Tokens

| Token | Value |
|---|---|
| Font | `Chakra Petch` |
| BG | `#00111A` |
| Text | `#F5F5F5` |
| Primary | `#33FFFF` |
| Secondary | `#33BBFF` |
| Error | `#FF3333` |
| Warning | `#FF8133` |
| Premium | `#6B6BD6` |
| Border | `#334148` |
| Radius | `0` (sharp) |
| Grid | 12-col, 8px base |
| Max width | 1440px |

## Workflow

1. Read `references/styles.md` for exact color/typography/spacing/shadow values
2. Read `references/components/<name>.md` for the specific component you're building
3. Implement using only documented tokens
4. Verify — no arbitrary values, colors, or fonts

## Critical Rules

- **Toast for action feedback** — every CRUD action (create, update, delete) must show a toast notification (success or error)
- **Only tokens from `references/styles.md`** — no arbitrary colors, sizes, or fonts
- **Chakra Petch** — the only font
- **Border radius: 0** everywhere (exception: radio `rounded-3xl`)
- **Beveled notch** on buttons/badges: 12x12px 45deg diagonal cut on right edge
- **Dark theme default** — BG `#00111A`, text `#F5F5F5`
- **Glow effects** on hover (cyan shadow for primary actions)
- **Corner brackets** on text/icon button hover (L-shaped 8x8 borders)
- **Focus states** with `border-2` for accessibility
- Do not invent components — only use what exists in `references/components/`

## Component Map

Read the matching file from `references/components/` when building:

| Need | File |
|---|---|
| Colors, fonts, spacing, shadows | `references/styles.md` |
| Buttons (filled/outlined/text/split) | `references/components/button.md` |
| Icon buttons | `references/components/icon-button.md` |
| Text inputs | `references/components/input.md` |
| Dropdowns/selects | `references/components/select.md` |
| Checkboxes | `references/components/checkbox.md` |
| Radio buttons | `references/components/radio.md` |
| Toggles | `references/components/switch.md` |
| Multi-line text | `references/components/textarea.md` |
| Tab navigation | `references/components/tabs.md` |
| Badges/tags/chips | `references/components/badge.md` |
| Breadcrumbs | `references/components/breadcrumb.md` |
| Tooltips | `references/components/tooltip.md` |
| Scrollbars | `references/components/scrollbar.md` |
| Sidebar/nav | `references/components/navigation.md` |
| Cards | `references/components/card.md` |
| Banners/alerts | `references/components/banner.md` |
| Progress bars | `references/components/progress.md` |
| Date picker | `references/components/datepicker.md` |
| File upload | `references/components/dropzone.md` |
| Modals/dialogs/sheets | `references/components/modal.md` |
| Avatars | `references/components/avatar.md` |
| Carousels | `references/components/carousel.md` |
| Sliders/ranges | `references/components/slider.md` |
| Button groups | `references/components/button-group.md` |
| Skeleton loaders | `references/components/skeleton.md` |
| Data tables | `references/components/table.md` |
| Toast / notifications | `references/components/toast.md` |
| Charts | `references/components/chart.md` |
