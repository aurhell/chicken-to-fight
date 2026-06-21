# Project conventions

## Database migrations

Always use `--name` when generating a migration so the filename is readable:

```bash
pnpm drizzle-kit generate --name <what_this_migration_does>
```

Examples:
- `pnpm drizzle-kit generate --name add_combat_results`
- `pnpm drizzle-kit generate --name add_clan_members`

Never commit a migration with the default random name (e.g. `0003_violet_agent_zero.sql`).

---

## Vue components

`components: false` is set in `nuxt.config.ts` — **always import components explicitly** in `<script setup>`. There is no auto-import.

Page and component filenames must be **multi-word kebab-case** (`grat-chicken.vue`, not `gratchicken.vue`). Never add single-word names to the `vue/multi-word-component-names` ignore list in `eslint.config.ts` — rename the file instead.

---

## Server vs. client boundary

**Never import from `~/server/` in Vue components or pages.** The `server/` directory is never bundled for the client. If a constant or type is needed on both sides, duplicate it or move it to a shared location.

---

## Architecture — DDD layers

### Backend (`server/`)

Dependencies flow in one direction only:

```
domain → application → infrastructure → api
```

| Layer | Can import | Forbidden |
|-------|-----------|-----------|
| `server/domain/` | nothing (pure TS) | application, infrastructure, framework packages |
| `server/application/` | domain | infrastructure, h3, @nuxt |
| `server/infrastructure/` | domain, application | api handlers |
| `server/api/` | anything server-side | — |

Each bounded context (`chicken`, `combat`, `economy`, etc.) lives in its own subfolder across all layers.

### Frontend (`app/`)

Same direction, adapted to the Vue/Nuxt context:

```
domain → application → infrastructure → presentation
```

| Layer | Location | Contains | Can import |
|-------|----------|----------|-----------|
| Domain | `app/domain/` | Pure TS types and interfaces | nothing |
| Application | `app/application/` | Pinia stores, composables with state and orchestration | domain, infrastructure |
| Infrastructure | `app/infrastructure/api/` | `$fetch` wrappers, typed API functions | domain |
| Presentation | `app/presentation/components/` | Vue components (UI only) | application, infrastructure, domain |
| Nuxt-required | `pages/`, `layouts/`, `middleware/`, `plugins/` | Routing and framework hooks | application (via explicit imports) |

**Rules:**
- Components in `app/presentation/components/` never call `$fetch` directly — they use application-layer composables.
- Pages are thin: they call one composable from `application/` and pass data to components.
- `$fetch` lives exclusively in `app/infrastructure/api/`.
- Types shared between frontend layers live in `app/domain/`. Types that are purely API response shapes live in `app/infrastructure/api/`.
- **Never import from `~/server/`** in any frontend file — duplicate or move types to `app/domain/`.

**Import sources (frontend):**

| What | Import from |
|------|------------|
| `useAuthStore` | `~/application/auth/useAuthStore` |
| Use case composables | `~/application/<context>/use<Name>` |
| API functions | `~/infrastructure/api/<context>` |
| Domain types | `~/domain/<context>/<Type>` |
| Components | `~/presentation/components/<context>/<Name>.vue` |
| `useSound` and other framework utilities | `~/composables/<name>` |

---

## Testing

- **TDD**: write the test first, then implement.
- **Structure**: Given / When / Then with nested `describe` blocks.
- **In-memory repositories**: each domain repository interface has an `InMemory*` implementation in `server/domain/<context>/repositories/` for use in tests. Never mock the database directly.
- **Co-located specs**: test files live next to the file they test (`Foo.ts` → `Foo.spec.ts`).

---

## Typography — Press Start 2P

Press Start 2P is a bitmap font. **Only use multiples of 8px** or it will render blurry:

| Class | Size |
|-------|------|
| `text-[8px]` | 8px |
| `text-base` | 16px |
| `text-2xl` | 24px |
| `text-4xl` | 32px |

Use `font-ui` (Pixelify Sans) for body text where arbitrary sizes are fine.

---

## Explicit imports

`components: false` is set and **all imports must be written explicitly** — composables, stores, Vue primitives, everything. Nuxt's auto-import is intentionally left enabled (disabling it breaks framework internals), but we don't rely on it: every file declares its own imports.

| What | Import from |
|------|------------|
| `ref`, `computed`, `watch`, `onMounted`… | `vue` |
| `useI18n` | `vue-i18n` |
| `useLocalePath`, `useSwitchLocalePath` | `#imports` |
| `useRoute`, `useRouter` | `vue-router` |
| `defineStore` | `pinia` |
| `useRouter` (for navigation) | `vue-router` |
| `useAuthStore` and other stores | `~/application/auth/useAuthStore` |
| Use case composables | `~/application/<context>/use<Name>` |
| API modules | `~/infrastructure/api/<context>` |
| `useSound` and framework utilities | `~/composables/<name>` |

**File naming rules for types:**
- `app/domain/<context>/<TypeName>.ts` — one file per domain concept, named after the exported type (PascalCase). Never use suffixes like `Types` or prefix like `I`. Example: `HatchOutcome.ts`, `AuthUser.ts`, `PlayResult.ts`.
- Types that are pure UI state (e.g. `GameState = "idle" | "playing" | …`) stay co-located in their composable — they are not domain concepts.
- API response types (e.g. `EggStatus`) stay in `app/infrastructure/api/<context>.ts` — they describe the server contract, not the domain.

Vue compiler macros (`defineProps`, `defineEmits`, `withDefaults`, `defineExpose`, `definePageMeta`) and `$fetch` are globals — no import needed.

**Never import `navigateTo` from `nuxt/app` in Pinia stores.** It creates a circular dependency with Nuxt's renderer initialization and causes a TDZ crash at startup. Use `useRouter().push()` instead.

---

## i18n routing

Always wrap internal links with `localePath()`:

```ts
const localePath = useLocalePath()
// <NuxtLink :to="localePath('/dashboard')">
```

Default locale is `fr` (no URL prefix). Other locales get a prefix: `/en/dashboard`. Never hardcode paths without `localePath` — links will break for non-default locales.

---

## Magic numbers

Use named constants for values that have a business meaning:

```ts
const WIN_STAGGER_MS = 120
const DAILY_FREE_PLAYS = 2
```

For pure data blocks (fixed index tables, lookup arrays) where naming each number would add noise, wrap with `eslint-disable`:

```ts
/* eslint-disable no-magic-numbers */
const WINNING_LINES = [[0, 1, 2], [3, 4, 5], ...] as const
/* eslint-enable no-magic-numbers */
```

`no-magic-numbers` is disabled globally in `*.spec.ts` — no need to suppress it in tests.

---

## Pre-commit

Run `/pre-commit` before every commit. It checks lint, audit, security scan, DDD layers, then groups changes into atomic commits with gitmoji messages.
