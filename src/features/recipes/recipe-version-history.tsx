import { useEffect, useState } from 'react'
import {
  getRecipeVersions,
  updateVersionNotes,
  type RecipeVersion,
} from './recipe-service'

interface Props {
  recipeId: string
  onBack: () => void
}

type DiffItem = { text: string; status: 'both' | 'removed' | 'added' }

function getDiff(
  left: string[],
  right: string[],
): { left: DiffItem[]; right: DiffItem[] } {
  const leftSet = new Set(left)
  const rightSet = new Set(right)
  return {
    left: left.map(text => ({ text, status: rightSet.has(text) ? 'both' : 'removed' })),
    right: right.map(text => ({ text, status: leftSet.has(text) ? 'both' : 'added' })),
  }
}

function DiffList({ items, numbered }: { items: DiffItem[]; numbered?: boolean }) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li
          key={i}
          className={`text-sm flex gap-2 ${
            item.status === 'removed'
              ? 'text-red-500 line-through opacity-70'
              : item.status === 'added'
              ? 'text-green-600 dark:text-green-400'
              : 'text-[#1C1917]/80 dark:text-[#FAFAF9]/80'
          }`}
        >
          {numbered ? (
            <span className="font-bold shrink-0 w-5">{i + 1}.</span>
          ) : (
            <span className="shrink-0">—</span>
          )}
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  )
}

export function RecipeVersionHistory({ recipeId, onBack }: Props) {
  const [versions, setVersions] = useState<RecipeVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [compareA, setCompareA] = useState<string | null>(null)
  const [compareB, setCompareB] = useState<string | null>(null)
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null)
  const [notesInput, setNotesInput] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    getRecipeVersions(recipeId)
      .then(data => {
        setVersions(data)
        if (data.length >= 1) setCompareA(data[0].id)
        if (data.length >= 2) setCompareB(data[1].id)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [recipeId])

  const startEditNotes = (v: RecipeVersion) => {
    setEditingNotesId(v.id)
    setNotesInput(v.cook_notes ?? '')
  }

  const cancelEditNotes = () => {
    setEditingNotesId(null)
    setNotesInput('')
  }

  const handleSaveNotes = async (versionId: string) => {
    setSavingNotes(true)
    try {
      await updateVersionNotes(versionId, notesInput)
      setVersions(prev =>
        prev.map(v => v.id === versionId ? { ...v, cook_notes: notesInput } : v)
      )
      setEditingNotesId(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSavingNotes(false)
    }
  }

  const versionA = versions.find(v => v.id === compareA)
  const versionB = versions.find(v => v.id === compareB)

  const ingredientDiff = versionA && versionB
    ? getDiff(versionA.ingredients, versionB.ingredients)
    : null

  const instructionDiff = versionA && versionB
    ? getDiff(versionA.instructions, versionB.instructions)
    : null

  return (
    <div className="px-8 py-12 max-w-5xl">
      <button onClick={onBack} className="text-sm text-[#D97706] hover:underline mb-8 block">
        ← Back
      </button>
      <h2 className="font-black text-4xl tracking-tight mb-10">Version History</h2>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mb-8">{error}</p>
      )}

      {loading && (
        <p className="text-sm text-[#1C1917]/40 dark:text-[#FAFAF9]/40">Loading…</p>
      )}

      {!loading && versions.length === 0 && (
        <p className="text-sm text-[#1C1917]/40 dark:text-[#FAFAF9]/40 italic">
          No versions yet. Save the recipe to create the first version.
        </p>
      )}

      {versions.length > 0 && (
        <>
          <section className="mb-12 space-y-4">
            {versions.map(v => (
              <div key={v.id} className="border border-black/10 dark:border-white/10">
                <div className="px-5 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="font-black text-lg text-[#D97706]">v{v.version_number}</span>
                      <span className="text-xs text-[#1C1917]/40 dark:text-[#FAFAF9]/40">
                        {new Date(v.created_at).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                      <span className="text-xs text-[#1C1917]/30 dark:text-[#FAFAF9]/30">
                        {v.ingredients.length} ingredients · {v.instructions.length} steps
                      </span>
                    </div>
                    {editingNotesId === v.id ? (
                      <div className="mt-2">
                        <textarea
                          value={notesInput}
                          onChange={e => setNotesInput(e.target.value)}
                          rows={3}
                          placeholder="How did it go? What would you change?"
                          className="w-full text-sm border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 resize-none focus:outline-none focus:border-[#D97706] placeholder:text-[#1C1917]/30 dark:placeholder:text-[#FAFAF9]/30"
                        />
                        <div className="flex gap-3 mt-2">
                          <button
                            onClick={() => handleSaveNotes(v.id)}
                            disabled={savingNotes}
                            className="text-sm font-bold text-[#D97706] hover:underline disabled:opacity-40"
                          >
                            {savingNotes ? 'Saving…' : 'Save notes'}
                          </button>
                          <button
                            onClick={cancelEditNotes}
                            disabled={savingNotes}
                            className="text-sm text-[#1C1917]/50 dark:text-[#FAFAF9]/50 hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p
                        className={`text-sm mt-1 ${
                          v.cook_notes
                            ? 'text-[#1C1917]/80 dark:text-[#FAFAF9]/80'
                            : 'text-[#1C1917]/30 dark:text-[#FAFAF9]/30 italic'
                        }`}
                      >
                        {v.cook_notes ?? 'No cook notes yet'}
                      </p>
                    )}
                  </div>
                  {editingNotesId !== v.id && (
                    <button
                      onClick={() => startEditNotes(v)}
                      className="text-xs text-[#D97706] hover:underline shrink-0"
                    >
                      Edit notes
                    </button>
                  )}
                </div>
              </div>
            ))}
          </section>

          {versions.length >= 2 && (
            <section className="border-t border-black/10 dark:border-white/10 pt-10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1917]/50 dark:text-[#FAFAF9]/50 mb-6">
                Compare versions
              </h3>
              <div className="flex gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#1C1917]/50 dark:text-[#FAFAF9]/50 uppercase tracking-widest font-bold">A</span>
                  <select
                    value={compareA ?? ''}
                    onChange={e => setCompareA(e.target.value)}
                    className="text-sm border border-black/10 dark:border-white/10 bg-transparent px-3 py-1.5 focus:outline-none focus:border-[#D97706]"
                  >
                    {versions.map(v => (
                      <option key={v.id} value={v.id}>v{v.version_number}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#1C1917]/50 dark:text-[#FAFAF9]/50 uppercase tracking-widest font-bold">B</span>
                  <select
                    value={compareB ?? ''}
                    onChange={e => setCompareB(e.target.value)}
                    className="text-sm border border-black/10 dark:border-white/10 bg-transparent px-3 py-1.5 focus:outline-none focus:border-[#D97706]"
                  >
                    {versions.map(v => (
                      <option key={v.id} value={v.id}>v{v.version_number}</option>
                    ))}
                  </select>
                </div>
              </div>

              {ingredientDiff && instructionDiff && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-1">
                      v{versionA?.version_number} — Ingredients
                    </p>
                    <DiffList items={ingredientDiff.left} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-1">
                      v{versionB?.version_number} — Ingredients
                    </p>
                    <DiffList items={ingredientDiff.right} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-1">
                      v{versionA?.version_number} — Instructions
                    </p>
                    <DiffList items={instructionDiff.left} numbered />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-1">
                      v{versionB?.version_number} — Instructions
                    </p>
                    <DiffList items={instructionDiff.right} numbered />
                  </div>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  )
}
