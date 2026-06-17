# Pre-commit checks + atomic commits

Run all pre-commit checks, group changes into atomic commits, and propose a message for each. Execute before every commit.

---

## Step 1 — Lint

```bash
pnpm lint
```

- **Pass**: 0 errors (warnings are acceptable)
- **Fail**: fix before proceeding

---

## Step 2 — Dependency security audit

```bash
pnpm audit --audit-level=high
```

- **Pass**: no high or critical vulnerabilities
- **Fail**: report the advisory, do not proceed

---

## Step 3 — Codebase security scan

Inspect all modified files for:

| Risk | What to look for |
|------|-----------------|
| Leaked secrets | Hardcoded API keys, tokens, passwords, private keys (patterns: `sk-`, `ghp_`, `-----BEGIN`, `password =`, `secret =`, `token =`) |
| Committed `.env` | `git ls-files | grep -E '\.env'` |
| Sensitive logs | `console.log` printing auth tokens, passwords, user data |
| Raw SQL interpolation | String concatenation inside query strings |
| `eval()` / `new Function()` | Dynamic code execution |

- **Pass**: nothing found
- **Fail**: list each occurrence with file + line, do not proceed

---

## Step 4 — DDD / Clean Architecture

For each modified file under `server/`, verify the dependency direction is respected.

**Dependency rules:**

| Layer | Can import from | Forbidden |
|-------|-----------------|-----------|
| `server/domain/**` | nothing (pure TS/types only) | `application`, `infrastructure`, `api`, framework packages (`h3`, `drizzle-orm`, `@nuxt`) |
| `server/application/**` | `domain` | `infrastructure`, `api`, framework packages (`h3`, `@nuxt`) |
| `server/infrastructure/**` | `domain`, `application` | `api` |
| `server/api/**` | anything server-side | — |

**Run these checks:**

```bash
# Domain must not leak toward outer layers or framework
grep -rn "from ['\"].*infrastructure\|from ['\"].*application\|from ['\"]h3\|from ['\"]drizzle" \
  server/domain/ --include="*.ts" | grep -v "\.spec\."

# Application must stay framework-agnostic
grep -rn "from ['\"].*infrastructure\|from ['\"].*\/api\/\|from ['\"]h3\|from ['\"]@nuxt" \
  server/application/ --include="*.ts" | grep -v "\.spec\."

# Infrastructure must not import from api handlers
grep -rn "from ['\"].*\/api\/" \
  server/infrastructure/ --include="*.ts"
```

- **Pass**: empty output on all three commands
- **Fail**: list each violation with file + line, do not proceed

---

## Step 5 — Analyze changes and group into atomic commits

```bash
git diff HEAD --name-only   # unstaged + staged
git status --short
```

Read the full diff, then group modified files by **logical unit of change**. One commit = one coherent, self-contained change. A good atomic commit:
- compiles and passes lint on its own
- has a single clear intent
- does not mix unrelated concerns (e.g. "fix bug" + "add feature" = 2 commits)

### Grouping heuristics

| Signal | Group together |
|--------|---------------|
| Same bounded context (`domain/chicken/`, `app/...chicken...`) | Yes, if same intent |
| Config/tooling changes | Separate from feature code |
| Schema + migration | Together (they're coupled) |
| Multiple unrelated features | One commit per feature |
| Lint/style-only changes | Separate from logic changes |

If all changes form a single coherent unit → one commit is correct, no need to split.

---

## Step 6 — Propose commits

For each group, propose:
1. The exact files to stage (`git add <files>`)
2. The commit message

### Commit message format

```
<gitmoji> <type>(<scope>): <short description>

[optional body: the why, not the what]
```

### Gitmoji + type reference

| Gitmoji | Type | When |
|---------|------|------|
| ✨ | feat | New feature |
| 🐛 | fix | Bug fix |
| ♻️ | refactor | Refactor without behavior change |
| 🎨 | style | Formatting, lint fixes |
| 🔧 | chore | Config, tooling, deps |
| 📝 | docs | Documentation |
| 🚀 | perf | Performance improvement |
| 🧪 | test | Adding or fixing tests |
| 🔒️ | security | Security fix |
| 🗃️ | db | Database / migrations |
| 💄 | ui | UI / styles |
| 🏗️ | arch | Architecture changes |

### Scopes

`chicken` · `training` · `combat` · `economy` · `clan` · `minigames` · `auth` · `db` · `config` · `eslint` · `dx`

### Rules

- Description in **English**, imperative mood ("add", "fix", not "added", "fixes")
- Max 72 characters on first line
- Body only if the *why* is non-obvious

---

## Output format

### Single commit

```
## Pre-commit checks

- [x] Lint — clean
- [x] Dependency audit — no high/critical vulnerabilities
- [x] Codebase security scan — nothing found
- [x] DDD / Clean Architecture — no layer violations

✅ All checks passed.

---

## Commit plan (1 commit)

### Commit 1
git add server/domain/chicken/entities/Chicken.ts server/domain/chicken/value-objects/XPLevel.ts
✨ feat(chicken): add Chicken entity and XPLevel value object
```

### Multiple atomic commits

```
## Pre-commit checks

- [x] Lint — clean
- [x] Dependency audit — no high/critical vulnerabilities
- [x] Codebase security scan — nothing found
- [x] DDD / Clean Architecture — no layer violations

✅ All checks passed.

---

## Commit plan (3 commits)

### Commit 1 — domain
git add server/domain/chicken/
✨ feat(chicken): add Chicken entity with XP and stats value objects

### Commit 2 — infrastructure
git add server/infrastructure/db/schema/chickens.ts server/infrastructure/db/index.ts
🗃️ db(chicken): add chickens table schema and db connection

### Commit 3 — tooling
git add eslint.config.ts .npmrc tsconfig.node.json
🔧 chore(eslint): fix import-x plugin and tailwind inline config
```

### On failure

```
## Pre-commit checks

- [x] Lint — clean
- [ ] Codebase security scan — 1 issue found

  ❌ server/infrastructure/db/index.ts:3 — hardcoded credential: `password123`

```

```
## Pre-commit checks

- [x] Lint — clean
- [x] Dependency audit — no high/critical vulnerabilities
- [x] Codebase security scan — nothing found
- [ ] DDD / Clean Architecture — 1 violation found

  ❌ server/application/auth/RegisterUseCase.ts:2 — forbidden import from infrastructure layer

🚫 Fix the issues above before proposing commits.
```
