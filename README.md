<div align="center">
  <img src="public/favicon.svg" alt="AnalyticaTech Logo" width="80" height="80" />
  
  <h1 align="center">AnalyticaTech</h1>
  
  <p align="center">
    <strong>Cabinet de Conseil en Intelligence Artificielle & Data Science</strong>
    <br />
    <em>Transformez vos données en avantage compétitif</em>
  </p>
  
  <p align="center">
    <a href="#-technologies">Technologies</a> •
    <a href="#-installation">Installation</a> •
    <a href="#-structure">Structure</a> •
    <a href="#-fonctionnalités">Fonctionnalités</a> •
    <a href="#-sécurité">Sécurité</a>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Supabase-Latest-3FCF8E?logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/Lighthouse-95+-green" alt="Lighthouse" />
  </p>
</div>

---

## 📋 À propos

**AnalyticaTech** est une application web moderne pour un cabinet de conseil spécialisé en :
- **Business Intelligence** : Tableaux de bord, KPIs, reporting automatisé
- **Hyper-Automatisation** : Workflows n8n, intégrations IA
- **Data Engineering** : Pipelines de données, architecture data
- **Développement Sur-Mesure** : Solutions personnalisées

### 🎯 Objectifs

- Lighthouse Score > 95 (Performance, Accessibility, Best Practices, SEO)
- Temps de chargement < 2s
- Architecture modulaire et scalable
- Support multilingue (FR/EN)

---

## 🛠 Technologies

### Frontend
| Technologie | Version | Usage |
|------------|---------|-------|
| React | 18.3 | Framework UI |
| TypeScript | 5.5 | Typage statique |
| Vite | Latest | Build tool |
| Tailwind CSS | 3.4 | Styling |
| Framer Motion | 11.x | Animations |
| React Router | 6.x | Routing |
| Lucide React | Latest | Icons |

### Backend & Services
| Service | Usage |
|---------|-------|
| Supabase | Base de données, Auth, Storage |
| Vercel | Hébergement & Edge Functions |

### Outils de développement
- **ESLint** : Linting avec règles strictes
- **Vitest** : Tests unitaires
- **Playwright** : Tests E2E

---

## 🚀 Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Supabase (optionnel pour les données dynamiques)

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/analyticatech.git
cd analyticatech
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration environnement**
```bash
cp .env.example .env.local
```

Configurer les variables dans `.env.local` :
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Lancer en développement**
```bash
npm run dev
```

L'application est accessible sur `http://localhost:3000`

5. **Build production**
```bash
npm run build
npm run preview
```

---

## 📁 Structure

```
analyticatech/
├── api/                    # API endpoints (Vercel Functions)
│   └── contact.ts          # Formulaire de contact
├── components/
│   ├── Layout/             # Layout components
│   │   ├── Navbar.tsx      # Navigation principale
│   │   └── Footer.tsx      # Pied de page
│   ├── System/             # Système global
│   │   ├── AnalyticsProvider.tsx
│   │   ├── I18nProvider.tsx
│   │   └── ErrorBoundary.tsx
│   ├── UI/                 # Composants réutilisables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   └── Visuals/            # Composants visuels
│       ├── FluidCursor.tsx
│       └── ImmersiveBackground.tsx
├── config/                 # Configuration
├── data/                   # Données statiques
├── hooks/                  # React hooks personnalisés
├── lib/                    # Librairies et utils
├── pages/                  # Pages de l'application
│   ├── Home.tsx
│   ├── Services.tsx
│   ├── ServiceDetail.tsx
│   ├── Solutions.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   └── ...
├── public/                 # Assets statiques
├── services/               # Services (data fetching)
├── types/                  # Types TypeScript
├── utils/                  # Utilitaires
└── supabase/               # Scripts SQL Supabase
```

---

## ✨ Fonctionnalités

### Pages
- **Accueil** : Hero animé, services, cas clients, témoignages
- **Services** : Catalogue avec scroll horizontal immersif
- **Solutions** : Produits packagés IA
- **Intelligence Hub** : Bibliothèque de prompts et workflows
- **À propos** : Équipe, histoire, valeurs
- **Contact** : Formulaire sécurisé avec Proof of Work

### Fonctionnalités techniques
- 🌍 **i18n** : Support FR/EN avec traductions dynamiques
- 🎨 **Thème** : Mode clair/sombre avec transition fluide
- 📱 **Responsive** : Mobile-first, optimisé tous écrans
- ⚡ **Performance** : Lazy loading, code splitting, caching
- 🔒 **Sécurité** : CSP, sanitization, rate limiting

---

## 🔒 Sécurité

### Mesures implémentées

1. **Content Security Policy (CSP)**
   - Headers restrictifs dans `vercel.json`
   - Protection XSS et injection

2. **Protection des formulaires**
   - Proof of Work (PoW) anti-bot
   - Rate limiting côté client
   - Sanitization des inputs (XSS defense)
   - Validation Zod côté client et serveur

3. **Headers de sécurité**
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - Permissions-Policy restrictif

---

## 📊 Performance

### Optimisations Lighthouse

- **Code Splitting** : Chunks séparés (vendor, animation, 3D)
- **Tree Shaking** : Suppression du code mort
- **Lazy Loading** : Images et composants à la demande
- **Preloading** : Fonts et ressources critiques
- **Caching** : Stratégie stale-while-revalidate

### Scores cibles
| Métrique | Cible |
|----------|-------|
| Performance | > 95 |
| Accessibility | > 95 |
| Best Practices | > 95 |
| SEO | > 95 |

---

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 🚢 Déploiement

### Vercel (recommandé)

1. Connecter le repo GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement sur push

```bash
vercel --prod
```

### Variables d'environnement requises

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run preview` | Prévisualiser le build |
| `npm run lint` | Linter ESLint |
| `npm run test` | Tests unitaires |
| `npm run test:e2e` | Tests E2E Playwright |

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est propriétaire. Tous droits réservés © 2025 AnalyticaTech SAS.

---

## 📧 Contact

- **Email** : contact@analyticatech.fr
- **Adresse** : 1 rue François 1er, 75008 Paris
- **Site** : [analyticatech.fr](https://analyticatech.fr)

---

<div align="center">
  <p>
    <strong>AnalyticaTech</strong> • Votre partenaire Data & IA
  </p>
  <p>
    <a href="https://github.com/analyticatech">GitHub</a> •
    <a href="https://linkedin.com/company/analyticatech">LinkedIn</a> •
    <a href="https://twitter.com/analyticatech">Twitter</a>
  </p>
</div>