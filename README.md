# HeritageFund 🏛️

Plateforme de crowdfunding pour préserver l'héritage familial face aux droits de succession élevés en France.

## 🎯 Le Problème

Les héritiers français ont 6 mois pour payer des droits de succession pouvant atteindre 45% (ligne directe) à 60% (tiers). Sans liquidités, ils sont forcés de vendre leur patrimoine familial.

## 💡 Notre Solution

**HeritageFund** propose un modèle hybride de crowdfunding + prêt participatif sécurisé:

- **Pour les héritiers**: Levée de fonds avec storytelling émotionnel, garantie hypothécaire, remboursement flexible
- **Pour les investisseurs**: Rendement 4-7%, impact émotionnel fort, investissement sécurisé
- **Pour les notaires**: Outil SaaS, génération de leads, commissions sur référencements

## 🏗️ Architecture

Monorepo Turborepo avec:

```
heritagefund/
├── apps/
│   ├── mobile/          # React Native + Expo (iOS/Android)
│   └── web/             # Next.js 14 (App Router)
├── packages/
│   ├── shared/          # Types, utils, composants partagés
│   ├── ui/              # Design system
│   └── api-client/      # Client API
└── supabase/            # Backend (Postgres, Auth, Storage)
```

## 🚀 Stack Tech

- **Frontend**: React Native (Expo), Next.js 14, TypeScript
- **Backend**: Supabase (Postgres, Auth, Storage, Edge Functions)
- **Payments**: Mangopay (crowdlending compliant) / Stripe
- **UI**: TailwindCSS, shadcn/ui
- **State**: Zustand
- **Forms**: React Hook Form + Zod

## 📱 Features MVP

### Espace Héritiers
- ✅ Calculateur droits de succession
- ✅ Création campagne crowdfunding (photos, histoire, objectif)
- ✅ Dashboard levée temps réel
- ✅ Gestion remboursements automatiques

### Espace Investisseurs
- ✅ Browse campagnes (carte + filtres)
- ✅ Investir à partir de 50€
- ✅ Portfolio diversifié
- ✅ Revenus temps réel

### Espace Notaires (Premium)
- ✅ CRM dossiers clients
- ✅ Validation juridique
- ✅ Tracking commissions

## 🛠️ Développement

```bash
# Installation
npm install

# Dev mobile + web simultanés
npm run dev

# Mobile uniquement
npm run mobile

# Web uniquement
npm run web

# Build production
npm run build
```

## 🎯 Roadmap

**Q1 2026**: MVP + validation marché DOM-TOM (Guadeloupe/Guyane)
**Q2 2026**: 100 campagnes, agrément CIP (AMF)
**Q3 2026**: Expansion métropole, levée seed 500K€
**Q4 2026**: 1000 campagnes, lancement fonds HeritageFund LP

## 📊 Business Model

- **Commission plateforme**: 3-5% montant levé
- **Frais dossier**: 500-1000€
- **SaaS Notaires**: 99€/mois/cabinet
- **Services premium**: Vidéo pro, accompagnement juridique

## 📄 License

Proprietary - © 2026 HeritageFund SAS

---

**Fondateur**: Jean-Sébastien Elpadrino
**Contact**: contact@heritagefund.fr
**Mission**: Préserver le patrimoine familial, une succession à la fois.
