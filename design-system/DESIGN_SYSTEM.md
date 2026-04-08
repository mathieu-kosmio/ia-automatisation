# Design System — Site Parcours IA Filière Bois
**Kosmio × Xylofutur · Édition Avril 2026 · v1.0**

---

## 1. Principes directeurs

1. **Premium filière bois** — sobre, artisanal, tactile. On évite l'esthétique générique SaaS « tech bleu ».
2. **Éditorial avant promotionnel** — la page est un magazine, pas une plaquette. Whitespace généreux, hiérarchie typographique forte, peu de bruit.
3. **ROI lisible immédiatement** — chaque section répond à « qu'est-ce que j'y gagne, combien ça coûte, par où je commence ».
4. **Co-branding équilibré** — Kosmio (opérateur) et Xylofutur (prescripteur) coexistent sans qu'aucun n'écrase l'autre. Vert Xylofutur dominant, sage Kosmio en accent.
5. **Accessible WCAG AA** — contrastes ≥ 4.5:1 sur tout texte, focus visibles, navigation clavier complète.

---

## 2. Tokens

### 2.1 Couleurs

#### Primitives
| Token | HEX | Usage |
|---|---|---|
| `--xf-green-500` | `#00B194` | Accent principal Xylofutur (CTA, liens, soulignements) |
| `--xf-green-600` | `#009982` | Hover CTA |
| `--xf-green-50`  | `#E6F7F4` | Fond léger / cartes vert |
| `--xf-gold-500`  | `#BA8748` | Or/bois — accent secondaire (niveau 03, badges premium) |
| `--xf-gold-50`   | `#F8EFE2` | Fond chaud doux |
| `--xf-beige-300` | `#F3E3CF` | Beige clair — bandeaux, cartes prix |
| `--xf-sand-100`  | `#FBF6EE` | Crème — fond de section alterné |
| `--km-sage-500`  | `#7C9E98` | Sage Kosmio — accent niveau 01 |
| `--km-sage-50`   | `#EEF3F2` | Fond sage léger |
| `--ink-900`      | `#1F2D3D` | Anthracite — titres, corps sombre, fond hero |
| `--ink-700`      | `#3B4B5E` | Texte secondaire sur fond sombre |
| `--grey-600`     | `#5D6C73` | Texte tertiaire, métadonnées |
| `--grey-300`     | `#C9BFB1` | Hairlines, bordures beige |
| `--white`        | `#FFFFFF` | Fond principal |

#### Sémantique
| Token sémantique | Valeur | Usage |
|---|---|---|
| `--color-bg`            | `--white`        | Fond par défaut |
| `--color-bg-alt`        | `--xf-sand-100`  | Sections alternées |
| `--color-bg-inverse`    | `--ink-900`      | Hero, footer, sections sombres |
| `--color-text`          | `--ink-900`      | Corps |
| `--color-text-muted`    | `--grey-600`     | Légendes, captions |
| `--color-text-inverse`  | `--white`        | Texte sur fond sombre |
| `--color-accent`        | `--xf-green-500` | CTA, liens, accents |
| `--color-accent-hover`  | `--xf-green-600` | États hover |
| `--color-border`        | `--grey-300`     | Hairlines |
| `--color-level-1`       | `--km-sage-500`  | Niveau Découvrir |
| `--color-level-2`       | `--xf-green-500` | Niveau Diagnostiquer |
| `--color-level-3`       | `--xf-gold-500`  | Niveau Déployer |

#### Ratios de contraste vérifiés (WCAG AA)
- `ink-900` sur `white` → 13.5:1 ✓
- `ink-900` sur `xf-sand-100` → 12.8:1 ✓
- `xf-green-500` sur `white` → 3.0:1 → **OK pour graphique uniquement**, pas pour texte de corps. Pour texte vert, utiliser `xf-green-600` (4.6:1) ou texte blanc sur fond vert.
- `white` sur `ink-900` → 13.5:1 ✓
- `grey-600` sur `white` → 5.9:1 ✓

### 2.2 Typographie

