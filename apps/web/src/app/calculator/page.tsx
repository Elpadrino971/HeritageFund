'use client'

import { useState } from 'react'
import { Calculator, AlertCircle, Info } from 'lucide-react'

type RelationType = 'direct' | 'spouse' | 'siblings' | 'nephews' | 'other'

interface CalculatorResult {
  assetValue: number
  taxableAmount: number
  taxAmount: number
  effectiveRate: number
}

const ABATEMENTS: Record<RelationType, number> = {
  direct: 100000,
  spouse: 80724,
  siblings: 15932,
  nephews: 7967,
  other: 1594,
}

const TAX_BRACKETS = {
  direct: [
    { limit: 8072, rate: 5 },
    { limit: 12109, rate: 10 },
    { limit: 15932, rate: 15 },
    { limit: 552324, rate: 20 },
    { limit: 902838, rate: 30 },
    { limit: 1805677, rate: 40 },
    { limit: Infinity, rate: 45 },
  ],
  siblings: [
    { limit: 24430, rate: 35 },
    { limit: Infinity, rate: 45 },
  ],
  other: [{ limit: Infinity, rate: 60 }],
}

export default function CalculatorPage() {
  const [assetValue, setAssetValue] = useState('')
  const [relation, setRelation] = useState<RelationType>('direct')
  const [result, setResult] = useState<CalculatorResult | null>(null)

  const calculateTax = () => {
    const value = parseFloat(assetValue.replace(/\s/g, ''))
    if (isNaN(value) || value <= 0) return

    const abatement = ABATEMENTS[relation]
    const taxableAmount = Math.max(0, value - abatement)

    let tax = 0
    let remaining = taxableAmount
    const brackets =
      relation === 'direct'
        ? TAX_BRACKETS.direct
        : relation === 'siblings'
        ? TAX_BRACKETS.siblings
        : TAX_BRACKETS.other

    let previousLimit = 0
    for (const bracket of brackets) {
      const bracketAmount = Math.min(remaining, bracket.limit - previousLimit)
      tax += bracketAmount * (bracket.rate / 100)
      remaining -= bracketAmount
      previousLimit = bracket.limit
      if (remaining <= 0) break
    }

    setResult({
      assetValue: value,
      taxableAmount,
      taxAmount: tax,
      effectiveRate: (tax / value) * 100,
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const relations: { value: RelationType; label: string }[] = [
    { value: 'direct', label: 'Enfant/Parent' },
    { value: 'spouse', label: 'Conjoint/PACS' },
    { value: 'siblings', label: 'Frère/Sœur' },
    { value: 'nephews', label: 'Neveu/Nièce' },
    { value: 'other', label: 'Autre' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-secondary-dark">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
            <Calculator className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Calculateur de droits de succession
          </h1>
          <p className="text-gray-400 text-lg">
            Estimez gratuitement le montant que vous devrez payer
          </p>
        </div>

        <div className="bg-secondary-light rounded-2xl p-8 mb-8">
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3">
              Valeur du bien hérité
            </label>
            <input
              type="text"
              placeholder="Ex: 300 000"
              value={assetValue}
              onChange={(e) => setAssetValue(e.target.value)}
              className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div className="mb-8">
            <label className="block text-white font-semibold mb-3">
              Lien de parenté
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {relations.map((rel) => (
                <button
                  key={rel.value}
                  onClick={() => setRelation(rel.value)}
                  className={`px-4 py-3 rounded-lg border-2 transition ${
                    relation === rel.value
                      ? 'bg-primary border-primary text-secondary font-semibold'
                      : 'bg-secondary border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {rel.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculateTax}
            className="w-full bg-primary text-secondary px-6 py-4 rounded-lg font-bold text-lg hover:bg-primary-dark transition"
          >
            Calculer les droits
          </button>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-secondary-light p-6 rounded-xl">
                <div className="text-sm text-gray-400 mb-2">
                  Valeur héritée
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(result.assetValue)}
                </div>
              </div>

              <div className="bg-secondary-light p-6 rounded-xl">
                <div className="text-sm text-gray-400 mb-2">Abattement</div>
                <div className="text-2xl font-bold text-white">
                  - {formatCurrency(ABATEMENTS[relation])}
                </div>
              </div>

              <div className="bg-secondary-light p-6 rounded-xl">
                <div className="text-sm text-gray-400 mb-2">
                  Montant taxable
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(result.taxableAmount)}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent/20 to-accent-light/20 border-2 border-accent p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <div className="text-accent-light font-semibold text-lg">
                  💸 DROITS À PAYER
                </div>
                <div className="text-sm text-gray-400">
                  Taux effectif: {result.effectiveRate.toFixed(1)}%
                </div>
              </div>
              <div className="text-5xl font-bold text-white mb-4">
                {formatCurrency(result.taxAmount)}
              </div>
              <div className="flex items-center text-accent-light">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">
                  À payer sous 6 mois après le décès
                </span>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-primary mb-3">
                💡 Vous n'avez pas les liquidités ?
              </h3>
              <p className="text-gray-300 mb-4">
                HeritageFund peut vous aider à lever ces fonds via crowdfunding
                en 30-45 jours, avec un taux de 4-7% (au lieu de 5,5% en
                banque).
              </p>
              <button className="bg-primary text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition">
                Créer ma campagne →
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 bg-secondary-light rounded-xl p-6">
          <div className="flex items-start">
            <Info className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-white font-semibold mb-3">Bon à savoir</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  • Les abattements se renouvellent tous les 15 ans
                </li>
                <li>
                  • Don avant 80 ans: +31 865€ exonérés (ligne directe)
                </li>
                <li>
                  • Nue-propriété: réduction 40-50% de la valeur selon l'âge
                </li>
                <li>• Pénalités de retard: 0,20% par mois</li>
                <li>
                  • Délai de déclaration: 6 mois en France métropolitaine, 12
                  mois pour DOM-TOM
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
