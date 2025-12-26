import Link from 'next/link'
import {
  Heart,
  Shield,
  TrendingUp,
  Calculator,
  Users,
  Building2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-secondary-dark">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl">🏛️</span>
              <span className="ml-2 text-xl font-bold text-white">
                HeritageFund
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/campaigns"
                className="text-gray-300 hover:text-white transition"
              >
                Campagnes
              </Link>
              <Link
                href="/calculator"
                className="text-gray-300 hover:text-white transition"
              >
                Calculateur
              </Link>
              <Link
                href="/how-it-works"
                className="text-gray-300 hover:text-white transition"
              >
                Comment ça marche
              </Link>
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="bg-primary text-secondary px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Préservez votre{' '}
              <span className="text-primary">héritage familial</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Ne laissez pas les droits de succession vous forcer à vendre.
              Financez-les grâce au crowdfunding solidaire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/calculator"
                className="bg-primary text-secondary px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-dark transition inline-flex items-center justify-center"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculer mes droits
              </Link>
              <Link
                href="/campaigns"
                className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary hover:text-secondary transition inline-flex items-center justify-center"
              >
                Explorer les campagnes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-secondary-light p-8 rounded-xl text-center">
              <div className="text-4xl font-bold text-primary mb-2">45%</div>
              <div className="text-gray-400">
                Droits de succession maximum
              </div>
            </div>
            <div className="bg-secondary-light p-8 rounded-xl text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                6 mois
              </div>
              <div className="text-gray-400">Délai légal pour payer</div>
            </div>
            <div className="bg-secondary-light p-8 rounded-xl text-center">
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-gray-400">Familles concernées/an</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-secondary-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Le problème
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Des milliers de familles perdent leur patrimoine chaque année
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent-light/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">⚠️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Droits exorbitants
                    </h3>
                    <p className="text-gray-400">
                      Jusqu'à 45% en ligne directe, 60% pour les tiers. Une
                      maison à 300K€ = 70K€ de droits à payer.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent-light/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">⏰</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Délai court
                    </h3>
                    <p className="text-gray-400">
                      Seulement 6 mois pour réunir les fonds. Pénalités de
                      0,20%/mois en cas de retard.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent-light/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💸</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Solutions inadaptées
                    </h3>
                    <p className="text-gray-400">
                      Crédit hypothécaire à 5,5% sur 25 ans + 8,5% de frais.
                      Ou vente forcée avec 20-30% de décote.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent-light/10 to-accent/10 p-8 rounded-2xl border border-accent/20">
              <h3 className="text-2xl font-bold text-white mb-4">
                Exemple réel
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>
                  📍 Maison familiale Guadeloupe: <strong>300 000€</strong>
                </p>
                <p>
                  👨‍👩‍👧‍👦 Héritiers: 3 enfants (ligne directe)
                </p>
                <p>
                  💰 Droits à payer: <strong className="text-accent-light">70 000€</strong>
                </p>
                <p>⏰ Délai: 6 mois maximum</p>
                <p className="pt-4 border-t border-accent/20">
                  ❌ Sans liquidités → <strong>Vente forcée</strong>
                </p>
                <p>
                  ✅ Avec HeritageFund →{' '}
                  <strong className="text-primary">
                    Patrimoine préservé
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Notre solution
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Crowdfunding + Prêt participatif sécurisé
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-secondary-light p-8 rounded-xl">
              <div className="w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Pour les héritiers
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Levée de fonds rapide (30-45 jours)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Taux attractif: 4-7% (vs 5,5% banque)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Remboursement flexible</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Storytelling émotionnel</span>
                </li>
              </ul>
            </div>

            <div className="bg-secondary-light p-8 rounded-xl">
              <div className="w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Pour les investisseurs
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Rendement 4-7% net</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Investissement à partir de 50€</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Garanti par hypothèque</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Impact social fort</span>
                </li>
              </ul>
            </div>

            <div className="bg-secondary-light p-8 rounded-xl">
              <div className="w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Pour les notaires
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Solution clé en main pour clients</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Outil SaaS gratuit</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Commissions sur référencement</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Fidélisation clients</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-secondary-light">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Comment ça marche
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                step: 1,
                title: 'Créez votre campagne',
                description:
                  'Racontez votre histoire, ajoutez des photos, définissez votre objectif',
              },
              {
                step: 2,
                title: 'Validation notariale',
                description:
                  'Votre notaire valide le dossier et la valeur du bien',
              },
              {
                step: 3,
                title: 'Collecte 30 jours',
                description:
                  'Les investisseurs soutiennent votre projet avec un rendement attractif',
              },
              {
                step: 4,
                title: 'Déblocage des fonds',
                description:
                  'Vous recevez les fonds et payez vos droits de succession',
              },
              {
                step: 5,
                title: 'Remboursement',
                description:
                  'Remboursement mensuel automatique sur 3-10 ans avec intérêts',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start bg-secondary p-6 rounded-xl"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-secondary font-bold text-xl">
                    {item.step}
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à sauver votre héritage ?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Rejoignez les centaines de familles qui ont préservé leur
            patrimoine
          </p>
          <Link
            href="/calculator"
            className="bg-primary text-secondary px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-dark transition inline-flex items-center"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Calculer mes droits gratuitement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-2xl">🏛️</span>
                <span className="ml-2 text-lg font-bold text-white">
                  HeritageFund
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Préservez votre patrimoine familial
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/campaigns">Campagnes</Link>
                </li>
                <li>
                  <Link href="/calculator">Calculateur</Link>
                </li>
                <li>
                  <Link href="/pricing">Tarifs</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Entreprise</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/about">À propos</Link>
                </li>
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
                <li>
                  <Link href="/press">Presse</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/terms">CGU</Link>
                </li>
                <li>
                  <Link href="/privacy">Confidentialité</Link>
                </li>
                <li>
                  <Link href="/legal">Mentions légales</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>
              © 2026 HeritageFund SAS • CIP agrément AMF en cours • Ne
              constitue pas un conseil en investissement
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
