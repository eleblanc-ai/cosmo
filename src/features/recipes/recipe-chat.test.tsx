import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { RecipeChat } from './recipe-chat'

const mockGetChatMessages = vi.hoisted(() => vi.fn())
const mockSaveChatMessage = vi.hoisted(() => vi.fn())
const mockSendChatMessage = vi.hoisted(() => vi.fn())
const mockUpdateRecipe = vi.hoisted(() => vi.fn())
const mockSaveRecipeVersion = vi.hoisted(() => vi.fn())

vi.mock('./recipe-service', () => ({
  getChatMessages: mockGetChatMessages,
  saveChatMessage: mockSaveChatMessage,
  sendChatMessage: mockSendChatMessage,
  updateRecipe: mockUpdateRecipe,
  saveRecipeVersion: mockSaveRecipeVersion,
}))

const recipe = {
  id: 'r1',
  title: 'Tonkotsu Ramen',
  sources: [],
  ingredients: ['2 lbs pork bones'],
  instructions: ['Boil for 12 hours.'],
  source_contents: undefined,
  created_at: '2026-01-01',
}

const existingMessage = {
  id: 'm1',
  recipe_id: 'r1',
  role: 'assistant' as const,
  content: 'Hello! How can I help with this recipe?',
  created_at: '2026-01-01T00:00:00Z',
}

