# Progress

Tracks implementation coverage against [GAMEPLAY.md](./GAMEPLAY.md).  
Use `/gameplay-check` for a detailed per-layer audit at any time.

**Legend:** ✅ Done · 🚧 In progress · ❌ Not started

---

## Milestones

The game is implemented level by level. Each milestone delivers a **complete, playable gameplay loop** for a given set of levels before unlocking the next.

---

### Milestone 1 — Levels 1 to 3: Egg → Chick → Adolescence ❌

**Goal:** a player can adopt an egg, hatch it, raise their chick, and complete the 6 required stages to unlock level 4.

**Gameplay loop:**
1. Player spends PO to adopt an egg
2. Player turns the egg and adjusts humidity & heat for 48h (level 1)
3. Egg hatches automatically → chick (level 2)
4. Player feeds their chick daily (hunger, thirst, happiness, fatigue)
5. Player picks and completes stages one at a time (level 3, 6/7 required)
6. Player chooses a job → unlocks level 4

**Bounded contexts:**

| BC | What is needed |
|----|----------------|
| Chicken | Chicken entity, lifecycle (levels 1→3), stats (hunger/thirst/happiness/fatigue), XP |
| Training | Stages (7 available, 6 required, one at a time), durations |
| Economy | PO balance (read/write), adoption cost, job list |

> Minimal Economy: PO balance + adoption spend only. Full shop and job income come in milestone 2.

---

### Milestone 2 — Level 4: Apprenti Fighter ❌

**Requirements:** rank Apprenti Fighter (1,000 XP) + training equipment + job chosen

**Gameplay loop:**
1. Player earns XP through boxing sessions (30 min, +10 to +40 XP)
2. Player buys training equipment (dumbbells, fitness room) to boost daily XP
3. Player receives daily salary from their job
4. Player challenges other players in PvP (+1 XP per victory)
5. Player manages their chicken's daily fatigue

**Bounded contexts:**

| BC | What is needed |
|----|----------------|
| Chicken | Fatigue management, XP progression → rank Apprenti Fighter |
| Training | Boxing sessions, equipment, XP potions |
| Economy | Daily job income, shop (equipment + consumables) |
| Combat | Basic PvP, victory resolution, XP gain |

---

### Milestone 3 — Levels 5 and 6: Champion → Maître ❌

**Level 5 requirements:** rank Champion du ring (10,000 XP) + 4 heroes defeated  
**Level 6 requirements:** rank Maître incontesté (80,000 XP) + 100 laying hens + victorious clan (20 wins) + bank placement > 10,000 PO

**Gameplay loop:**
1. Player fights the 4 heroes in sequence (Comte Dracula → Poulet-Garou)
2. Player manages a laying hen farm (building, expansion, egg sales)
3. Player creates or joins a clan and participates in clan battles (2v2, 3v3)
4. Player places PO in the bank to generate interest

**Bounded contexts:**

| BC | What is needed |
|----|----------------|
| Chicken | XP progression up to 80,000 |
| Combat | Hero system (4 sequential bosses), clan battles |
| Economy | Laying hens, bank (placements + interest), advanced shop |
| Clan | Creation, roles, recruitment, battles, statistics |

---

### Milestone 4 — Levels 7 to 9: Légende → Immortel ❌

**Level 7 requirements:** Mimétis defeated ×10 + 5 riddles answered correctly  
**Level 9:** no feeding required, salary replaced by a pension

**Gameplay loop:**
1. Player fights Mimétis (merges 2 hero powers simultaneously)
2. Player answers 5 riddles correctly
3. Chicken retires (level 8), then becomes immortal (level 9)
4. Player receives a permanent pension instead of their job salary

**Bounded contexts:**

| BC | What is needed |
|----|----------------|
| Chicken | Retired and Immortal states, feeding exemption |
| Combat | Mimétis (fusion boss), riddle management |
| Economy | Salary → pension conversion |

---

### Milestone 5 — Minigames ❌

