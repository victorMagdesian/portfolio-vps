"use client"

import { useState, useEffect } from "react"
import { X, Phone, Mail, ChevronRight, MessageSquare, RefreshCw } from "lucide-react"
import type { Order, OrderEvent } from "@/lib/shop-db"

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:    { label: "Pendente",    color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  approved:   { label: "Aprovado",   color: "bg-green-500/20 text-green-300 border-green-500/30" },
  in_process: { label: "Em processo",color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  rejected:   { label: "Rejeitado",  color: "bg-red-500/20 text-red-300 border-red-500/30" },
  cancelled:  { label: "Cancelado",  color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30" },
  refunded:   { label: "Estornado",  color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  error:      { label: "Erro",       color: "bg-red-700/20 text-red-400 border-red-700/30" },
}

const EVENT_ICONS: Record<string, string> = {
  created: "🛒", checkout_created: "🔗", payment: "💳",
  status_change: "🔄", admin_note: "📝", error: "⚠️",
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABELS[status] || { label: status, color: "bg-zinc-700 text-zinc-300" }
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${s.color}`}>{s.label}</span>
}

function fmtPhone(d: string) {
  if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
  return d
}
function fmtDate(s: string) {
  return new Date(s + "Z").toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" })
}

function OrderDetail({ orderId, onClose }: { orderId: number; onClose: () => void }) {
  const [data, setData]         = useState<{ order: Order; events: OrderEvent[] } | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [note, setNote]         = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [saving, setSaving]     = useState(false)

  async function load() {
    const res = await fetch(`/api/720-admin/orders/${orderId}`)
    const d = await res.json()
    setData(d); setAdminNotes(d.order.admin_notes || ""); setNewStatus(d.order.status)
  }
  useEffect(() => { load() }, [orderId])

  async function save() {
    setSaving(true)
    const body: Record<string, string> = { admin_notes: adminNotes }
    if (newStatus !== data?.order.status) body.status = newStatus
    if (note.trim()) body.note = note.trim()
    const res = await fetch(`/api/720-admin/orders/${orderId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    })
    const d = await res.json(); setData(d); setNote(""); setSaving(false)
  }

  if (!data) return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="text-zinc-400 animate-pulse text-sm">Carregando…</div>
    </div>
  )

  const { order, events } = data
  const waLink = `https://wa.me/55${order.phone}?text=${encodeURIComponent(`Olá! Sobre seu pedido #${order.id} (${order.product_name})`)}`

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-start sm:justify-center sm:pt-6 overflow-y-auto">
      <div className="w-full sm:max-w-2xl sm:mx-4 bg-zinc-900 border border-zinc-700 sm:rounded-2xl rounded-t-2xl shadow-2xl sm:mb-8">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 rounded-t-2xl z-10">
          <div>
            <h2 className="text-white font-bold text-sm sm:text-base">Pedido #{order.id}</h2>
            <p className="text-zinc-400 text-xs">{fmtDate(order.created_at)}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1"><X size={18} /></button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Customer + Order — stacked on mobile, grid on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-zinc-800 rounded-xl p-3 sm:p-4 space-y-2">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Cliente</p>
              <p className="text-white font-medium text-sm">{order.payer_name || "—"}</p>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300">
                <Phone size={12} />
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">
                  {fmtPhone(order.phone)}
                </a>
              </div>
              {order.payer_email && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300">
                  <Mail size={12} />
                  <a href={`mailto:${order.payer_email}`} className="hover:text-blue-400 transition truncate">
                    {order.payer_email}
                  </a>
                </div>
              )}
            </div>
            <div className="bg-zinc-800 rounded-xl p-3 sm:p-4 space-y-2">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Pedido</p>
              <p className="text-white font-medium text-sm truncate">{order.product_name}</p>
              <p className="text-lg sm:text-xl font-bold text-white">R$ {order.amount.toFixed(2).replace(".", ",")}</p>
              <StatusBadge status={order.status} />
            </div>
          </div>

          {/* Gateway info */}
          {(order.gateway_preference_id || order.checkout_url) && (
            <div className="bg-zinc-800/50 rounded-xl p-3 sm:p-4 text-xs sm:text-sm space-y-1">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Gateway</p>
              {order.gateway_preference_id && (
                <p className="text-zinc-300 break-all">Preferência: <span className="text-zinc-100 font-mono text-xs">{order.gateway_preference_id}</span></p>
              )}
              {order.gateway_transaction_id && (
                <p className="text-zinc-300">Transação: <span className="text-zinc-100 font-mono text-xs">{order.gateway_transaction_id}</span></p>
              )}
              {order.checkout_url && (
                <a href={order.checkout_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs break-all">
                  {order.checkout_url}
                </a>
              )}
            </div>
          )}

          {/* Timeline */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Histórico</p>
            <div className="space-y-2 max-h-40 sm:max-h-52 overflow-y-auto pr-1">
              {events.map(ev => (
                <div key={ev.id} className="flex gap-2 sm:gap-3 text-xs sm:text-sm">
                  <span className="text-base shrink-0">{EVENT_ICONS[ev.type] || "•"}</span>
                  <div>
                    <p className="text-zinc-200 leading-snug">{ev.content}</p>
                    <p className="text-zinc-500 text-xs">{fmtDate(ev.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin controls */}
          <div className="space-y-3 border-t border-zinc-800 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Alterar status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-400">
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">WhatsApp</label>
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-3 py-2 rounded-lg transition justify-center">
                  <MessageSquare size={13} />Abrir conversa
                </a>
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Notas internas</label>
              <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={2}
                placeholder="Observações privadas…"
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-400 resize-none" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Evento manual</label>
              <input value={note} onChange={e => setNote(e.target.value)}
                placeholder="Ex: Cliente confirmou pagamento…"
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-400" />
            </div>

            <button onClick={save} disabled={saving}
              className="w-full bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-zinc-200 transition disabled:opacity-50 text-sm">
              {saving ? "Salvando…" : "Salvar alterações"}
            </button>
          </div>
        </div>
        <div className="sm:hidden flex justify-center pb-4"><div className="w-10 h-1 bg-zinc-700 rounded-full" /></div>
      </div>
    </div>
  )
}

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail]   = useState<number | null>(null)
  const [filter, setFilter]   = useState("all")

  async function load() {
    setLoading(true)
    const res = await fetch("/api/720-admin/orders")
    setOrders(await res.json()); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-base sm:text-lg">Pedidos</h2>
        <button onClick={load} className="text-zinc-400 hover:text-white transition p-1"><RefreshCw size={15} /></button>
      </div>

      {/* Filters — horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {["all", "pending", "approved", "rejected", "cancelled"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`shrink-0 px-3 py-1 text-xs rounded-full border transition ${
              filter === s ? "bg-white text-black border-white" : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500"
            }`}>
            {s === "all" ? "Todos" : STATUS_LABELS[s]?.label || s}
          </button>
        ))}
      </div>

      {loading
        ? <div className="text-zinc-500 text-sm animate-pulse">Carregando…</div>
        : filtered.length === 0
        ? <div className="text-zinc-500 text-sm text-center py-12">Nenhum pedido</div>
        : <div className="space-y-2">
            {filtered.map(order => (
              <button key={order.id} onClick={() => setDetail(order.id)}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl px-3 sm:px-4 py-3 text-left transition group">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="text-zinc-500 text-xs font-mono shrink-0">#{order.id}</span>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{order.product_name}</p>
                      <p className="text-zinc-400 text-xs truncate">{fmtPhone(order.phone)}{order.payer_name ? ` · ${order.payer_name}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={order.status} />
                    <span className="text-white font-semibold text-xs sm:text-sm">R$ {order.amount.toFixed(2).replace(".", ",")}</span>
                    <ChevronRight size={13} className="text-zinc-500 group-hover:text-zinc-300" />
                  </div>
                </div>
              </button>
            ))}
          </div>
      }

      {detail !== null && (
        <OrderDetail orderId={detail} onClose={() => { setDetail(null); load() }} />
      )}
    </div>
  )
}
