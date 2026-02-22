import { useState } from 'react'
import { searchRecipes, type SearchResult } from './recipe-service'

interface Props {
  onWorkshop: (description: string, sources: { url: string }[]) => void
  onCancel: () => void
}

export function NewRecipeForm({ onWorkshop, onCancel }: Props) {
  const [searchDescription, setSearchDescription] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set())

  const handleSearch = async () => {
    const desc = searchDescription.trim()
    if (!desc || searching) return
    setSearching(true)
    setSearchError(null)
    setSearchResults([])
    setSelectedUrls(new Set())
    try {
      const results = await searchRecipes(desc)
      setSearchResults(results)
      if (results.length === 0) setSearchError('No results found. Try a different description.')
    } catch {
      setSearchError('Search failed. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  const handleToggleUrl = (url: string) => {
    setSelectedUrls(prev => {
      const next = new Set(prev)
      if (next.has(url)) next.delete(url)
      else next.add(url)
      return next
    })
  }

  const handleUseSelected = () => {
    const sources = searchResults
      .filter(r => selectedUrls.has(r.url))
      .map(r => ({ url: r.url }))
    onWorkshop(searchDescription.trim(), sources)
  }

  return (
    <div className="px-8 py-12 max-w-2xl">
      <button onClick={onCancel} className="text-sm text-[#D97706] hover:underline mb-8 block">
        ← Back
      </button>
      <h2 className="font-black text-3xl tracking-tight mb-10">New recipe</h2>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-[#1C1917]/50 dark:text-[#FAFAF9]/50 mb-2">
          Describe a dish
        </label>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="e.g. creamy mushroom risotto"
            value={searchDescription}
            onChange={e => setSearchDescription(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSearch() } }}
            className="flex-1 px-4 py-3 bg-transparent border border-black/20 dark:border-white/20 text-[#1C1917] dark:text-[#FAFAF9] placeholder:text-[#1C1917]/30 dark:placeholder:text-[#FAFAF9]/30 text-sm focus:outline-none focus:border-[#D97706]"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={searching || !searchDescription.trim()}
            className="px-6 py-3 bg-[#D97706] text-white font-bold text-sm hover:bg-[#B45309] disabled:opacity-50 transition"
          >
            {searching ? 'Searching…' : 'Search'}
          </button>
        </div>
        {searchError && <p className="text-sm text-red-600 dark:text-red-400 mb-4">{searchError}</p>}
        {searchResults.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-[#1C1917]/50 dark:text-[#FAFAF9]/50">
                {selectedUrls.size > 0 ? `${selectedUrls.size} selected` : 'Select recipes to use as sources'}
              </p>
              <button
                type="button"
                onClick={handleUseSelected}
                disabled={selectedUrls.size === 0}
                className="px-6 py-2 bg-[#D97706] text-white font-bold text-sm hover:bg-[#B45309] disabled:opacity-50 transition"
              >
                Use {selectedUrls.size > 0 ? `${selectedUrls.size} selected` : 'selected'}
              </button>
            </div>
            <ul className="space-y-3">
              {searchResults.map((r) => (
                <li key={r.url}>
                  <label className="flex gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedUrls.has(r.url)}
                      onChange={() => handleToggleUrl(r.url)}
                      className="mt-1 shrink-0 accent-[#D97706]"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#1C1917] dark:text-[#FAFAF9] group-hover:text-[#D97706] transition line-clamp-1">
                        {r.title}
                      </p>
                      <p className="text-xs text-[#1C1917]/40 dark:text-[#FAFAF9]/40 mb-0.5">
                        {new URL(r.url).hostname}
                      </p>
                      {r.snippet && (
                        <p className="text-xs text-[#1C1917]/60 dark:text-[#FAFAF9]/60 line-clamp-2">
                          {r.snippet}
                        </p>
                      )}
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
