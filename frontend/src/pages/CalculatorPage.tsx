import { useState } from 'react'
import { Calculator, AlertCircle, Info } from 'lucide-react'
import { calculatorApi } from '@/services/api'
import { formatCurrency, formatPercentage } from '@/utils/formatters'
import toast from 'react-hot-toast'

type RelationType = 'direct' | 'spouse' | 'siblings' | 'nephews' | 'other'

export function CalculatorPage() {
  const [assetValue, setAssetValue] = useState('')
  const [relation, setRelation] = useState<RelationType>('direct')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const relations: { value: RelationType; label: string }[] = [
    { value: 'direct', label: 'Enfant/Parent' },
    { value: 'spouse', label: 'Conjoint/PACS' },
    { value: 'siblings', label: 'Frère/Sœur' },
    { value: 'nephews', label: 'Neveu/Nièce' },
    { value: 'other', label: 'Autre' },
  ]

  const calculateTax = async () => {
    const value = parseFloat(assetValue.replace(/\s/g, ''))
    if (isNaN(value) || value <= 0) {
      toast.error('Veuillez entrer une valeur valide')
      return
    }

    setLoading(true)
    try {
      const response = await calculatorApi.calculateSuccession(value, relation)
      setResult(response.data)
    } catch (error) {
      toast.error('Erreur lors du calcul')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-light-primary/20 dark:bg-dark-primary/20 rounded-full mb-4">
            <Calculator className="h-8 w-8 text-light-primary dark:text-dark-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Calculateur de droits de succession</h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg">
            Estimez gratuitement le montant que vous devrez payer
          </p>
        </div>

        <div className="card mb-8">
          <div className="mb-6">
            <label className="block font-semibold mb-3">Valeur du bien hérité</label>
            <input
              type="text"
              placeholder="Ex: 300 000"
              value={assetValue}
              onChange={(e) => setAssetValue(e.target.value)}
              className="input w-full text-lg"
            />
          </div>

          <div className="mb-8">
            <label className="block font-semibold mb-3">Lien de parenté</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {relations.map((rel) => (
                <button
                  key={rel.value}
                  onClick={() => setRelation(rel.value)}
                  className={`px-4 py-3 rounded-lg border-2 transition ${
                    relation === rel.value
                      ? 'bg-light-primary dark:bg-dark-primary border-light-primary dark:border-dark-primary text-white font-semibold'
                      : 'bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border hover:border-light-text-secondary dark:hover:border-dark-text-secondary'
                  }`}
                >
                  {rel.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculateTax}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Calcul en cours...' : 'Calculer les droits'}
          </button>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="card">
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                  Valeur héritée
                </div>
                <div className="text-2xl font-bold">{formatCurrency(result.assetValue)}</div>
              </div>

              <div className="card">
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                  Abattement
                </div>
                <div className="text-2xl font-bold">- {formatCurrency(result.abatement)}</div>
              </div>

              <div className="card">
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                  Montant taxable
                </div>
                <div className="text-2xl font-bold">{formatCurrency(result.taxableAmount)}</div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-light-accent/20 to-light-accent/10 dark:from-dark-accent/20 dark:to-dark-accent/10 border-light-accent dark:border-dark-accent border-2">
              <div className="flex items-center justify-between mb-2">
                <div className="text-light-accent dark:text-dark-accent font-semibold text-lg">
                  💸 DROITS À PAYER
                </div>
                <div className="text-sm">
                  Taux effectif: {formatPercentage(result.effectiveRate)}
                </div>
              </div>
              <div className="text-5xl font-bold mb-4">{formatCurrency(result.taxAmount)}</div>
              <div className="flex items-center text-light-accent dark:text-dark-accent">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">À payer sous 6 mois après le décès</span>
              </div>
            </div>

            <div className="card bg-light-primary/10 dark:bg-dark-primary/10 border-light-primary dark:border-dark-primary">
              <h3 className="text-lg font-semibold text-light-primary dark:text-dark-primary mb-3">
                💡 Vous n'avez pas les liquidités ?
              </h3>
              <p className="mb-4">
                HeritageFund peut vous aider à lever ces fonds via crowdfunding en 30-45 jours, avec
                un taux de 4-7% (au lieu de 5,5% en banque).
              </p>
              <button className="btn-primary">Créer ma campagne →</button>
            </div>
          </div>
        )}

        <div className="card mt-12">
          <div className="flex items-start">
            <Info className="h-6 w-6 text-light-primary dark:text-dark-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-3">Bon à savoir</h3>
              <ul className="space-y-2 text-light-text-secondary dark:text-dark-text-secondary text-sm">
                <li>• Les abattements se renouvellent tous les 15 ans</li>
                <li>• Don avant 80 ans: +31 865€ exonérés (ligne directe)</li>
                <li>• Nue-propriété: réduction 40-50% de la valeur selon l'âge</li>
                <li>• Pénalités de retard: 0,20% par mois</li>
                <li>
                  • Délai de déclaration: 6 mois en France métropolitaine, 12 mois pour DOM-TOM
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
