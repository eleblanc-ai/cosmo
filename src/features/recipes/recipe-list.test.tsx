import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { RecipeList } from './recipe-list'

const mockListRecipes = vi.hoisted(() => vi.fn())

vi.mock('./recipe-service', () => ({
  listRecipes: mockListRecipes,
}))

vi.mock('../auth/auth-provider', () => ({
  useAuth: () => ({ session: { user: { id: 'user-1' } } }),
}))

describe('RecipeList', () => {
  it('renders empty state when no recipes', async () => {
    mockListRecipes.mockResolvedValue([])
    render(<RecipeList onNewRecipe={vi.fn()} onSelect={vi.fn()} />)
    expect(await screen.findByText(/no recipes yet/i)).toBeInTheDocument()
  })

  it('renders recipe titles when recipes exist', async () => {
    mockListRecipes.mockResolvedValue([
      { id: '1', title: 'Tonkotsu Ramen', sources: [], created_at: '' },
      { id: '2', title: 'Beef Bourguignon', sources: [], created_at: '' },
    ])
    render(<RecipeList onNewRecipe={vi.fn()} onSelect={vi.fn()} />)
    expect(await screen.findByText('Tonkotsu Ramen')).toBeInTheDocument()
    expect(screen.getByText('Beef Bourguignon')).toBeInTheDocument()
  })
})
