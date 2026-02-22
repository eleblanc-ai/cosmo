import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { SourceComparison } from './source-comparison'

const mockFetchSourceContents = vi.hoisted(() => vi.fn())
const mockSaveSourceContents = vi.hoisted(() => vi.fn())

vi.mock('./recipe-service', () => ({
  fetchSourceContents: mockFetchSourceContents,
  saveSourceContents: mockSaveSourceContents,
}))

const recipe = {
  id: 'r1',
  title: 'Tonkotsu Ramen',
  sources: [{ url: 'https://example.com/ramen', title: 'Best Ramen Recipe' }],
  ingredients: [],
  instructions: [],
  source_contents: undefined,
  created_at: '2026-01-01',
}

describe('SourceComparison', () => {
  beforeEach(() => { vi.clearAllMocks() })
  it('shows skeleton columns while loading', () => {
    mockFetchSourceContents.mockReturnValue(new Promise(() => {}))
    render(<SourceComparison recipe={recipe} onBack={vi.fn()} onGenerate={vi.fn()} />)
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders extracted title, ingredients, and instructions', async () => {
    mockFetchSourceContents.mockResolvedValue([
      {
        label: 'example.com',
        title: 'Classic Tonkotsu Ramen',
        ingredients: ['2 lbs pork bones', '1 tbsp salt'],
        instructions: ['Boil the bones for 12 hours.', 'Season and serve.'],
      },
    ])
    mockSaveSourceContents.mockResolvedValue(undefined)
    render(<SourceComparison recipe={recipe} onBack={vi.fn()} onGenerate={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('Classic Tonkotsu Ramen')).toBeInTheDocument())
    expect(screen.getByText('2 lbs pork bones')).toBeInTheDocument()
    expect(screen.getByText('Boil the bones for 12 hours.')).toBeInTheDocument()
  })

  it('uses source title as header link when extracted title is empty', async () => {
    mockFetchSourceContents.mockResolvedValue([
      { label: 'example.com', title: '', ingredients: ['1 egg'], instructions: ['Boil it.'] },
    ])
    mockSaveSourceContents.mockResolvedValue(undefined)
    render(<SourceComparison recipe={recipe} onBack={vi.fn()} onGenerate={vi.fn()} />)
    await waitFor(() => {
      const link = screen.getByRole('link', { name: /best ramen recipe/i })
      expect(link).toHaveAttribute('href', 'https://example.com/ramen')
    })
  })

  it('shows no recipe found message with link when extraction fails', async () => {
    mockFetchSourceContents.mockResolvedValue([
      { label: 'example.com', title: '', ingredients: [], instructions: [] },
    ])
    mockSaveSourceContents.mockResolvedValue(undefined)
    render(<SourceComparison recipe={recipe} onBack={vi.fn()} onGenerate={vi.fn()} />)
    await waitFor(() => expect(screen.getByText(/no recipe found/i)).toBeInTheDocument())
    expect(screen.getByRole('link', { name: 'example.com' })).toBeInTheDocument()
  })

  it('shows error when fetch fails', async () => {
    mockFetchSourceContents.mockRejectedValue(new Error('Failed to fetch source contents'))
    render(<SourceComparison recipe={recipe} onBack={vi.fn()} onGenerate={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('Failed to fetch source contents')).toBeInTheDocument())
  })

  it('uses cached source_contents and skips fetch when available', async () => {
    const cachedRecipe = {
      ...recipe,
      source_contents: [
        {
          label: 'example.com',
          title: 'Cached Ramen',
          ingredients: ['cached ingredient'],
          instructions: ['cached step'],
        },
      ],
    }
    render(<SourceComparison recipe={cachedRecipe} onBack={vi.fn()} onGenerate={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('Cached Ramen')).toBeInTheDocument())
    expect(mockFetchSourceContents).not.toHaveBeenCalled()
  })
})
