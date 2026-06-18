# UI Design System — Chicken to Fight Revival

Pixel art aesthetic inspired by NES.css. Zero external UI dependencies — tout est maison.

---

## Fonts

| Token | Font | Usage |
|---|---|---|
| `font-pixel` | Press Start 2P | Titres, labels importants, erreurs |
| `font-ui` | Pixelify Sans | Tout le reste (corps, boutons, inputs) |

**Règle critique** : Press Start 2P est une police bitmap. Elle doit être utilisée **uniquement à des multiples de 8px** : `text-[8px]`, `text-base` (16px), `text-2xl` (24px), `text-[32px]`… Toute autre taille sera flou.

---

## Couleurs

Toutes préfixées `pixel-` pour éviter les conflits avec Tailwind.

| Token | Hex | Usage |
|---|---|---|
| `pixel-black` | `#181018` | Bordures, texte, fond header |
| `pixel-white` | `#f8f0e8` | Fond des cartes |
| `pixel-sand` | `#f0d080` | Fond de page |
| `pixel-straw` | `#c89828` | Hover des éléments dorés |
| `pixel-gold` | `#f8b800` | Texte sur fond sombre, PO, accents |
| `pixel-brown` | `#804818` | Textes secondaires sur fond clair |
| `pixel-red` / `pixel-red-light` | `#c02020` / `#f04040` | Danger, REVIVAL, erreurs |
| `pixel-green` / `pixel-green-light` | `#188020` / `#38c040` | Succès |
| `pixel-blue` / `pixel-blue-light` | `#1840b8` / `#4878f0` | Liens |
| `pixel-gray` / `pixel-gray-light` | `#887878` / `#c8b8b8` | Textes désactivés |

---

## Bordures & Ombres

**Règle** : toutes les bordures font **4px** (`border-4`). Les bordures 2px n'existent pas dans ce DS.

| Token | Valeur | Usage |
|---|---|---|
| `shadow-pixel` | `8px 8px 0 0 #181018` | Ombre portée standard |
| `shadow-pixel-sm` | `4px 4px 0 0 #181018` | Ombre portée réduite (ghost button) |
| `shadow-pixel-lg` | `16px 16px 0 0 #181018` | Grande ombre (modals, éléments proéminents) |
| `shadow-pixel-nes` | `inset 0 0 0 4px + 8px 8px` | Double cadre NES — signature des conteneurs |

**CSS classes** (via plugin Tailwind) :

- `.pixel-border` — `border-4` + double cadre NES + ombre 8px → pour les cartes/conteneurs
- `.pixel-border-sm` — `border-4` + ombre 4px → pour les éléments plus discrets
- `.pixel-inset` — `border-4` + ombre inset → pour les champs "enfoncés"

---

## Composants

### PixelCard
Conteneur principal. Utilise `shadow-pixel-nes` pour le double cadre NES signature.
```html
<PixelCard title="Optionnel">contenu</PixelCard>
```
- Fond `pixel-white`, bordure 4px, ombre NES
- Titre : barre noire `font-pixel text-base`
- Contenu : padding `p-8`

### PixelButton
```html
<PixelButton variant="primary|danger|ghost" :disabled="bool">Label</PixelButton>
```
- `primary` — fond gold, ombre 8px
- `danger` — fond rouge, ombre 8px
- `ghost` — transparent, ombre 4px
- Touch target minimum : `min-h-[44px]`
- Effet press : `translate 8px` (colle à l'ombre 8px)

### PixelInput
```html
<PixelInput id="x" v-model="val" label="Label" :error="msg" />
```
- Fond `pixel-sand`, bordure 4px
- Erreur en `font-pixel text-[8px] text-pixel-red`

### GameTitle
```html
<GameTitle compact variant="dark|light" />
```
- Default (login/register) : titre `text-2xl`, REVIVAL `text-base`
- `compact` (header) : titre `text-base`, REVIVAL `text-[8px]`
- `light` : gold + rouge clair (fond sombre)
- `dark` : noir + rouge (fond clair)

---

## Layout

- **Mobile-first** : styles par défaut = mobile, `md:` pour desktop
- **Game layout** (`layouts/game.vue`) : header sticky + contenu + bottom nav mobile
- **Bottom nav** : fixée en bas, `h-16`, visible mobile uniquement (`md:hidden`)
- **Touch targets** : minimum `44px` sur tous les éléments interactifs

---

## Règles globales

- `border-radius: 0` partout — aucun arrondi, jamais
- `image-rendering: pixelated` sur tous les `img`, `canvas`, `svg`
- Pas d'antialiasing (`-webkit-font-smoothing: none`)
- Fond de page : `pixel-sand` (`#f0d080`)
