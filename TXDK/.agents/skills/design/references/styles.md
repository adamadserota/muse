# Global Styles

## Colors

### Primary (Cyan)
`100:#33FFFF` `200:#5AFDFD` `300:#81FBFB` `400:#A7F9F9` `500:#CEF7F7` `80:#29CFD1` `60:#1FA0A3` `40:#147076` `20:#0A4148` `10:#052931` `5:#031D25`

### Secondary (Blue)
`100:#33BBFF` `200:#5AC7FD` `300:#81D2FB` `400:#A7DEF9` `500:#CEE9F7` `80:#2999D1` `60:#1F77A3` `40:#145576` `20:#0A3348` `10:#052231` `5:#031925`

### Warning (Orange)
`100:#FF8133` `200:#FD985A` `300:#FBB081` `400:#F9C7A7` `500:#F7DECE` `80:#CC6B2E` `60:#995429` `40:#663E24` `20:#33271F` `10:#191C1C` `5:#0D171B`

### Error (Red)
`100:#FF3333` `200:#FD5A5A` `300:#FB8181` `400:#F9A7A7` `500:#F7CECE` `80:#CC2C2E` `60:#992529` `40:#661F24` `20:#33181F` `10:#19141C` `5:#0D131B`

### White
`100:#F5F5F5` `80:#CCCFD1` `60:#99A0A3` `40:#667076` `20:#334148` `10:#192931` `5:#0D1D25`

### Neutral (Dark)
`100:#00111A` `200:#313F46` `300:#626C72` `400:#939A9D` `500:#C4C7C9`

### Premium (Purple)
`100:#6B6BD6` `200:#8989D8` `300:#A6A6E1` `400:#E1E1F5` `500:#F0F0FA` `80:#5759AA` `60:#414786` `40:#2D3562` `20:#18233E` `10:#0F1A2C` `5:#091622`

All colors have transparent variants (alpha hex, e.g. `#33FFFFcc` for primary80-t).

### Semantic Tokens (Dark)

**Text:** title `#F5F5F5` | body `#F5F5F5` | desc `#CCCFD1` | desc-warning `#FF8133` | desc-error `#FF3333` | link `#29CFD1` | link-hover `#33FFFF` | link-visited `#8989D8` | error `#FF3333` | warning `#FF8133` | negative `#00111A` | title-brand `#29CFD1` | bg-selected `#147076` | tooltip `#192931`

**Surfaces:** default `#00111A` | section `#0D1D25` | hover `#192931` | active `#334148` | modal `#0D1D25` | modal-error `#33181F` | modal-warning `#33271F` | dialog `#00111A` | sheet `#00111A` | menu `#00111A` | scrim `#00111A` | skeleton `#192931` | premium `#18233E`

**Borders:** default `#334148` | hover `#99A0A3` | strong `#F5F5F5` | error `#33181F` | warning `#33271F` | premium `#18233E`

**Icons:** primary `#33FFFF` | default `#F5F5F5` | soft `#667076` | error `#FF3333` | warning `#FF8133` | negative `#00111A` | negative-soft `#00111A`

**Gradient:** primary `#5AFDFD` | white `#F5F5F5`

### Semantic Tokens (Light)

**Text:** title `#00111A` | body `#00111A` | desc `#313F46` | link `#147076` | link-hover `#1FA0A3` | link-visited `#5759AA` | error `#992529` | warning `#663E24` | negative `#F5F5F5`

**Surfaces:** default `#CCCFD1` | section `#F5F5F5` | hover `#C4C7C9` | active `#939A9D` | modal `#F5F5F5` | dialog `#F5F5F5` | scrim `#F5F5F5` | skeleton `#C4C7C9`

**Borders:** default `#939A9D` | hover `#626C72` | strong `#00111A` | error `#F9A7A7` | warning `#F9C7A7`

**Icons:** primary `#147076` | default `#00111A` | soft `#626C72` | error `#992529` | warning `#663E24` | negative `#F5F5F5`

**Buttons (light):** filled-primary `#1FA0A3` hover `#33FFFF` | filled-secondary `#939A9D` hover `#00111A` | filled-error `#F9A7A7` hover `#FF3333` | text defaults flip to dark equivalents

**Card (light):** bg `#F5F5F5` | hover `#A7F9F9` | border `#00111A`

**Tooltip (light):** bg `#00111A` | text `#F5F5F5`

---

## Typography

Font: **Chakra Petch** (only)

| Token | Size | Weight | Extra |
|---|---|---|---|
| Display 1 | 80px | bold | — |
| Display 2 | 48px (5xl) | bold | — |
| H1 | 48px (5xl) | bold | — |
| H2 | 32px | bold | — |
| H3 | 24px (2xl) | bold | — |
| Body 1 | 14px (sm) | regular/bold | leading-6 |
| Body 2 | 12px (xs) | regular/bold | — |
| CTA default | 14px (sm) | bold | — |
| CTA small | 12px (xs) | bold | — |
| Label 1 | 14px (sm) | regular/bold | uppercase |
| Label 2 | 12px (xs) | regular/bold | uppercase |
| Caption | 12px (xs) | regular/bold | — |
| Link | 14px (sm) | regular | leading-6 |

---

## Spacing

Scale: `4px` `8px` `16px` `24px` `48px`
Base unit: 8px

---

## Border Radius

**0** everywhere. Exception: radio buttons `rounded-3xl`.

---

## Shadows

| Context | Value |
|---|---|
| Dialog/Modal | `0 0 20px 8px #000` |
| Popover/Card | `0 0 20px 6px rgba(0,0,0,0.4)` |
| Dropdown | `0 8px 20px 0 #000` |
| Select dropdown | `0 8px 20px 0 rgba(0,0,0,0.4)` |
| Btn hover (primary) | `0 0 8px 0 #33FFFF` |
| Btn hover (secondary) | `0 0 8px 0 #FFF` |
| Switch selected | `0 0 8px 0 #33FFFF` |
| Input focused | `0 0 12px 0 rgba(51,255,255,0.25)` |
| Outlined btn hover | `inset 4px 4px 4px 0 rgba(255,255,255,0.15), inset 4px -6px 4px 0 rgba(255,255,255,0.15)` |

---

## Layout

- 12-column grid
- Max width: 1440px
- Breakpoints: 640 / 768 / 1024 / 1280px
- Default padding: 16px
- Flexbox-first
