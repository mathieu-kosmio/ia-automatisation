# Spécifications fonctionnelles & éditoriales
## Site web — Parcours IA Filière Bois (Kosmio × Xylofutur)

**Version 1.0 · Avril 2026**
**Auteur** : Mathieu Pesin (Kosmio)
**Cible de mise en ligne** : 30 avril 2026 (avant relances post-AG Xylofutur du 16 avril)

---

## 1. Contexte & objectifs

### 1.1 Contexte
Kosmio développe une offre d'accompagnement à l'intégration de l'IA et de l'automatisation à destination des entreprises de la filière bois. Cette offre est co-portée avec Xylofutur (pôle de compétitivité forêt-bois-papier) qui la diffuse à ses adhérents. Une présentation est prévue à l'AG Xylofutur du 16 avril 2026 ; le site web est l'outil de conversion qui prend le relais de la plaquette papier.

### 1.2 Objectifs business
1. **Générer des demandes de séances découverte** (formation 1 jour) — **objectif : 8 inscriptions / mois**
2. **Générer des demandes de diagnostic** (3 500 € HT) — **objectif : 2 diagnostics signés / mois**
3. **Crédibiliser l'offre Kosmio** auprès des adhérents Xylofutur (preuve de sérieux, de spécialisation filière, de méthode)
4. **Capitaliser** sur le contenu (RETEX, cas d'usage) pour nourrir la prescription Xylofutur dans le temps

### 1.3 KPIs
| Métrique | Cible 3 mois | Outil de mesure |
|---|---|---|
| Visites uniques / mois | 800 | Plausible / Matomo |
| Taux de conversion formulaire | 4 % | Plausible |
| Demandes de diagnostic / mois | 2 | CRM (Notion + Tally) |
| Inscriptions formation / mois | 8 | CRM |
| Temps moyen sur la page offre | > 1 min 30 | Plausible |
| Provenance Xylofutur | > 30 % | UTM trackés |

---

## 2. Personae

### 2.1 Persona principal — « Le dirigeant occupé »
- **Nom de code** : Bernard, 52 ans
- **Rôle** : Dirigeant d'une scierie / négoce / entreprise de seconde transformation, 15 à 80 salariés
- **Maturité IA** : ≤ 2 sur 5. A entendu parler de ChatGPT, est curieux mais débordé. Pas de DSI.
- **Douleur** : « Tout le monde me parle d'IA mais je ne sais pas par où commencer, et je n'ai ni le temps ni l'envie de me faire vendre une usine à gaz. »
- **Déclencheur d'achat** : un pair de la filière qui raconte un gain concret + un cadre rassurant (Xylofutur)
- **Objection clé** : « C'est trop tôt, je verrai dans 6 mois »

### 2.2 Persona secondaire — « Le responsable amélioration continue / qualité »
- **Nom de code** : Sophie, 38 ans
- **Rôle** : Responsable qualité / méthodes / RH dans une ETI bois
- **Maturité IA** : 3 sur 5. Utilise déjà ChatGPT à titre perso, cherche à structurer
- **Douleur** : « J'ai besoin d'un cadre pour expérimenter sans casser, et de convaincre ma direction »
- **Déclencheur** : une formation 1 jour pour outiller son discours interne
- **Objection clé** : « Est-ce vraiment adapté à notre métier ou c'est du générique ? »

---

## 3. Architecture de l'information

### 3.1 Sitemap (v1)
```
Accueil (/)
├─ Offre (/offre)
│   ├─ #niveau-1-decouvrir
│   ├─ #niveau-2-diagnostiquer
│   └─ #niveau-3-deployer
├─ Méthode (/methode)
├─ Cas d'usage filière bois (/cas-d-usage)
├─ Tarifs & financement (/tarifs)
├─ À propos (/a-propos)
│   ├─ #kosmio
│   └─ #xylofutur
├─ Ressources (/ressources)
│   └─ Articles & RETEX (/ressources/[slug])
├─ Contact (/contact)
└─ Mentions légales / CGV / Confidentialité
```

### 3.2 Navigation principale
- **Header** : Offre · Méthode · Cas d'usage · Tarifs · Contact
- **CTA permanent** : « Réserver un échange » (ouvre modal de prise de RDV Cal.com)
- **Footer** : Sitemap complet + co-branding Kosmio / Xylofutur + mentions

### 3.3 Hiérarchie des pages (priorité d'effort)
1. **P0 — Critique pour le lancement** : Accueil, Offre, Tarifs, Contact, Mentions
2. **P1 — Important** : Méthode, À propos, 3 cas d'usage minimum
3. **P2 — Enrichissement post-lancement** : Ressources / blog, formulaire d'autodiagnostic en ligne

---

## 4. Spécifications par page

### 4.1 Page d'accueil

#### Structure (top → bottom)

**Section 1 — HERO (fond anthracite)**
- Eyebrow : `KOSMIO ✕ XYLOFUTUR · PARCOURS IA FILIÈRE BOIS`
- Titre display-1 : « L'IA dans vos *ateliers*. » (« ateliers » en italique vert)
- Lead : « Un parcours conçu pour les entreprises de la filière bois qui veulent comprendre, expérimenter et déployer l'intelligence artificielle — sans jargon, à leur rythme, avec un ROI mesurable. »
- 2 CTAs : **primary** « Découvrir l'offre » (scroll vers section 3) · **secondary** « Réserver un échange » (modal Cal.com)
- Mention bas de hero : « Co-construit avec Xylofutur · Tarifs préférentiels adhérents »

**Section 2 — POURQUOI MAINTENANT (fond crème)**
- Eyebrow : `LE CONTEXTE`
- H1 : « L'IA passe du buzz à l'avantage compétitif. »
- 3 cartes Stat :
  - **+30 %** de productivité documentée sur les tâches administratives et de devis quand l'IA générative est intégrée aux process
  - **6 mois** c'est le temps moyen pour qu'une PME de la filière bois passe d'un premier cas d'usage à un déploiement structuré
  - **8 leviers** d'intégration à activer pour transformer une expérimentation isolée en transformation durable
- Lien texte : « Voir les sources et la méthode → »

**Section 3 — L'OFFRE EN 3 NIVEAUX (fond blanc)**
- Eyebrow : `L'OFFRE EN UN COUP D'ŒIL`
- H1 : « Trois portes d'entrée. Un parcours cohérent. »
- Lead : « Selon votre maturité, choisissez le point d'entrée qui vous convient. Vous pouvez aussi enchaîner les niveaux. »
- 3 cartes Niveau côte à côte (composant `level-card`)
  - **01 Découvrir** — Formation 1 jour — 890 € HT — sage Kosmio
  - **02 Diagnostiquer** — Diagnostic + roadmap — 3 500 € HT — vert Xylofutur
  - **03 Déployer** — Accompagnement continu — dès 950 € / mois — or/bois
- CTA : « Voir le détail de chaque niveau → » vers `/offre`

**Section 4 — POUR QUI (fond crème)**
- 2 colonnes :
  - Texte gauche : H2 « Pensé pour la filière bois, pas pour la tech. » + paragraphe de positionnement (60-80 mots)
  - Photo droite : ouvrier en atelier bois (4:5 portrait, traitement chaud)
- Liste à puces flèche :
  - Scieries et 1re transformation
  - Négoces et distribution
  - 2e transformation et menuiseries industrielles
  - Bureaux d'études et architectes bois
  - Coopératives forestières

**Section 5 — LA MÉTHODE EN 4 ÉTAPES (fond blanc)**
- Eyebrow : `NOTRE MÉTHODE`
- H1 : « Une approche en 4 temps, pensée pour ne casser ni votre quotidien, ni votre budget. »
- 4 cartes en ligne, numérotées 01-04 :
  1. **Comprendre** — autodiagnostic + cadrage
  2. **Cibler** — séance sur site + cartographie des cas d'usage
  3. **Tester** — sprint MVP sur 1 cas d'usage prioritaire
  4. **Déployer** — accompagnement, équipe pilote, mesure d'impact

**Section 6 — TÉMOIGNAGE (fond crème)**
- Quote XXL d'un dirigeant filière bois (à recueillir)
- Photo carrée à droite, attribution + logo entreprise

**Section 7 — TARIFS RÉSUMÉ (fond blanc)**
- Eyebrow : `TARIFS`
- H1 : « Trois engagements. Trois budgets. »
- Tableau comparatif 3 colonnes (composant `comparison-table`)
- CTA : « Voir le détail des tarifs et financements → » vers `/tarifs`

**Section 8 — FAQ (fond crème)**
- 6 questions accordéon :
  1. À quoi sert le diagnostic concrètement ?
  2. Faut-il déjà utiliser ChatGPT pour démarrer ?
  3. Mon entreprise est petite (<10 salariés), est-ce pour moi ?
  4. Quels financements sont mobilisables ?
  5. En combien de temps voit-on les premiers résultats ?
  6. Quelle est la différence entre Kosmio et un cabinet de conseil classique ?

**Section 9 — CONTACT / CTA FINAL (fond anthracite)**
- Eyebrow vert : `ET APRÈS ?`
- Display-1 : « Parlons-en. »
- 2 cartes contact (Kosmio + Xylofutur) avec coordonnées
- CTA primary : « Réserver 30 minutes »

**Section 10 — FOOTER**
- 4 colonnes : Logos · Offre · Ressources · Contact
- Mention bas : copyright + mentions + RGPD

### 4.2 Page Offre (`/offre`)

Une page longue avec ancre par niveau. Pour chaque niveau, une section pleine largeur reprenant le composant `level-card` enrichi :
- Numéral XXL à gauche (fond couleur niveau, texte blanc)
- Contenu structuré à droite : Pour qui · Objectifs · Programme · Format · Livrables · Bénéfices attendus
- Bandeau prix + CTA niveau « Réserver / Demander un devis »
- Encart « Tarif adhérent Xylofutur » en `--xf-gold-50` avec icône étoile

**Sections additionnelles :**
- Comparatif entre les 3 niveaux (tableau)
- FAQ contextuelle (3 questions par niveau)
- CTA contact final

### 4.3 Page Méthode (`/methode`)

Page éditoriale longue (style article), structure :
1. Intro : « Pourquoi une méthode ? »
2. Les 8 leviers d'intégration IA (cartes 2x4 grid)
3. Les 4 couches de valeur IA (Automatiser · Détecter · Prédire · Enrichir la décision) — schéma central
4. Notre posture : « Stratège, pas vendeur d'outils »
5. CTA : « Demander notre note méthodologique »

### 4.4 Page Cas d'usage (`/cas-d-usage`)

Grille filtrable de cas d'usage par :
- Métier (scierie, négoce, 2e transfo, BE)
- Fonction (commercial, administratif, production, qualité, RH)
- Maturité requise (faible / moyenne / forte)

Chaque cas d'usage : carte avec icône, titre, 1 ligne de description, niveau d'effort, gain estimé. Click → page détail (P2).

**Cas d'usage minimum à publier au lancement (5)** :
1. Génération automatique de devis à partir d'une demande client mail
2. Synthèse hebdomadaire automatique des indicateurs de production
3. Réponse assistée aux appels d'offres publics filière bois
4. Documentation automatique des procédures qualité
5. Veille marché bois automatisée

### 4.5 Page Tarifs (`/tarifs`)

- Tableau comparatif détaillé des 3 niveaux
- Section « Financements mobilisables » : OPCO, France Travail, crédit d'impôt formation, aides régionales Nouvelle-Aquitaine
- Section « Tarifs adhérents Xylofutur » avec encart visuel
- FAQ tarifs (4 questions)
- CTA double : « Réserver formation » + « Demander un devis diagnostic »

### 4.6 Page Contact (`/contact`)

- Formulaire principal (Tally embed ou natif) :
  - Nom *
  - Email *
  - Entreprise *
  - Métier (select : scierie / négoce / 2e transfo / BE / autre)
  - Effectif (select)
  - Vous êtes adhérent Xylofutur ? (toggle)
  - Niveau d'intérêt (cases à cocher : formation / diagnostic / accompagnement / autre)
  - Message
  - Consentement RGPD *
- Coordonnées directes : email, téléphone, LinkedIn
- Carte intégrée (région d'intervention : Nouvelle-Aquitaine et national)
- Lien Cal.com pour prise de RDV directe

---

## 5. Spécifications techniques

### 5.1 Stack recommandée
- **Framework** : Astro 4 (statique, ultra-rapide, idéal pour un site éditorial)
- **Styling** : CSS variables (`tokens.css`) + CSS modules ou vanilla
- **CMS contenu éditorial** : MDX dans le repo (cas d'usage, articles)
- **Formulaire** : Tally embed (no-code, RGPD-compliant, gratuit)
- **Prise de RDV** : Cal.com self-hosted ou cloud
- **Hébergement** : Netlify ou Vercel (déploiement continu sur push Git)
- **Domaine** : `parcours-ia-bois.fr` ou sous-domaine `ia.kosm.io`
- **Analytics** : Plausible (RGPD-friendly, sans bandeau cookies)

### 5.2 Performance
- Lighthouse Performance ≥ 95 sur mobile
- LCP < 2.0 s
- CLS < 0.05
- FID < 100 ms
- Images en `.webp` avec fallback `.jpg`, lazy-load natif (`loading="lazy"`)
- Polices auto-hébergées avec `font-display: swap`

### 5.3 SEO
- Title et meta description par page (max 60 / 155 caractères)
- Schema.org `Organization` + `Service` + `FAQPage`
- Sitemap.xml généré automatiquement
- robots.txt
- Mots-clés cibles principaux :
  - « formation IA filière bois »
  - « diagnostic IA PME industrie »
  - « accompagnement IA scierie »
  - « IA générative bois »
- Mots-clés long tail dans les cas d'usage

### 5.4 Sécurité & RGPD
- HTTPS forcé
- Headers de sécurité (CSP, HSTS, X-Frame-Options)
- Bannière cookies inutile (Plausible sans cookies)
- Mentions légales + politique de confidentialité + CGV
- Formulaire avec double consentement RGPD
- DPO contact mentionné

### 5.5 Accessibilité
- Cible **WCAG 2.1 AA**
- Test avec axe DevTools sur chaque page avant mise en ligne
- Audit lecteur d'écran (VoiceOver Mac + NVDA Windows)
- Navigation clavier complète testée

### 5.6 Internationalisation
- v1 : français uniquement
- v2 (Q4 2026) : anglais possible si export envisagé

---

## 6. Plan de contenu à produire

### 6.1 Textes
| Élément | Volume | Statut | Owner |
|---|---|---|---|
| Hero accueil | 80 mots | À écrire | Mathieu |
| Pour qui (texte positionnement) | 80 mots | À écrire | Mathieu |
| Méthode 4 étapes | 200 mots | À écrire | Mathieu |
| 3 fiches niveau (P/O/Pgm/F/L) | 300 mots × 3 | Existant (à adapter du Word) | Mathieu |
| 5 cas d'usage filière | 200 mots × 5 | À écrire | Mathieu + ia-integration-coach |
| FAQ accueil (6 Q) | 100 mots × 6 | À écrire | Mathieu |
| Témoignage | citation 60 mots | À recueillir | Mathieu |
| Page méthode complète | 1500 mots | À écrire | Mathieu |

### 6.2 Visuels
| Élément | Format | Statut |
|---|---|---|
| Hero image (atelier bois) | 2400 × 1350 | À shooter ou banque d'image |
| 5 photos cas d'usage | 1200 × 1500 | À shooter / banque |
| Portrait Mathieu | 1200 × 1500 | Existant |
| Logo Xylofutur | SVG | À demander à Charlotte |
| Logo Kosmio | SVG | Existant |
| Schéma méthode 4 étapes | SVG natif | À designer |
| Schéma 8 leviers | SVG natif | À designer |

### 6.3 Documents téléchargeables (gated)
- Plaquette PDF (export du Word actuel)
- Note méthodologique « Les 8 leviers d'intégration IA »
- Grille d'autodiagnostic 20 questions

---

## 7. Roadmap d'exécution

### Sprint 1 — Structure & design (2 semaines)
- [ ] Init repo Astro + intégration `tokens.css`
- [ ] Composants de base : Button, EyebrowLabel, LevelCard, StatCard, Section, Footer, Header
- [ ] Page Accueil (sections 1 à 10) avec contenu lorem-ipsum-bois
- [ ] Setup déploiement Netlify

### Sprint 2 — Contenu & conversion (2 semaines)
- [ ] Rédaction des textes définitifs (Mathieu)
- [ ] Intégration formulaire Tally + Cal.com
- [ ] Pages Offre, Tarifs, Contact, Méthode
- [ ] 5 cas d'usage en MDX
- [ ] Tests d'accessibilité (axe + clavier + lecteur d'écran)

### Sprint 3 — Polish & lancement (1 semaine)
- [ ] Recueil témoignage + photo
- [ ] Audit Lighthouse, optimisation perf
- [ ] Configuration Plausible + UTM
- [ ] Mentions légales, CGV, politique confidentialité
- [ ] Recette finale avec Charlotte (Xylofutur)
- [ ] Mise en ligne

### Post-lancement — Capitalisation (continu)
- [ ] Publication d'1 RETEX par mois
- [ ] Mise à jour des cas d'usage
- [ ] Suivi mensuel des KPIs

---

## 8. Annexes

- `design-system/DESIGN_SYSTEM.md` — système de design complet
- `design-system/tokens.css` — variables CSS prêtes à intégrer
- Fichier source de l'offre Word et PPT : `/PerfIA/Kosmio_Xylofutur_Offre_IA_2026-04*.{docx,pptx}`

---

**Validation requise** : Mathieu (Kosmio) + Charlotte Perrier (Xylofutur)
**Prochaine étape** : valider le sitemap, lancer le sprint 1
