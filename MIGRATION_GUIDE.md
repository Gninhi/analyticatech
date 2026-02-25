# 📦 MIGRATION GUIDE - Mise à jour des dépendances

## Changements appliqués

### Mises à jour PATCH/MINOR (sûres)
- @vercel/node: 5.6.6 → 5.6.7 ✅
- posthog-js: 1.352.0 → 1.353.1 ✅

### Mises à jour MAJEURES (nécessitent tests)
Les packages suivants nécessitent une attention particulière :

#### CRITIQUE
- **React 18 → 19**: Breaking changes potentiels
- **TypeScript ESLint 6 → 8**: Nouvelles règles
- **TailwindCSS 3 → 4**: Changements majeurs de config
- **Vite 5 → 7**: Breaking changes

#### IMPORTANT
- **Framer Motion 10 → 12**: API changes
- **React Router 6 → 7**: Breaking changes
- **Zod 3 → 4**: API changes
- **ESLint 8 → 10**: Configuration changes

#### MOYEN
- **Three.js 0.160 → 0.183**: Si utilisé
- **Lucide React**: Majeure mais compatible
- **Vitest 1 → 4**: Breaking changes tests

## Procédure de mise à jour

### Étape 1: Packages PATCH/MINOR
```bash
npm update
```

### Étape 2: React 18 → 19
```bash
npm install react@19 react-dom@19
npm install --save-dev @types/react@19 @types/react-dom@19
```

**Breaking changes à vérifier:**
- `forwardRef` → `ref` prop directe
- Nouveau comportement de batching
- Changements StrictMode

### Étape 3: React Router 6 → 7
```bash
npm install react-router-dom@7
```

**Breaking changes:**
- `useBlocker` API changes
- Changements dans le parsing des query params
- Nouveau comportement des loaders

### Étape 4: TypeScript ESLint 6 → 8
```bash
npm install --save-dev @typescript-eslint/eslint-plugin@8 @typescript-eslint/parser@8
```

**Configuration nécessaire:**
- Nouvelle configuration recommandée
- Règles renommées/supprimées

### Étape 5: TailwindCSS 3 → 4
```bash
npm install --save-dev tailwindcss@4
```

**⚠️ ATTENTION**: Tailwind v4 a une architecture complètement différente
- Plus de `tailwind.config.js`
- Configuration via CSS
- Plugins incompatibles

**Alternative**: Rester sur v3 si pas nécessaire

### Étape 6: Vite 5 → 7
```bash
npm install --save-dev vite@7 @vitejs/plugin-react@5
```

**Breaking changes:**
- API changes dans les plugins
- Nouvelle résolution des dépendances

## Tests à effectuer après chaque mise à jour

1. `npm run build` (doit passer)
2. `npm run lint` (doit passer)
3. `npm run test` (tous les tests doivent passer)
4. `npm run test:e2e` (tests E2E)
5. Vérifier manuellement les pages principales

## Rollback

Si problèmes, rollback avec:
```bash
git checkout package.json package-lock.json
npm install
```

## Recommandation

Mettre à jour par groupe:
1. **Semaine 1**: Patch/minor + React 19
2. **Semaine 2**: React Router 7 + TypeScript ESLint 8
3. **Semaine 3**: Vite 7 + Vitest 4
4. **Semaine 4**: Tailwind v4 (si nécessaire)

**Note**: Ne pas tout mettre à jour en une seule fois pour faciliter le debugging.
