import { useEffect, useState } from 'react'
import { getRecipe, deleteRecipe, updateRecipe, saveRecipeVersion, type Recipe } from './recipe-service'
import { ConfirmModal } from '../../shared/components/confirm-modal'

interface Props {
  recipeId: string
  onBack: () => void
  onDelete: () => void
  onCompare: (recipe: Recipe) => void
  onChat: (recipe: Recipe) => void
  onHistory: (recipeId: string) => void
  onWorkshop: (recipe: Recipe) => void
}

export function RecipeDetail({ recipeId, onBack, onDelete, onCompare, onChat, onHistory, onWorkshop }: Props) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draftIngredients, setDraftIngredients] = useState<string[]>([])
  const [draftInstructions, setDraftInstructions] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getRecipe(recipeId)
      .then(setRecipe)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [recipeId])

  const handleConfirmDelete = async () => {
    setConfirmOpen(false)
    setDeleting(true)
    try {
      await deleteRecipe(recipeId)
      onDelete()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setDeleting(false)
    }
  }

  const enterEdit = () => {
    setDraftIngredients(recipe?.ingredients ?? [])
    setDraftInstructions(recipe?.instructions ?? [])
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
  }

  const handleSave = async () => {
    if (!recipe) return
    setSaving(true)
    try {
      await updateRecipe(recipe.id, { ingredients: draftIngredients, instructions: draftInstructions })
      saveRecipeVersion(recipe.id, draftIngredients, draftInstructions).catch(console.error)
      setRecipe({ ...recipe, ingredients: draftIngredients, instructions: draftInstructions })
      setEditing(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="text-sm text-[#1C1917]/40 dark:text-[#FAFAF9]/40">Loading…</span>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="px-8 py-12">
        <button onClick={onBack} className="text-sm text-[#D97706] hover:underline mb-8 block">
          ← Back
        </button>
        <p className="text-sm text-red-600 dark:text-red-400">{error ?? 'Recipe not found'}</p>
      </div>
    )
  }

  const hasRecipe = recipe.ingredients.length > 0 || recipe.instructions.length > 0

  return (
    <div className="px-8 py-12 max-w-2xl">
      {confirmOpen && (
        <ConfirmModal
          message="Delete this recipe? This cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
      <button onClick={onBack} className="text-sm text-[#D97706] hover:underline mb-8 block">
        ← Back
      </button>
      <h2 className="font-black text-4xl tracking-tight mb-10">{recipe.title}</h2>

      <section className="mb-10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1917]/50 dark:text-[#FAFAF9]/50 mb-4">
          Sources
        </h3>
        {recipe.sources.length === 0 ? (
          <p className="text-sm text-[#1C1917]/40 dark:text-[#FAFAF9]/40">No sources.</p>
        ) : (
          <ul className="space-y-3">
            {recipe.sources.map((source, i) => (
              <li key={i} className="text-sm">
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D97706] hover:underline break-all"
                  >
                    {source.title ?? source.url}
                  </a>
                ) : (
                  <p className="text-[#1C1917]/70 dark:text-[#FAFAF9]/70 line-clamp-2">
                    {source.raw_text}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="py-10 border-t border-black/10 dark:border-white/10 mb-10">
        {!hasRecipe && !editing && (
          <>
            <p className="text-sm text-[#1C1917]/40 dark:text-[#FAFAF9]/40 italic mb-6">
              No recipe generated yet.
            </p>
            {recipe.sources.length > 0 && (
              <button
                onClick={() => onCompare(recipe)}
                className="px-6 py-3 bg-[#D97706] text-white font-bold text-sm hover:bg-[#B45309] transition"
              >
                Compare sources
              </button>
            )}
          </>
        )}

        {hasRecipe && !editing && (
          <>
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-4">
                Ingredients
              </h3>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                {recipe.ingredients.map((item, i) => (
                  <li key={i} className="text-sm text-[#1C1917]/80 dark:text-[#FAFAF9]/80 flex gap-2">
                    <span className="text-[#D97706] shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-4">
                Instructions
              </h3>
              <ol className="space-y-3">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="text-sm text-[#1C1917]/80 dark:text-[#FAFAF9]/80 flex gap-3">
                    <span className="font-bold text-[#D97706] shrink-0 w-5">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {recipe.ai_context && (
              <div className="mb-8 p-6 border border-black/10 dark:border-white/10 space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1917]/50 dark:text-[#FAFAF9]/50">
                  Recipe Context
                </h3>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-1">Flavor Profile</p>
                  <p className="text-sm text-[#1C1917]/80 dark:text-[#FAFAF9]/80">{recipe.ai_context.flavor_profile}</p>
                </div>
                {recipe.ai_context.highlights.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-1">Key Techniques</p>
                    <ul className="space-y-1">
                      {recipe.ai_context.highlights.map((h, i) => (
                        <li key={i} className="text-sm text-[#1C1917]/80 dark:text-[#FAFAF9]/80 flex gap-2">
                          <span className="text-[#D97706] shrink-0">—</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {recipe.ai_context.pitfalls.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-1">Pitfalls</p>
                    <ul className="space-y-1">
                      {recipe.ai_context.pitfalls.map((p, i) => (
                        <li key={i} className="text-sm text-[#1C1917]/80 dark:text-[#FAFAF9]/80 flex gap-2">
                          <span className="text-[#D97706] shrink-0">—</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {recipe.ai_context.notes && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-1">Source Notes</p>
                    <p className="text-sm text-[#1C1917]/80 dark:text-[#FAFAF9]/80">{recipe.ai_context.notes}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={enterEdit}
                className="px-6 py-3 bg-[#D97706] text-white font-bold text-sm hover:bg-[#B45309] transition"
              >
                Edit
              </button>
              <button
                onClick={() => onChat(recipe)}
                className="px-6 py-3 border border-[#D97706] text-[#D97706] font-bold text-sm hover:bg-[#D97706]/5 transition"
              >
                Chat
              </button>
              <button
                onClick={() => onHistory(recipe.id)}
                className="px-6 py-3 border border-[#D97706] text-[#D97706] font-bold text-sm hover:bg-[#D97706]/5 transition"
              >
                History
              </button>
              <button
                onClick={() => onWorkshop(recipe)}
                className="px-6 py-3 border border-[#D97706] text-[#D97706] font-bold text-sm hover:bg-[#D97706]/5 transition"
              >
                Workshop
              </button>
              {recipe.sources.length > 0 && (
                <button
                  onClick={() => onCompare(recipe)}
                  className="px-6 py-3 border border-[#D97706] text-[#D97706] font-bold text-sm hover:bg-[#D97706]/5 transition"
                >
                  Compare sources
                </button>
              )}
            </div>
          </>
        )}

        {editing && (
          <>
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-4">
                Ingredients
              </h3>
              <ul className="space-y-2 mb-3">
                {draftIngredients.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <input
                      value={item}
                      onChange={e => setDraftIngredients(d => d.map((x, j) => j === i ? e.target.value : x))}
                      className="flex-1 text-sm border border-black/10 dark:border-white/10 bg-transparent px-3 py-1.5 focus:outline-none focus:border-[#D97706]"
                    />
                    <button
                      onClick={() => setDraftIngredients(d => d.filter((_, j) => j !== i))}
                      className="text-sm text-[#1C1917]/40 dark:text-[#FAFAF9]/40 hover:text-red-500 px-2"
                      aria-label="Remove ingredient"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setDraftIngredients(d => [...d, ''])}
                className="text-sm text-[#D97706] hover:underline"
              >
                + Add ingredient
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-4">
                Instructions
              </h3>
              <ol className="space-y-2 mb-3">
                {draftInstructions.map((step, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="font-bold text-[#D97706] shrink-0 w-5 pt-1.5 text-sm">{i + 1}.</span>
                    <input
                      value={step}
                      onChange={e => setDraftInstructions(d => d.map((x, j) => j === i ? e.target.value : x))}
                      className="flex-1 text-sm border border-black/10 dark:border-white/10 bg-transparent px-3 py-1.5 focus:outline-none focus:border-[#D97706]"
                    />
                    <button
                      onClick={() => setDraftInstructions(d => d.filter((_, j) => j !== i))}
                      className="text-sm text-[#1C1917]/40 dark:text-[#FAFAF9]/40 hover:text-red-500 px-2 pt-1.5"
                      aria-label="Remove instruction"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ol>
              <button
                onClick={() => setDraftInstructions(d => [...d, ''])}
                className="text-sm text-[#D97706] hover:underline"
              >
                + Add instruction
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-[#D97706] text-white font-bold text-sm hover:bg-[#B45309] transition disabled:opacity-40 disabled:pointer-events-none"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="px-6 py-3 border border-black/20 dark:border-white/20 font-bold text-sm hover:border-black/40 dark:hover:border-white/40 transition disabled:opacity-40"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </section>

      <button
        onClick={() => setConfirmOpen(true)}
        disabled={deleting}
        className="text-sm text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
      >
        {deleting ? 'Deleting…' : 'Delete recipe'}
      </button>
    </div>
  )
}
