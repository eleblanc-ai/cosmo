import { useState } from 'react'
import { useTheme } from './theme-provider'
import { useAuth } from '../features/auth/auth-provider'
import { AuthForm } from '../features/auth/auth-form'
import { RecipeList } from '../features/recipes/recipe-list'
import { NewRecipeForm } from '../features/recipes/new-recipe-form'
import { RecipeDetail } from '../features/recipes/recipe-detail'
import { RecipeWorkshop } from '../features/recipes/recipe-workshop'
import { SourceComparison } from '../features/recipes/source-comparison'
import { RecipeChat } from '../features/recipes/recipe-chat'
import { RecipeVersionHistory } from '../features/recipes/recipe-version-history'
import { generateRecipe, updateRecipe } from '../features/recipes/recipe-service'
import type { Recipe, SourceContent } from '../features/recipes/recipe-service'

type View = 'list' | 'new' | 'detail' | 'comparison' | 'chat' | 'history' | 'workshop'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const { session, loading, signOut } = useAuth()
  const [view, setView] = useState<View>('list')
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [comparisonRecipe, setComparisonRecipe] = useState<Recipe | null>(null)
  const [chatRecipe, setChatRecipe] = useState<Recipe | null>(null)
  const [historyRecipeId, setHistoryRecipeId] = useState<string | null>(null)
  const [workshopData, setWorkshopData] = useState<{ description: string, sources: { url: string }[] } | null>(null)
  const [workshopRecipe, setWorkshopRecipe] = useState<Recipe | null>(null)

  const openDetail = (id: string) => {
    setSelectedRecipeId(id)
    setView('detail')
  }

  const openComparison = (recipe: Recipe) => {
    setComparisonRecipe(recipe)
    setView('comparison')
  }

  const openChat = (recipe: Recipe) => {
    setChatRecipe(recipe)
    setView('chat')
  }

  const openHistory = (recipeId: string) => {
    setHistoryRecipeId(recipeId)
    setView('history')
  }

  const openWorkshop = (recipe: Recipe) => {
    setWorkshopRecipe(recipe)
    setView('workshop')
  }

  const handleGenerate = async (contents: SourceContent[]) => {
    if (!comparisonRecipe) return
    const result = await generateRecipe(contents)
    await updateRecipe(comparisonRecipe.id, result)
    setSelectedRecipeId(comparisonRecipe.id)
    setView('detail')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#1C1917] flex items-center justify-center">
        <span className="text-sm text-[#1C1917]/40 dark:text-[#FAFAF9]/40">Loading…</span>
      </div>
    )
  }

  if (!session) {
    return <AuthForm />
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#1C1917] text-[#1C1917] dark:text-[#FAFAF9] font-sans">
      <header className="px-8 py-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
        <h1 className="font-black text-2xl tracking-tight">Recipe Lab</h1>
        <div className="flex items-center gap-6">
          <span className="text-sm text-[#1C1917]/60 dark:text-[#FAFAF9]/60">{session.user.email}</span>
          <button onClick={signOut} className="text-sm font-medium text-[#D97706] hover:underline">
            Sign out
          </button>
          <button onClick={toggleTheme} className="text-sm font-medium text-[#D97706] hover:underline">
            {theme === 'light' ? 'Dark' : 'Light'} mode
          </button>
        </div>
      </header>
      <main>
        {view === 'list' && (
          <RecipeList
            onNewRecipe={() => setView('new')}
            onSelect={openDetail}
          />
        )}
        {view === 'new' && (
          <NewRecipeForm
            onWorkshop={(description, sources) => {
              setWorkshopData({ description, sources })
              setView('workshop')
            }}
            onCancel={() => setView('list')}
          />
        )}
        {view === 'detail' && selectedRecipeId && (
          <RecipeDetail
            recipeId={selectedRecipeId}
            onBack={() => setView('list')}
            onDelete={() => setView('list')}
            onCompare={openComparison}
            onChat={openChat}
            onHistory={openHistory}
            onWorkshop={openWorkshop}
          />
        )}
        {view === 'comparison' && comparisonRecipe && (
          <SourceComparison
            recipe={comparisonRecipe}
            onBack={() => setView('detail')}
            onGenerate={handleGenerate}
          />
        )}
        {view === 'chat' && chatRecipe && (
          <RecipeChat
            recipe={chatRecipe}
            onBack={() => setView('detail')}
          />
        )}
        {view === 'history' && historyRecipeId && (
          <RecipeVersionHistory
            recipeId={historyRecipeId}
            onBack={() => setView('detail')}
          />
        )}
        {view === 'workshop' && session && (workshopData || workshopRecipe) && (
          workshopRecipe ? (
            <RecipeWorkshop
              existingRecipe={workshopRecipe}
              onDone={openDetail}
              onBack={() => { setWorkshopRecipe(null); setView('detail') }}
            />
          ) : workshopData && (
            <RecipeWorkshop
              userId={session.user.id}
              description={workshopData.description}
              sources={workshopData.sources}
              onDone={openDetail}
              onBack={() => setView('new')}
            />
          )
        )}
      </main>
    </div>
  )
}