**Outside level progression** — accessible at any time.

- Tombola (weekly draw)
- Grat'Chicken, Jackpot, Roue de la Fortune (2 free plays/day)
- Antre du Magicien (7 PO/card)
- Combat betting

**Bounded context:** Minigames (standalone)

---

## Overview

| Context | Status | Notes |
|---------|--------|-------|
| Auth | ✅ Done | Register, login, session, route guard |
| Chicken | ❌ | Lifecycle, stats, XP, ranks, levels |
| Training | ❌ | Boxing, level 3 stages, equipment |
| Combat | ❌ | PvP duels, attacks, heroes, Mimétis |
| Economy | ❌ | PO, shop, jobs, bank, laying hens |
| Clan | ❌ | Creation, roles, clan battles |
| Minigames | ❌ | Tombola, Grat'Chicken, jackpot, etc. |

---

## Auth ✅

- [x] Register (username, email, password)
- [x] Login / Logout
- [x] Cookie-based session (`ctf_session`, 7 days)
- [x] Route guard (redirect unauthenticated users)
- [x] Pinia auth store + `/api/auth/me`

---

## Chicken ❌

### Lifecycle
- [ ] Egg (level 1) — incubation 48h, humidity & heat management
- [ ] Chick (level 2) — automatic at 3 days of age
- [ ] Adolescence (level 3) — 6/7 stages required
- [ ] Apprenti Fighter (level 4) — rank + equipment + job unlocked
- [ ] Champion (level 5) — 10 000 XP + 4 heroes defeated
- [ ] Maître (level 6) — 80 000 XP + 100 laying hens + clan + bank
- [ ] Légende (level 7) — Mimétis ×10 + 5 riddles
- [ ] Retraite (level 8)
- [ ] Immortel (level 9) — no feeding required, receives pension

### Stats & care
- [ ] Hunger / feeding (water, flour, seeds)
- [ ] Thirst
- [ ] Happiness
- [ ] Fatigue (resets to 100% each day)

### XP & Ranks
- [ ] XP accumulation
- [ ] Rank progression (Omelette pacifique → Maître incontesté, 13+ ranks)

### Adoption
- [ ] Adopt an egg (costs PO)
- [ ] Anti-adoption decree (shop item blocking others for 3 days)

---

## Training ❌

### Boxing sessions
- [ ] 30-minute training session (+10 to +40 XP)
- [ ] Fatigue cost per session

### Level 3 stages
- [ ] Self-defence (48h)
- [ ] Get a look (0h)
- [ ] Doping training (24h)
- [ ] Learn attacks (12h)
- [ ] Etiquette lessons (48h)
- [ ] History of great Fighters (24h)
- [ ] Combat tricks (48h)
- [ ] Validation logic (6/7 required to reach level 4)

### Equipment (shop items)
- [ ] Dumbbells — 32.1 PO, +30 XP/day
- [ ] Fitness room — 610 PO, +200 XP/day

### XP potions (consumables)
- [ ] Milkshake — 9 PO, +10 XP
- [ ] Magic potion — 140 PO, +100 XP
- [ ] Celestial potion — 230 PO, +200 XP
- [ ] Legendary potion — 430 PO, +400 XP

---

## Combat ❌

### PvP
- [ ] Challenge another player's chicken
- [ ] Victory grants +1 XP
- [ ] Fatigue impact on combat

### Attacks (purchasable)
- [ ] Basic attack (beak, claws) — free
- [ ] Éclair attack — 27.3 PO
- [ ] Céleste attack — 68.7 PO
- [ ] Légendaire attack — 420 PO
- [ ] Bazooka (secret code, paid)

### Combat items
- [ ] Doping pill — 30 PO, +50 XP in combat
- [ ] Stimulants — 27.1 PO, reduces fatigue (malus on thirst/happiness)

