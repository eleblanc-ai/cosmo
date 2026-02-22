import { supabase } from '../../shared/config/supabase'

export interface RecipeSource {
  url?: string
  raw_text?: string
  title?: string
}

export interface AiContext {
  flavor_profile: string
  highlights: string[]
  pitfalls: string[]
  notes: string
}

export interface Recipe {
  id: string
  title: string
  sources: RecipeSource[]
  ingredients: string[]
  instructions: string[]
  source_contents?: SourceContent[]
  ai_context?: AiContext
  created_at: string
}

export async function listRecipes(userId: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('id, title, sources, ingredients, instructions, source_contents, ai_context, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Recipe[]
}

export async function getRecipe(id: string): Promise<Recipe> {
  const { data, error } = await supabase
    .from('recipes')
    .select('id, title, sources, ingredients, instructions, source_contents, ai_context, created_at')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Recipe
}

export async function deleteRecipe(id: string): Promise<void> {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function updateRecipe(
  id: string,
  patch: { ingredients: string[], instructions: string[], ai_context?: AiContext },
): Promise<void> {
  const { error } = await supabase
    .from('recipes')
    .update(patch)
    .eq('id', id)
  if (error) throw error
}

export async function saveSourceContents(
  id: string,
  contents: SourceContent[],
): Promise<void> {
  const { error } = await supabase
    .from('recipes')
    .update({ source_contents: contents })
    .eq('id', id)
  if (error) throw error
}

export interface SourceContent {
  label: string
  title: string
  ingredients: string[]
  instructions: string[]
}

export async function fetchSourceContents(
  sources: RecipeSource[],
): Promise<SourceContent[]> {
  const { data, error } = await supabase.functions.invoke('fetch-sources', {
    body: { sources },
  })
  if (error) throw new Error('Failed to fetch source contents')
  return (data as { contents: SourceContent[] }).contents
}

export async function generateRecipe(
  sources: SourceContent[],
): Promise<{ ingredients: string[], instructions: string[], ai_context?: AiContext }> {
  const { data, error } = await supabase.functions.invoke('generate-recipe', {
    body: { sources },
  })
  if (error) throw new Error('Failed to generate recipe')
  return data as { ingredients: string[], instructions: string[], ai_context?: AiContext }
}

export async function createRecipe(
  userId: string,
  title: string,
  sources: RecipeSource[],
): Promise<Recipe> {
  const { data, error } = await supabase
    .from('recipes')
    .insert({ user_id: userId, title, sources })
    .select('id, title, sources, ingredients, instructions, source_contents, ai_context, created_at')
    .single()
  if (error) throw error
  return data as Recipe
}

export interface ChatMessage {
  id: string
  recipe_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export async function getChatMessages(recipeId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, recipe_id, role, content, created_at')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data as ChatMessage[]
}

export async function saveChatMessage(
  recipeId: string,
  role: 'user' | 'assistant',
  content: string,
): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ recipe_id: recipeId, role, content })
    .select('id, recipe_id, role, content, created_at')
    .single()
  if (error) throw error
  return data as ChatMessage
}

export async function sendChatMessage(
  recipe: Recipe,
  messages: ChatMessage[],
): Promise<{ message: string, recipe: { ingredients: string[], instructions: string[] } }> {
  const { data, error } = await supabase.functions.invoke('chat-recipe', {
    body: {
      recipe: { title: recipe.title, ingredients: recipe.ingredients, instructions: recipe.instructions },
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    },
  })
  if (error) throw new Error('Failed to send chat message')
  return data as { message: string, recipe: { ingredients: string[], instructions: string[] } }
}

export interface RecipeVersion {
  id: string
  recipe_id: string
  version_number: number
  ingredients: string[]
  instructions: string[]
  cook_notes: string | null
  created_at: string
}

export async function getRecipeVersions(recipeId: string): Promise<RecipeVersion[]> {
  const { data, error } = await supabase
    .from('recipe_versions')
    .select('id, recipe_id, version_number, ingredients, instructions, cook_notes, created_at')
    .eq('recipe_id', recipeId)
    .order('version_number', { ascending: false })
  if (error) throw error
  return data as RecipeVersion[]
}

export async function saveRecipeVersion(
  recipeId: string,
  ingredients: string[],
  instructions: string[],
): Promise<RecipeVersion> {
  const { data: maxData } = await supabase
    .from('recipe_versions')
    .select('version_number')
    .eq('recipe_id', recipeId)
    .order('version_number', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextVersion = ((maxData as { version_number: number } | null)?.version_number ?? 0) + 1

  const { data, error } = await supabase
    .from('recipe_versions')
    .insert({ recipe_id: recipeId, version_number: nextVersion, ingredients, instructions })
    .select('id, recipe_id, version_number, ingredients, instructions, cook_notes, created_at')
    .single()
  if (error) throw error
  return data as RecipeVersion
}

export async function updateVersionNotes(versionId: string, notes: string): Promise<void> {
  const { error } = await supabase
    .from('recipe_versions')
    .update({ cook_notes: notes })
    .eq('id', versionId)
  if (error) throw error
}

export interface SearchResult {
  title: string
  url: string
  snippet: string
}

export async function searchRecipes(description: string): Promise<SearchResult[]> {
  const { data, error } = await supabase.functions.invoke('search-recipes', {
    body: { description },
  })
  if (error) throw new Error('Failed to search recipes')
  return (data as { results: SearchResult[] }).results
}

export interface WorkshopAnalysis {
  general_context: AiContext
  source_insights: { label: string; insights: string[] }[]
  recipe: { ingredients: string[]; instructions: string[] }
}

export async function analyzeAndGenerate(
  description: string,
  sources: RecipeSource[],
): Promise<WorkshopAnalysis> {
  const { data, error } = await supabase.functions.invoke('analyze-sources', {
    body: { description, sources },
  })
  if (error) throw new Error('Failed to analyze sources')
  return data as WorkshopAnalysis
}

export interface CraftRecipeResponse {
  message: string
  recipe: { ingredients: string[], instructions: string[] }
  quick_replies?: string[]
}

export async function craftRecipe(input: {
  description: string
  general_context: AiContext
  source_insights: { label: string, insights: string[] }[]
  recipe: { ingredients: string[], instructions: string[] }
  messages: { role: 'user' | 'assistant', content: string }[]
  userMessage?: string
}): Promise<CraftRecipeResponse> {
  const { data, error } = await supabase.functions.invoke('craft-recipe', {
    body: input,
  })
  if (error) throw new Error('Failed to get craft response')
  return data as CraftRecipeResponse
}
