import type { ReactNode } from 'react'

export function highlightMatchingText(text: string, query: string): ReactNode {
  if (!query) return text

  const parts = text.split(new RegExp(`(${query})`, 'gi'))

  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="highlight">{part}</mark>
      : part
  )
}
