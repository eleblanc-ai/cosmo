import { validateTitle, validateSourceContent, findDuplicateUrlIndices } from './recipe-validation'

describe('validateTitle', () => {
  it('returns error for empty title', () => {
    expect(validateTitle('')).not.toBeNull()
    expect(validateTitle('   ')).not.toBeNull()
  })

  it('returns error when over 200 characters', () => {
    expect(validateTitle('a'.repeat(201))).not.toBeNull()
  })

  it('returns null for valid title', () => {
    expect(validateTitle('Tonkotsu Ramen')).toBeNull()
  })
})

describe('validateSourceContent', () => {
  it('returns null for empty content', () => {
    expect(validateSourceContent('url', '')).toBeNull()
    expect(validateSourceContent('text', '   ')).toBeNull()
  })

  it('returns error for invalid URL format', () => {
    expect(validateSourceContent('url', 'not-a-url')).not.toBeNull()
    expect(validateSourceContent('url', 'example.com')).not.toBeNull()
  })

  it('returns error for non-http URL', () => {
    expect(validateSourceContent('url', 'ftp://example.com')).not.toBeNull()
  })

  it('returns null for valid https URL', () => {
    expect(validateSourceContent('url', 'https://example.com/recipe')).toBeNull()
  })

  it('returns null for valid http URL', () => {
    expect(validateSourceContent('url', 'http://example.com')).toBeNull()
  })

  it('returns error for text over 10000 characters', () => {
    expect(validateSourceContent('text', 'a'.repeat(10_001))).not.toBeNull()
  })

  it('returns null for valid text', () => {
    expect(validateSourceContent('text', 'Boil water, add noodles.')).toBeNull()
  })
})

describe('findDuplicateUrlIndices', () => {
  it('returns empty set when no duplicates', () => {
    const result = findDuplicateUrlIndices([
      { type: 'url', content: 'https://a.com' },
      { type: 'url', content: 'https://b.com' },
    ])
    expect(result.size).toBe(0)
  })

  it('returns indices of duplicate URLs', () => {
    const result = findDuplicateUrlIndices([
      { type: 'url', content: 'https://a.com' },
      { type: 'url', content: 'https://a.com' },
    ])
    expect(result).toEqual(new Set([0, 1]))
  })

  it('ignores text sources when checking for duplicates', () => {
    const result = findDuplicateUrlIndices([
      { type: 'text', content: 'same text' },
      { type: 'text', content: 'same text' },
    ])
    expect(result.size).toBe(0)
  })
})
