# Chicken to Fight

A recreation of the early 2000s French browser game **Chicken to Fight** — a fighting rooster breeding simulation with PvP combat, economy management, and clan battles.

> The original game ran on `chickentofight.com` and shut down around 2011. This project aims to faithfully recreate its mechanics from community-documented sources. See [`GAMEPLAY.md`](./GAMEPLAY.md) for the full game reference.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | [Nuxt 4](https://nuxt.com) (SPA mode, SSR disabled) |
| Frontend | Vue 3 + TypeScript (strict) |
| State | Pinia |
| Styling | Tailwind CSS v3 |
| Backend | Nitro (built into Nuxt) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) |
| Database | PostgreSQL 17 |
| Package manager | pnpm |

---

## Architecture

The project follows **Domain-Driven Design** with **Clean Architecture** on both frontend and backend.

```
chickentofight/
├── app/                        # Frontend (Vue 3)
│   ├── domain/                 # Frontend domain types and interfaces
│   ├── application/            # Use cases as Vue composables
│   ├── infrastructure/
│   │   ├── api/                # $fetch wrappers
│   │   └── stores/             # Pinia stores (state = infrastructure)
│   ├── presentation/
│   │   ├── components/         # Pure presentational Vue components
│   │   └── layouts/            # Nuxt layouts
│   ├── pages/                  # Nuxt pages — thin wiring layer
│   └── assets/
├── server/                     # Backend (Nitro)
│   ├── domain/                 # Pure business logic, no external dependencies
│   │   ├── chicken/
│   │   ├── training/
│   │   ├── combat/
│   │   ├── economy/
│   │   ├── clan/
│   │   └── minigames/
│   ├── application/            # Use cases — orchestrate domain, no business logic
│   ├── infrastructure/         # Drizzle repositories, DB schema
│   └── presentation/api/       # Thin Nitro route handlers
└── shared/
    └── types/                  # DTOs shared between frontend and backend
```

**Layer rules:**
- `domain/` — zero external imports (no Nuxt, Drizzle, Vue)
- `application/` — depends on domain interfaces only, never on infra implementations
- `infrastructure/` — implements domain interfaces, may use Drizzle and `postgres`
- `presentation/` — validates input, calls a use case, returns response. No business logic

See the `/archi` Claude skill for detailed conventions and scaffolding.

---

## Prerequisites

- [Node.js](https://nodejs.org) v20+
- [pnpm](https://pnpm.io) v9+
- [Docker](https://www.docker.com) (for the database)

---

## Getting started

**1. Clone and install**

```bash
git clone <repo-url>
cd chickentofight
pnpm install
```

**2. Configure environment**

```bash
cp .env.example .env
```

The default `.env` is pre-configured for the Docker database — no changes needed for local development.

**3. Start the database**

```bash
docker compose up -d
```

**4. Run database migrations**

```bash
pnpm db:migrate
```

**5. Start the dev server**

```bash
pnpm dev
```

The app is available at `http://localhost:3000`.

---

## Available commands

### Development

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the Nuxt dev server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview the production build |

### Database

| Command | Description |
|---------|-------------|
| `pnpm db:generate` | Generate a new migration from schema changes |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:studio` | Open Drizzle Studio (visual DB explorer) |

### Code quality

| Command | Description |
|---------|-------------|
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint and auto-fix |

### Docker

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start PostgreSQL in background |
| `docker compose down` | Stop the database |
| `docker compose down -v` | Stop and delete all data |

---

## Workflow: adding a feature

New features follow the DDD bounded context structure. The `/archi` Claude skill can scaffold files for you.

Example for a new `TrainChicken` feature:

1. **Domain** — add/update entity or value object in `server/domain/training/`
2. **Application** — create `server/application/training/use-cases/TrainChicken.ts`
3. **Infrastructure** — implement repository in `server/infrastructure/repositories/`
4. **API route** — create thin handler in `server/presentation/api/training/`
5. **Frontend use case** — create `app/application/useTrainChicken.ts`
6. **Store** (if needed) — add to `app/infrastructure/stores/`
7. **Component** — add presentational component in `app/presentation/components/`
8. **Page** — wire up in `app/pages/`

After touching the DB schema, run `pnpm db:generate` then `pnpm db:migrate`.

---

## Claude skills

This project ships with two custom Claude Code slash commands:

| Skill | Usage | Description |
|-------|-------|-------------|
| `/gameplay-check` | `/gameplay-check` | Audits the codebase against `GAMEPLAY.md` and reports what's implemented, partial, or missing |
| `/archi` | `/archi` or `/archi "feature name"` | Without args: audits architecture for layer violations. With args: scaffolds a new file at the correct location |

---

## Game reference

All game mechanics are documented in [`GAMEPLAY.md`](./GAMEPLAY.md), reconstructed from community sources (blogs, forums) dating from 2007–2011.

Key concepts:
- **PO** (Poulets d'Or) — the in-game currency
- **9 game levels** — from egg to immortal rooster
- **XP ranks** — from "Omelette pacifique" (0 XP) to "Maître incontesté" (80,000 XP)
- **6 bounded contexts** — Chicken, Training, Combat, Economy, Clan, Minigames