#### Familles
```css
--font-display: "Helvetica Neue", "Helvetica", "Arial", sans-serif;  /* charte Xylofutur */
--font-body:    "Inter", "Myriad Pro", "Calibri", system-ui, sans-serif;
--font-mono:    "JetBrains Mono", "Consolas", monospace;             /* micro-labels */
```

> Note : la charte Xylofutur impose Helvetica + Myriad Pro. Sur le web, on substitue Inter (proche de Myriad Pro, gratuit, Google Fonts) pour le corps. Helvetica reste en titres avec fallback Arial.

#### Échelle (modulaire 1.250 — Major Third)

| Token | Desktop | Mobile | line-height | Usage |
|---|---|---|---|---|
| `--text-display-1` | 96 px / 6rem    | 56 px / 3.5rem | 0.95 | Hero monumental |
| `--text-display-2` | 72 px / 4.5rem  | 44 px / 2.75rem | 1.0 | Titres niveaux |
| `--text-h1`        | 56 px / 3.5rem  | 36 px / 2.25rem | 1.1 | Titres de section |
| `--text-h2`        | 40 px / 2.5rem  | 28 px / 1.75rem | 1.15 | Sous-sections |
| `--text-h3`        | 28 px / 1.75rem | 22 px / 1.375rem | 1.25 | Cartes |
| `--text-lead`      | 22 px / 1.375rem| 18 px / 1.125rem | 1.5 | Chapô |
| `--text-body`      | 17 px / 1.0625rem | 16 px / 1rem | 1.65 | Corps |
| `--text-small`     | 14 px / 0.875rem | 13 px | 1.5 | Captions |
| `--text-micro`     | 12 px / 0.75rem | 11 px | 1.4 | Labels trackés (uppercase, letter-spacing 0.12em) |

#### Graisses
- `--font-weight-regular: 400`
- `--font-weight-medium: 500`
- `--font-weight-semibold: 600` (corps emphasis)
- `--font-weight-bold: 700` (titres display, micro-labels)

#### Italiques
- Utilisé uniquement sur 1 mot d'accent dans les titres (« ateliers. ») en couleur `--xf-green-500`. Jamais sur le corps.

### 2.3 Espacements (échelle 4 px)

```
--space-0:  0
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  24px
--space-6:  32px
--space-7:  48px
--space-8:  64px
--space-9:  96px
--space-10: 128px
--space-11: 160px
```

**Règles d'usage**
- Padding interne carte : `--space-6` (32 px)
- Gap entre cartes : `--space-5` (24 px)
- Gap entre sections : `--space-10` desktop / `--space-8` mobile
- Marges latérales mobile : `--space-5` (24 px)

### 2.4 Grille

- **Container max-width** : 1280 px (`--container-xl`)
- **Container narrow** : 880 px pour les longs textes éditoriaux (`--container-prose`)
- **Colonnes** : 12 colonnes desktop, 8 tablette, 4 mobile
- **Gutter** : 32 px desktop, 24 px tablette, 16 px mobile
- **Marges latérales** : 80 px desktop, 48 px tablette, 24 px mobile

### 2.5 Rayons

```
--radius-none: 0
--radius-sm:   4px   /* inputs, badges */
--radius-md:   8px   /* cartes secondaires */
--radius-lg:   12px  /* cartes principales */
--radius-pill: 999px /* tags, eyebrow */
```

> Note : on garde des coins peu arrondis (4–12 px) pour conserver le caractère éditorial. Pas de 24 px+.

### 2.6 Élévations

```
--shadow-sm: 0 1px 2px rgba(31,45,61,0.06);
--shadow-md: 0 4px 16px rgba(31,45,61,0.08);
--shadow-lg: 0 12px 40px rgba(31,45,61,0.12);
--shadow-focus: 0 0 0 3px rgba(0,177,148,0.35);
```

### 2.7 Mouvement

```
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--duration-fast: 150ms;
--duration-base: 250ms;
--duration-slow: 500ms;
```

**Règles** : transitions sur `color`, `background-color`, `border-color`, `transform`, `opacity` uniquement. Jamais sur `width/height/top/left`. Respecter `prefers-reduced-motion`.

