import { Link } from 'react-router-dom'
import { Calculator, Heart, TrendingUp, Shield, CheckCircle2, ArrowRight } from 'lucide-react'

export function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-light-bg to-light-bg-secondary dark:from-dark-bg to-dark-bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Préservez votre{' '}
              <span className="text-light-primary dark:text-dark-primary">
                héritage familial
              </span>
            </h1>
            <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-3xl mx-auto">
              Ne laissez pas les droits de succession vous forcer à vendre. Financez-les grâce au
              crowdfunding solidaire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/calculator"
                className="btn-primary inline-flex items-center justify-center"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculer mes droits
              </Link>
              <Link
                to="/campaigns"
                className="btn-secondary inline-flex items-center justify-center"
              >
                Explorer les campagnes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="card text-center">
              <div className="text-4xl font-bold text-light-primary dark:text-dark-primary mb-2">
                45%
              </div>
              <div className="text-light-text-secondary dark:text-dark-text-secondary">
                Droits de succession maximum
              </div>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-light-primary dark:text-dark-primary mb-2">
                6 mois
              </div>
              <div className="text-light-text-secondary dark:text-dark-text-secondary">
                Délai légal pour payer
              </div>
            </div>
            <div className="card text-center">
              <div className="text-4xl font-bold text-light-primary dark:text-dark-primary mb-2">
                50K+
              </div>
              <div className="text-light-text-secondary dark:text-dark-text-secondary">
                Familles concernées/an
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Le problème</h2>
            <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
              Des milliers de familles perdent leur patrimoine chaque année
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-light-accent/20 dark:bg-dark-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Droits exorbitants</h3>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">
                    Jusqu'à 45% en ligne directe, 60% pour les tiers. Une maison à 300K€ = 70K€ de
                    droits à payer.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-light-accent/20 dark:bg-dark-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⏰</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Délai court</h3>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">
                    Seulement 6 mois pour réunir les fonds. Pénalités de 0,20%/mois en cas de retard.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-light-accent/20 dark:bg-dark-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💸</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Solutions inadaptées</h3>
                  <p className="text-light-text-secondary dark:text-dark-text-secondary">
                    Crédit hypothécaire à 5,5% sur 25 ans + 8,5% de frais. Ou vente forcée avec 20-30%
                    de décote.
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-light-accent/10 to-light-accent/5 dark:from-dark-accent/10 dark:to-dark-accent/5 border-light-accent/20 dark:border-dark-accent/20">
              <h3 className="text-2xl font-bold mb-4">Exemple réel</h3>
              <div className="space-y-3">
                <p>
                  📍 Maison familiale Guadeloupe: <strong>300 000€</strong>
                </p>
                <p>
                  👨‍👩‍👧‍👦 Héritiers: 3 enfants (ligne directe)
                </p>
                <p>
                  💰 Droits à payer:{' '}
                  <strong className="text-light-accent dark:text-dark-accent">70 000€</strong>
                </p>
                <p>⏰ Délai: 6 mois maximum</p>
                <p className="pt-4 border-t border-light-border dark:border-dark-border">
                  ❌ Sans liquidités → <strong>Vente forcée</strong>
                </p>
                <p>
                  ✅ Avec HeritageFund →{' '}
                  <strong className="text-light-primary dark:text-dark-primary">
                    Patrimoine préservé
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 bg-light-bg-secondary dark:bg-dark-bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Notre solution</h2>
            <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
              Crowdfunding + Prêt participatif sécurisé
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <div className="w-14 h-14 bg-light-primary/20 dark:bg-dark-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-7 w-7 text-light-primary dark:text-dark-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pour les héritiers</h3>
              <ul className="space-y-2 text-light-text-secondary dark:text-dark-text-secondary">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-light-primary dark:text-dark-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Levée de fonds rapide (30-45 jours)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-light-primary dark:text-dark-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Taux attractif: 4-7% (vs 5,5% banque)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-light-primary dark:text-dark-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Remboursement flexible</span>
                </li>
              </ul>
            </div>

            <div className="card">
              <div className="w-14 h-14 bg-light-primary/20 dark:bg-dark-primary/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-7 w-7 text-light-primary dark:text-dark-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pour les investisseurs</h3>
              <ul className="space-y-2 text-light-text-secondary dark:text-dark-text-secondary">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-light-primary dark:text-dark-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Rendement 4-7% net</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-light-primary dark:text-dark-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Investissement à partir de 50€</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-light-primary dark:text-dark-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Garanti par hypothèque</span>
                </li>
              </ul>
            </div>

            <div className="card">
              <div className="w-14 h-14 bg-light-primary/20 dark:bg-dark-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-7 w-7 text-light-primary dark:text-dark-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pour les notaires</h3>
              <ul className="space-y-2 text-light-text-secondary dark:text-dark-text-secondary">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-light-primary dark:text-dark-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Solution clé en main pour clients</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-light-primary dark:text-dark-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Outil SaaS gratuit</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-light-primary dark:text-dark-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Commissions sur référencement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Prêt à sauver votre héritage ?</h2>
          <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary mb-8">
            Rejoignez les centaines de familles qui ont préservé leur patrimoine
          </p>
          <Link to="/calculator" className="btn-primary inline-flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            Calculer mes droits gratuitement
          </Link>
        </div>
      </section>
    </div>
  )
}
