# Accessibility Rules

## Semantic HTML

- **Use native HTML elements** — `<button>`, `<a>`, `<input>`, `<select>`, not styled `<div>` or `<span>`
- **Heading hierarchy** — one `<h1>` per page, no skipped levels (`h1` → `h3`)
- **Landmarks** — `<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>` for page structure
- **Lists** — use `<ul>`/`<ol>` for groups of related items, not `<div>` chains
- **Tables** — use `<table>` for tabular data with `<th>` headers, not grid layouts

## Keyboard Navigation

- **All interactive elements reachable via Tab** — buttons, links, inputs, custom controls
- **Visible focus indicator** — never `outline: none` without a replacement
- **Escape closes overlays** — modals, dropdowns, tooltips
- **Enter/Space activates** — buttons and toggle controls
- **Arrow keys navigate** — within menus, tabs, radio groups, select dropdowns

## Focus Management

- **Focus trap in modals** — Tab cycles within the modal, not behind it
- **Return focus on close** — when a modal/dropdown closes, focus returns to the trigger element
- **Auto-focus sparingly** — only the primary input in a modal or the first form field
- **Skip to content link** — for pages with complex navigation

```typescript
// Focus trap pattern for modals
useEffect(() => {
    if (!isOpen) return;
    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable?.length) focusable[0].focus();
}, [isOpen]);
```

## ARIA

Use ARIA only when native HTML is insufficient:

| Pattern | ARIA | When |
|---|---|---|
| Icons without text | `aria-label="Close"` | Icon-only buttons |
| Error messages | `aria-describedby="error-id"` | Linking input to error text |
| Dynamic content | `aria-live="polite"` | Toast notifications, status updates |
| Modals | `role="dialog"` + `aria-modal="true"` | Custom modal components |
| Toggles | `aria-pressed="true/false"` | Toggle buttons |
| Loading | `aria-busy="true"` | Sections being loaded |
| Required fields | `aria-required="true"` | When `required` attribute isn't sufficient |

**Rules:**
- **No ARIA is better than bad ARIA** — incorrect roles confuse screen readers
- **Don't override native semantics** — `<button role="link">` is wrong, use `<a>`
- **`aria-label` vs `aria-labelledby`** — use `labelledby` when visible text exists

## Color & Contrast

- **Minimum 4.5:1 contrast** for normal text, 3:1 for large text (18px+ bold)
- **Don't rely on color alone** — add icons, underlines, or text to convey meaning
- **Error states** — use both red color AND an error icon/message

The design system's primary cyan (`#33FFFF`) on dark background (`#00111A`) meets WCAG AA.

## Forms

```typescript
// ✅ Accessible form pattern
<label htmlFor="email" className="text-xs font-bold uppercase text-white-100">
    Email <span aria-hidden="true">*</span>
</label>
<input
    id="email"
    type="email"
    required
    aria-required="true"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? "email-error" : undefined}
    className="..."
/>
{errors.email && (
    <p id="email-error" role="alert" className="text-xs text-error-100">
        {errors.email}
    </p>
)}
```

**Rules:**
- **Every input has a visible label** — linked with `htmlFor`/`id`
- **Error messages linked** — via `aria-describedby`
- **Required fields marked** — visually and with `aria-required`
- **Validation on submit** — not on every keystroke (distracting for screen readers)

## Images & Media

- **Decorative images** — `alt=""` (empty, not omitted)
- **Informative images** — descriptive `alt` text
- **Complex images** — `aria-describedby` pointing to a longer description
- **Videos** — captions when available

## Testing

- **Keyboard-only testing** — navigate the entire flow without a mouse
- **Screen reader testing** — VoiceOver (Mac), NVDA (Windows) for critical flows
- **Automated checking** — `axe-core` via `@axe-core/react` in development