### Heroes (level 5 progression)
- [ ] Comte Dracula — 10 damage
- [ ] Poulet au Masque de Fer — 15 damage
- [ ] Poulerminator — 20 damage
- [ ] Poulet-Garou — 30 damage
- [ ] Defeat 4 heroes in sequence to reach level 6
- [ ] Evening bonus (heroes weaker at night)

### Mimétis (level 7 progression)
- [ ] Fuses powers of 2 heroes simultaneously
- [ ] Defeat 10 times
- [ ] Answer 5 riddles correctly

### Combat betting
- [ ] Bet on Pouletausorus vs KotkotKodaak (10–80 PO, win ×2)

---

## Economy ❌

### Currency
- [ ] PO balance per user (120 PO starting gold)
- [ ] Daily income from jobs

### Jobs (unlocked at level 4, permanent choice)
- [ ] Ouvrier — free, +2 PO/day
- [ ] Barman — 40 PO, +4 PO/day
- [ ] Chimiste — 200 PO, +10 PO/day
- [ ] Médecin — 500 PO, +20 PO/day
- [ ] Détective — 1 200 PO, +30 PO/day
- [ ] Businessman — 2 000 PO, +50 PO/day
- [ ] Mafioso — 2 800 PO, +70 PO/day
- [ ] Espion — 3 500 PO, +80 PO/day

### Shop
- [ ] Food & wellbeing items (water, flour, seeds, beer, treats)
- [ ] Housing items (large cage, chicken coop, villa with pool)
- [ ] Security items (alarm, anti-adoption decree, expulsion notice, legal protection)
- [ ] Communication items (flash message packs)

### Inventory & storage
- [ ] Default basket — 10 items
- [ ] Storage shed — 147 PO, 25 items
- [ ] Storage warehouse — 510 PO, 100 items
- [ ] Alarm protection against theft

### Bank
- [ ] ChickenAdopcheune — 10 days, +10% return
- [ ] ChickenMuscuTec — 20 days, +30% return
- [ ] Balance blocked during placement
- [ ] 10 000 PO placement required for level 6

### Laying hens
- [ ] Building — 300 PO
- [ ] Expansion — 240 PO
- [ ] Individual hen — 70 PO
- [ ] Daily egg production (box of 6 = 10 PO)
- [ ] 100 hens required for level 6

### Player-to-player market
- [ ] Buy/sell chickens and items between players

### Secret codes (permanent bonuses)
- [ ] `Let me feel better` — +2 XP/day
- [ ] `Ayez pitié oh grand poulet` — +0.5 PO/day
- [ ] One-time codes (beer, seeds)
- [ ] Cosmetic shoe codes (7 colors)

---

## Clan ❌

- [ ] Create a clan (founder role)
- [ ] Roles: Founder, Moderator, Member
- [ ] Recruitment opt-in (green lamp)
- [ ] Clan battles: 2v2, 3v3 formats
- [ ] Victory statistics
- [ ] Clan customization (logo GIF/JPG ≤ 50KB, battle cry)
- [ ] Clan forum
- [ ] 20 clan victories required for level 6

---

## Minigames ❌

- [ ] Tombola — 2 PO/ticket, up to 100 tickets, weekly draw
- [ ] Grat'Chicken — 2 free plays/day, find 3 aligned chickens → 50 PO
- [ ] Jackpot — 2 free spins/day, 3 identical chicken heads → 20 PO
- [ ] Antre du Magicien — 7 PO/card, choose 1 of 4 cards, always wins
- [ ] Roue de la Fortune — 2 free spins/day, 1–500 PO
- [ ] Combat betting — (tracked under Combat)

---

## Infrastructure ❌

### DB schema (Drizzle)
- [x] `users` table
- [ ] `chickens` table
- [ ] `training_sessions` table
- [ ] `combats` table
- [ ] `items` / `inventory` tables
- [ ] `jobs` table
- [ ] `bank_placements` table
- [ ] `laying_hen_buildings` table
- [ ] `clans` table
- [ ] `clan_members` table

---

*Run `/gameplay-check` for a detailed audit of what's implemented vs. missing in the code.*
