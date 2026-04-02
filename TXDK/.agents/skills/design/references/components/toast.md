# Toast / Notification

Transient feedback messages that appear after an action and auto-dismiss.

## Guidelines

**When to use:** Confirm a completed action (item saved, entity deleted, export started), show transient errors (network failed, validation error), or notify background task status changes.

**When NOT to use:** Not for persistent alerts — use banner. Not for blocking confirmations — use modal. Not for inline validation — use form error states.

**Do:**
- Keep messages short (one line, max two)
- Auto-dismiss success toasts (4-5 seconds)
- Allow manual dismiss on all toasts
- Stack multiple toasts vertically

**Don't:**
- Don't show more than 3 toasts at once — queue the rest
- Don't use toasts for critical errors that need user action — use modal or banner
- Don't put interactive elements (links, buttons) inside toasts except dismiss
- Don't show toasts on page load — they are responses to user actions

## Anatomy

```
┌─────────────────────────────────────────────────┐
│  ● Icon  │  Message text              │  ✕      │
│          │  Description (optional)    │         │
│          │  ━━━━━━━━━ progress bar    │         │  ← only for timed/task toasts
└─────────────────────────────────────────────────┘
```

## Variants

| Variant | Icon | Use case |
|---|---|---|
| Success | checkmark circle | Action completed (saved, created, deleted) |
| Error | alert circle | Action failed (network error, server error) |
| Warning | alert triangle | Action succeeded with caveats |
| Info | info circle | Neutral notification |
| Loading | spinner | Background task in progress |

## States (Dark)

| Variant | BG | Border-left | Icon color | Text |
|---|---|---|---|---|
| Success | `#052931` | `3px solid #33FFFF` | `#33FFFF` | `#F5F5F5` |
| Error | `#33181F` | `3px solid #FF3333` | `#FF3333` | `#F5F5F5` |
| Warning | `#33271F` | `3px solid #FF8133` | `#FF8133` | `#F5F5F5` |
| Info | `#192931` | `3px solid #33BBFF` | `#33BBFF` | `#F5F5F5` |
| Loading | `#192931` | `3px solid #33FFFF` | `#33FFFF` (animated) | `#F5F5F5` |

### Common Properties
| Property | Value |
|---|---|
| Border | `1px solid #334148` (top, right, bottom) |
| Shadow | `0 0 20px 6px rgba(0,0,0,0.4)` |
| Dismiss icon | `#667076` hover `#F5F5F5` |
| Description text | `#CCCFD1` |

## States (Light)

| Variant | BG | Border-left | Icon color | Text |
|---|---|---|---|---|
| Success | `#CEF7F7` | `3px solid #147076` | `#147076` | `#00111A` |
| Error | `#F7CECE` | `3px solid #992529` | `#992529` | `#00111A` |
| Warning | `#F7DECE` | `3px solid #663E24` | `#663E24` | `#00111A` |
| Info | `#CEE9F7` | `3px solid #145576` | `#145576` | `#00111A` |

## Sizing

| Property | Value |
|---|---|
| Width | `360px` (fixed) |
| Min height | `48px` |
| Padding | `12px 16px` |
| Border radius | 0 (sharp) |
| Icon size | `20px` |
| Gap (icon to text) | `12px` |
| Gap (text to dismiss) | `12px` |
| Message font | 14px (sm) bold |
| Description font | 12px (xs) regular |
| Progress bar height | `2px` |

## Positioning

| Property | Value |
|---|---|
| Position | fixed, top-right corner |
| Offset from edge | `16px` top, `16px` right |
| Stack direction | top to bottom (newest on top) |
| Gap between toasts | `8px` |
| Z-index | above modal (z-50 or higher) |

## Timing

| Variant | Auto-dismiss | Duration |
|---|---|---|
| Success | yes | 4000ms |
| Error | no | manual dismiss only |
| Warning | yes | 6000ms |
| Info | yes | 4000ms |
| Loading | no | dismiss when task completes |

### Progress Bar (auto-dismiss toasts)
| Property | Value |
|---|---|
| Track BG | transparent |
| Fill | same as border-left color, reduced opacity `0.4` |
| Animation | width 100% → 0% over dismiss duration, linear |
| Position | bottom edge of toast, full width |

## Animation

| Event | Animation |
|---|---|
| Enter | slide in from right `translate-x-full → translate-x-0`, 200ms ease-out |
| Exit | fade out + slide right `opacity-0 translate-x-full`, 150ms ease-in |
| Stack shift | other toasts shift down smoothly, 150ms ease |

## Pause on Hover

- Hovering over a toast pauses its auto-dismiss timer
- Progress bar animation pauses
- Timer resumes when mouse leaves

## Accessibility

- Container: `role="status"` with `aria-live="polite"` (success/info) or `aria-live="assertive"` (error/warning)
- Dismiss button: `aria-label="Dismiss notification"`
- Toast content must not be the only way to communicate critical information
- Respect `prefers-reduced-motion`: disable slide animations, use instant show/hide
- Focus: dismiss button is not auto-focused (toasts should not steal focus)
- Screen reader: announce the full message text when toast appears