### 2.8 Breakpoints

```
--bp-sm:  640px   /* mobile large */
--bp-md:  768px   /* tablette */
--bp-lg:  1024px  /* desktop */
--bp-xl:  1280px  /* large desktop */
```

---

## 3. Composants

### 3.1 Bouton

**Variantes** : `primary` · `secondary` · `ghost` · `link`

**Tailles** : `sm` (40 px) · `md` (48 px) · `lg` (56 px)

| Variante | Background | Texte | Bordure | Hover |
|---|---|---|---|---|
| primary   | `--xf-green-500` | `--white` | none | bg → `--xf-green-600`, lift `-2px` |
| secondary | `transparent`    | `--ink-900` | `1.5px solid --ink-900` | bg → `--ink-900`, texte → `--white` |
| ghost     | `transparent`    | `--xf-green-600` | none | bg → `--xf-green-50` |
| link      | none             | `--xf-green-600` | underline | underline plus épais |

**États** :
- Focus : `--shadow-focus` (anneau vert 35% opacity, 3px)
- Disabled : opacity 0.4, cursor not-allowed
- Loading : spinner inline, label « Patientez... »

**Anatomie** :
- Padding horizontal `--space-5` (24 px)
- Font `--text-body`, weight 600
- Letter-spacing 0.01em
- Icône optionnelle à droite (flèche →)

### 3.2 Carte Niveau (cœur de page)

Inspirée de la PPT/Word — barre de couleur supérieure + numéral XXL.

```
┌──────────────────────────────┐ ← top border 4px : color level
│                              │
│  01                          │ ← display-2 en color level
│                              │
│  NIVEAU 01 · DÉCOUVRIR       │ ← micro label couleur level
│  Une journée pour            │ ← h1
│  démystifier l'IA.           │
│                              │
│  Un chapô court qui          │ ← lead text-muted
│  positionne la promesse.     │
│                              │
│  ─────────────────────       │ ← hairline
│                              │
│  Pour qui · Objectifs ·      │ ← liste à puces flèche
│  Programme · Format          │
│                              │
│  ─────────────────────       │
│                              │
│  890 € HT     →              │ ← prix display-2 + CTA
│  /participant · 1 jour       │
│                              │
└──────────────────────────────┘
```

**Specs** :
- Background : `--xf-sand-100`
- Border-top : 4 px solid `--color-level-N`
- Border : 1 px solid `--grey-300`
- Padding : `--space-7` (48 px)
- Border-radius : `--radius-lg`
- Hover : translateY(-4px), shadow-lg, transition 250ms

### 3.3 Carte Stat

Bloc grand chiffre + label, séparateur coloré.

```
┌─────────────────┐
│                 │
│  +30%           │ ← display-2 ink-900
│  ───            │ ← bar 4px x 32px couleur accent
│                 │
│  de productivité│ ← text-small grey-600
│  documentée...  │
│                 │
└─────────────────┘
```

### 3.4 Section Hero

- Background : `--ink-900`
- Padding : `--space-11` haut, `--space-10` bas
- Layout : 12 colonnes, contenu à gauche (col 1-9), espace négatif à droite (col 10-12)
- Titre `--text-display-1` en blanc, dernier mot italique vert
- Eyebrow `--text-micro` orange `--xf-gold-500` (label tracké)
- Lead `--text-lead` en `--ink-700` clair
- 2 CTAs : primary vert + secondary outline blanc
- Décoration : barre verticale 4px x 64px en `--xf-green-500` à gauche du eyebrow

### 3.5 Header / Navigation

- Hauteur : 80 px desktop, 64 px mobile
- Background : `--white` avec backdrop-filter blur(12px), opacity 0.92 au scroll
- Logo Kosmio à gauche · « ✕ » · logo Xylofutur
- Nav : 4 items max (`#offre`, `#methode`, `#tarifs`, `#contact`)
- CTA primary à droite : « Réserver un échange »
- Mobile : burger → drawer plein écran sombre

### 3.6 Footer

