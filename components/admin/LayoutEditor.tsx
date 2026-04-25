"use client"

import { useState, useEffect } from "react"
import { Save, ChevronUp, ChevronDown } from "lucide-react"
import type { Group } from "@/lib/shop-db"

interface LayoutConfig {
  columns: number
  groupOrder: number[]
  showGroupTabs: boolean
  heroTitle: string
  heroSubtitle: string
}

export function LayoutEditor() {
  const [groups, setGroups] = useState<Group[]>([])
  const [config, setConfig] = useState<LayoutConfig>({
    columns: 3,
    groupOrder: [],
    showGroupTabs: true,
    heroTitle: "Nossa Loja",
    heroSubtitle: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/720-admin/groups").then(r => r.json()),
      fetch("/api/720-admin/layout").then(r => r.json()),
    ]).then(([gs, ly]) => {
      setGroups(gs)
      setConfig(c => ({ ...c, ...ly }))
      setLoading(false)
    })
  }, [])

  const orderedGroups = config.groupOrder.length
    ? [...groups].sort((a, b) => {
        const ai = config.groupOrder.indexOf(a.id)
        const bi = config.groupOrder.indexOf(b.id)
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
      })
    : groups

  function moveGroup(id: number, dir: -1 | 1) {
    const order = config.groupOrder.length ? [...config.groupOrder] : groups.map(g => g.id)
    const idx = order.indexOf(id)
    if (idx === -1) return
    const target = idx + dir
    if (target < 0 || target >= order.length) return
    ;[order[idx], order[target]] = [order[target], order[idx]]
    setConfig(c => ({ ...c, groupOrder: order }))
  }

  async function save() {
    setSaving(true)
    await fetch("/api/720-admin/layout", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="text-zinc-500 text-sm animate-pulse">Carregando…</div>

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-white font-bold text-base sm:text-lg">Layout da loja</h2>

      {/* Hero text */}
      <div className="space-y-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Cabeçalho</p>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Título</label>
          <input
            value={config.heroTitle}
            onChange={e => setConfig(c => ({ ...c, heroTitle: e.target.value }))}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Subtítulo (opcional)</label>
          <input
            value={config.heroSubtitle}
            onChange={e => setConfig(c => ({ ...c, heroSubtitle: e.target.value }))}
            placeholder="Tagline opcional…"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
          />
        </div>
      </div>

      {/* Grid columns */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Colunas do grid</p>
        <div className="flex flex-wrap gap-2">
          {[2, 3, 4].map(n => (
            <button
              key={n}
              onClick={() => setConfig(c => ({ ...c, columns: n }))}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                config.columns === n
                  ? "bg-white text-black border-white"
                  : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500"
              }`}
            >
              {n} colunas
            </button>
          ))}
        </div>
      </div>

      {/* Group tabs toggle */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-medium">Tabs de grupos</p>
          <p className="text-zinc-500 text-xs">Exibir navegação por grupo no topo</p>
        </div>
        <button
          onClick={() => setConfig(c => ({ ...c, showGroupTabs: !c.showGroupTabs }))}
          className={`w-10 h-6 rounded-full relative transition-colors ${config.showGroupTabs ? "bg-green-500" : "bg-zinc-600"}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${config.showGroupTabs ? "translate-x-4" : "translate-x-0.5"}`} />
        </button>
      </div>

      {/* Group order */}
      {groups.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Ordem dos grupos</p>
          <div className="space-y-2">
            {orderedGroups.map((g, i) => (
              <div key={g.id} className="flex items-center gap-3 bg-zinc-800 rounded-lg px-3 py-2">
                <span className="text-zinc-500 text-xs w-5">{i + 1}</span>
                <span className="text-white text-sm flex-1">{g.name}</span>
                <button onClick={() => moveGroup(g.id, -1)} disabled={i === 0}
                  className="text-zinc-400 hover:text-white disabled:opacity-20 transition p-0.5">
                  <ChevronUp size={15} />
                </button>
                <button onClick={() => moveGroup(g.id, 1)} disabled={i === orderedGroups.length - 1}
                  className="text-zinc-400 hover:text-white disabled:opacity-20 transition p-0.5">
                  <ChevronDown size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={save}
        disabled={saving}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition ${
          saved ? "bg-green-500 text-white" : "bg-white text-black hover:bg-zinc-200"
        } disabled:opacity-50`}
      >
        <Save size={15} />
        {saving ? "Salvando…" : saved ? "Salvo ✓" : "Salvar layout"}
      </button>
    </div>
  )
}
