import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { RecipeVersionHistory } from './recipe-version-history'

const mockGetRecipeVersions = vi.hoisted(() => vi.fn())
const mockUpdateVersionNotes = vi.hoisted(() => vi.fn())

vi.mock('./recipe-service', () => ({
  getRecipeVersions: mockGetRecipeVersions,
  updateVersionNotes: mockUpdateVersionNotes,
}))

const v1 = {
  id: 'v1',
  recipe_id: 'r1',
  version_number: 1,
  ingredients: ['2 lbs pork bones'],
  instructions: ['Boil for 12 hours.'],
  cook_notes: null,
  created_at: '2026-01-01T10:00:00Z',
}

const v2 = {
  id: 'v2',
  recipe_id: 'r1',
  version_number: 2,
  ingredients: ['2 lbs pork bones', '1 tbsp chili oil'],
  instructions: ['Boil for 12 hours.', 'Drizzle chili oil.'],
  cook_notes: 'Great result!',
  created_at: '2026-01-02T10:00:00Z',
}

describe('RecipeVersionHistory', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders version list on mount', async () => {
    mockGetRecipeVersions.mockResolvedValue([v2, v1])
    render(<RecipeVersionHistory recipeId="r1" onBack={vi.fn()} />)
    await waitFor(() => {
      expect(screen.getAllByText('v2').length).toBeGreaterThan(0)
      expect(screen.getAllByText('v1').length).toBeGreaterThan(0)
    })
    expect(screen.getByText('Great result!')).toBeInTheDocument()
    expect(screen.getByText('No cook notes yet')).toBeInTheDocument()
  })

  it('shows "No versions yet" when empty', async () => {
    mockGetRecipeVersions.mockResolvedValue([])
    render(<RecipeVersionHistory recipeId="r1" onBack={vi.fn()} />)
    await waitFor(() =>
      expect(screen.getByText(/no versions yet/i)).toBeInTheDocument()
    )
  })

  it('shows ingredient diff with correct highlighting', async () => {
    mockGetRecipeVersions.mockResolvedValue([v2, v1])
    render(<RecipeVersionHistory recipeId="r1" onBack={vi.fn()} />)
    await waitFor(() => expect(screen.getAllByText('v2').length).toBeGreaterThan(0))

    // Both versions share '2 lbs pork bones' — appears in both diff columns
    const sharedItems = screen.getAllByText('2 lbs pork bones')
    expect(sharedItems.length).toBeGreaterThanOrEqual(1)

    // '1 tbsp chili oil' is only in v2 (compareA=v2, compareB=v1)
    // It appears in the left/A column as 'removed' (not in v1)
    const removedItems = screen.getAllByText('1 tbsp chili oil')
    expect(removedItems.length).toBeGreaterThanOrEqual(1)
    expect(removedItems[0].closest('li')).toHaveClass('text-red-500')
  })

  it('clicking "Edit notes" shows inline textarea', async () => {
    mockGetRecipeVersions.mockResolvedValue([v2, v1])
    render(<RecipeVersionHistory recipeId="r1" onBack={vi.fn()} />)
    await waitFor(() => expect(screen.getAllByRole('button', { name: /edit notes/i }).length).toBeGreaterThan(0))

    const editButtons = screen.getAllByRole('button', { name: /edit notes/i })
    await userEvent.click(editButtons[0])

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save notes/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('saving notes calls updateVersionNotes and exits edit mode', async () => {
    mockGetRecipeVersions.mockResolvedValue([v2, v1])
    mockUpdateVersionNotes.mockResolvedValue(undefined)
    render(<RecipeVersionHistory recipeId="r1" onBack={vi.fn()} />)
    await waitFor(() => expect(screen.getAllByRole('button', { name: /edit notes/i }).length).toBeGreaterThan(0))

    const editButtons = screen.getAllByRole('button', { name: /edit notes/i })
    await userEvent.click(editButtons[0])

    const textarea = screen.getByRole('textbox')
    await userEvent.clear(textarea)
    await userEvent.type(textarea, 'Needs more salt next time')
    await userEvent.click(screen.getByRole('button', { name: /save notes/i }))

    await waitFor(() =>
      expect(mockUpdateVersionNotes).toHaveBeenCalledWith(v2.id, 'Needs more salt next time')
    )
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})
