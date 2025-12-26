# HeritageFund 🏛️

Plateforme de crowdfunding pour préserver l'héritage familial face aux droits de succession élevés en France.

## 🎯 Le Problème

Les héritiers français ont 6 mois pour payer des droits de succession pouvant atteindre 45% (ligne directe) à 60% (tiers). Sans liquidités, ils sont forcés de vendre leur patrimoine familial.

## 💡 Notre Solution

**HeritageFund** propose un modèle hybride de crowdfunding + prêt participatif sécurisé:

- **Pour les héritiers**: Levée de fonds rapide (30-45j), taux 4-7%, storytelling émotionnel
- **Pour les investisseurs**: Rendement 4-7% net, investissement dès 50€, garanti par hypothèque
- **Pour les notaires**: Outil SaaS gratuit, commissions sur référencements

## 🏗️ Architecture

```
heritagefund/
├── frontend/            # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/    # Theme + Auth
│   │   └── services/    # API calls
│   └── package.json
├── backend/             # FastAPI + MongoDB
│   ├── app/
│   │   ├── models/      # User, Campaign, Investment
│   │   ├── routes/      # API endpoints
│   │   └── services/    # Auth, Succession calculator
│   └── requirements.txt
└── README.md
```

## 🚀 Stack Tech

- **Frontend**: React 18 + Vite + TypeScript + TailwindCSS
- **Backend**: FastAPI + MongoDB (Beanie ODM)
- **Auth**: Google OAuth + JWT
- **Payments**: Stripe (migration Mangopay prévue)
- **Theme**: Dark/Light mode avec Context
- **State**: Zustand
- **Forms**: React Hook Form + Axios

## 📱 Features MVP

### ✅ Implémenté

- **Calculateur succession** (gratuit, barèmes 2025)
- **Auth Google OAuth** + JWT
- **Dark/Light mode** avec toggle
- **Homepage** avec stats et value proposition
- **Backend API** complet (routes auth, campaigns, investments, calculator)
- **MongoDB models** (User, Campaign, Investment, Repayment)
- **Layout responsive** avec navigation

### 🚧 En cours / À compléter

- Campaigns browse + détails
- Création campagne (espace héritier)
- Investor dashboard
- Notary dashboard
- Stripe payment integration
- File upload (images campagnes)

## 🛠️ Installation & Lancement

### Prérequis

- **Node.js** >= 18.0.0
- **Python** >= 3.10
- **MongoDB** (local ou Atlas)
- **Google OAuth** Client ID (pour l'auth)

### 1. Installer les dépendances

```bash
# Root
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
pip install -r requirements.txt
```

### 2. Configuration

```bash
# Backend
cp backend/.env.example backend/.env
# Éditer backend/.env avec:
# - MONGODB_URL
# - SECRET_KEY (générer avec: openssl rand -hex 32)
# - GOOGLE_CLIENT_ID + SECRET

# Frontend
cp frontend/.env.example frontend/.env
# Éditer frontend/.env avec:
# - VITE_GOOGLE_CLIENT_ID
```

### 3. Lancer MongoDB

```bash
# Local
mongod

# Ou Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ou MongoDB Atlas (cloud gratuit)
# https://cloud.mongodb.com
```

### 4. Lancer l'application

```bash
# Option 1: Tout en parallèle (recommandé)
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs

# Option 2: Séparément
npm run dev:frontend  # Port 5173
npm run dev:backend   # Port 8000
```

## 🎨 Dark/Light Mode

Le thème s'adapte automatiquement:
- Préférence système détectée au chargement
- Toggle manuel dans le header
- Sauvegarde dans localStorage
- Transition smooth entre modes

## 🔐 Google OAuth Setup

1. **Google Cloud Console**: https://console.cloud.google.com
2. **Créer projet** → APIs & Services → Credentials
3. **OAuth 2.0 Client ID**:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5173`
4. **Copier Client ID** dans `.env`

## 📊 API Documentation

Backend FastAPI auto-documente toutes les routes:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Routes disponibles:

- `POST /api/v1/auth/google` - Login Google OAuth
- `GET /api/v1/users/me` - Current user
- `POST /api/v1/calculator/succession` - Calculate succession tax
- `GET /api/v1/campaigns` - List campaigns
- `POST /api/v1/campaigns` - Create campaign
- `POST /api/v1/investments` - Create investment

## 🎯 Roadmap

**Q1 2026**:
- ✅ MVP structure complete
- 🚧 Complete all dashboards
- 🚧 Stripe integration
- 🚧 First 10 beta users

**Q2 2026**:
- 100 campaigns
- Agrément CIP (AMF)
- Expansion Guadeloupe/Guyane

**Q3 2026**:
- Expansion métropole
- Levée seed 500K€

## 📊 Business Model

- **Commission plateforme**: 3-5% montant levé
- **Frais dossier**: 500-1000€
- **SaaS Notaires**: 99€/mois/cabinet
- **Revenus année 1**: 500K€ estimés

## 🤝 Contribution

Ce projet est en développement actif. Pour contribuer:

1. Fork le repo
2. Crée une branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvre une Pull Request

## 📄 License

Proprietary - © 2026 HeritageFund SAS

---

**Fondateur**: Jean-Sébastien Elpadrino
**Contact**: contact@heritagefund.fr
**Mission**: Préserver le patrimoine familial, une succession à la fois.
