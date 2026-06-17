# Gameplay Check

Verify that the codebase faithfully implements the mechanics described in GAMEPLAY.md.

## Instructions

1. Read GAMEPLAY.md in full to get the complete reference for all game mechanics.

2. Scan the codebase in this order:
   - `server/domain/` — entities, value objects, events: does every gameplay concept have a domain representation?
   - `server/application/` — use cases: does every documented player action have a use case?
   - `server/infrastructure/` — repositories: does the persisted data match the expected data model?
   - `server/presentation/api/` — routes: do the endpoints expose all required actions?
   - `app/` — pages and components: does the frontend cover all described screens?

3. For each section of GAMEPLAY.md, produce a table:

   | Mechanic | Status | Code location | Notes |
   |----------|--------|---------------|-------|
   | ...      | ✅ Implemented / ⚠️ Partial / ❌ Missing | ... | ... |

4. At the end of the report:
   - List **critical gaps** (missing mechanics that block player progression)
   - List **inconsistencies** (code that contradicts GAMEPLAY.md)
   - Suggest the next priority implementations

Do not modify any file. This skill is read-only.
