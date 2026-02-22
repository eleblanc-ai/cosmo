import { useEffect, useRef, useState } from 'react'
import {
  createRecipe,
  updateRecipe,
  analyzeAndGenerate,
  craftRecipe,
  type WorkshopAnalysis,
  type RecipeSource,
  type Recipe,
} from './recipe-service'

interface Props {
  userId?: string
  description?: string
  sources?: { url: string }[]
  existingRecipe?: Recipe
  onDone: (recipeId: string) => void
  onBack: () => void
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export function RecipeWorkshop({ userId, description, sources, existingRecipe, onDone, onBack }: Props) {
  const workshopDescription = existingRecipe?.title ?? description ?? ''
  const [analysis, setAnalysis] = useState<WorkshopAnalysis | null>(null)
  const [recipeId, setRecipeId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentRecipe, setCurrentRecipe] = useState<{ ingredients: string[], instructions: string[] } | null>(null)
  const [displayRecipe, setDisplayRecipe] = useState<{ ingredients: string[], instructions: string[] } | null>(null)
  const [chatLoading, setChatLoading] = useState(false)
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [chatInput, setChatInput] = useState('')
  const [changedIngredients, setChangedIngredients] = useState<Set<number>>(new Set())
  const [changedInstructions, setChangedInstructions] = useState<Set<number>>(new Set())
  const chatEndRef = useRef<HTMLDivElement>(null)
  const changeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    return () => { if (changeTimerRef.current) clearTimeout(changeTimerRef.current) }
  }, [])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const init = async () => {
      try {
        if (existingRecipe) {
          // Reopen mode: data is already here — show instantly
          setRecipeId(existingRecipe.id)
          const reopenAnalysis: WorkshopAnalysis = {
            general_context: existingRecipe.ai_context ?? { flavor_profile: '', highlights: [], pitfalls: [], notes: '' },
            source_insights: [],
            recipe: { ingredients: existingRecipe.ingredients, instructions: existingRecipe.instructions },
          }
          setAnalysis(reopenAnalysis)
          setCurrentRecipe(reopenAnalysis.recipe)
          setDisplayRecipe(reopenAnalysis.recipe)
          setLoading(false)
          setChatLoading(true)

          const craftResponse = await craftRecipe({
            description: existingRecipe.title,
            general_context: reopenAnalysis.general_context,
            source_insights: [],
            recipe: reopenAnalysis.recipe,
            messages: [],
          })
          setChatMessages([{ role: 'assistant', content: craftResponse.message }])
          setQuickReplies(craftResponse.quick_replies ?? [])
        } else {
          // New recipe mode
          const recipeSources: RecipeSource[] = (sources ?? []).map(s => ({ url: s.url }))
          const recipe = await createRecipe(userId!, workshopDescription, recipeSources)
          setRecipeId(recipe.id)

          const result = await analyzeAndGenerate(workshopDescription, recipeSources)
          setAnalysis(result)
          setCurrentRecipe(result.recipe)
          setDisplayRecipe(result.recipe)

          await updateRecipe(recipe.id, {
            ingredients: result.recipe.ingredients,
            instructions: result.recipe.instructions,
            ai_context: result.general_context,
          })
          setLoading(false)
          setChatLoading(true)

          const craftResponse = await craftRecipe({
            description: workshopDescription,
            general_context: result.general_context,
            source_insights: result.source_insights,
            recipe: result.recipe,
            messages: [],
          })
          setChatMessages([{ role: 'assistant', content: craftResponse.message }])
          setQuickReplies(craftResponse.quick_replies ?? [])
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong')
      } finally {
        setLoading(false)
        setChatLoading(false)
      }
    }

    init()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSend = async (userMessage: string) => {
    if (!userMessage.trim() || chatLoading || !analysis || !currentRecipe || !recipeId) return

    const updatedMessages: ChatMessage[] = [...chatMessages, { role: 'user', content: userMessage }]
    setChatMessages(updatedMessages)
    setChatInput('')
    setQuickReplies([])
    setChatLoading(true)

    try {
      const response = await craftRecipe({
        description: workshopDescription,
        general_context: analysis.general_context,
        source_insights: analysis.source_insights,
        recipe: currentRecipe,
        messages: chatMessages,
        userMessage,
      })

      setChatMessages([...updatedMessages, { role: 'assistant', content: response.message }])

      const recipeChanged =
        JSON.stringify(response.recipe.ingredients) !== JSON.stringify(currentRecipe.ingredients) ||
        JSON.stringify(response.recipe.instructions) !== JSON.stringify(currentRecipe.instructions)

      if (recipeChanged) {
        const oldIngs = currentRecipe.ingredients
        const oldInsts = currentRecipe.instructions
        const newIngs = response.recipe.ingredients
        const newInsts = response.recipe.instructions

        // Update craft context + DB immediately
        setCurrentRecipe(response.recipe)
        await updateRecipe(recipeId, {
          ingredients: newIngs,
          instructions: newInsts,
        })

        // Build ordered patch list (modifications + additions)
        const patches: Array<{ kind: 'ingredient' | 'instruction'; i: number; value: string }> = []
        newIngs.forEach((ing, i) => {
          if (ing !== oldIngs[i]) patches.push({ kind: 'ingredient', i, value: ing })
        })
        newInsts.forEach((step, i) => {
          if (step !== oldInsts[i]) patches.push({ kind: 'instruction', i, value: step })
        })

        // Handle deletions immediately (trim before stagger)
        if (newIngs.length < oldIngs.length || newInsts.length < oldInsts.length) {
          setDisplayRecipe(prev => ({
            ingredients: (prev ?? response.recipe).ingredients.slice(0, newIngs.length),
            instructions: (prev ?? response.recipe).instructions.slice(0, newInsts.length),
          }))
        }

        // Reset any prior highlights
        setChangedIngredients(new Set())
        setChangedInstructions(new Set())
        if (changeTimerRef.current) clearTimeout(changeTimerRef.current)

        const CHAR_MS = 25
        const ITEM_PAUSE = 150

        let patchIdx = 0
        let charIdx = 0

        const tick = () => {
          if (patchIdx >= patches.length) {
            changeTimerRef.current = setTimeout(() => {
              setChangedIngredients(new Set())
              setChangedInstructions(new Set())
              setDisplayRecipe(response.recipe)
            }, 1800)
            return
          }

          const patch = patches[patchIdx]

          if (charIdx === 0) {
            if (patch.kind === 'ingredient') {
              setChangedIngredients(prev => new Set([...prev, patch.i]))
            } else {
              setChangedInstructions(prev => new Set([...prev, patch.i]))
            }
            setDisplayRecipe(prev => {
              if (!prev) return response.recipe
              const u = { ingredients: [...prev.ingredients], instructions: [...prev.instructions] }
              if (patch.kind === 'ingredient') u.ingredients[patch.i] = ''
              else u.instructions[patch.i] = ''
              return u
            })
            charIdx = 1
            changeTimerRef.current = setTimeout(tick, CHAR_MS)
            return
          }

          const partial = patch.value.slice(0, charIdx)
          setDisplayRecipe(prev => {
            if (!prev) return response.recipe
            const u = { ingredients: [...prev.ingredients], instructions: [...prev.instructions] }
            if (patch.kind === 'ingredient') u.ingredients[patch.i] = partial
            else u.instructions[patch.i] = partial
            return u
          })

          if (charIdx < patch.value.length) {
            charIdx++
            changeTimerRef.current = setTimeout(tick, CHAR_MS)
          } else {
            patchIdx++
            charIdx = 0
            changeTimerRef.current = setTimeout(tick, ITEM_PAUSE)
          }
        }

        tick()
      }

      setQuickReplies(response.quick_replies ?? [])
    } catch {
      setChatMessages([...updatedMessages, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setChatLoading(false)
      chatEndRef.current?.scrollIntoView?.({ behavior: 'smooth' })
    }
  }

  if (error) {
    return (
      <div className="px-8 py-12 max-w-2xl">
        <button onClick={onBack} className="text-sm text-[#D97706] hover:underline mb-8 block">
          ← Back
        </button>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }


  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-sm text-[#D97706] hover:underline">
          ← Back
        </button>
        {!loading && recipeId && (
          <button
            onClick={() => onDone(recipeId)}
            className="px-6 py-2 bg-[#D97706] text-white font-bold text-sm hover:bg-[#B45309] transition"
          >
            Done — view recipe
          </button>
        )}
      </div>

      <h2 className="font-black text-3xl tracking-tight mb-8">{workshopDescription}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8">
        {/* Left panel: analysis + recipe draft */}
        <div className="space-y-8">
          {loading ? (
            <>
              <div className="space-y-3" aria-label="Loading analysis">
                <div className="h-4 bg-black/10 dark:bg-white/10 w-24 animate-pulse" />
                <div className="h-3 bg-black/10 dark:bg-white/10 w-full animate-pulse" />
                <div className="h-3 bg-black/10 dark:bg-white/10 w-4/5 animate-pulse" />
                <div className="h-3 bg-black/10 dark:bg-white/10 w-3/5 animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-black/10 dark:bg-white/10 w-32 animate-pulse" />
                <div className="h-3 bg-black/10 dark:bg-white/10 w-full animate-pulse" />
                <div className="h-3 bg-black/10 dark:bg-white/10 w-5/6 animate-pulse" />
                <div className="h-3 bg-black/10 dark:bg-white/10 w-4/6 animate-pulse" />
                <div className="h-3 bg-black/10 dark:bg-white/10 w-3/6 animate-pulse" />
              </div>
            </>
          ) : analysis ? (
            <>
              {/* General context */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1917]/50 dark:text-[#FAFAF9]/50 mb-4">
                  Recipe Context
                </h3>
                <p className="text-sm text-[#1C1917]/80 dark:text-[#FAFAF9]/80 mb-4 leading-relaxed">
                  {analysis.general_context.flavor_profile}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {analysis.general_context.highlights.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-2">Highlights</p>
                      <ul className="space-y-1">
                        {analysis.general_context.highlights.map((h, i) => (
                          <li key={i} className="text-xs text-[#1C1917]/70 dark:text-[#FAFAF9]/70 flex gap-2">
                            <span className="text-[#D97706] shrink-0">—</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.general_context.pitfalls.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#1C1917]/50 dark:text-[#FAFAF9]/50 mb-2">Watch out</p>
                      <ul className="space-y-1">
                        {analysis.general_context.pitfalls.map((p, i) => (
                          <li key={i} className="text-xs text-[#1C1917]/70 dark:text-[#FAFAF9]/70 flex gap-2">
                            <span className="shrink-0">—</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {analysis.general_context.notes && (
                  <p className="text-xs text-[#1C1917]/50 dark:text-[#FAFAF9]/50 italic">
                    {analysis.general_context.notes}
                  </p>
                )}
              </section>

              {/* Source insights */}
              {analysis.source_insights.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1917]/50 dark:text-[#FAFAF9]/50 mb-4">
                    From Your Sources
                  </h3>
                  <div className="space-y-4">
                    {analysis.source_insights.map((s, i) => (
                      <div key={i}>
                        <p className="text-xs font-bold text-[#1C1917]/60 dark:text-[#FAFAF9]/60 mb-1">{s.label}</p>
                        <ul className="space-y-1">
                          {s.insights.map((insight, j) => (
                            <li key={j} className="text-xs text-[#1C1917]/70 dark:text-[#FAFAF9]/70 flex gap-2">
                              <span className="text-[#D97706] shrink-0">—</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Recipe draft (live) */}
              {displayRecipe && (
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1917]/50 dark:text-[#FAFAF9]/50 mb-4">
                    Recipe Draft
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#1C1917]/40 dark:text-[#FAFAF9]/40 mb-3">
                        Ingredients
                      </p>
                      <ul className="space-y-2">
                        {displayRecipe.ingredients.map((ing, i) => (
                          <li key={i} className={`text-sm flex gap-2 transition-colors duration-700 ${changedIngredients.has(i) ? 'text-[#D97706]' : 'text-[#1C1917]/80 dark:text-[#FAFAF9]/80'}`}>
                            <span className="text-[#D97706] shrink-0">—</span>
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#1C1917]/40 dark:text-[#FAFAF9]/40 mb-3">
                        Instructions
                      </p>
                      <ol className="space-y-3 list-decimal list-outside ml-4">
                        {displayRecipe.instructions.map((step, i) => (
                          <li key={i} className={`text-sm leading-relaxed transition-colors duration-700 ${changedInstructions.has(i) ? 'text-[#D97706]' : 'text-[#1C1917]/80 dark:text-[#FAFAF9]/80'}`}>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </section>
              )}
            </>
          ) : null}
        </div>

        {/* Right panel: guided chat */}
        <div className="border border-black/10 dark:border-white/10 flex flex-col">
          <div className="px-4 py-3 border-b border-black/10 dark:border-white/10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1C1917]/50 dark:text-[#FAFAF9]/50">
              Recipe assistant
            </p>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[60vh] px-4 py-4 space-y-3">
            {loading && (
              <div className="flex gap-2 items-start">
                <div className="max-w-[80%] px-3 py-2 bg-black/5 dark:bg-white/5">
                  <div className="h-3 bg-black/10 dark:bg-white/10 w-32 animate-pulse" />
                </div>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#D97706]/10 text-[#1C1917] dark:text-[#FAFAF9]'
                      : 'bg-black/5 dark:bg-white/5 text-[#1C1917]/80 dark:text-[#FAFAF9]/80'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-3 py-2 bg-black/5 dark:bg-white/5">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-[#1C1917]/30 dark:bg-[#FAFAF9]/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-[#1C1917]/30 dark:bg-[#FAFAF9]/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-[#1C1917]/30 dark:bg-[#FAFAF9]/30 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {quickReplies.length > 0 && (
            <div className="px-4 py-2 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-2">
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(reply)}
                  disabled={chatLoading}
                  className="px-3 py-1 text-xs border border-black/20 dark:border-white/20 text-[#1C1917]/70 dark:text-[#FAFAF9]/70 hover:border-[#D97706] hover:text-[#D97706] disabled:opacity-50 transition"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          <div className="px-4 py-3 border-t border-black/10 dark:border-white/10 flex gap-2">
            <input
              type="text"
              placeholder="Ask or suggest a change…"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSend(chatInput) } }}
              disabled={chatLoading || loading}
              className="flex-1 px-3 py-2 bg-transparent border border-black/20 dark:border-white/20 text-[#1C1917] dark:text-[#FAFAF9] placeholder:text-[#1C1917]/30 dark:placeholder:text-[#FAFAF9]/30 text-sm focus:outline-none focus:border-[#D97706] disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => handleSend(chatInput)}
              disabled={chatLoading || loading || !chatInput.trim()}
              className="px-4 py-2 bg-[#D97706] text-white font-bold text-sm hover:bg-[#B45309] disabled:opacity-50 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
