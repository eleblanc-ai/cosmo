import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { RecipeDetail } from './recipe-detail'

const mockGetRecipe = vi.hoisted(() => vi.fn())
const mockDeleteRecipe = vi.hoisted(() => vi.fn())
const mockUpdateRecipe = vi.hoisted(() => vi.fn())
const mockSaveRecipeVersion = vi.hoisted(() => vi.fn())

vi.mock('./recipe-service', () => ({
  getRecipe: mockGetRecipe,
  deleteRecipe: mockDeleteRecipe,
  updateRecipe: mockUpdateRecipe,
  saveRecipeVersion: mockSaveRecipeVersion,
}))

const recipe = {
  id: 'r1',
  title: 'Tonkotsu Ramen',
  sources: [{ url: 'https://example.com/ramen' }],
  ingredients: [],
  instructions: [],
  source_contents: null,
  created_at: '2026-01-01',
}

const recipeWithContent = {
  ...recipe,
  ingredients: ['2 lbs pork bones', '1 tbsp salt'],
  instructions: ['Boil the bones for 12 hours.', 'Season and serve.'],
}

const recipeWithContext = {
  ...recipeWithContent,
  ai_context: {
    flavor_profile: 'Rich and savory umami broth.',
    highlights: ['Toast bones before boiling for deeper flavor.'],
    pitfalls: ['Do not rush the simmer time.'],
    notes: 'Source 1 uses more salt than Source 2.',
  },
}

