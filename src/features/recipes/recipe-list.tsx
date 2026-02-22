import { useEffect, useState } from 'react'
import { useAuth } from '../auth/auth-provider'
import { listRecipes, type Recipe } from './recipe-service'

interface Props {
  onNewRecipe: () => void
  onSelect: (id: string) => void
}

export function RecipeList({ onNewRecipe, onSelect }: Props) {
  const { session } = useAuth()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) return
    listRecipes(session.user.id)
      .then(setRecipes)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [session])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="text-sm text-[#1C1917]/40 dark:text-[#FAFAF9]/40">Loading…</span>
      </div>
    )
  }

  return (
    <div className="px-8 py-12">
      <div className="flex items-center justify-between mb-12">
        <h2 className="font-black text-3xl tracking-tight">Your recipes</h2>
        <button
          onClick={onNewRecipe}
          className="px-5 py-2.5 bg-[#D97706] text-white text-sm font-bold hover:bg-[#B45309] transition"
        >
          New recipe
        </button>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400 mb-6">{error}</p>}
      {recipes.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-[#1C1917]/40 dark:text-[#FAFAF9]/40 text-lg">No recipes yet.</p>
          <p className="text-[#1C1917]/40 dark:text-[#FAFAF9]/40 text-sm mt-2">
            Add your first recipe to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {recipes.map(recipe => (
            <div
              key={recipe.id}
              onClick={() => onSelect(recipe.id)}
              className="px-6 py-5 border border-black/10 dark:border-white/10 cursor-pointer hover:border-black/30 dark:hover:border-white/30 transition"
            >
              <h3 className="font-bold text-lg tracking-tight">{recipe.title}</h3>
              <p className="text-sm text-[#1C1917]/50 dark:text-[#FAFAF9]/50 mt-1">
                {recipe.sources.length} source{recipe.sources.length !== 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
