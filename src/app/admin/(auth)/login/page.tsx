'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pizza, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'

export default function AdminLoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const err = await signIn(email, password)
    if (err) {
      setError('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }
    router.push('/admin')
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl bg-stone-800/60 border border-stone-700/60 text-foreground text-sm placeholder:text-stone-500 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600/50 transition-colors'

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-700/20 border border-brand-700/40 flex items-center justify-center">
            <Pizza className="w-6 h-6 text-brand-500" />
          </div>
          <div className="text-center">
            <h1 className="font-bold text-foreground text-xl">Área Administrativa</h1>
            <p className="text-stone-500 text-sm">Forno & Lenha</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-stone-400 uppercase tracking-wider">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@exemplo.com"
              className={inputCls}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-stone-400 uppercase tracking-wider">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
              required
            />
          </div>

          {error && (
            <p className="text-brand-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-full bg-brand-700 text-white font-semibold py-3 hover:bg-brand-600 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
