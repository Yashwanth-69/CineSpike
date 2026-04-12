import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatMoney(value) {
  const number = Number(value) || 0
  if (number >= 1_000_000_000) {
    return `$${(number / 1_000_000_000).toFixed(2)}B`
  }
  if (number >= 1_000_000) {
    return `$${(number / 1_000_000).toFixed(1)}M`
  }
  return `$${number.toLocaleString()}`
}

export function formatCompact(value) {
  const number = Number(value) || 0
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number)
}

export function formatDate(value) {
  if (!value) {
    return 'Unknown'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleString()
}

export function sentenceCase(value = '') {
  if (!value) {
    return ''
  }
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function resolveAnalysisPath(basePath, analysisId) {
  return analysisId ? `${basePath}/${analysisId}` : basePath
}
