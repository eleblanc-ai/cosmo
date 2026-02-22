import { useState } from 'react'
import { useAuth } from './auth-provider'

export function AuthForm() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = mode === 'sign-in'
      ? await signIn(email, password)
      : await signUp(email, password)
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#1C1917] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-black text-5xl tracking-tight text-[#1C1917] dark:text-[#FAFAF9] mb-10">
          Recipe Lab
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-transparent border border-black/20 dark:border-white/20 text-[#1C1917] dark:text-[#FAFAF9] placeholder:text-[#1C1917]/40 dark:placeholder:text-[#FAFAF9]/40 text-sm focus:outline-none focus:border-[#D97706]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-transparent border border-black/20 dark:border-white/20 text-[#1C1917] dark:text-[#FAFAF9] placeholder:text-[#1C1917]/40 dark:placeholder:text-[#FAFAF9]/40 text-sm focus:outline-none focus:border-[#D97706]"
          />
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#D97706] text-white font-bold text-sm tracking-wide hover:bg-[#B45309] disabled:opacity-50 transition"
          >
            {loading ? '...' : mode === 'sign-in' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <button
          onClick={() => setMode(m => m === 'sign-in' ? 'sign-up' : 'sign-in')}
          className="mt-6 text-sm text-[#D97706] hover:underline"
        >
          {mode === 'sign-in' ? 'No account? Sign up' : 'Have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
