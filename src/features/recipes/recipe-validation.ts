const TITLE_MAX = 200
const URL_MAX = 2000
const TEXT_MAX = 10_000

export function validateTitle(title: string): string | null {
  if (!title.trim()) return 'Title is required'
  if (title.length > TITLE_MAX) return `Title must be ${TITLE_MAX} characters or fewer`
  return null
}

export function validateSourceContent(type: 'url' | 'text', content: string): string | null {
  if (!content.trim()) return null
  if (type === 'url') {
    if (content.length > URL_MAX) return `URL must be ${URL_MAX} characters or fewer`
    try {
      const parsed = new URL(content.trim())
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return 'URL must start with http:// or https://'
      }
    } catch {
      return 'Must be a valid URL (e.g. https://example.com)'
    }
  }
  if (type === 'text' && content.length > TEXT_MAX) {
    return `Text must be ${TEXT_MAX.toLocaleString()} characters or fewer`
  }
  return null
}

export function findDuplicateUrlIndices(
  sources: Array<{ type: 'url' | 'text'; content: string }>,
): Set<number> {
  const seen = new Map<string, number>()
  const duplicates = new Set<number>()
  sources.forEach((source, i) => {
    if (source.type !== 'url' || !source.content.trim()) return
    const url = source.content.trim()
    if (seen.has(url)) {
      duplicates.add(seen.get(url)!)
      duplicates.add(i)
    } else {
      seen.set(url, i)
    }
  })
  return duplicates
}
