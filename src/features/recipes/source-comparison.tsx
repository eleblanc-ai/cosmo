import { useEffect, useState } from 'react'
import { fetchSourceContents, saveSourceContents, type Recipe, type SourceContent } from './recipe-service'

interface Props {
  recipe: Recipe
  onBack: () => void
  onGenerate: (contents: SourceContent[]) => Promise<void>
}

function SkeletonColumn() {
  return (
    <div className="border border-black/10 dark:border-white/10 animate-pulse">
      <div className="px-5 py-3 border-b border-black/10 dark:border-white/10">
        <div className="h-3 w-32 bg-black/10 dark:bg-white/10 rounded" />
      </div>
      <div className="px-5 py-6 space-y-6">
        <div className="space-y-2">
          <div className="h-2.5 w-20 bg-black/10 dark:bg-white/10 rounded" />
          <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded" />
          <div className="h-2 w-5/6 bg-black/10 dark:bg-white/10 rounded" />
          <div className="h-2 w-4/6 bg-black/10 dark:bg-white/10 rounded" />
          <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded" />
          <div className="h-2 w-3/4 bg-black/10 dark:bg-white/10 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-2.5 w-24 bg-black/10 dark:bg-white/10 rounded" />
          <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded" />
          <div className="h-2 w-5/6 bg-black/10 dark:bg-white/10 rounded" />
          <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded" />
          <div className="h-2 w-4/5 bg-black/10 dark:bg-white/10 rounded" />
          <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded" />
          <div className="h-2 w-2/3 bg-black/10 dark:bg-white/10 rounded" />
        </div>
      </div>
    </div>
  )
}

export function SourceComparison({ recipe, onBack, onGenerate }: Props) {
  const [contents, setContents] = useState<SourceContent[]>(recipe.source_contents ?? [])
  const [loading, setLoading] = useState(!recipe.source_contents)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    onGenerate(contents).finally(() => setGenerating(false))
  }

  useEffect(() => {
    if (recipe.source_contents) return
    fetchSourceContents(recipe.sources)
      .then(data => {
        setContents(data)
        saveSourceContents(recipe.id, data).catch(err => console.error('saveSourceContents failed:', err))
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [recipe])

  const colCount = Math.min(Math.max(recipe.sources.length, 1), 3)

  return (
    <div className="px-8 py-12">
      <button onClick={onBack} className="text-sm text-[#D97706] hover:underline mb-8 block">
        ← Back
      </button>
      <div className="flex items-end justify-between mb-10">
        <h2 className="font-black text-3xl tracking-tight">{recipe.title}</h2>
        <button
          onClick={handleGenerate}
          disabled={loading || generating}
          className="px-6 py-3 bg-[#D97706] text-white font-bold text-sm hover:bg-[#B45309] transition disabled:opacity-40 disabled:pointer-events-none"
        >
          {generating ? 'Generating…' : 'Generate recipe'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {!error && (
        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}>
          {loading
            ? recipe.sources.slice(0, 3).map((_, i) => <SkeletonColumn key={i} />)
            : contents.map((source, i) => {
                const src = recipe.sources[i]
                const title = source.title || src?.title || source.label
                const url = src?.url
                const hasContent = source.ingredients.length > 0 || source.instructions.length > 0

                return (
                  <div key={i} className="border border-black/10 dark:border-white/10">
                    <div className="px-5 py-3 border-b border-black/10 dark:border-white/10">
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block"
                        >
                          {title && title !== source.label && (
                            <span className="block text-xs font-bold uppercase tracking-widest text-[#D97706] group-hover:underline">
                              {title}
                            </span>
                          )}
                          <span className="block text-xs text-[#1C1917]/40 dark:text-[#FAFAF9]/40 group-hover:underline">
                            {source.label}
                          </span>
                        </a>
                      ) : (
                        <span className="text-xs font-bold uppercase tracking-widest text-[#1C1917]/50 dark:text-[#FAFAF9]/50">
                          {title}
                        </span>
                      )}
                    </div>
                    <div className="px-5 py-6 h-[60vh] overflow-y-auto space-y-6">
                      {!hasContent && (
                        <p className="text-sm text-[#1C1917]/40 dark:text-[#FAFAF9]/40">
                          No recipe found
                          {url && (
                            <> at <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#D97706] hover:underline">{source.label}</a></>
                          )}.
                        </p>
                      )}
                      {source.ingredients.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-3">
                            Ingredients
                          </h3>
                          <ul className="space-y-1">
                            {source.ingredients.map((item, j) => (
                              <li key={j} className="text-sm text-[#1C1917]/80 dark:text-[#FAFAF9]/80 flex gap-2">
                                <span className="text-[#D97706] shrink-0">—</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {source.instructions.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-3">
                            Instructions
                          </h3>
                          <ol className="space-y-3">
                            {source.instructions.map((step, j) => (
                              <li key={j} className="text-sm text-[#1C1917]/80 dark:text-[#FAFAF9]/80 flex gap-3">
                                <span className="font-bold text-[#D97706] shrink-0 w-5">{j + 1}.</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
        </div>
      )}
    </div>
  )
}
