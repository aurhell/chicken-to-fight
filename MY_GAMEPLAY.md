# Chicken to Fight — Mon gameplay

> Ce document décrit les règles **de ma version** du jeu, qui s'inspire du jeu original (voir `GAMEPLAY.md`) tout en prenant des libertés créatives. Quand ce document contredit `GAMEPLAY.md`, c'est volontaire.

---

## Cycle de vie du poulet

```
Œuf (48h d'incubation)
  → Poussin (niveau 2 : survie 3 jours)
    → Adolescent (niveau 3 : stages de formation)
      → Combattant (niveaux 4–7)
        → Retraité (niveau 8)
          → Immortel (niveau 9)
```

---

## Niveau 2 — Le Poussin

### Objectif
Maintenir le poussin en vie pendant **3 jours** pour qu'il devienne adolescent.

### Mécanique de survie

Le poussin a deux barres de vie qui **descendent progressivement** :

| Barre | Ressource | Durée avant vidage complet |
|-------|-----------|---------------------------|
| 🌾 Faim | Farine | 12 heures |
| 💧 Soif | Eau | 12 heures |

- Donner à **manger** (1 farine) : remet la barre de faim à 100 %
- Donner à **boire** (1 eau) : remet la barre de soif à 100 %
- Si l'une des deux barres atteint **0 % → le poussin meurt** et est définitivement perdu
- Si les deux barres restent > 0 % pendant **3 jours depuis l'éclosion → le poussin évolue** en adolescent

### Ce qui change vs le jeu original
- **Pas de barre d'XP** à ce stade (l'XP concerne les phases de combat, pas l'élevage)
- La nourriture et l'eau sont des **ressources distinctes** issues d'un inventaire (pas de colonnes user)
- La mort du poussin est **définitive** (pas de résurrection)

---

## Inventaire

Les ressources eau et farine ne sont pas liées au joueur sous forme de champs statiques, mais gérées dans une table `inventory (user_id, item, quantity)`.

| Item | Clé | Usage |
|------|-----|-------|
| Eau | `water` | Abreuver le poussin (niveau 2) |
| Farine | `flour` | Nourrir le poussin (niveau 2) |

---

## Ressources de départ

À l'inscription :
- **120 PO**
- **20 eau** et **20 farine** (suffisant pour plusieurs jours si le joueur est régulier)

---

## Ce qui reste identique au jeu original

- **Incubation** (48h, soins humidité/chaleur/retournement)
- **3 jours** pour passer du niveau 2 au niveau 3
- **Niveaux 3–9** : voir `GAMEPLAY.md` (pas encore implémenté)
- **Rangs XP** : `GAMEPLAY.md`, utilisés à partir du niveau 4
- **Mini-jeux**, **combats**, **clans**, **métiers** : voir `GAMEPLAY.md`
