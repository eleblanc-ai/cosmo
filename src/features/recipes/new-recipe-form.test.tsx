import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { NewRecipeForm } from './new-recipe-form'

const mockSearchRecipes = vi.hoisted(() => vi.fn())

vi.mock('./recipe-service', () => ({
  searchRecipes: mockSearchRecipes,
}))

const searchResults = [
  { title: 'Tonkotsu Ramen Recipe', url: 'https://example.com/tonkotsu', snippet: 'Rich pork broth ramen.' },
  { title: 'Easy Ramen', url: 'https://other.com/ramen', snippet: 'Quick weeknight ramen.' },
]

describe('NewRecipeForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows search input and Search button on initial render', () => {
    render(<NewRecipeForm onWorkshop={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByPlaceholderText(/creamy mushroom risotto/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^search$/i })).toBeInTheDocument()
  })

  it('calls searchRecipes with description and shows results', async () => {
    mockSearchRecipes.mockResolvedValue(searchResults)
    render(<NewRecipeForm onWorkshop={vi.fn()} onCancel={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText(/creamy mushroom risotto/i), 'tonkotsu ramen')
    await userEvent.click(screen.getByRole('button', { name: /^search$/i }))
    expect(mockSearchRecipes).toHaveBeenCalledWith('tonkotsu ramen')
    await waitFor(() => expect(screen.getByText('Tonkotsu Ramen Recipe')).toBeInTheDocument())
    expect(screen.getByText('Easy Ramen')).toBeInTheDocument()
  })

  it('selecting results and clicking Use selected calls onWorkshop with description and sources', async () => {
    const mockOnWorkshop = vi.fn()
    mockSearchRecipes.mockResolvedValue(searchResults)
    render(<NewRecipeForm onWorkshop={mockOnWorkshop} onCancel={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText(/creamy mushroom risotto/i), 'tonkotsu ramen')
    await userEvent.click(screen.getByRole('button', { name: /^search$/i }))
    await waitFor(() => expect(screen.getByText('Tonkotsu Ramen Recipe')).toBeInTheDocument())
    await userEvent.click(screen.getAllByRole('checkbox')[0])
    await userEvent.click(screen.getByRole('button', { name: /use 1 selected/i }))
    expect(mockOnWorkshop).toHaveBeenCalledWith('tonkotsu ramen', [{ url: 'https://example.com/tonkotsu' }])
  })

  it('shows error when search fails', async () => {
    mockSearchRecipes.mockRejectedValue(new Error('Network error'))
    render(<NewRecipeForm onWorkshop={vi.fn()} onCancel={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText(/creamy mushroom risotto/i), 'tonkotsu ramen')
    await userEvent.click(screen.getByRole('button', { name: /^search$/i }))
    await waitFor(() => expect(screen.getByText(/search failed/i)).toBeInTheDocument())
  })
})
