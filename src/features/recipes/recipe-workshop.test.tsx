import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { RecipeWorkshop } from './recipe-workshop'

const mockCreateRecipe = vi.hoisted(() => vi.fn())
const mockUpdateRecipe = vi.hoisted(() => vi.fn())
const mockAnalyzeAndGenerate = vi.hoisted(() => vi.fn())
const mockCraftRecipe = vi.hoisted(() => vi.fn())

vi.mock('./recipe-service', () => ({
  createRecipe: mockCreateRecipe,
  updateRecipe: mockUpdateRecipe,
  analyzeAndGenerate: mockAnalyzeAndGenerate,
  craftRecipe: mockCraftRecipe,
}))

const defaultProps = {
  userId: 'user-1',
  description: 'tonkotsu ramen',
  sources: [{ url: 'https://example.com/tonkotsu' }],
  onDone: vi.fn(),
  onBack: vi.fn(),
}

const analysisResult = {
  general_context: {
    flavor_profile: 'Rich, creamy pork broth with deep umami.',
    highlights: ['Toast bones before boiling', 'Low and slow simmer'],
    pitfalls: ['Do not rush the broth'],
    notes: 'Source 1 uses more salt.',
  },
  source_insights: [
    { label: 'Source 1', insights: ['Uses black garlic oil', 'Thin noodles'] },
  ],
  recipe: {
    ingredients: ['2 lbs pork bones', '4 cups water'],
    instructions: ['Blanch bones in boiling water', 'Simmer for 8 hours'],
  },
}

describe('RecipeWorkshop', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCreateRecipe.mockResolvedValue({ id: 'recipe-1' })
    mockUpdateRecipe.mockResolvedValue(undefined)
    mockCraftRecipe.mockResolvedValue({
      message: 'How spicy would you like it?',
      recipe: analysisResult.recipe,
      quick_replies: ['Very spicy', 'Medium', 'Mild'],
    })
  })

  it('shows loading skeleton on mount', () => {
    mockAnalyzeAndGenerate.mockReturnValue(new Promise(() => {}))
    render(<RecipeWorkshop {...defaultProps} />)
    expect(screen.getByLabelText('Loading analysis')).toBeInTheDocument()
  })

  it('renders analysis section after load', async () => {
    mockAnalyzeAndGenerate.mockResolvedValue(analysisResult)
    render(<RecipeWorkshop {...defaultProps} />)
    await waitFor(() => expect(screen.getByText('Rich, creamy pork broth with deep umami.')).toBeInTheDocument())
    expect(screen.getByText('Toast bones before boiling')).toBeInTheDocument()
    expect(screen.getByText('Do not rush the broth')).toBeInTheDocument()
    expect(screen.getByText('Source 1 uses more salt.')).toBeInTheDocument()
    expect(screen.getByText('Uses black garlic oil')).toBeInTheDocument()
  })

  it('renders recipe draft after load', async () => {
    mockAnalyzeAndGenerate.mockResolvedValue(analysisResult)
    render(<RecipeWorkshop {...defaultProps} />)
    await waitFor(() => expect(screen.getByText('2 lbs pork bones')).toBeInTheDocument())
    expect(screen.getByText('4 cups water')).toBeInTheDocument()
    expect(screen.getByText('Blanch bones in boiling water')).toBeInTheDocument()
    expect(screen.getByText('Simmer for 8 hours')).toBeInTheDocument()
  })

  it('autosaves recipe to DB on mount', async () => {
    mockAnalyzeAndGenerate.mockResolvedValue(analysisResult)
    render(<RecipeWorkshop {...defaultProps} />)
    await waitFor(() => expect(mockUpdateRecipe).toHaveBeenCalled())
    expect(mockCreateRecipe).toHaveBeenCalledWith(
      'user-1',
      'tonkotsu ramen',
      [{ url: 'https://example.com/tonkotsu' }],
    )
    expect(mockUpdateRecipe).toHaveBeenCalledWith('recipe-1', {
      ingredients: analysisResult.recipe.ingredients,
      instructions: analysisResult.recipe.instructions,
      ai_context: analysisResult.general_context,
    })
  })

  it('shows AI opening question in chat after analysis loads', async () => {
    mockAnalyzeAndGenerate.mockResolvedValue(analysisResult)
    render(<RecipeWorkshop {...defaultProps} />)
    await waitFor(() => expect(screen.getByText('How spicy would you like it?')).toBeInTheDocument())
  })

  it('shows quick reply chips from opening message', async () => {
    mockAnalyzeAndGenerate.mockResolvedValue(analysisResult)
    render(<RecipeWorkshop {...defaultProps} />)
    await waitFor(() => expect(screen.getByText('Very spicy')).toBeInTheDocument())
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Mild')).toBeInTheDocument()
  })

  it('clicking a quick reply sends the message and calls craftRecipe with correct args', async () => {
    mockAnalyzeAndGenerate.mockResolvedValue(analysisResult)
    render(<RecipeWorkshop {...defaultProps} />)
    await waitFor(() => expect(screen.getByText('Very spicy')).toBeInTheDocument())

    mockCraftRecipe.mockResolvedValue({
      message: 'Got it, making it very spicy!',
      recipe: analysisResult.recipe,
      quick_replies: [],
    })

    fireEvent.click(screen.getByText('Very spicy'))

    await waitFor(() => expect(screen.getByText('Got it, making it very spicy!')).toBeInTheDocument())
    expect(mockCraftRecipe).toHaveBeenLastCalledWith(expect.objectContaining({
      userMessage: 'Very spicy',
      description: 'tonkotsu ramen',
    }))
  })

  it('recipe draft in left panel updates when AI returns a modified recipe', async () => {
    mockAnalyzeAndGenerate.mockResolvedValue(analysisResult)
    render(<RecipeWorkshop {...defaultProps} />)
    await waitFor(() => expect(screen.getByText('Very spicy')).toBeInTheDocument())

    mockCraftRecipe.mockResolvedValue({
      message: 'Added chili oil for extra heat.',
      recipe: {
        ingredients: ['2 lbs pork bones', '4 cups water', '2 tbsp chili oil'],
        instructions: ['Blanch bones in boiling water', 'Simmer for 8 hours'],
      },
      quick_replies: [],
    })

    fireEvent.click(screen.getByText('Very spicy'))

    await waitFor(() => expect(screen.getByText('2 tbsp chili oil')).toBeInTheDocument())
  })

  it('reopen mode: skips createRecipe and analyzeAndGenerate, fires craft opening question', async () => {
    const existingRecipe = {
      id: 'recipe-existing',
      title: 'tonkotsu ramen',
      ingredients: ['2 lbs pork bones', '4 cups water'],
      instructions: ['Blanch bones', 'Simmer for 8 hours'],
      sources: [{ url: 'https://example.com' }],
      ai_context: {
        flavor_profile: 'Rich umami broth.',
        highlights: ['Toast bones'],
        pitfalls: ['Do not rush'],
        notes: 'Classic preparation.',
      },
      created_at: '2026-01-01',
    }
    render(
      <RecipeWorkshop
        existingRecipe={existingRecipe}
        onDone={vi.fn()}
        onBack={vi.fn()}
      />
    )
    await waitFor(() => expect(screen.getByText('How spicy would you like it?')).toBeInTheDocument())
    expect(mockCreateRecipe).not.toHaveBeenCalled()
    expect(mockAnalyzeAndGenerate).not.toHaveBeenCalled()
    expect(mockCraftRecipe).toHaveBeenCalledWith(expect.objectContaining({
      description: 'tonkotsu ramen',
      messages: [],
    }))
  })
})
