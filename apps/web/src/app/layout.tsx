import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HeritageFund - Préservez votre héritage familial',
  description:
    'Plateforme de crowdfunding pour aider les héritiers à payer leurs droits de succession sans vendre leur patrimoine familial.',
  keywords: [
    'succession',
    'héritage',
    'crowdfunding',
    'droits de succession',
    'patrimoine',
    'financement participatif',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
