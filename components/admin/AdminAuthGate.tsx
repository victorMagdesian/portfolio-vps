"use client"

import { useState } from "react"

interface Props {
  onAuthenticated: () => void
}

export function AdminAuthGate({ onAuthenticated }: Props) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch("/api/720-admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || "Senha incorreta"); setLoading(false); return }
    onAuthenticated()
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-xs mx-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-white">720 Admin</div>
          <p className="text-zinc-500 text-sm mt-1">Painel administrativo</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError("") }}
            placeholder="Senha de acesso"
            autoFocus
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {loading ? "Verificando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  )
}