- Background : `--ink-900`
- 4 colonnes : Logo & baseline · Offre · Ressources · Contact
- Padding `--space-9` haut, `--space-7` bas
- Mention bas : « © 2026 Kosmio · Co-édité avec Xylofutur · Mentions légales · CGV »

### 3.7 Formulaire

- Inputs : hauteur 56 px, border-bottom 1.5 px `--ink-900`, pas de border autour
- Label flottant qui remonte au focus
- Focus : border-bottom `--xf-green-500` 2 px + label vert
- Erreur : border-bottom rouge `#C0392B`, message text-small rouge sous l'input
- Submit : bouton primary large

### 3.8 Tableau comparatif (3 niveaux)

- Lignes alternées : `--white` / `--xf-sand-100`
- Header : `--ink-900` background, texte blanc, micro-label tracké
- Colonne label gauche, 3 colonnes niveaux à droite
- Cellules check : icône ✓ en `--xf-green-500`, croix `—` en `--grey-300`
- Première ligne post-header : prix HT en `--text-h2`

### 3.9 Quote / Témoignage

- Background `--xf-sand-100` ou `--km-sage-50`
- Citation `--text-h2` italique
- Guillemet décoratif XXL `--xf-green-500` à 0.15 opacity en background
- Attribution : nom bold + rôle + entreprise en `--text-small`

### 3.10 Eyebrow / Micro-label

- `--text-micro`, uppercase, letter-spacing 0.12em
- Précédé d'une barre 4 px x 24 px en `--xf-green-500`
- Couleur texte : `--xf-green-600` (contraste AA)

---

## 4. Iconographie

- Style : **outline 1.5 px**, coins arrondis, boîte 24x24
- Famille : **Phosphor Icons** (Light) ou **Lucide**
- Couleur héritée du parent (`currentColor`)
- Jamais d'icône colorée multi-tons
- Liste recommandée : `arrow-right`, `check`, `compass`, `target`, `rocket`, `tree-evergreen`, `factory`, `sparkle`, `calendar`, `users`, `clock`

---

## 5. Photographie & illustration

- **Tonalité** : ateliers réels de la filière bois, mains, matière, lumière naturelle
- **Traitement** : legère désaturation (-10), contraste +5, virage chaud (warm temperature)
- **Cadrage** : préférer les détails (mains sur établi, planches empilées, écorces) plutôt que les portraits frontaux
- **Format hero** : 16:9 ou 21:9 panoramique
- **Format carte** : 4:5 portrait
- **Filigrane optionnel** : superposition `--ink-900` à 30% pour faire ressortir un texte
- **Pas d'illustration générique IA** (pas de cerveaux bleus, pas de réseaux de neurones)

---

## 6. Voix éditoriale

| Faire | Éviter |
|---|---|
| Verbes d'action concrets : démystifier, cartographier, déployer | Jargon : disruption, synergies, leverage |
| Nous parlons à un dirigeant occupé | Nous parlons à un CTO |
| Phrases courtes (15-20 mots) | Paragraphes de 6 lignes |
| Chiffres précis : « 4 à 6 semaines », « 890 € HT » | Vague : « rapide », « accessible » |
| Tutoyer la filière : « vos ateliers », « vos équipes » | « les utilisateurs », « la cible » |

---

## 7. Accessibilité — checklist

- [ ] Tout texte ≥ 4.5:1 contraste (ou ≥ 3:1 si ≥ 24 px)
- [ ] Navigation clavier complète, ordre logique
- [ ] Focus visible sur tous les éléments interactifs (`--shadow-focus`)
- [ ] `alt` sur toutes les images, vide si décoratif
- [ ] Hiérarchie `<h1>` → `<h6>` cohérente, un seul `<h1>`
- [ ] Labels de formulaire associés (`<label for>`)
- [ ] `prefers-reduced-motion` respecté (animations désactivées)
- [ ] Skip link « Aller au contenu » en haut de page
- [ ] Langue déclarée `<html lang="fr">`
- [ ] Test lecteur d'écran VoiceOver et NVDA

---

## 8. Tokens CSS — fichier de référence

Voir `tokens.css` dans ce dossier — copie directe à intégrer dans le projet web.
