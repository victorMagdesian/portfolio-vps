"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, X, Save } from "lucide-react"
import type { Group } from "@/lib/shop-db"

export function GroupsManager() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Group | null>(null)
  const [newName, setNewName] = useState("")
  const [adding, setAdding] = useState(false)

  async function load() {
    setLoading(true)
    const res = await fetch("/api/720-admin/groups")
    setGroups(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function add() {
    if (!newName.trim()) return
    await fetch("/api/720-admin/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), sort_order: groups.length }),
    })
    setNewName("")
    setAdding(false)
    load()
  }

  async function update(g: Group) {
    await fetch(`/api/720-admin/groups/${g.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(g),
    })
    setEditing(null)
    load()
  }

  async function remove(id: number) {
    if (!confirm("Excluir grupo? Os produtos ficam sem grupo.")) return
    await fetch(`/api/720-admin/groups/${id}`, { method: "DELETE" })
    load()
  }

  async function toggle(g: Group) {
    await fetch(`/api/720-admin/groups/${g.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...g, active: g.active ? 0 : 1 }),
    })
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-base sm:text-lg">Grupos</h2>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 bg-white text-black text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg hover:bg-zinc-200 transition"
        >
          <Plus size={15} /> Novo grupo
        </button>
      </div>

      {adding && (
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Nome do grupo"
            autoFocus
            onKeyDown={e => e.key === "Enter" && add()}
            className="flex-1 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 text-sm"
          />
          <button onClick={add} className="bg-white text-black px-3 py-2 rounded-lg hover:bg-zinc-200 transition">
            <Save size={15} />
          </button>
          <button onClick={() => { setAdding(false); setNewName("") }}
            className="text-zinc-400 hover:text-white px-2">
            <X size={15} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-zinc-500 text-sm animate-pulse">Carregando…</div>
      ) : groups.length === 0 ? (
        <div className="text-zinc-500 text-sm text-center py-16 border border-dashed border-zinc-800 rounded-xl">
          Nenhum grupo cadastrado
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map(g => (
            <div key={g.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center gap-3">
              {editing?.id === g.id ? (
                <>
                  <input
                    value={editing.name}
                    onChange={e => setEditing({ ...editing, name: e.target.value })}
                    autoFocus
                    className="flex-1 bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none"
                  />
                  <input
                    type="number"
                    value={editing.sort_order}
                    onChange={e => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-16 bg-zinc-800 border border-zinc-600 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none"
                  />
                  <button onClick={() => update(editing)} className="text-green-400 hover:text-green-300 p-1"><Save size={15} /></button>
                  <button onClick={() => setEditing(null)} className="text-zinc-400 hover:text-white p-1"><X size={15} /></button>
                </>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{g.name}</p>
                    <p className="text-zinc-500 text-xs">Ordem: {g.sort_order}</p>
                  </div>
                  <button onClick={() => toggle(g)}
                    className={`w-8 h-5 rounded-full relative transition-colors shrink-0 ${g.active ? "bg-green-500" : "bg-zinc-600"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${g.active ? "translate-x-3" : "translate-x-0.5"}`} />
                  </button>
                  <button onClick={() => setEditing(g)} className="text-zinc-400 hover:text-white p-1 transition"><Pencil size={14} /></button>
                  <button onClick={() => remove(g.id)} className="text-zinc-400 hover:text-red-400 p-1 transition"><Trash2 size={14} /></button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
