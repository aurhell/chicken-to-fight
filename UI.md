# UI Design System — Chicken to Fight Revival

Pixel art aesthetic inspired by NES.css. Zero external UI dependencies — everything is hand-rolled.

---

## Fonts

| Token | Font | Usage |
|---|---|---|
| `font-pixel` | Press Start 2P | Titles, important labels, error messages |
| `font-ui` | Pixelify Sans | Everything else (body, buttons, inputs) |

**Critical rule**: Press Start 2P is a bitmap font. It must only be used at **multiples of 8px**: `text-[8px]`, `text-base` (16px), `text-2xl` (24px), `text-[32px]`… Any other size will look blurry.

---

## Colors

All prefixed `pixel-` to avoid conflicts with Tailwind's built-in utilities.

| Token | Hex | Usage |
|---|---|---|
| `pixel-black` | `#181018` | Borders, text, header background |
| `pixel-white` | `#f8f0e8` | Card backgrounds |
| `pixel-sand` | `#f0d080` | Page background |
| `pixel-straw` | `#c89828` | Hover state for gold elements |
| `pixel-gold` | `#f8b800` | Text on dark backgrounds, PO currency, accents |
| `pixel-brown` | `#804818` | Secondary text on light backgrounds |
| `pixel-red` / `pixel-red-light` | `#c02020` / `#f04040` | Danger, REVIVAL label, errors |
| `pixel-green` / `pixel-green-light` | `#188020` / `#38c040` | Success states |
| `pixel-blue` / `pixel-blue-light` | `#1840b8` / `#4878f0` | Links |
| `pixel-gray` / `pixel-gray-light` | `#887878` / `#c8b8b8` | Disabled text |

---

## Borders & Shadows

**Rule**: all borders are **4px** (`border-4`). 2px borders do not exist in this design system.

| Token | Value | Usage |
|---|---|---|
| `shadow-pixel` | `8px 8px 0 0 #181018` | Standard drop shadow |
| `shadow-pixel-sm` | `4px 4px 0 0 #181018` | Reduced drop shadow (ghost button) |
| `shadow-pixel-lg` | `16px 16px 0 0 #181018` | Large shadow (modals, prominent elements) |
| `shadow-pixel-nes` | `inset 0 0 0 4px + 8px 8px` | NES double-frame — signature for containers |

**CSS classes** (via Tailwind plugin):

- `.pixel-border` — `border-4` + NES double-frame + 8px shadow → for cards and containers
- `.pixel-border-sm` — `border-4` + 4px shadow → for subtler elements
- `.pixel-inset` — `border-4` + inset shadow → for "sunken" fields

---

## Components

### PixelCard
Main container. Uses `shadow-pixel-nes` for the signature NES double-frame look.
```html
<PixelCard title="Optional">content</PixelCard>
```
- Background `pixel-white`, 4px border, NES shadow
- Title bar: black strip, `font-pixel text-base`
- Content: `p-8` padding

### PixelButton
```html
<PixelButton variant="primary|danger|ghost" :disabled="bool">Label</PixelButton>
```
- `primary` — gold background, 8px shadow
- `danger` — red background, 8px shadow
- `ghost` — transparent, 4px shadow
- Minimum touch target: `min-h-[44px]`
- Press effect: `translate 8px` (matches the 8px shadow depth)

### PixelInput
```html
<PixelInput id="x" v-model="val" label="Label" :error="msg" />
```
- Background `pixel-sand`, 4px border
- Error message: `font-pixel text-[8px] text-pixel-red`

### GameTitle
```html
<GameTitle compact variant="dark|light" />
```
- Default (login/register): title `text-2xl`, REVIVAL `text-base`
- `compact` (header): title `text-base`, REVIVAL `text-[8px]`
- `light`: gold + light red (dark backgrounds)
- `dark`: black + red (light backgrounds)

---

## Layout

- **Mobile-first**: default styles target mobile, `md:` breakpoint for desktop
- **Game layout** (`layouts/game.vue`): sticky header + scrollable content + mobile bottom nav
- **Bottom nav**: fixed to bottom, `h-16`, mobile only (`md:hidden`)
- **Touch targets**: minimum `44px` on all interactive elements

---

## Global rules

- `border-radius: 0` everywhere — no rounded corners, ever
- `image-rendering: pixelated` on all `img`, `canvas`, `svg`
- No antialiasing (`-webkit-font-smoothing: none`)
- Page background: `pixel-sand` (`#f0d080`)
