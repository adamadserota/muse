# Button

Buttons trigger actions. Labels express what action occurs on interaction.

## Guidelines

**When to use:** Communicate actions users can take. One primary (filled) button per page/modal max. Remaining actions use outlined or text buttons.

**When NOT to use:** Not for navigation. No 2 filled buttons together. No 2 primary-color buttons on same page. Prefer text button over icon button when space allows.

**Labels:** Max 3 words or 24 chars. If auto-generated and overflows, truncate with ellipsis + tooltip on hover.

**Do:**
- Use destructive variant when action is irreversible (delete, remove, clear)
- Keep same button size in a row
- Use text button for 3rd action in modals
- Show all split button actions in dropdown including the main one

**Don't:**
- Don't use text buttons with prefix/suffix icons inside banners/snackbars
- Don't use prefix AND suffix icons when purely illustrative
- Don't break text button layout for long labels
- Don't use split button as a select component

## Anatomy

**Basic:** Container + Label
**With icons:** Container + Prefix(icon) + Label + Suffix(icon)
**Sizes:** Small / Default / Large
**States:** Default / Hover / Click / Focused / Disabled
**Disabled:** `opacity: 0.5`, no interaction

---

## Filled Button

Reserved for main action on a page/modal. Takes focus when dialogs appear.

Beveled/notch system: Edge(left) + Text + Edge(right, 12x12 diagonal cut at 45deg on bottom-right corner).


| Action | Default BG | Hover BG | Click BG | Focused BG | Text Default | Text Hover |
|---|---|---|---|---|---|---|
| Primary | `#0A4148` | `#33FFFF` | `#33FFFF` | `#147076` | `#F5F5F5` | `#00111A` |
| Secondary | `#334148` | `#F5F5F5` | `#F5F5F5` | `#667076` | `#F5F5F5` | `#00111A` |
| Error | `#33181F` | `#FF3333` | `#FF3333` | `#661F24` | `#F5F5F5` | `#00111A` |

- Hover: glow shadow (primary `0 0 8px #33FFFF`, secondary `0 0 8px #FFF`)
- Focused: border doubles (`border` → `border-2`)
- Font: Chakra Petch, sm bold (default) / xs bold (small)
- Label: `uppercase`, `leading-6`

**CSS vars:** `--Surface-Button-Filled-bg-button-filled-{action}-{state}`, `--Text-Button-text-button-filled-{state}`, `--Border-Button-border-button-{action}`

## Outlined Button

Second action on a page/modal, or when no main action exists. Same structure as filled.

| Action | Border | Hover BG | Focused BG |
|---|---|---|---|
| Primary | `#33FFFF` | `#052931` | `#0A4148` |
| Secondary | `#F5F5F5` | `#192931` | `#334148` |
| Error | `#FF3333` | `#19141C` | `#33181F` |
| Warning | `#FF8133` | `#191C1C` | `#33271F` |

Text matches border color. Hover: inset shadow effect.

**CSS vars:** `--Text-Button-text-button-outlined-{action}`, `--Surface-Button-Outlined-bg-button-outlined-{action}-{state}`

## Split Button

Main action + dropdown for related actions. Use sparingly as main screen actions.

**Composition:** Filled/Outlined Button + Icon Button (dropdown trigger).
**Variants:** Primary / Secondary / Destructive / Default. Available in filled and outlined.
**Sizes:** Small / Default / Large.
**States:** Each part (button + icon) has independent states: Default / Hover / Click / Focused / Disabled / Active.

## Text Button

Third action on a page/modal, or when space allows a label.

No border/bg by default. Actions: Primary(`#33FFFF`), Secondary(`#F5F5F5`), Destructive(`#FF3333`), Warning(`#FF8133`).

- Hover: corner bracket decorations appear (L-shaped 8x8 borders at 4 corners)
- Click: bg fill
- Focused: border-2 + bg (`--Surface-Text-Button-bg-button-text-{action}-focused`)
- Sizes: Default / Small
- Sub-parts: prefix-icon, label, suffix-icon

**CSS vars:** `--Text-Button-text-button-text-{action}`

## Text Split Button

Split button for overcrowded small sections. Text Button + Icon Button (not contained).
Same variants/sizes/states as split button.

## Icon Button

For toolbars, list hover actions, space-constrained areas. See `icon-button.md` for full tokens.

**Variants:** Primary / Secondary / Destructive / Default
**Sizes:** Default (32x32) / Large
**Styles:** Standard / Contained
**States:** Default / Hover / Click / Focused / Disabled / Active

---

## Accessibility

Role: `button`. Accessible label via text content, `aria-labelledby`, or `aria-label`.

**Keyboard:**
- `Enter`: triggers button action
- `Tab`: moves to next interactive element (wraps to first when last)
- In forms, `Enter` activates the primary button if focus is on non-actionable element

**ARIA properties:**
- `aria-describedby`: if description of function exists
- `aria-disabled="true"`: when action unavailable
- `aria-pressed`: for toggle buttons (`true`/`false`), label must NOT change with state
- `aria-haspopup="menu"`: for menu/split buttons

**Toggle button:** Two-state (pressed/not pressed). Keep label constant (e.g. always "Mute", not "Mute"/"Unmute").

Ref: https://www.w3.org/WAI/ARIA/apg/patterns/button/
