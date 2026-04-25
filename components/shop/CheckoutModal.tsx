"use client"

import { useState } from "react"
import { X, ShoppingCart, ExternalLink } from "lucide-react"
import type { Product } from "@/lib/shop-db"

interface Props {
  product: Product
  phone: string
  onClose: () => void
}

export function CheckoutModal({ product, phone, onClose }: Props) {
  const [name, setName]         = useState("")
  const [email, setEmail]       = useState("")
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")
  const [checkoutUrl, setCheckoutUrl] = useState("")

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/710/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, payerName: name, payerEmail: email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Erro ao processar"); setLoading(false); return }
      setCheckoutUrl(data.checkout_url)
    } catch { setError("Falha de conexão") }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Sheet on mobile, centered modal on sm+ */}
      <div className="w-full sm:max-w-md sm:mx-4 bg-zinc-900 border border-zinc-700 sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
          <h2 className="text-white font-bold text-base sm:text-lg">Confirmar compra</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition p-1"><X size={18} /></button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {/* Product summary */}
          <div className="bg-zinc-800 rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
            {product.cover_url && (
              <img src={product.cover_url} alt={product.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm sm:text-base truncate">{product.name}</p>
              <p className="text-zinc-400 text-xs sm:text-sm">1 unidade</p>
            </div>
            <span className="text-white font-bold text-base sm:text-lg whitespace-nowrap shrink-0">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
          </div>

          {!checkoutUrl ? (
            <form onSubmit={handleCheckout} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1.5">Seu nome</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome completo" required
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 sm:px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 text-sm transition" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1.5">E-mail</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" required
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 sm:px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 text-sm transition" />
              </div>
              <p className="text-xs text-zinc-500">
                WhatsApp vinculado: <span className="text-zinc-300">{phone}</span>
              </p>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition disabled:opacity-50 text-sm sm:text-base">
                <ShoppingCart size={15} />
                {loading ? "Gerando link…" : "Ir para pagamento"}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-2">
              <div className="text-green-400 text-4xl">✓</div>
              <p className="text-white font-semibold">Link de pagamento gerado!</p>
              <p className="text-zinc-400 text-sm">Clique abaixo para concluir no MercadoPago</p>
              <a href={checkoutUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-500 transition text-sm sm:text-base">
                <ExternalLink size={15} />Pagar agora
              </a>
            </div>
          )}
        </div>

        {/* Mobile drag handle hint */}
        <div className="sm:hidden flex justify-center pb-4">
          <div className="w-10 h-1 bg-zinc-700 rounded-full" />
        </div>
      </div>
    </div>
  )
}
