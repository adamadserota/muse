# Skeleton

Loading placeholder that mimics content layout while data loads.

## Variants

| Variant | Use for |
|---|---|
| Text | Paragraphs, labels, headings |
| Rectangle | Cards, images, banners |
| Circle | Avatars |
| Table row | Data tables |

## Tokens

- **BG:** `bg-white-10` (`#192931`)
- **Shimmer:** animated gradient `from-white-10 via-white-20 to-white-10` moving left to right
- **Border radius:** `0` (matches component being loaded, except circle for avatars)
- **Animation:** `animate-pulse` or custom shimmer `@keyframes shimmer { 0% { transform: translateX(-100%) } 100% { transform: translateX(100%) } }`
- **Duration:** `1.5s infinite`

## Sizes

- **Text line:** `h-4 w-full` (vary width: `w-3/4`, `w-1/2` for natural look)
- **Heading:** `h-6 w-1/3`
- **Avatar:** `w-8 h-8 rounded-full`
- **Card:** match card dimensions
- **Gap between lines:** `gap-2`

## Rules

- Match the layout of the content being loaded — same heights, widths, gaps
- Use `overflow-hidden` on container to clip shimmer animation
- 2-3 skeleton lines for text blocks (vary widths)
- Never show skeleton for more than 3 seconds — show error/empty state after timeout
- No skeleton for instant operations — only for async data fetches
