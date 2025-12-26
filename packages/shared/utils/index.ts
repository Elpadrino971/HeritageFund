/**
 * Format currency in EUR
 */
export function formatCurrency(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  }).format(value)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format date in French format
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj)
}

/**
 * Calculate days remaining from now until date
 */
export function daysUntil(date: string | Date): number {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Calculate campaign progress percentage
 */
export function calculateProgress(current: number, target: number): number {
  return Math.min(100, (current / target) * 100)
}

/**
 * Calculate monthly payment for a loan
 * @param principal - Principal amount
 * @param annualRate - Annual interest rate (e.g., 5.5 for 5.5%)
 * @param months - Duration in months
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  const monthlyRate = annualRate / 100 / 12
  if (monthlyRate === 0) return principal / months

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  )
}

/**
 * Calculate total expected return (principal + interest)
 */
export function calculateTotalReturn(
  principal: number,
  annualRate: number,
  months: number
): number {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, months)
  return monthlyPayment * months
}

/**
 * Calculate succession tax based on French tax brackets
 */
export interface TaxBracket {
  limit: number
  rate: number
}

export const TAX_ABATEMENTS = {
  direct: 100000, // Enfants, parents
  spouse: 80724, // Conjoint, PACS
  siblings: 15932,
  nephews: 7967,
  other: 1594,
} as const

export const TAX_BRACKETS = {
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
} as const

export type RelationType = keyof typeof TAX_ABATEMENTS

export function calculateSuccessionTax(
  assetValue: number,
  relation: RelationType
): {
  assetValue: number
  abatement: number
  taxableAmount: number
  taxAmount: number
  effectiveRate: number
} {
  const abatement = TAX_ABATEMENTS[relation]
  const taxableAmount = Math.max(0, assetValue - abatement)

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

  return {
    assetValue,
    abatement,
    taxableAmount,
    taxAmount: tax,
    effectiveRate: (tax / assetValue) * 100,
  }
}

/**
 * Validate IBAN (basic validation)
 */
export function isValidIBAN(iban: string): boolean {
  const cleaned = iban.replace(/\s/g, '').toUpperCase()
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/
  return ibanRegex.test(cleaned)
}

/**
 * Slugify text for URLs
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}
