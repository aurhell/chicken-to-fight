# Architecture — DDD / Clean Architecture

This project follows Domain-Driven Design with Clean Architecture on **both backend and frontend**.

---

## Bounded Contexts

| Context    | Domain folder           | Responsibility |
|------------|-------------------------|----------------|
| Chicken    | `domain/chicken/`       | Lifecycle, stats, XP, levels, fatigue |
| Training   | `domain/training/`      | Boxing sessions, level 3 stages, equipment |
| Combat     | `domain/combat/`        | PvP duels, attacks, heroes, Mimétis |
| Economy    | `domain/economy/`       | Gold (PO), shop, commerce, bank, laying hens |
| Clan       | `domain/clan/`          | Creation, members, roles, clan battles |
| Minigames  | `domain/minigames/`     | Tombola, Grat'Chicken, Jackpot, etc. |

---

## Backend layers

### Dependency rule

```
Presentation → Application → Domain ← Infrastructure
```

- **`server/domain/`**: no imports from Nuxt, Drizzle, or any external library. Pure entities, value objects, repository interfaces, domain events, domain services.
- **`server/application/`**: use cases only. Depends on domain interfaces, never on infra implementations. Orchestrates the domain — contains no business logic itself.
- **`server/infrastructure/`**: implements domain interfaces (Drizzle repositories, external services). May import Drizzle and `postgres`.
- **`server/presentation/api/`**: thin Nitro routes. Validate input, call a use case, return the response. No business logic here.

### Backend structure

```
server/
  domain/<context>/
    entities/          # Aggregates and entities (prefer immutable classes)
    value-objects/     # Typed value objects (XPLevel, ChickenStats, GoldAmount...)
    events/            # Domain events (ChickenHatched, TrainingCompleted...)
    repositories/      # Interfaces — IXxxRepository (never implementations)
    services/          # Domain services (logic that doesn't belong to one entity)
  application/<context>/
    use-cases/         # One file = one player action (AdoptEgg.ts, TrainChicken.ts...)
    dtos/              # Data Transfer Objects (use case input/output)
  infrastructure/
    repositories/      # Drizzle implementations of IXxxRepository
    db/schema/         # Drizzle table definitions
  presentation/api/
    <context>/         # Nitro routes: index.get.ts, [id].patch.ts, etc.
```

---

## Frontend layers

### Dependency rule

```
Pages → Application (composables) → Domain ← Infrastructure (stores, API client)
```

- **`app/domain/`**: frontend domain types and interfaces. No Vue, no Pinia, no $fetch. Can reference `shared/types/` for DTOs shared with the backend.
- **`app/application/`**: use cases as Vue composables (`useAdoptEgg`, `useTrainChicken`...). Orchestrate stores and API calls. No direct DOM or component logic.
- **`app/infrastructure/`**: Pinia stores (state = infrastructure), `$fetch` API clients. Pinia stores are adapters, not application logic.
- **`app/presentation/`**: pure Vue components — receive props, emit events, no business logic, no direct store access.
- **`app/pages/`**: Nuxt pages — thin wiring layer. Wire use cases to presentation components. Minimal logic.

### Frontend structure

```
app/
  domain/              # Frontend domain types and interfaces
  application/         # Use cases as Vue composables, one per player action
  infrastructure/
    api/               # $fetch wrappers (useApiClient)
    stores/            # Pinia stores per bounded context
  presentation/
    components/        # Pure presentational Vue components
    layouts/           # Nuxt layouts
  pages/               # Nuxt pages (thin, wiring only)
  assets/              # Static assets (styles, images)
```

---

## Shared layer

```
shared/
  types/               # DTOs and types shared between frontend and backend
```

Use `shared/types/` for anything that crosses the API boundary (request/response shapes). The backend application layer outputs these DTOs; the frontend domain layer consumes them.

---

## Usage

Without argument: audit the project architecture.
- Check for layer dependency violations (forbidden imports) on both frontend and backend
- Identify missing use cases for existing bounded contexts
- Flag entities without a repository, repositories without an infra implementation
- Flag presentation components that access stores or $fetch directly

With an argument `$ARGUMENTS` (e.g. `/archi "TrainChicken use case"`): scaffold the requested file in the correct location on the correct side (frontend or backend), following the conventions above.

---

## Naming conventions

- Entities: `PascalCase` (e.g. `Chicken`, `ClanMember`)
- Value Objects: descriptive `PascalCase` (e.g. `XPLevel`, `GoldAmount`, `ChickenStats`)
- Use cases (backend): verb + noun class (e.g. `AdoptEgg`, `StartTraining`, `ChallengeDuel`)
- Use cases (frontend): `use` + verb + noun composable (e.g. `useAdoptEgg`, `useStartTraining`)
- Repository interfaces: `I` prefix (e.g. `IChickenRepository`)
- Repository implementations: `Drizzle` prefix (e.g. `DrizzleChickenRepository`)
- Domain events: past tense (e.g. `ChickenHatched`, `LevelReached`, `CombatFinished`)
- Pinia stores: `use` + context + `Store` (e.g. `useChickenStore`, `useEconomyStore`)
- API client functions: `use` + context + `Api` (e.g. `useChickenApi`, `useCombatApi`)
