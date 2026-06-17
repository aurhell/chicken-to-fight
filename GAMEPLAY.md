# Chicken to Fight — Documentation Gameplay

> Jeu de navigateur français actif autour de 2005–2011, fermé depuis.  
> Site original : `chickentofight.com` / `new.chickentofight.com`  
> Genre : élevage virtuel + combat PvP + gestion économique

---

## Table des matières

1. [Présentation générale](#présentation-générale)
2. [Ressources de départ](#ressources-de-départ)
3. [Monnaie](#monnaie)
4. [Cycle de vie du poulet](#cycle-de-vie-du-poulet)
5. [Rangs XP](#rangs-xp)
6. [Niveaux et objectifs](#niveaux-et-objectifs)
7. [Stages du niveau 3](#stages-du-niveau-3)
8. [Métiers](#métiers)
9. [Entraînement et XP](#entraînement-et-xp)
10. [Système de combat](#système-de-combat)
11. [Héros (boss niveau 5)](#héros-boss-niveau-5)
12. [Boss final — Mimétis (niveau 7)](#boss-final--mimétis-niveau-7)
13. [Clans](#clans)
14. [Poules pondeuses](#poules-pondeuses)
15. [Banque](#banque)
16. [Shop — Catalogue des objets](#shop--catalogue-des-objets)
17. [Mini-jeux](#mini-jeux)
18. [Façons de gagner de l'argent](#façons-de-gagner-de-largent)
19. [Codes secrets](#codes-secrets)
20. [Interface — Sections disponibles](#interface--sections-disponibles)
21. [Inventaire et stockage](#inventaire-et-stockage)

---

## Présentation générale

Chicken to Fight est un jeu de navigateur multijoueur gratuit (avec options payantes) dans lequel chaque joueur incarne un **coach d'élevage de poulets de combat**. L'objectif est de faire progresser son poulet depuis l'œuf jusqu'au rang de champion, en le nourrissant, l'entraînant, le faisant travailler et le confrontant à d'autres joueurs.

Le jeu combine :
- **Simulation d'élevage** (soin de l'œuf, du poussin, alimentation, bonheur, fatigue)
- **Progression RPG** (XP, rangs, niveaux)
- **Gestion économique** (métier, poules pondeuses, commerce, banque)
- **PvP** (duels entre joueurs, combats de clans)
- **PvE** (héros et boss à vaincre)
- **Mini-jeux** (tombola, jackpot, roue de la fortune, etc.)

---

## Ressources de départ

À l'inscription, chaque nouveau joueur reçoit :
- **120 PO** (Poulets d'Or) comme capital de départ
- **Eau et farine** en quantité suffisante pour nourrir son premier poussin jusqu'au niveau 3

> **Conseil de début de partie :** n'adopter qu'un seul œuf au départ pour conserver ses ressources. Une fois le poulet suffisamment valorisé, le revendre pour financer le suivant. Ne pas s'encombrer trop vite de plusieurs poulets.

---

## Monnaie

| Symbole | Nom | Usage |
|---------|-----|-------|
| **PO** | Poulets d'Or (ou Pièces d'Or) | Monnaie principale du jeu |

---

## Cycle de vie du poulet

```
Œuf (48h d'incubation)
  → Poussin (niveau 2, automatique à 3 jours d'âge)
    → Poulet (niveau 3 : stages de formation)
      → Combattant (niveaux 4–7)
        → Retraité (niveau 8)
          → Immortel (niveau 9)
```

**Pendant l'incubation (niveau 1) :** retourner l'œuf, ajuster l'humidité et la chaleur pour améliorer la santé du futur poussin.

**Paramètres à gérer en permanence :**
- Faim / alimentation (eau, farine, graines)
- Bonheur
- Fatigue (se reset à 100 % chaque jour)
- Soif

---

## Rangs XP

Les rangs représentent la puissance de combat du poulet. Ils progressent avec l'XP accumulée.

| XP requis | Rang |
|-----------|------|
| 0 | Omelette pacifique |
| 300 | Freluquet pitoyable |
| 400 | Croquette de combat |
| 600 | Bec à claque |
| 800 | Fil de fer arrogant |
| 1 000 | Apprenti Fighter |
| 1 200 | Punching chicken |
| 1 400 | Bec téméraire |
| … | *(rangs intermédiaires non documentés)* |
| 10 000 | Champion du ring |
| 80 000 | Maître incontesté |

---

## Niveaux et objectifs

Le jeu compte **9 niveaux** (appelés aussi "stades de vie"). Chaque niveau a des conditions de passage spécifiques.

### Niveau 1 — L'Œuf
- Soigner l'œuf pendant 48 heures avant l'éclosion
- Régler humidité et chaleur

### Niveau 2 — Le Poussin
- Atteint automatiquement à 3 jours d'âge
- Le poussin découvre le monde
- L'alimentation affecte l'XP mais n'est pas obligatoire

### Niveau 3 — L'Adolescence
- Accomplir **6 objectifs minimum parmi 7** formations proposées
- On ne peut suivre qu'une formation à la fois
- Débouche sur le choix d'une profession rémunérée
- *(voir section [Stages du niveau 3](#stages-du-niveau-3))*

### Niveau 4 — L'Apprenti Fighter
**Conditions :**
- Atteindre le rang **Apprenti Fighter (1 000 XP)**
- Acquérir un équipement d'entraînement personnel (haltères, banc ou salle de fitness)
- Choisir un métier (permanent, non modifiable)
- Gérer la fatigue quotidienne

### Niveau 5 — Le Champion
**Conditions :**
- Atteindre le rang **Champion du ring (10 000 XP)**
- Vaincre **4 héros extraordinaires** en duels successifs
- *(voir section [Héros](#héros-boss-niveau-5))*

### Niveau 6 — Le Maître
**Conditions (4 conditions cumulatives) :**
1. Atteindre le rang **Maître incontesté (80 000 XP)**
2. Posséder un élevage de **100 poules pondeuses**
3. Être dans un **clan victorieux (20 victoires)**
4. Avoir un **placement bancaire supérieur à 10 000 PO**

### Niveau 7 — La Légende
**Conditions :**
- Vaincre **Mimétis 10 fois** en duels
- Répondre correctement à **5 énigmes**
- *(Mimétis fusionne les pouvoirs de deux héros simultanément)*

### Niveau 8 — La Retraite
- Le poulet prend sa retraite

### Niveau 9 — L'Immortalité
- Le poulet ne touche plus son salaire
- Reçoit en contrepartie une **rente équivalente à son ancien salaire**
- Dispensé d'alimentation et d'objectifs

---

## Stages du niveau 3

Le passage au niveau 4 exige de valider **6 stages sur 7** au cours du niveau 3. On ne peut en suivre qu'un à la fois.

| Stage | Durée |
|-------|-------|
| Suivre un stage de self-défense | 48 h |
| Se faire un look | 0 h |
| Suivre une formation dopage | 24 h |
| Apprendre des attaques | 12 h |
| Suivre des leçons de savoir-vivre | 48 h |
| Étudier l'histoire des grands Fighters | 24 h |
| Apprendre des ruses de combat | 48 h |

---

## Métiers

Débloqués au **niveau 4**. Le choix est **permanent** (impossible d'en changer ensuite). Les revenus sont versés quotidiennement en PO.

| Métier | Coût de formation (PO) | Gain journalier (PO) |
|--------|------------------------|----------------------|
| Ouvrier | 0 | 2 |
| Barman | 40 | 4 |
| Chimiste | 200 | 10 |
| Médecin | 500 | 20 |
| Détective | 1 200 | 30 |
| Businessman | 2 000 | 50 |
| Mafioso | 2 800 | 70 |
| Espion | 3 500 | 80 |

---

## Entraînement et XP

### Entraînement de boxe
- Durée : **30 minutes**
- Gain : **10 à 40 XP**
- Avantage : fatigue le poulet moins que les combats réels, tout en rapportant plus d'XP

### Équipements d'entraînement (achetables au Shop)
| Équipement | Prix (PO) | Bonus XP |
|------------|-----------|----------|
| Haltères | 32,1 | +30 XP/jour |
| Salle de fitness | 610 | +200 XP/jour |

### Potions d'expérience
| Objet | Prix (PO) | Gain XP |
|-------|-----------|---------|
| Milkshake | 9 | +10 XP |
| Potion magique | 140 | +100 XP |
| Potion céleste | 230 | +200 XP |
| Potion légendaire | 430 | +400 XP |

### Codes bonus XP
- `Let me feel better` → +2 XP par jour (permanent)

---

## Système de combat

### Combats PvP
- Le joueur défie un autre coach et ses poulets
- Chaque **victoire** rapporte **1 XP**
- La **fatigue** du poulet est un facteur à surveiller

### Types d'attaques
| Attaque | Prix (PO) | Notes |
|---------|-----------|-------|
| Attaque de base | — | Bec, griffes |
| Attaque Éclair | 27,3 | Attaque puissante |
| Attaque Céleste | 68,7 | Inflige plusieurs dégâts |
| Attaque Légendaire | 420 | Surpuissante, pour poulets expérimentés |
| Bazooka | Payant (audiotel) | Code : "Je vais te pulvériser" |

### Pilule dopante
- Prix : 30 PO
- Effet : +50 XP supplémentaires lors d'un combat

### Stimulants
- Prix : 27,1 PO
- Effet : réduit la fatigue (mais impact négatif sur soif et bonheur)

---

## Héros (boss niveau 5)

Pour passer du niveau 5 au niveau 6, il faut vaincre ces **4 héros extraordinaires** en duels successifs :

| Héros | Dégâts | Description |
|-------|--------|-------------|
| **Comte Dracula** | 10 | Venu de Transylvanie, se repaît du sang des poulets |
| **Poulet au Masque de Fer** | 15 | Élégant et mystérieux, maître de l'épée |
| **Poulerminator** | 20 | Mi-robot mi-poulet, frappe fort et encaisse facilement les coups |
| **Poulet-Garou** | 30 | Trouve sa vitalité à la pleine lune, terrorise Chickenland |

> **Astuce :** les affronter le soir les rend moins puissants.

---

## Boss final — Mimétis (niveau 7)

- **Capacité spéciale :** fusionne les pouvoirs de **2 héros simultanément**
- **Conditions de victoire :** le vaincre **10 fois** ET répondre correctement à **5 énigmes**

---

## Clans

Les combats de clan deviennent accessibles au **niveau 6**.

### Rôles
| Rôle | Permissions |
|------|-------------|
| **Fondateur** | Crée le clan, ajoute/retire des membres, demande des combats, choisit nom et photo, nomme les modérateurs, participe au forum |
| **Modérateur** | Mêmes droits que le fondateur, sauf choisir le nom (définitif) |
| **Membre** | Peut uniquement participer au forum du clan |

### Combats de clan
- Formats disponibles : 2v2, 3v3 et autres combinaisons
- Les statistiques de victoires sont affichées sur la page du clan

### Personnalisation
- Logo personnalisable (GIF ou JPG, max 50 Ko)
- Cri de clan
- Statistiques de victoires et combats

### Recrutement
- Par défaut, les joueurs sont exclus des clans
- Pour rejoindre un clan, le joueur doit activer son statut "ouvert au recrutement" (lampe verte)

---

## Poules pondeuses

Activité secondaire permettant de générer un revenu passif. Économiquement peu rentable selon les guides de l'époque.

| Élément | Coût (PO) |
|---------|-----------|
| Bâtiment (construction) | 300 |
| Agrandissement | 240 |
| Une poule | 70 |
| Boîte de 6 œufs (revente) | 10 |

> La condition "posséder 100 poules pondeuses" est requise pour passer au niveau 6.

---

## Banque

Le système bancaire permet de placer ses PO pour générer des intérêts. Les fonds sont bloqués pendant toute la durée du placement.

| Placement | Durée | Rendement | Exemple |
|-----------|-------|-----------|---------|
| ChickenAdopcheune | 10 jours | +10% | 1 000 PO → 1 100 PO |
| ChickenMuscuTec | 20 jours | +30% | 2 500 PO → 3 250 PO |

> Un placement bancaire supérieur à 10 000 PO est requis pour passer au niveau 6.

---

## Shop — Catalogue des objets

### Alimentation & bien-être
| Objet | Prix (PO) | Effet |
|-------|-----------|-------|
| Bac d'eau potable | 4,3 | Hydrate le poulet |
| Farine | 3,2 | Renforce le poulet |
| Graines comestibles | 5,35 | Nourrit le poulet |
| Bière | 4,7 | Désaltère le poulet |
| Friandises | 3,7 | Augmente le bonheur |

### Logement & bonheur
| Objet | Prix (PO) | Effet |
|-------|-----------|-------|
| Grande cage | 69 | Augmente le bonheur |
| Poulailler | 104 | Permet l'entraînement en plein air |
| Villa avec piscine | 860 | Augmente considérablement le bonheur |

### Entraînement & XP
| Objet | Prix (PO) | Effet |
|-------|-----------|-------|
| Haltères | 32,1 | +30 XP/jour |
| Salle de fitness | 610 | +200 XP/jour |
| Milkshake | 9 | +10 XP |
| Potion magique | 140 | +100 XP |
| Potion céleste | 230 | +200 XP |
| Potion légendaire | 430 | +400 XP |

### Combat
| Objet | Prix (PO) | Effet |
|-------|-----------|-------|
| Stimulants | 27,1 | Réduit la fatigue (malus soif/bonheur) |
| Pilule dopante | 30 | +50 XP supplémentaires en combat |
| Attaque Éclair | 27,3 | Attaque puissante |
| Attaque Céleste | 68,7 | Attaque multi-dégâts |
| Attaque Légendaire | 420 | Attaque surpuissante |

### Stockage
| Objet | Prix (PO) | Capacité |
|-------|-----------|----------|
| *(panier de base)* | — | 10 objets |
| Cabane de stockage | 147 | 25 objets |
| Entrepôt de stockage | 510 | 100 objets |

### Sécurité & actions sur les autres joueurs
| Objet | Prix (PO) | Effet |
|-------|-----------|-------|
| Alarme | 32 | Protège contre les vols dans le panier/cabane/entrepôt |
| Décret anti-adoption | 49 | Empêche un coach adverse d'adopter des œufs pendant 3 jours |
| Avis d'expulsion | 264 | Fait saisir un arc à un concurrent |
| Protection judiciaire | 120 | Protège contre les décrets pendant 15 jours |

### Communication
| Objet | Prix (PO) | Effet |
|-------|-----------|-------|
| Lot de 5 messages flash | 50 | Ajoute 5 messages flash |
| Lot de 10 messages flash | 98 | Ajoute 10 messages flash |

---

## Mini-jeux

Six jeux disponibles, accessibles depuis la section **Jeux** de l'interface.

### 1. Tambola (Tombola)
- Coût : 2 PO / ticket
- Maximum : 100 tickets par tirage (sur 999 numéros possibles)
- Tirage : hebdomadaire
- Gains : variables selon le nombre de tickets vendus

### 2. Grat'Chicken
- Accès : 2 parties gratuites par jour
- Mécanisme : trouver 3 poulets alignés (horizontalement ou verticalement) surlignés en vert néon
- Gain : 50 PO

### 3. Jackpot
- Accès : 2 lancers gratuits par jour
- Mécanisme : obtenir 3 têtes de poulets identiques
- Gain : 20 PO

### 4. Antre du Magicien
- Coût : 7 PO / carte
- Mécanisme : choisir parmi 4 cartes
- Gain : toujours une récompense (PO, XP, eau, milkshake, etc.)

### 5. Roue de la Fortune
- Accès : 2 lancers gratuits par jour
- Mécanisme : faire tourner la roue
- Gains : entre 1 et 500 PO

### 6. Paris sur combat
- Mise : entre 10 et 80 PO
- Mécanisme : parier sur l'un de deux combattants prédéfinis (**Pouletausorus** vs **KotkotKodaak**)
- Gain possible : mise × 2

---

## Façons de gagner de l'argent

1. **Vente de poulets** : élever un œuf, attendre qu'il prenne de la valeur, le revendre
2. **Métier** : revenu journalier en PO à partir du niveau 4
3. **Commerce entre coachs** : acheter bas, revendre haut
4. **Mini-jeux** : Grat'Chicken, roue de la fortune, jackpot (gratuits chaque jour)
5. **Tombola** : jusqu'à 100 numéros hebdomadaires
6. **Banque** : intérêts sur placement (10–30%)
7. **Poules pondeuses** : vente quotidienne d'œufs
8. **Aides audiotel** : appel téléphonique ou SMS payant contre des PO (système de monétisation de l'époque)

---

## Codes secrets

Les codes se saisissent dans une section dédiée du jeu. **Respecter la casse et l'orthographe exacte, sans point final.**

| Code | Effet | Notes |
|------|-------|-------|
| `Je vais te pulvériser` | Attaque Bazooka | Payant (audiotel) |
| `Let me feel better` | +2 XP par jour | Permanent |
| `Ayez pitié oh grand poulet` | +0,5 PO par jour | Permanent |
| `Aubergiste, une petite bière!` | 1 Bière | Usage unique |
| `Je meurs de faim` | Graines comestibles | Usage unique |
| `Je veux de belles chaussures rouges` | Chaussons rouges | Cosmétique |
| `Je veux de belles chaussures noires` | Chaussons noirs | Cosmétique |
| `Je veux de belles chaussures grises` | Chaussons gris | Cosmétique |
| `Je veux de belles chaussures oranges` | Chaussons oranges | Cosmétique |
| `Je veux de belles chaussures bleues` | Chaussons bleus | Cosmétique |
| `Je veux de belles chaussures jaunes` | Chaussons jaunes | Cosmétique |
| `Je veux de belles chaussures vertes` | Chaussons verts | Cosmétique |

> Des codes bonus cachés existent également dans le jeu.

---

## Interface — Sections disponibles

| Section | Rôle |
|---------|------|
| Infos du poulet | État de santé, XP, objectifs en cours |
| Panier | Gestion du stock d'objets |
| Adoption | Adopter des œufs |
| Shop | Acheter des objets |
| Combats | Proposer ou accepter des duels |
| Clan | Affichage et gestion du clan |
| Aides audiotel | Acheter des PO via SMS/appel |
| Banque | Placer de l'argent |
| Commerce entre coachs | Marché joueur-à-joueur |
| Espace vital | Lieu de vie du poulet et équipements installés |
| Entraînements de boxe | Sessions de 30 min pour gagner de l'XP |
| Gazette | Publier des histoires sur son poulet |
| Professionnels | Section joueurs avancés |
| Jeux | Mini-jeux |
| Historique | Journal du compte |
| Look | Personnalisation du poulet (crêtes, plumes, lunettes, etc.) |

---

## Inventaire et stockage

| Contenant | Capacité | Coût |
|-----------|----------|------|
| Panier (défaut) | 10 objets | Gratuit |
| Cabane de stockage | 25 objets | 147 PO |
| Entrepôt de stockage | 100 objets | 510 PO |

Une **Alarme** (32 PO) peut être achetée pour protéger le contenu de ces stockages contre les vols.

---

## Notes de reconstitution

Ce document est reconstitué à partir de sources secondaires (blogs, forums, annuaires de jeux) datant principalement de 2007–2011. Certaines mécaniques peuvent être incomplètes ou légèrement inexactes. Les zones d'incertitude identifiées :

- Formule exacte de calcul des dégâts en combat PvP
- Nombre complet de rangs XP entre 1 400 et 10 000
- Détail des énigmes de Mimétis
- Mécaniques exactes des stages du niveau 7
- Liste complète des objets cosmétiques (look du poulet)
- Fonctionnement détaillé du commerce entre coachs
- Conditions précises de la Gazette

---

*Sources : [chickentofightastuces.blogspot.com](http://chickentofightastuces.blogspot.com/), [chickentofightcodesetastuces.kazeo.com](https://chickentofightcodesetastuces.kazeo.com/), [jeux-pour-gagner-des-cadeaux.com](https://jeux-pour-gagner-des-cadeaux.com/chicken-to-fight/), [funornot.forumactif.com](https://funornot.forumactif.com/t32-chickentofight), [mantes-exotiques.forumactif.com](https://mantes-exotiques.forumactif.com/t454-chicken-to-fight)*
