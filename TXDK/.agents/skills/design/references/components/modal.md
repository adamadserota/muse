# Modal / Dialog / Sheet

Overlays that require user attention or input before continuing.

## Guidelines

**When to use:**
- **Modal:** Complex forms, multi-step flows, content that needs full focus
- **Dialog:** Confirmations, alerts, simple yes/no decisions
- **Sheet:** Side panels, detail views, filters, settings

**When NOT to use:** Not for non-blocking notifications (use banners/toasts). Not for simple selections (use dropdowns).

**Do:**
- One primary action button per modal (filled), secondary actions as outlined/text
- Close on Escape key press
- Include a visible close button (X) in the header

**Don't:**
- Don't stack modals — if a modal needs another modal, redesign the flow
- Don't use modals for content that should be a page
- Don't auto-close modals without user action (except success confirmations)

## Anatomy

```
┌─ Scrim (full viewport) ──────────────┐
│                                        │
│   ┌─ Container ───────────────────┐   │
│   │ Header: Title + Close button  │   │
│   ├───────────────────────────────┤   │
│   │ Body: Content / Form          │   │
│   ├───────────────────────────────┤   │
│   │ Footer: Action buttons        │   │
│   └───────────────────────────────┘   │
│                                        │
└────────────────────────────────────────┘
```

## Variants

### Modal
Full overlay for complex tasks requiring focus.

| Property | Value |
|---|---|
| BG | `#0D1D25` |
| Error variant BG | `#33181F` |
| Warning variant BG | `#33271F` |
| Shadow | `0 0 20px 8px #000` |
| Scrim | `#00111A` at 80% opacity |
| Border radius | 0 (sharp) |
| Border | `#334148` |

| Size | Width |
|---|---|
| Small | 400px |
| Default | 560px |
| Large | 720px |
| Full | 100vw - 48px (24px margin each side) |

### Dialog
Compact overlay for confirmations and alerts.

| Property | Value |
|---|---|
| BG | `#00111A` |
| Shadow | `0 0 20px 8px #000` |
| Max width | 400px |
| Border | `#334148` |

### Sheet
Slides from edge of viewport for side content.

| Property | Value |
|---|---|
| BG | `#00111A` |
| Width | 320px (small), 480px (default), 640px (large) |
| Position | right edge (default), left edge, bottom |
| Border | left border `#334148` |

## Behavior

- **Open:** fade in scrim (200ms), scale container from 95% to 100% (200ms)
- **Close:** reverse animation (150ms)
- **Scroll:** body scrolls independently, header/footer fixed
- **Body scroll lock:** disable page scroll when modal is open

## Accessibility

| Property | Value |
|---|---|
| Role | `role="dialog"` |
| Modal | `aria-modal="true"` |
| Label | `aria-labelledby` pointing to title element |
| Description | `aria-describedby` pointing to body (optional) |

**Focus management:**
- On open: focus first focusable element (or close button)
- Focus trap: Tab cycles within modal only
- On close: return focus to the element that triggered the modal
- Escape: closes the modal

**Keyboard:**
- `Escape` — close modal
- `Tab` / `Shift+Tab` — cycle focus within modal
- `Enter` — activate focused button

## Light Mode

| Component | BG | Border |
|---|---|---|
| Modal | `#F5F5F5` | `#939A9D` |
| Dialog | `#F5F5F5` | `#939A9D` |
| Sheet | `#F5F5F5` | left `#939A9D` |
| Scrim | `#F5F5F5` at 80% opacity |
