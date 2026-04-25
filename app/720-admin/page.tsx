"use client"

import { useState, useEffect } from "react"
import { AdminAuthGate } from "@/components/admin/AdminAuthGate"
import { ProductsManager } from "@/components/admin/ProductsManager"
import { GroupsManager } from "@/components/admin/GroupsManager"
import { LayoutEditor } from "@/components/admin/LayoutEditor"
import { OrdersManager } from "@/components/admin/OrdersManager"
import { Package, Tag, Layout, ShoppingBag, LogOut, ExternalLink } from "lucide-react"

type Tab = "products" | "groups" | "layout" | "orders"

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "orders",   label: "Pedidos",  icon: ShoppingBag },
  { id: "products", label: "Produtos", icon: Package },
  { id: "groups",   label: "Grupos",   icon: Tag },
  { id: "layout",   label: "Layout",   icon: Layout },
]

export default function AdminPage() {
  const [auth, setAuth] = useState<"loading" | "gate" | "admin">("loading")
  const [tab, setTab]   = useState<Tab>("orders")

  useEffect(() => {
    fetch("/api/720-admin/orders")
      .then(r => setAuth(r.ok ? "admin" : "gate"))
      .catch(() => setAuth("gate"))
  }, [])

  function logout() {
    document.cookie = "admin_auth_720=; Max-Age=0; path=/"
    setAuth("gate")
  }

  if (auth === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-600 animate-pulse text-sm">…</div>
      </div>
    )
  }
  if (auth === "gate") return <AdminAuthGate onAuthenticated={() => setAuth("admin")} />

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">

      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <aside className="hidden md:flex w-52 shrink-0 border-r border-zinc-800 flex-col">
        <div className="px-5 py-5 border-b border-zinc-800">
          <div className="text-lg font-bold">720 Admin</div>
          <p className="text-zinc-500 text-xs mt-0.5">Gerenciamento</p>
        </div>
        <nav className="flex-1 py-3 space-y-0.5 px-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                tab === id ? "bg-white text-black" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}>
              <Icon size={15} />{label}
            </button>
          ))}
        </nav>
        <div className="px-2 py-3 border-t border-zinc-800 space-y-0.5">
          <a href="/710" target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:text-white hover:bg-zinc-800 transition">
            <ExternalLink size={13} />Ver loja
          </a>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:text-white hover:bg-zinc-800 transition">
            <LogOut size={13} />Sair
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-800 sticky top-0 bg-black/95 backdrop-blur z-10">
          <span className="font-bold text-sm">720 Admin</span>
          <div className="flex items-center gap-3">
            <a href="/710" target="_blank" className="text-zinc-500 hover:text-white transition">
              <ExternalLink size={15} />
            </a>
            <button onClick={logout} className="text-zinc-500 hover:text-white transition">
              <LogOut size={15} />
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {tab === "products" && <ProductsManager />}
          {tab === "groups"   && <GroupsManager />}
          {tab === "layout"   && <LayoutEditor />}
          {tab === "orders"   && <OrdersManager />}
        </div>
      </main>

      {/* ── Mobile bottom nav (hidden on desktop) ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-zinc-950 border-t border-zinc-800 flex z-20"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition ${
              tab === id ? "text-white" : "text-zinc-500"
            }`}>
            <Icon size={18} />
            <span className="text-[10px]">{label}</span>
            {tab === id && <span className="absolute bottom-0 w-6 h-0.5 bg-white rounded-full" />}
          </button>
        ))}
      </nav>
    </div>
  )
}
