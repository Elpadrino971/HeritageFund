# HeritageFund - Requirements Document

## Original Problem Statement
Plateforme de crowdfunding pour préserver l'héritage familial en France. Les frais de succession sont parmi les plus élevés au monde (jusqu'à 45% en ligne directe, 60% pour les tiers). Les héritiers ont 6 mois pour payer et sont souvent forcés de vendre des biens familiaux.

**Solution**: Crowdfunding + Prêt participatif où les héritiers créent des campagnes avec leur histoire, demandent un prêt participatif avec intérêts attractifs (4-7%), garantie hypothécaire sur le bien hérité.

## Architecture Implemented

### Backend (FastAPI + MongoDB)
- **Authentication**: Google OAuth via Emergent Auth + JWT sessions
- **Calculateur de succession**: Calcul gratuit des droits selon le barème fiscal français
- **Campagnes**: CRUD complet (create, read, update, publish)
- **Investissements**: Création via Stripe, portfolio, statistiques
- **Notaire**: Dashboard validation, commissions
- **Paiements**: Stripe Checkout integration

### Frontend (React + Tailwind CSS)
- **Landing Page**: Hero, calculateur intégré, how it works, testimonials
- **Authentification**: Google OAuth, protected routes
- **Dashboard Héritier**: Mes campagnes, création wizard multi-étapes
- **Dashboard Investisseur**: Portfolio, graphiques, revenus attendus
- **Dashboard Notaire**: Validation campagnes, commissions
- **Theme**: Mode clair/sombre avec toggle

### Database Collections
- `users`: Profils utilisateurs
- `user_sessions`: Sessions OAuth
- `campaigns`: Campagnes de crowdfunding
- `investments`: Investissements des contributeurs
- `payment_transactions`: Historique des paiements Stripe

## Features Completed ✅
1. Calculateur de droits de succession (gratuit, sans auth)
2. Authentification Google OAuth + gestion sessions
3. Mode clair/sombre avec persistance
4. Landing page responsive avec design professionnel
5. Dashboard Héritier avec création de campagnes
6. Dashboard Investisseur avec portfolio
7. Dashboard Notaire avec validation
8. Intégration Stripe pour paiements
9. Page détail campagne avec investissement

## Next Action Items
1. **MongoDB Atlas**: Ajouter 0.0.0.0/0 dans Network Access pour autoriser le serveur
2. **Upload images**: Implémenter upload vers cloud storage (S3/Cloudinary)
3. **Notifications email**: Intégrer service email (SendGrid/Resend) pour alertes
4. **KYC**: Ajouter vérification identité pour conformité CIP
5. **Remboursements**: Système de gestion des échéances mensuelles
6. **Tableau de bord admin**: Panel administration plateforme
7. **SEO**: Meta tags, sitemap, structured data
8. **Analytics**: Intégrer tracking (Mixpanel/GA)

## Technical Notes
- MongoDB local utilisé en développement
- Pour production: configurer MongoDB Atlas avec IP whitelist
- Stripe en mode test (sk_test_emergent)
- Design guidelines suivis: Cormorant Garamond + Manrope fonts
