"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, ExternalLink } from "lucide-react"

interface Props { onClose: () => void }

const PRESETS = [5, 10, 15, 25]

/* ─── Vending Machine 3D Coffee ──────────────────────────────────────────── */
function VendingCoffee({ state }: {
  state: "idle" | "processing" | "waiting" | "dropping" | "done"
}) {
  return (
    <div className="relative flex items-center justify-center" style={{ height: 160, perspective: 600 }}>
      {/* Machine body */}
      <div className="absolute inset-x-4 inset-y-0 rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg,#292524 0%,#1c1917 100%)",
          border: "1px solid rgba(251,191,36,0.2)",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.6), 0 4px 24px rgba(0,0,0,0.4)",
        }}>
        {/* Glass */}
        <div className="absolute inset-3 rounded-xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg,rgba(251,191,36,0.04) 0%,rgba(0,0,0,0.3) 100%)",
            border: "1px solid rgba(251,191,36,0.12)",
          }}>
          <div className="absolute top-0 left-0 w-1/3 h-full opacity-10"
            style={{ background: "linear-gradient(90deg,rgba(255,255,255,0.4),transparent)" }} />
        </div>
        {/* Slot */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-3 rounded-t-sm"
          style={{ background: "rgba(0,0,0,0.8)", border: "1px solid rgba(251,191,36,0.15)", borderBottom: "none" }} />
        {/* Waiting pulse ring */}
        {state === "waiting" && (
          <div className="absolute inset-3 rounded-xl pointer-events-none"
            style={{ border: "1px solid rgba(251,191,36,0.5)", animation: "ringPulse 1.5s ease-in-out infinite" }} />
        )}
      </div>

      {/* Cup */}
      <div className="relative z-10" style={{
        animation:
          state === "idle"       ? "bobCup 2.5s ease-in-out infinite" :
          state === "processing" ? "shakeCup 0.12s ease-in-out infinite" :
          state === "waiting"    ? "bobCup 1.8s ease-in-out infinite" :
          state === "dropping"   ? "dropCup 0.6s cubic-bezier(.55,-0.1,.7,.8) forwards" :
          state === "done"       ? "landedCup 0.4s ease forwards" : "none",
      }}>
        <div style={{ transformStyle: "preserve-3d", transform: "rotateX(12deg)" }}>
          <div className="relative" style={{
            width: 48, height: 56,
            background: state === "waiting"
              ? "linear-gradient(160deg,#fbbf24 0%,#d97706 100%)"
              : "linear-gradient(160deg,#d97706 0%,#92400e 100%)",
            clipPath: "polygon(8% 0%,92% 0%,100% 100%,0% 100%)",
            borderRadius: "0 0 8px 8px",
            boxShadow: state === "waiting"
              ? "inset -4px 0 8px rgba(0,0,0,0.3), 0 0 20px rgba(251,191,36,0.4)"
              : "inset -4px 0 8px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)",
            transition: "background 0.5s ease, box-shadow 0.5s ease",
          }}>
            <div className="absolute -top-2 left-0 right-0 h-3 rounded-sm"
              style={{ background: "linear-gradient(180deg,#fbbf24,#d97706)", borderRadius: 3 }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span style={{ fontSize: 20, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}>☕</span>
            </div>
            <div className="absolute top-3 left-2 w-2 h-8 rounded-full opacity-20"
              style={{ background: "white", transform: "rotate(-5deg)" }} />
          </div>
          <div className="absolute right-0 top-1/2" style={{
            width: 14, height: 20,
            border: "3px solid #92400e",
            borderLeft: "none",
            borderRadius: "0 10px 10px 0",
            transform: "translate(10px,-50%)",
          }} />
        </div>

        {/* Steam */}
        {state === "done" && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-2">
            {[0,1,2].map(i => (
              <div key={i} className="w-1 rounded-full" style={{
                height: 20,
                background: "rgba(251,191,36,0.5)",
                animation: `steam 1.4s ${i * 0.25}s ease-out infinite`,
                transformOrigin: "bottom",
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Drop trail */}
      {state === "dropping" && [...Array(6)].map((_, i) => (
        <div key={i} className="absolute left-1/2 w-1 h-1 rounded-full" style={{
          background: "#d97706",
          top: `${20 + i * 10}%`,
          animation: `trailDot 0.5s ${i * 0.06}s ease forwards`,
          opacity: 0,
        }} />
      ))}

      {/* Splash */}
      {state === "done" && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2" style={{
          width: 48, height: 6, borderRadius: "50%",
          background: "rgba(217,119,6,0.4)",
          animation: "splash 0.4s ease forwards",
        }} />
      )}
    </div>
  )
}

/* ─── Main Modal ──────────────────────────────────────────────────────────── */
export function CoffeeModal({ onClose }: Props) {
  const [amount, setAmount]             = useState(10)
  const [custom, setCustom]             = useState("")
  const [useCustom, setUseCustom]       = useState(false)
  const [loading, setLoading]           = useState(false)
  const [machineState, setMachineState] = useState<"idle"|"processing"|"waiting"|"dropping"|"done">("idle")
  const [checkoutUrl, setCheckoutUrl]   = useState("")
  const [prefId, setPrefId]             = useState("")
  const [error, setError]               = useState("")
  const [mounted, setMounted]           = useState(false)
  const pollRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => { window.removeEventListener("keydown", onKey); stopPolling() }
  }, [onClose])

  function stopPolling() {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
  }

  const checkStatus = useCallback(async (pref: string) => {
    try {
      const res = await fetch(`/api/coffee?pref=${encodeURIComponent(pref)}`)
      const data = await res.json()
      if (data.status === "approved") {
        stopPolling()
        setMachineState("dropping")
        await new Promise(r => setTimeout(r, 650))
        setMachineState("done")
      }
    } catch {/* silent */}
  }, [])

  function startPolling(pref: string) {
    stopPolling()
    pollRef.current = setInterval(() => checkStatus(pref), 3000)
  }

  const finalAmount = useCustom ? parseFloat(custom) || 0 : amount

  async function generate() {
    if (!finalAmount || finalAmount < 1) { setError("Valor mínimo: R$ 1,00"); return }
    setLoading(true)
    setError("")
    setMachineState("processing")
    await new Promise(r => setTimeout(r, 450))

    try {
      const res = await fetch("/api/coffee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Erro ao gerar link")
        setMachineState("idle")
        setLoading(false)
        return
      }
      setCheckoutUrl(data.checkout_url)
      setPrefId(data.preference_id)
      setMachineState("waiting")
      startPolling(data.preference_id)
    } catch {
      setError("Falha de conexão")
      setMachineState("idle")
    }
    setLoading(false)
  }

  function reset() {
    stopPolling()
    setCheckoutUrl(""); setPrefId(""); setAmount(10)
    setCustom(""); setUseCustom(false)
    setMachineState("idle"); setError("")
  }

  const isSelected = (v: number) => !useCustom && amount === v
  const paid = machineState === "dropping" || machineState === "done"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.75)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl"
        style={{
          transform: mounted ? "translateY(0) scale(1)" : "translateY(28px) scale(0.94)",
          opacity: mounted ? 1 : 0,
          transition: "transform 0.4s cubic-bezier(.22,.68,0,1.15), opacity 0.3s ease",
          background: "linear-gradient(160deg,#1c1917 0%,#231f1e 60%,#1c1917 100%)",
          border: "1px solid rgba(251,191,36,0.18)",
          boxShadow: "0 0 80px rgba(251,191,36,0.07), 0 30px 60px rgba(0,0,0,0.7)",
        }}>
        <div className="absolute top-0 inset-x-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent,rgba(251,191,36,0.7),transparent)" }} />
        <div className="absolute top-0 inset-x-0 h-16 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(251,191,36,0.08) 0%,transparent 70%)" }} />

        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 text-stone-500 hover:text-white transition p-1.5 rounded-full hover:bg-white/10">
          <X size={16} />
        </button>

        <div className="px-6 pt-6 pb-7 space-y-5">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(251,191,36,0.5)" }}>
              Apoie o projeto
            </p>
            <h2 className="text-xl font-bold text-white">Me pague um café ☕</h2>
          </div>

          <VendingCoffee state={machineState} />

          {/* Status label */}
          <p className="text-center text-xs" style={{ color: "rgba(251,191,36,0.55)" }}>
            {machineState === "idle"       && "Selecione um valor e confirme"}
            {machineState === "processing" && "Preparando seu café…"}
            {machineState === "waiting"    && "Aguardando confirmação do pagamento…"}
            {machineState === "dropping"   && "Pagamento confirmado! Servindo ☕"}
            {machineState === "done"       && "Obrigado! Café entregue com sucesso ✨"}
          </p>

          {/* Waiting state: show open link + cancel */}
          {machineState === "waiting" && checkoutUrl && (
            <div className="space-y-2">
              <a href={checkoutUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-black transition-all"
                style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", boxShadow: "0 6px 24px rgba(245,158,11,0.3)" }}>
                <ExternalLink size={16} />
                Abrir checkout MercadoPago
              </a>
              <p className="text-center text-stone-600 text-xs">
                O café cai automaticamente ao confirmar o pagamento
              </p>
              <button onClick={reset}
                className="block mx-auto text-stone-600 text-xs hover:text-stone-400 transition pt-1">
                Cancelar
              </button>
            </div>
          )}

          {/* Done state */}
          {paid && machineState === "done" && (
            <div className="text-center space-y-3">
              <p className="text-stone-300 text-sm">Muito obrigado! Você foi incrível 🙏</p>
              <button onClick={reset}
                className="text-stone-500 text-xs hover:text-stone-300 transition">
                ← Pagar mais um café
              </button>
            </div>
          )}

          {/* Idle / processing: show controls */}
          {(machineState === "idle" || machineState === "processing") && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESETS.map(v => (
                  <button key={v} onClick={() => { setAmount(v); setUseCustom(false); setError("") }}
                    disabled={loading}
                    className="relative py-3 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-50 overflow-hidden"
                    style={{
                      background: isSelected(v) ? "linear-gradient(135deg,#f59e0b,#d97706)" : "rgba(255,255,255,0.05)",
                      color: isSelected(v) ? "#000" : "#a8a29e",
                      border: isSelected(v) ? "none" : "1px solid rgba(255,255,255,0.07)",
                      transform: isSelected(v) ? "scale(1.05)" : "scale(1)",
                      boxShadow: isSelected(v) ? "0 4px 16px rgba(245,158,11,0.35)" : "none",
                    }}>
                    R${v}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200"
                style={{
                  background: useCustom ? "rgba(251,191,36,0.07)" : "rgba(255,255,255,0.03)",
                  border: useCustom ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(255,255,255,0.07)",
                }}>
                <span className="text-stone-500 text-sm shrink-0">R$</span>
                <input ref={inputRef} type="number" min="1" step="1"
                  value={custom}
                  onChange={e => { setCustom(e.target.value); setUseCustom(true); setError("") }}
                  onFocus={() => setUseCustom(true)}
                  placeholder="Outro valor…" disabled={loading}
                  className="flex-1 bg-transparent text-white placeholder-stone-700 text-sm focus:outline-none disabled:opacity-50" />
              </div>

              {finalAmount >= 1 && (
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl"
                  style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.1)" }}>
                  <span className="text-stone-400 text-sm">
                    {Math.max(1, Math.floor(finalAmount / 5))} café{Math.floor(finalAmount / 5) !== 1 ? "s" : ""} ☕
                  </span>
                  <span className="text-white font-bold">R$ {finalAmount.toFixed(2).replace(".", ",")}</span>
                </div>
              )}

              {error && <p className="text-red-400 text-xs text-center">{error}</p>}

              <button onClick={generate}
                disabled={loading || finalAmount < 1}
                className="w-full py-4 rounded-xl font-bold text-black transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg,#f59e0b 0%,#d97706 100%)",
                  boxShadow: finalAmount >= 1 ? "0 6px 28px rgba(245,158,11,0.3)" : "none",
                }}>
                {loading
                  ? <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Preparando…
                    </span>
                  : "☕ Pagar café"
                }
              </button>
            </>
          )}

          <p className="text-center text-stone-700 text-xs">Pagamento seguro via MercadoPago</p>
        </div>
      </div>

      <style>{`
        @keyframes bobCup    { 0%,100%{transform:translateY(0)}       50%{transform:translateY(-6px)} }
        @keyframes shakeCup  { 0%,100%{transform:translateX(0)}        25%{transform:translateX(-4px) rotate(-2deg)} 75%{transform:translateX(4px) rotate(2deg)} }
        @keyframes dropCup   { 0%{transform:translateY(0) scale(1);opacity:1} 60%{transform:translateY(62px) scale(1.05);opacity:1} 80%{transform:translateY(58px) scale(0.95);opacity:1} 100%{transform:translateY(62px) scale(1);opacity:0} }
        @keyframes landedCup { 0%{transform:translateY(62px) scale(0.9);opacity:0} 60%{transform:translateY(-4px) scale(1.05);opacity:1} 100%{transform:translateY(0) scale(1);opacity:1} }
        @keyframes steam     { 0%{transform:scaleX(1) translateY(0);opacity:0} 20%{opacity:.7} 80%{transform:scaleX(1.5) translateY(-14px);opacity:.3} 100%{transform:scaleX(.8) translateY(-20px);opacity:0} }
        @keyframes trailDot  { 0%{transform:translateX(-50%) scale(1);opacity:.8} 100%{transform:translateX(-50%) scale(0);opacity:0} }
        @keyframes splash    { 0%{transform:scaleX(.2);opacity:.8} 100%{transform:scaleX(1.4);opacity:0} }
        @keyframes ringPulse { 0%,100%{opacity:.3;transform:scale(1)} 50%{opacity:.8;transform:scale(1.01)} }
      `}</style>
    </div>
  )
}
