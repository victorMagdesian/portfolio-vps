"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react"
import type { Product, Group } from "@/lib/shop-db"

type ProductWithGroup = Product & { group_name?: string }

function ProductForm({ initial, groups, onSave, onCancel }: {
  initial?: ProductWithGroup | null
  groups: Group[]
  onSave: () => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    name:        initial?.name || "",
    description: initial?.description || "",
    price:       initial?.price?.toString() || "",
    cover_url:   initial?.cover_url || "",
    group_id:    initial?.group_id?.toString() || "",
    active:      initial?.active !== 0,
    sort_order:  initial?.sort_order?.toString() || "0",
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  async function uploadImage(file: File) {
    setUploading(true)
    const fd = new FormData(); fd.append("file", file)
    const res = await fetch("/api/720-admin/upload", { method: "POST", body: fd })
    const data = await res.json()
    if (res.ok) setForm(f => ({ ...f, cover_url: data.url }))
    else setError(data.error || "Erro no upload")
    setUploading(false)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.price) { setError("Nome e preço são obrigatórios"); return }
    setSaving(true)
    const body = {
      name: form.name, description: form.description,
      price: parseFloat(form.price), cover_url: form.cover_url,
      group_id: form.group_id ? parseInt(form.group_id) : null,
      active: form.active, sort_order: parseInt(form.sort_order) || 0,
    }
    const url = initial ? `/api/720-admin/products/${initial.id}` : "/api/720-admin/products"
    const res = await fetch(url, { method: initial ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    if (!res.ok) { const d = await res.json(); setError(d.error || "Erro"); setSaving(false); return }
    onSave()
  }

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-start sm:justify-center sm:pt-8 overflow-y-auto">
      <div className="w-full sm:max-w-lg sm:mx-4 bg-zinc-900 border border-zinc-700 sm:rounded-2xl rounded-t-2xl shadow-2xl sm:mb-8">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 rounded-t-2xl z-10">
          <h3 className="text-white font-bold text-sm sm:text-base">{initial ? "Editar produto" : "Novo produto"}</h3>
          <button onClick={onCancel}><X size={18} className="text-zinc-400 hover:text-white" /></button>
        </div>
        <form onSubmit={save} className="p-4 sm:p-6 space-y-4">
          {/* Cover */}
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Capa</label>
            <div onClick={() => fileRef.current?.click()}
              className="relative cursor-pointer border-2 border-dashed border-zinc-700 hover:border-zinc-500 rounded-xl h-28 sm:h-32 flex items-center justify-center transition overflow-hidden">
              {form.cover_url
                ? <img src={form.cover_url} className="w-full h-full object-cover" alt="" />
                : <div className="text-center text-zinc-500">
                    <Upload size={22} className="mx-auto mb-1" />
                    <p className="text-xs">{uploading ? "Enviando…" : "Clique para upload"}</p>
                  </div>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
            {form.cover_url && (
              <input value={form.cover_url} onChange={f("cover_url")} placeholder="URL da imagem"
                className="mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-300 text-xs focus:outline-none" />
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Nome *</label>
            <input value={form.name} onChange={f("name")} placeholder="Nome do produto" required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-sm" />
          </div>

          {/* Price + Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Preço (R$) *</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={f("price")} placeholder="99.90" required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Grupo</label>
              <select value={form.group_id} onChange={f("group_id")}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-zinc-500 text-sm">
                <option value="">Sem grupo</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
          </div>

          {/* Sort + Active */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Ordem</label>
              <input type="number" value={form.sort_order} onChange={f("sort_order")}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-zinc-500 text-sm" />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <button type="button" onClick={() => setForm(p => ({ ...p, active: !p.active }))}
                className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${form.active ? "bg-green-500" : "bg-zinc-600"}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.active ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
              <span className="text-zinc-300 text-sm">{form.active ? "Ativo" : "Inativo"}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Descrição</label>
            <textarea value={form.description} onChange={f("description")} rows={2} placeholder="Descrição opcional…"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none text-sm" />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pb-safe">
            <button type="button" onClick={onCancel}
              className="flex-1 border border-zinc-700 text-zinc-300 py-2.5 rounded-lg hover:bg-zinc-800 transition text-sm">
              Cancelar
            </button>
            <button type="submit" disabled={saving || uploading}
              className="flex-1 bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-zinc-200 transition disabled:opacity-50 text-sm">
              {saving ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function ProductsManager() {
  const [products, setProducts] = useState<ProductWithGroup[]>([])
  const [groups, setGroups]     = useState<Group[]>([])
  const [editing, setEditing]   = useState<ProductWithGroup | null | undefined>(undefined)
  const [loading, setLoading]   = useState(true)

  async function load() {
    setLoading(true)
    const [pr, gr] = await Promise.all([
      fetch("/api/720-admin/products").then(r => r.json()),
      fetch("/api/720-admin/groups").then(r => r.json()),
    ])
    setProducts(pr); setGroups(gr); setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function toggle(p: ProductWithGroup) {
    await fetch(`/api/720-admin/products/${p.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, active: p.active ? 0 : 1 }),
    })
    load()
  }
  async function remove(id: number) {
    if (!confirm("Excluir produto?")) return
    await fetch(`/api/720-admin/products/${id}`, { method: "DELETE" })
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-base sm:text-lg">Produtos</h2>
        <button onClick={() => setEditing(null)}
          className="flex items-center gap-1.5 bg-white text-black text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg hover:bg-zinc-200 transition">
          <Plus size={14} />Novo
        </button>
      </div>

      {loading
        ? <div className="text-zinc-500 text-sm animate-pulse">Carregando…</div>
        : products.length === 0
        ? <div className="text-zinc-500 text-sm text-center py-16 border border-dashed border-zinc-800 rounded-xl">Nenhum produto</div>
        : <div className="space-y-2">
            {products.map(p => (
              <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 sm:px-4 py-3 flex items-center gap-3">
                {p.cover_url
                  ? <img src={p.cover_url} alt={p.name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover shrink-0" />
                  : <div className="w-9 h-9 sm:w-10 sm:h-10 bg-zinc-800 rounded-lg shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{p.name}</p>
                  <p className="text-zinc-400 text-xs truncate">{p.group_name || "Sem grupo"} · R$ {p.price.toFixed(2).replace(".", ",")}</p>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button onClick={() => toggle(p)}
                    className={`w-8 h-5 rounded-full relative transition-colors ${p.active ? "bg-green-500" : "bg-zinc-600"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${p.active ? "translate-x-3" : "translate-x-0.5"}`} />
                  </button>
                  <button onClick={() => setEditing(p)} className="text-zinc-400 hover:text-white p-1 transition"><Pencil size={13} /></button>
                  <button onClick={() => remove(p.id)} className="text-zinc-400 hover:text-red-400 p-1 transition"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
      }

      {editing !== undefined && (
        <ProductForm initial={editing} groups={groups}
          onSave={() => { setEditing(undefined); load() }}
          onCancel={() => setEditing(undefined)} />
      )}
    </div>
  )
}
