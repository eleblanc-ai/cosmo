import { useEffect, useRef, useState } from 'react'
import {
  getChatMessages,
  saveChatMessage,
  sendChatMessage,
  updateRecipe,
  saveRecipeVersion,
  type ChatMessage,
  type Recipe,
} from './recipe-service'

interface Props {
  recipe: Recipe
  onBack: () => void
}

export function RecipeChat({ recipe, onBack }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [recipeUpdated, setRecipeUpdated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [versionError, setVersionError] = useState(false)
  const [currentRecipe, setCurrentRecipe] = useState({
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
  })
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getChatMessages(recipe.id)
      .then(setMessages)
      .catch((e: Error) => setError(e.message))
  }, [recipe.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: 'smooth' })
  }, [messages])

  function arraysEqual(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((v, i) => v === b[i])
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || sending) return

    const optimistic: ChatMessage = {
      id: `temp-${Date.now()}`,
      recipe_id: recipe.id,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    }

    setMessages(prev => [...prev, optimistic])
    setInput('')
    setSending(true)
    setError(null)
    setVersionError(false)

    try {
      await saveChatMessage(recipe.id, 'user', text)
      const allMessages = [...messages, optimistic]
      const response = await sendChatMessage(
        { ...recipe, ingredients: currentRecipe.ingredients, instructions: currentRecipe.instructions },
        allMessages,
      )
      const assistantMsg = await saveChatMessage(recipe.id, 'assistant', response.message)
      setMessages(prev => [...prev, assistantMsg])

      const changed =
        !arraysEqual(response.recipe.ingredients, currentRecipe.ingredients) ||
        !arraysEqual(response.recipe.instructions, currentRecipe.instructions)

      if (changed) {
        await updateRecipe(recipe.id, response.recipe)
        setCurrentRecipe(response.recipe)
        setRecipeUpdated(true)
        saveRecipeVersion(recipe.id, response.recipe.ingredients, response.recipe.instructions)
          .catch(() => setVersionError(true))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="px-8 py-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between shrink-0">
        <button onClick={onBack} className="text-sm text-[#D97706] hover:underline">
          ← Back
        </button>
        <h2 className="font-black text-xl tracking-tight">{recipe.title}</h2>
        <div className="w-12" />
      </header>

      {recipeUpdated && (
        <div className="px-8 py-3 bg-[#D97706]/10 border-b border-[#D97706]/20 shrink-0">
          <p className="text-sm text-[#D97706] font-medium">
            {versionError ? 'Recipe updated (version history unavailable)' : 'Recipe updated'}
          </p>
        </div>
      )}

      {error && (
        <div className="px-8 py-3 bg-red-50 dark:bg-red-900/10 border-b border-red-200 dark:border-red-800 shrink-0">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {messages.length === 0 && !sending && (
          <p className="text-sm text-[#1C1917]/40 dark:text-[#FAFAF9]/40 italic text-center py-12">
            Ask me anything about this recipe — I can adjust ingredients, techniques, or answer questions.
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#D97706] text-white'
                  : 'bg-black/5 dark:bg-white/5 text-[#1C1917]/90 dark:text-[#FAFAF9]/90'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="px-4 py-3 bg-black/5 dark:bg-white/5 text-sm text-[#1C1917]/40 dark:text-[#FAFAF9]/40 italic">
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-8 py-6 border-t border-black/10 dark:border-white/10 shrink-0">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            placeholder="Ask me to adjust the recipe…"
            rows={2}
            className="flex-1 text-sm border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 resize-none focus:outline-none focus:border-[#D97706] disabled:opacity-50 placeholder:text-[#1C1917]/30 dark:placeholder:text-[#FAFAF9]/30"
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className="px-6 py-2 bg-[#D97706] text-white font-bold text-sm hover:bg-[#B45309] transition disabled:opacity-40 disabled:pointer-events-none"
          >
            {sending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
