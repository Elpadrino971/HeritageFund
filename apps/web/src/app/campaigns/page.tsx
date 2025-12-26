'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TrendingUp, MapPin, Users, Clock } from 'lucide-react'

interface Campaign {
  id: string
  title: string
  location: string
  story: string
  targetAmount: number
  currentAmount: number
  backers: number
  daysLeft: number
  image: string
  interestRate: number
  propertyType: 'house' | 'farm' | 'business'
}

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    title: 'Maison familiale en Guadeloupe',
    location: 'Pointe-à-Pitre, Guadeloupe',
    story:
      'Ma grand-mère a construit cette maison en 1965. 3 générations ont grandi ici. Les droits de succession nous obligent à vendre sans votre aide...',
    targetAmount: 75000,
    currentAmount: 45000,
    backers: 28,
    daysLeft: 12,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
    interestRate: 5.5,
    propertyType: 'house',
  },
  {
    id: '2',
    title: 'Exploitation agricole familiale',
    location: 'Bretagne',
    story:
      'Ferme transmise depuis 4 générations. 15 hectares, 50 vaches laitières. Sans votre aide, nous devrons vendre l\'exploitation...',
    targetAmount: 120000,
    currentAmount: 89000,
    backers: 52,
    daysLeft: 8,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    interestRate: 6.0,
    propertyType: 'farm',
  },
  {
    id: '3',
    title: "Maison d'enfance à la montagne",
    location: 'Haute-Savoie',
    story:
      'Chalet familial où mes 5 frères et sœurs avons passé tous nos étés depuis 30 ans. Mon père vient de décéder et nous risquons de perdre ce lieu chargé de souvenirs...',
    targetAmount: 95000,
    currentAmount: 12000,
    backers: 8,
    daysLeft: 25,
    image: 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59',
    interestRate: 5.0,
    propertyType: 'house',
  },
  {
    id: '4',
    title: 'Appartement haussmannien Paris',
    location: 'Paris 11e',
    story:
      "Appartement acheté par mes grands-parents en 1970. C'est ici que toute ma famille s'est toujours réunie. Les droits s'élèvent à 180K€...",
    targetAmount: 180000,
    currentAmount: 95000,
    backers: 67,
    daysLeft: 18,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    interestRate: 5.8,
    propertyType: 'house',
  },
  {
    id: '5',
    title: 'Vignoble familial Bordeaux',
    location: 'Saint-Émilion',
    story:
      '5 hectares de vignes cultivées depuis 1890. Notre vin a remporté plusieurs médailles. Les droits de succession menacent 5 générations de travail...',
    targetAmount: 250000,
    currentAmount: 125000,
    backers: 89,
    daysLeft: 22,
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb',
    interestRate: 6.5,
    propertyType: 'farm',
  },
  {
    id: '6',
    title: 'Boulangerie artisanale',
    location: 'Lyon',
    story:
      'Boulangerie créée par mon arrière-grand-père en 1925. 15 employés, client fidèle. Mon père est décédé et je dois trouver 85K€ pour continuer...',
    targetAmount: 85000,
    currentAmount: 67000,
    backers: 43,
    daysLeft: 15,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    interestRate: 6.2,
    propertyType: 'business',
  },
]

export default function CampaignsPage() {
  const [filter, setFilter] = useState<'all' | 'house' | 'farm' | 'business'>(
    'all'
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getProgressPercentage = (campaign: Campaign) => {
    return (campaign.currentAmount / campaign.targetAmount) * 100
  }

  const filteredCampaigns =
    filter === 'all'
      ? MOCK_CAMPAIGNS
      : MOCK_CAMPAIGNS.filter((c) => c.propertyType === filter)

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-secondary-dark">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Soutenez une famille
          </h1>
          <p className="text-gray-400 text-lg">
            Investissez avec impact social et rendement attractif
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-primary text-secondary'
                : 'bg-secondary-light text-gray-400 hover:text-white'
            }`}
          >
            Toutes ({MOCK_CAMPAIGNS.length})
          </button>
          <button
            onClick={() => setFilter('house')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'house'
                ? 'bg-primary text-secondary'
                : 'bg-secondary-light text-gray-400 hover:text-white'
            }`}
          >
            🏠 Maisons (
            {MOCK_CAMPAIGNS.filter((c) => c.propertyType === 'house').length})
          </button>
          <button
            onClick={() => setFilter('farm')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'farm'
                ? 'bg-primary text-secondary'
                : 'bg-secondary-light text-gray-400 hover:text-white'
            }`}
          >
            🌾 Exploitations (
            {MOCK_CAMPAIGNS.filter((c) => c.propertyType === 'farm').length})
          </button>
          <button
            onClick={() => setFilter('business')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'business'
                ? 'bg-primary text-secondary'
                : 'bg-secondary-light text-gray-400 hover:text-white'
            }`}
          >
            🏢 Entreprises (
            {MOCK_CAMPAIGNS.filter((c) => c.propertyType === 'business').length}
            )
          </button>
        </div>

        {/* Campaigns Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/campaigns/${campaign.id}`}
              className="group bg-secondary-light rounded-xl overflow-hidden hover:ring-2 hover:ring-primary transition"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 right-3 bg-primary text-secondary px-3 py-1 rounded-full text-sm font-bold">
                  {campaign.interestRate}% /an
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition">
                  {campaign.title}
                </h3>

                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {campaign.location}
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {campaign.story}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${getProgressPercentage(campaign)}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div>
                    <div className="text-white font-bold text-sm">
                      {formatCurrency(campaign.currentAmount)}
                    </div>
                    <div className="text-gray-500 text-xs">
                      levés sur {formatCurrency(campaign.targetAmount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm flex items-center justify-center">
                      <Users className="h-3 w-3 mr-1" />
                      {campaign.backers}
                    </div>
                    <div className="text-gray-500 text-xs">investisseurs</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm flex items-center justify-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {campaign.daysLeft}j
                    </div>
                    <div className="text-gray-500 text-xs">restants</div>
                  </div>
                </div>

                <button className="w-full bg-primary text-secondary px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition">
                  Investir →
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Vous avez besoin d'aide pour votre succession ?
          </h2>
          <p className="text-gray-400 mb-6">
            Créez votre campagne en quelques minutes
          </p>
          <Link
            href="/create-campaign"
            className="inline-block bg-primary text-secondary px-8 py-3 rounded-lg font-bold hover:bg-primary-dark transition"
          >
            Créer ma campagne
          </Link>
        </div>
      </div>
    </div>
  )
}
