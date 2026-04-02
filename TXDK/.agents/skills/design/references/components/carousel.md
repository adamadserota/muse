# Carousel

Horizontal scrollable content with navigation dots and optional arrows.

## Structure

Container → slides viewport → individual slides. Dots below for position.

## Tokens

- **Container:** `bg-neutral-100` full width, `overflow-hidden`
- **Dot (default):** `w-2 h-2 bg-white-10` (`#192931`)
- **Dot (hover):** `bg-white-100` (`#F5F5F5`)
- **Dot (active):** `bg-white-100` (`#F5F5F5`)
- **Arrow buttons:** icon button style (see `icon-button.md`), positioned absolute left/right
- **Slide gap:** `gap-4` (16px)
- **Transition:** `transition-transform duration-300 ease-out`

## States

- **Default:** show active dot, content visible
- **Hover (container):** show arrow navigation
- **Dragging:** `cursor-grabbing`
- **Autoplay:** optional, pause on hover

## Rules

- Dots: `gap-2`, centered below slides
- Keyboard: left/right arrows navigate, Enter activates
- Touch: swipe gestures on mobile
- Show 1 slide (full-width) or multiple (card carousel) depending on content