describe('RecipeChat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSaveRecipeVersion.mockResolvedValue(undefined)
  })

  it('renders chat history loaded on mount', async () => {
    mockGetChatMessages.mockResolvedValue([existingMessage])
    render(<RecipeChat recipe={recipe} onBack={vi.fn()} />)
    await waitFor(() => expect(screen.getByText('Hello! How can I help with this recipe?')).toBeInTheDocument())
  })

  it('sends a user message and shows it immediately', async () => {
    mockGetChatMessages.mockResolvedValue([])
    mockSaveChatMessage.mockResolvedValue({ id: 'm2', recipe_id: 'r1', role: 'user', content: 'Make it spicier', created_at: '2026-01-01T00:01:00Z' })
    mockSendChatMessage.mockReturnValue(new Promise(() => {}))
    render(<RecipeChat recipe={recipe} onBack={vi.fn()} />)
    await waitFor(() => expect(mockGetChatMessages).toHaveBeenCalled())
    await userEvent.type(screen.getByPlaceholderText(/ask me to adjust/i), 'Make it spicier')
    await userEvent.click(screen.getByRole('button', { name: /^send$/i }))
    expect(screen.getByText('Make it spicier')).toBeInTheDocument()
  })

  it('shows assistant response after send', async () => {
    mockGetChatMessages.mockResolvedValue([])
    mockSaveChatMessage
      .mockResolvedValueOnce({ id: 'm2', recipe_id: 'r1', role: 'user', content: 'Make it spicier', created_at: '2026-01-01T00:01:00Z' })
      .mockResolvedValueOnce({ id: 'm3', recipe_id: 'r1', role: 'assistant', content: 'Added chili oil to the recipe.', created_at: '2026-01-01T00:02:00Z' })
    mockSendChatMessage.mockResolvedValue({ message: 'Added chili oil to the recipe.', recipe: { ingredients: ['2 lbs pork bones'], instructions: ['Boil for 12 hours.'] } })
    render(<RecipeChat recipe={recipe} onBack={vi.fn()} />)
    await waitFor(() => expect(mockGetChatMessages).toHaveBeenCalled())
    await userEvent.type(screen.getByPlaceholderText(/ask me to adjust/i), 'Make it spicier')
    await userEvent.click(screen.getByRole('button', { name: /^send$/i }))
    await waitFor(() => expect(screen.getByText('Added chili oil to the recipe.')).toBeInTheDocument())
  })

  it('calls updateRecipe and shows banner when AI returns updated recipe', async () => {
    mockGetChatMessages.mockResolvedValue([])
    mockSaveChatMessage
      .mockResolvedValueOnce({ id: 'm2', recipe_id: 'r1', role: 'user', content: 'Make it spicier', created_at: '2026-01-01T00:01:00Z' })
      .mockResolvedValueOnce({ id: 'm3', recipe_id: 'r1', role: 'assistant', content: 'Added chili oil.', created_at: '2026-01-01T00:02:00Z' })
    mockSendChatMessage.mockResolvedValue({
      message: 'Added chili oil.',
      recipe: { ingredients: ['2 lbs pork bones', '1 tbsp chili oil'], instructions: ['Boil for 12 hours.', 'Drizzle chili oil.'] },
    })
    mockUpdateRecipe.mockResolvedValue(undefined)
    render(<RecipeChat recipe={recipe} onBack={vi.fn()} />)
    await waitFor(() => expect(mockGetChatMessages).toHaveBeenCalled())
    await userEvent.type(screen.getByPlaceholderText(/ask me to adjust/i), 'Make it spicier')
    await userEvent.click(screen.getByRole('button', { name: /^send$/i }))
    await waitFor(() => expect(mockUpdateRecipe).toHaveBeenCalledWith('r1', {
      ingredients: ['2 lbs pork bones', '1 tbsp chili oil'],
      instructions: ['Boil for 12 hours.', 'Drizzle chili oil.'],
    }))
    expect(screen.getByText('Recipe updated')).toBeInTheDocument()
  })

  it('calls saveRecipeVersion when AI returns updated recipe', async () => {
    mockGetChatMessages.mockResolvedValue([])
    mockSaveChatMessage
      .mockResolvedValueOnce({ id: 'm2', recipe_id: 'r1', role: 'user', content: 'Make it spicier', created_at: '2026-01-01T00:01:00Z' })
      .mockResolvedValueOnce({ id: 'm3', recipe_id: 'r1', role: 'assistant', content: 'Added chili oil.', created_at: '2026-01-01T00:02:00Z' })
    mockSendChatMessage.mockResolvedValue({
      message: 'Added chili oil.',
      recipe: { ingredients: ['2 lbs pork bones', '1 tbsp chili oil'], instructions: ['Boil for 12 hours.', 'Drizzle chili oil.'] },
    })
    mockUpdateRecipe.mockResolvedValue(undefined)
    render(<RecipeChat recipe={recipe} onBack={vi.fn()} />)
    await waitFor(() => expect(mockGetChatMessages).toHaveBeenCalled())
    await userEvent.type(screen.getByPlaceholderText(/ask me to adjust/i), 'Make it spicier')
    await userEvent.click(screen.getByRole('button', { name: /^send$/i }))
    await waitFor(() =>
      expect(mockSaveRecipeVersion).toHaveBeenCalledWith(
        'r1',
        ['2 lbs pork bones', '1 tbsp chili oil'],
        ['Boil for 12 hours.', 'Drizzle chili oil.'],
      )
    )
  })

  it('disables input and Send button while sending', async () => {
    mockGetChatMessages.mockResolvedValue([])
    mockSaveChatMessage.mockResolvedValue({ id: 'm2', recipe_id: 'r1', role: 'user', content: 'Hello', created_at: '2026-01-01T00:01:00Z' })
    mockSendChatMessage.mockReturnValue(new Promise(() => {}))
    render(<RecipeChat recipe={recipe} onBack={vi.fn()} />)
    await waitFor(() => expect(mockGetChatMessages).toHaveBeenCalled())
    await userEvent.type(screen.getByPlaceholderText(/ask me to adjust/i), 'Hello')
    await userEvent.click(screen.getByRole('button', { name: /^send$/i }))
    expect(screen.getByPlaceholderText(/ask me to adjust/i)).toBeDisabled()
  })

  it('does not call updateRecipe when AI returns the same recipe', async () => {
    mockGetChatMessages.mockResolvedValue([])
    mockSaveChatMessage
      .mockResolvedValueOnce({ id: 'm2', recipe_id: 'r1', role: 'user', content: 'Does this look right?', created_at: '2026-01-01T00:01:00Z' })
      .mockResolvedValueOnce({ id: 'm3', recipe_id: 'r1', role: 'assistant', content: 'Looks great!', created_at: '2026-01-01T00:02:00Z' })
    mockSendChatMessage.mockResolvedValue({
      message: 'Looks great!',
      recipe: { ingredients: ['2 lbs pork bones'], instructions: ['Boil for 12 hours.'] },
    })
    render(<RecipeChat recipe={recipe} onBack={vi.fn()} />)
    await waitFor(() => expect(mockGetChatMessages).toHaveBeenCalled())
    await userEvent.type(screen.getByPlaceholderText(/ask me to adjust/i), 'Does this look right?')
    await userEvent.click(screen.getByRole('button', { name: /^send$/i }))
    await waitFor(() => expect(screen.getByText('Looks great!')).toBeInTheDocument())
    expect(mockUpdateRecipe).not.toHaveBeenCalled()
    expect(mockSaveRecipeVersion).not.toHaveBeenCalled()
  })

  it('shows version history unavailable when saveRecipeVersion fails', async () => {
    mockGetChatMessages.mockResolvedValue([])
    mockSaveChatMessage
      .mockResolvedValueOnce({ id: 'm2', recipe_id: 'r1', role: 'user', content: 'Make it spicier', created_at: '2026-01-01T00:01:00Z' })
      .mockResolvedValueOnce({ id: 'm3', recipe_id: 'r1', role: 'assistant', content: 'Added chili oil.', created_at: '2026-01-01T00:02:00Z' })
    mockSendChatMessage.mockResolvedValue({
      message: 'Added chili oil.',
      recipe: { ingredients: ['2 lbs pork bones', '1 tbsp chili oil'], instructions: ['Boil for 12 hours.', 'Drizzle chili oil.'] },
    })
    mockUpdateRecipe.mockResolvedValue(undefined)
    mockSaveRecipeVersion.mockRejectedValue(new Error('DB error'))
    render(<RecipeChat recipe={recipe} onBack={vi.fn()} />)
    await waitFor(() => expect(mockGetChatMessages).toHaveBeenCalled())
    await userEvent.type(screen.getByPlaceholderText(/ask me to adjust/i), 'Make it spicier')
    await userEvent.click(screen.getByRole('button', { name: /^send$/i }))
    await waitFor(() =>
      expect(screen.getByText('Recipe updated (version history unavailable)')).toBeInTheDocument()
    )
  })
})