describe('RecipeDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSaveRecipeVersion.mockResolvedValue(undefined)
  })
  it('renders recipe title and sources', async () => {
    mockGetRecipe.mockResolvedValue(recipe)
    render(<RecipeDetail recipeId="r1" onBack={vi.fn()} onDelete={vi.fn()} onCompare={vi.fn()} onChat={vi.fn()} onHistory={vi.fn()} onWorkshop={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('Tonkotsu Ramen')).toBeInTheDocument())
    expect(screen.getByText('https://example.com/ramen')).toBeInTheDocument()
  })

  it('shows no recipe generated when ingredients and instructions are empty', async () => {
    mockGetRecipe.mockResolvedValue(recipe)
    render(<RecipeDetail recipeId="r1" onBack={vi.fn()} onDelete={vi.fn()} onCompare={vi.fn()} onChat={vi.fn()} onHistory={vi.fn()} onWorkshop={vi.fn()} />)
    await waitFor(() => expect(screen.getByText(/no recipe generated yet/i)).toBeInTheDocument())
    expect(screen.getByRole('button', { name: /compare sources/i })).toBeInTheDocument()
  })

  it('renders ingredients and instructions when present', async () => {
    mockGetRecipe.mockResolvedValue(recipeWithContent)
    render(<RecipeDetail recipeId="r1" onBack={vi.fn()} onDelete={vi.fn()} onCompare={vi.fn()} onChat={vi.fn()} onHistory={vi.fn()} onWorkshop={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('2 lbs pork bones')).toBeInTheDocument())
    expect(screen.getByText('Boil the bones for 12 hours.')).toBeInTheDocument()
  })

  it('enters edit mode when Edit is clicked', async () => {
    mockGetRecipe.mockResolvedValue(recipeWithContent)
    render(<RecipeDetail recipeId="r1" onBack={vi.fn()} onDelete={vi.fn()} onCompare={vi.fn()} onChat={vi.fn()} onHistory={vi.fn()} onWorkshop={vi.fn()} />)
    await waitFor(() => screen.getByRole('button', { name: /^edit$/i }))
    await userEvent.click(screen.getByRole('button', { name: /^edit$/i }))
    expect(screen.getByDisplayValue('2 lbs pork bones')).toBeInTheDocument()
  })

  it('saves changes and exits edit mode', async () => {
    mockGetRecipe.mockResolvedValue(recipeWithContent)
    mockUpdateRecipe.mockResolvedValue(undefined)
    render(<RecipeDetail recipeId="r1" onBack={vi.fn()} onDelete={vi.fn()} onCompare={vi.fn()} onChat={vi.fn()} onHistory={vi.fn()} onWorkshop={vi.fn()} />)
    await waitFor(() => screen.getByRole('button', { name: /^edit$/i }))
    await userEvent.click(screen.getByRole('button', { name: /^edit$/i }))
    await userEvent.click(screen.getByRole('button', { name: /^save$/i }))
    await waitFor(() => expect(mockUpdateRecipe).toHaveBeenCalledWith('r1', {
      ingredients: recipeWithContent.ingredients,
      instructions: recipeWithContent.instructions,
    }))
    expect(screen.queryByDisplayValue('2 lbs pork bones')).not.toBeInTheDocument()
  })

  it('cancels edit mode without saving', async () => {
    mockGetRecipe.mockResolvedValue(recipeWithContent)
    render(<RecipeDetail recipeId="r1" onBack={vi.fn()} onDelete={vi.fn()} onCompare={vi.fn()} onChat={vi.fn()} onHistory={vi.fn()} onWorkshop={vi.fn()} />)
    await waitFor(() => screen.getByRole('button', { name: /^edit$/i }))
    await userEvent.click(screen.getByRole('button', { name: /^edit$/i }))
    await userEvent.click(screen.getByRole('button', { name: /^cancel$/i }))
    expect(mockUpdateRecipe).not.toHaveBeenCalled()
    expect(screen.getByText('2 lbs pork bones')).toBeInTheDocument()
  })

  it('calls onDelete after confirming deletion', async () => {
    mockGetRecipe.mockResolvedValue(recipe)
    mockDeleteRecipe.mockResolvedValue(undefined)
    const onDelete = vi.fn()
    render(<RecipeDetail recipeId="r1" onBack={vi.fn()} onDelete={onDelete} onCompare={vi.fn()} onChat={vi.fn()} onHistory={vi.fn()} onWorkshop={vi.fn()} />)
    await waitFor(() => screen.getByRole('button', { name: /delete recipe/i }))
    await userEvent.click(screen.getByRole('button', { name: /delete recipe/i }))
    await userEvent.click(screen.getByRole('button', { name: /^delete$/i }))
    expect(mockDeleteRecipe).toHaveBeenCalledWith('r1')
    expect(onDelete).toHaveBeenCalled()
  })

  it('shows Chat button when recipe has content', async () => {
    mockGetRecipe.mockResolvedValue(recipeWithContent)
    const onChat = vi.fn()
    render(<RecipeDetail recipeId="r1" onBack={vi.fn()} onDelete={vi.fn()} onCompare={vi.fn()} onChat={onChat} onHistory={vi.fn()} onWorkshop={vi.fn()} />)
    await waitFor(() => screen.getByRole('button', { name: /^chat$/i }))
    await userEvent.click(screen.getByRole('button', { name: /^chat$/i }))
    expect(onChat).toHaveBeenCalledWith(recipeWithContent)
  })

  it('shows History button when recipe has content', async () => {
    mockGetRecipe.mockResolvedValue(recipeWithContent)
    const onHistory = vi.fn()
    render(<RecipeDetail recipeId="r1" onBack={vi.fn()} onDelete={vi.fn()} onCompare={vi.fn()} onChat={vi.fn()} onHistory={onHistory} onWorkshop={vi.fn()} />)
    await waitFor(() => screen.getByRole('button', { name: /^history$/i }))
    await userEvent.click(screen.getByRole('button', { name: /^history$/i }))
    expect(onHistory).toHaveBeenCalledWith('r1')
  })

  it('shows AI context section when present', async () => {
    mockGetRecipe.mockResolvedValue(recipeWithContext)
    render(<RecipeDetail recipeId="r1" onBack={vi.fn()} onDelete={vi.fn()} onCompare={vi.fn()} onChat={vi.fn()} onHistory={vi.fn()} onWorkshop={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('Recipe Context')).toBeInTheDocument())
    expect(screen.getByText('Rich and savory umami broth.')).toBeInTheDocument()
    expect(screen.getByText('Toast bones before boiling for deeper flavor.')).toBeInTheDocument()
    expect(screen.getByText('Do not rush the simmer time.')).toBeInTheDocument()
    expect(screen.getByText('Source 1 uses more salt than Source 2.')).toBeInTheDocument()
  })

  it('calls onWorkshop when Workshop button is clicked', async () => {
    mockGetRecipe.mockResolvedValue(recipeWithContent)
    const onWorkshop = vi.fn()
    render(<RecipeDetail recipeId="r1" onBack={vi.fn()} onDelete={vi.fn()} onCompare={vi.fn()} onChat={vi.fn()} onHistory={vi.fn()} onWorkshop={onWorkshop} />)
    await waitFor(() => screen.getByRole('button', { name: /^workshop$/i }))
    await userEvent.click(screen.getByRole('button', { name: /^workshop$/i }))
    expect(onWorkshop).toHaveBeenCalledWith(recipeWithContent)
  })
})