"use client"

import { useState, useEffect, useRef } from "react"

interface Props {
  onAuthenticated: () => void
}

type Step = "password" | "phone"

function applyPhoneMask(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ""
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function livePhoneError(digits: string): string | null {
  if (!digits) return null
  if (digits.length < 2) return "Informe o DDD (ex: 11, 21, 31…)"
  const ddd = parseInt(digits.slice(0, 2), 10)
  const validDDDs = [
    11,12,13,14,15,16,17,18,19,
    21,22,24,27,28,
    31,32,33,34,35,37,38,
    41,42,43,44,45,46,47,48,49,
    51,53,54,55,61,62,63,64,65,66,67,68,69,
    71,73,74,75,77,79,
    81,82,83,84,85,86,87,88,89,
    91,92,93,94,95,96,97,98,99,
  ]
  if (digits.length >= 2 && !validDDDs.includes(ddd)) return `DDD ${ddd} inválido`
  if (digits.length === 2) return "Número incompleto — continue digitando"
  if (digits.length < 10) return "Número incompleto"
  if (digits.length === 10) return null
  if (digits.length === 11 && digits[2] !== "9") return "Celular deve começar com 9 após o DDD"
  return null
}

function phoneStrength(digits: string): { label: string; color: string; pct: number } {
  if (!digits) return { label: "", color: "bg-zinc-700", pct: 0 }
  if (digits.length < 2) return { label: "DDD…", color: "bg-red-500", pct: 15 }
  if (digits.length < 10) return { label: `${digits.length}/11 dígitos`, color: "bg-yellow-500", pct: (digits.length / 11) * 100 }
  const ddd = parseInt(digits.slice(0, 2), 10)
  const validDDDs = [11,12,13,14,15,16,17,18,19,21,22,24,27,28,31,32,33,34,35,37,38,41,42,43,44,45,46,47,48,49,51,53,54,55,61,62,63,64,65,66,67,68,69,71,73,74,75,77,79,81,82,83,84,85,86,87,88,89,91,92,93,94,95,96,97,98,99]
  if (!validDDDs.includes(ddd)) return { label: "DDD inválido", color: "bg-red-500", pct: 40 }
  if (digits.length === 11 && digits[2] !== "9") return { label: "Celular inválido", color: "bg-red-500", pct: 80 }
  return { label: "Número válido ✓", color: "bg-green-500", pct: 100 }
}

export function AuthGate({ onAuthenticated }: Props) {
  const [step, setStep] = useState<Step>("password")
  const [password, setPassword] = useState("")
  const [phoneRaw, setPhoneRaw] = useState("")
  const [phoneMasked, setPhoneMasked] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const phoneRef = useRef<HTMLInputElement>(null)

  const phoneDigits = phoneRaw.replace(/\D/g, "")
  const liveError = livePhoneError(phoneDigits)
  const strength = phoneStrength(phoneDigits)
  const phoneReady = phoneDigits.length >= 10 && !livePhoneError(phoneDigits)

  useEffect(() => {
    if (step === "phone") setTimeout(() => phoneRef.current?.focus(), 100)
  }, [step])

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = applyPhoneMask(e.target.value)
    setPhoneMasked(masked)
    setPhoneRaw(masked)
    setError("")
  }

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!password) { setError("Digite a senha"); return }
    setStep("phone")
    setError("")
  }

  async function submitPhone(e: React.FormEvent) {
    e.preventDefault()
    if (!phoneReady) {
      setError(liveError || "Número inválido")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/710/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, phone: phoneDigits }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Erro"); setLoading(false); return }
      onAuthenticated()
    } catch {
      setError("Falha de conexão")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-8">
        {/* Logo / branding */}
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-white tracking-tight">710</div>
          <p className="text-zinc-400 text-sm mt-1">Acesso exclusivo</p>
        </div>

        {step === "password" && (
          <form onSubmit={submitPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Senha de acesso
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError("") }}
                placeholder="••••••••••"
                autoFocus
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-zinc-200 transition"
            >
              Continuar →
            </button>
          </form>
        )}

        {step === "phone" && (
          <form onSubmit={submitPhone} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Seu WhatsApp com DDD
              </label>
              <input
                ref={phoneRef}
                type="tel"
                inputMode="numeric"
                value={phoneMasked}
                onChange={handlePhoneChange}
                placeholder="(11) 99999-9999"
                maxLength={16}
                className={`w-full bg-zinc-800 border rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none transition ${
                  phoneDigits.length >= 2 && liveError
                    ? "border-red-500 focus:border-red-400"
                    : phoneReady
                    ? "border-green-500 focus:border-green-400"
                    : "border-zinc-600 focus:border-zinc-400"
                }`}
              />

              {/* Progress bar */}
              {phoneDigits.length > 0 && (
                <div className="mt-2">
                  <div className="h-1 bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.pct}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${
                    strength.pct === 100 ? "text-green-400" :
                    liveError ? "text-red-400" : "text-yellow-400"
                  }`}>
                    {strength.label || liveError}
                  </p>
                </div>
              )}

              {/* Static hint */}
              {!phoneDigits && (
                <p className="text-zinc-500 text-xs mt-1.5">
                  Comece pelo DDD — ex: <span className="text-zinc-300">(11)</span> para São Paulo
                </p>
              )}
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={!phoneReady || loading}
              className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-zinc-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Verificando…" : "Entrar →"}
            </button>

            <button
              type="button"
              onClick={() => { setStep("password"); setError("") }}
              className="w-full text-zinc-500 text-sm hover:text-zinc-300 transition"
            >
              ← Voltar
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
