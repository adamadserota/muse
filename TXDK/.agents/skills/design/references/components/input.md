# Text Input

Height: 40px. BG: `#0D1D25`. Font: Chakra Petch.

## States

| State | Border | Label | Placeholder | Text |
|---|---|---|---|---|
| Default | `#334148` | `#F5F5F5` xs bold | `#99A0A3` | — |
| Focused | `#147076` + glow | `#33FFFF` | `#1FA0A3` | `#33FFFF` |
| Filled | `#334148` | `#F5F5F5` | — | `#F5F5F5` |
| Filled-focused | `#147076` + glow | `#33FFFF` | — | `#33FFFF` |
| Error | `#661F24` | `#FF3333` | — | `#F5F5F5` |

- Focused glow: `0 0 12px 0 rgba(51,255,255,0.25)`
- Cursor: 1px `#33FFFF` blinking bar
- Helper text: xs `#CCCFD1` / error xs `#FF3333`
- Sub-parts: left(icon + placeholder/value), right(icon buttons, clear btn on filled-focused)
- Error BG: `#0D131B`
