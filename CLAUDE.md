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

`components: false` and `imports: { autoImport: false }` are both set — **everything must be imported explicitly**, including composables, stores, and Vue primitives.

| What | Import from |
|------|------------|
| `ref`, `computed`, `watch`, `onMounted`… | `vue` |
| `useI18n` | `vue-i18n` |
| `useLocalePath`, `useSwitchLocalePath` | `#imports` |
| `useRoute`, `useRouter` | `vue-router` |
| `defineStore` | `pinia` |
| `navigateTo` | `nuxt/app` |
| Stores (`useAuthStore`…) | `~/stores/<name>` |
| Composables (`useSound`…) | `~/composables/<name>` |

Vue compiler macros (`defineProps`, `defineEmits`, `withDefaults`, `defineExpose`, `definePageMeta`) and `$fetch` are globals — no import needed.

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
