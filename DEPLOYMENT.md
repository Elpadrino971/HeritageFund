# HeritageFund - Guide de déploiement

## 🚀 Stack technique

### Frontend
- **Mobile**: React Native + Expo (iOS, Android)
- **Web**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **State**: Zustand
- **Forms**: React Hook Form + Zod

### Backend
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: Mangopay (crowdlending compliant)

### Infrastructure
- **Hosting Web**: Vercel
- **Hosting Mobile**: Expo EAS
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + Mixpanel

---

## 📋 Prérequis

### Comptes nécessaires

1. **Supabase** (https://supabase.com)
   - Créer un projet
   - Noter: URL + anon key + service role key

2. **Vercel** (https://vercel.com)
   - Connecter le repository GitHub
   - Projet Next.js auto-détecté

3. **Expo** (https://expo.dev)
   - Créer un compte
   - Installer EAS CLI: `npm install -g eas-cli`

4. **Mangopay** (https://mangopay.com)
   - Demander compte sandbox
   - Puis compte production (nécessite KYC)

5. **Stripe** (Alternative) (https://stripe.com)
   - Compte test gratuit
   - Mode production après validation

---

## 🛠️ Installation locale

### 1. Cloner le repo

```bash
git clone https://github.com/Elpadrino971/HeritageFund.git
cd HeritageFund
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
# Copier les fichiers d'exemple
cp .env.example .env.local
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env

# Éditer avec vos valeurs
# apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Initialiser la base de données

```bash
# Se connecter à Supabase
npx supabase login

# Lier le projet local
npx supabase link --project-ref your-project-ref

# Appliquer les migrations
npx supabase db push

# Ou directement via SQL Editor sur Supabase Dashboard
# Copier/coller le contenu de supabase/migrations/20250101_initial_schema.sql
```

### 5. Lancer en développement

```bash
# Tout en parallèle (mobile + web)
npm run dev

# Ou séparément
npm run mobile  # Expo Metro Bundler sur :8081
npm run web     # Next.js sur :3000
```

---

## 🌐 Déploiement Web (Vercel)

### Configuration automatique

1. Connecter GitHub à Vercel
2. Importer le repository `HeritageFund`
3. Détecter Next.js automatiquement
4. Définir le root directory: `apps/web`

### Variables d'environnement Vercel

Ajouter dans Vercel Dashboard > Settings > Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=https://heritagefund.fr
MANGOPAY_CLIENT_ID=xxx
MANGOPAY_API_KEY=xxx
MANGOPAY_ENV=production
```

### Build settings

```
Root Directory: apps/web
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Déploiement

```bash
# Push sur main = déploiement auto
git push origin main

# Ou manuellement via CLI
cd apps/web
vercel --prod
```

---

## 📱 Déploiement Mobile (Expo EAS)

### 1. Configuration EAS

```bash
cd apps/mobile

# Login Expo
eas login

# Configurer le projet
eas build:configure
```

### 2. Variables d'environnement

Créer `apps/mobile/.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Build Android

```bash
# Build APK pour test
eas build --platform android --profile preview

# Build AAB pour Google Play
eas build --platform android --profile production
```

### 4. Build iOS

```bash
# Nécessite Apple Developer Account ($99/an)

# Build pour TestFlight
eas build --platform ios --profile preview

# Build pour App Store
eas build --platform ios --profile production
```

### 5. Publication

```bash
# Mise à jour OTA (Over-The-Air) sans rebuild
eas update --branch production --message "Fix bug payment"

# Les users recevront la MAJ au prochain lancement
```

---

## 🗄️ Base de données Supabase

### Migrations

```bash
# Créer une nouvelle migration
npx supabase migration new add_feature_x

# Appliquer localement
npx supabase db reset

# Pousser en production
npx supabase db push
```

### Backups

- Automatiques tous les jours (Supabase Pro)
- Export manuel: Dashboard > Database > Backups

### Row Level Security (RLS)

Toutes les tables ont RLS activé. Policies définies dans `supabase/migrations/20250101_initial_schema.sql`

---

## 💳 Paiements Mangopay

### Configuration Sandbox

1. Créer compte sur https://mangopay.com
2. Récupérer Client ID + API Key (mode Sandbox)
3. Configurer Webhook URL: `https://heritagefund.fr/api/webhooks/mangopay`

### Passage en Production

1. Compléter KYC entreprise (KBIS, RIB, etc.)
2. Obtenir agrément CIP auprès AMF
3. Activer mode Production
4. Mettre à jour `MANGOPAY_ENV=production`

### Tests en Sandbox

Cartes de test:
- **Succès**: 4970100000000154
- **Échec**: 4970100000000006

---

## 📊 Monitoring & Analytics

### Sentry (Erreurs)

```bash
npm install @sentry/nextjs @sentry/react-native

# Configurer Sentry
npx @sentry/wizard -i nextjs
npx @sentry/wizard -i reactNative
```

### Mixpanel (Analytics)

```typescript
// apps/web/lib/analytics.ts
import mixpanel from 'mixpanel-browser'

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!)

export const track = (event: string, properties?: any) => {
  mixpanel.track(event, properties)
}
```

---

## 🔐 Sécurité

### Checklist avant production

- [ ] RLS activé sur toutes les tables Supabase
- [ ] Variables d'environnement sécurisées (jamais commitées)
- [ ] Rate limiting sur API routes (Vercel Edge Middleware)
- [ ] Validation des inputs (Zod)
- [ ] HTTPS forcé partout
- [ ] CSP headers configurés
- [ ] KYC obligatoire pour investisseurs >1000€
- [ ] 2FA recommandé pour héritiers
- [ ] Logs d'audit pour transactions
- [ ] Backup automatique quotidien

### Headers de sécurité

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

---

## 🧪 Tests

### Tests unitaires

```bash
# Installer
npm install -D vitest @testing-library/react

# Lancer
npm run test
```

### Tests E2E

```bash
# Installer Playwright
npm install -D @playwright/test

# Lancer
npm run test:e2e
```

---

## 📈 Scaling

### Performance Web

- [ ] Images optimisées (Next.js Image)
- [ ] Lazy loading components
- [ ] CDN Vercel activé
- [ ] Cache API routes (SWR/React Query)
- [ ] ISR pour pages statiques

### Performance Mobile

- [ ] Code splitting (Expo Router)
- [ ] Images optimisées (expo-image)
- [ ] Hermes engine activé (Android)
- [ ] React.memo pour listes longues

---

## 🚨 Troubleshooting

### Erreur Supabase "JWT expired"

```typescript
// Refresh session automatiquement
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed')
  }
})
```

### Build Expo échoue

```bash
# Clear cache
rm -rf node_modules
npm install

# Clear Expo cache
npx expo start -c
```

### Next.js build timeout Vercel

```
# vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "maxDuration": 60
      }
    }
  ]
}
```

---

## 📞 Support

- **Documentation**: https://docs.heritagefund.fr
- **Email**: dev@heritagefund.fr
- **GitHub Issues**: https://github.com/Elpadrino971/HeritageFund/issues

---

**Prêt à déployer!** 🚀

Bon courage Jean-Sébastien! N'oublie pas de sauver ton patrimoine familial cette semaine 💪
