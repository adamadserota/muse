# Card

Cards group related content and actions into a contained surface.

## Guidelines

**When to use:** Display a summary of content that links to a detail view, or group related information (stats, profiles, items).

**When NOT to use:** Not for full-page layouts. Not for wrapping a single action — use a button. Not for navigation — use nav items.

**Do:**
- Keep content concise — card is a preview, not the full content
- Use consistent card sizes within a grid
- Include a clear primary action when interactive

**Don't:**
- Don't nest cards inside cards
- Don't put more than 2 actions in a card footer
- Don't use cards for simple list items — use a list component

## Anatomy

```
┌──────────────────────────┐
│ Header (optional)        │  ← title, subtitle, avatar, badge
├──────────────────────────┤
│ Body                     │  ← main content, text, image
├──────────────────────────┤
│ Footer (optional)        │  ← actions, metadata, links
└──────────────────────────┘
```

## Variants

| Variant | Use case |
|---|---|
| Standard | Static content display |
| Interactive | Clickable — navigates to detail view |
| Selected | Active/chosen state in a selection context |

## States (Dark)

| State | BG | Border | Shadow |
|---|---|---|---|
| Default | `#00111A` | `#334148` | `0 0 20px 6px rgba(0,0,0,0.4)` |
| Hover | `#00111A` | `#F5F5F5` | `0 0 20px 6px rgba(0,0,0,0.4)` |
| Selected | `#052931` | `#33FFFF` | `0 0 20px 6px rgba(0,0,0,0.4)` |
| Focused | `#00111A` | `#33FFFF` (border-2) | — |
| Disabled | `#00111A` | `#334148` | — (opacity 0.5) |

## States (Light)

| State | BG | Border |
|---|---|---|
| Default | `#F5F5F5` | `#00111A` |
| Hover | `#A7F9F9` | `#00111A` |
| Selected | `#CEF7F7` | `#147076` |

## Sizing

| Property | Value |
|---|---|
| Default padding | 16px |
| Compact padding | 8px |
| Border radius | 0 (sharp) |
| Border width | 1px (2px on focus) |
| Min height | none — content-driven |
| Gap between cards | 16px (grid) or 8px (compact list) |

## Accessibility

- **Interactive cards:** `role="article"` or wrap content in `<a>`/`<button>`
- **Keyboard:** Tab to focus, Enter to activate (interactive variant)
- **Focus indicator:** border-2 `#33FFFF`
- **Card groups:** wrap in a list (`<ul>` + `<li>`) for screen reader context
