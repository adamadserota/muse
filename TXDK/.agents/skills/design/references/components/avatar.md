# Avatar

Circular user identifier — initials, image, or icon fallback.

## Sizes

| Size | Dimensions | Font |
|---|---|---|
| sm | 24x24 | 10px bold |
| md | 32x32 | 12px bold |
| lg | 48x48 | 16px bold |
| xl | 64x64 | 24px bold |

## Tokens

- **BG:** `bg-primary-20` (`#0A4148`)
- **Text:** `text-primary-100` (`#33FFFF`)
- **Border:** `border border-white-20`
- **Shape:** `rounded-full` (exception to radius-0 rule)
- **Image fit:** `object-cover rounded-full`
- **Hover:** `ring-2 ring-primary-100`

## States

- **Default:** initials on dark cyan BG
- **Hover:** cyan ring glow
- **Image error:** fallback to initials
- **Loading:** skeleton circle

## Group

Stack with `-ml-2` overlap. Max 3-5 visible, then `+N` counter badge.
