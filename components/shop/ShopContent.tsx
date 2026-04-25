"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./ProductCard"
import { CheckoutModal } from "./CheckoutModal"
import type { Product, Group } from "@/lib/shop-db"

interface LayoutConfig {
  columns?: number
  groupOrder?: number[]
  showGroupTabs?: boolean
  heroTitle?: string
  heroSubtitle?: string
}

interface ShopData {
  groups: Group[]
  products: (Product & { group_name?: string })[]
  layout: LayoutConfig
}

interface Props { phone: string }

export function ShopContent({ phone }: Props) {
  const [data, setData]           = useState<ShopData | null>(null)
  const [activeGroup, setActiveGroup] = useState<number | null>(null)
  const [buyProduct, setBuyProduct]   = useState<Product | null>(null)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    fetch("/api/710/products")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-400 animate-pulse text-sm">Carregando…</div>
      </div>
    )
  }
  if (!data) return null

  const { groups, products, layout } = data
  const cols = layout.columns || 3
  const gridClass =
    cols === 2 ? "grid-cols-1 xs:grid-cols-2" :
    cols === 4 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" :
                 "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

  const orderedGroups = layout.groupOrder?.length
    ? [...groups].sort((a, b) => {
        const ai = layout.groupOrder!.indexOf(a.id)
        const bi = layout.groupOrder!.indexOf(b.id)
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
      })
    : groups

  const visibleGroups  = activeGroup === null ? orderedGroups : orderedGroups.filter(g => g.id === activeGroup)
  const ungrouped      = products.filter(p => !p.group_id)
  const showUngrouped  = activeGroup === null && ungrouped.length > 0

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <header className="py-10 sm:py-14 px-4 text-center border-b border-zinc-800">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
          {layout.heroTitle || "Nossa Loja"}
        </h1>
        {layout.heroSubtitle && (
          <p className="text-zinc-400 mt-2 text-sm sm:text-lg">{layout.heroSubtitle}</p>
        )}
      </header>

      {/* Group filter tabs */}
      {orderedGroups.length > 0 && layout.showGroupTabs !== false && (
        <nav className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-zinc-800 sticky top-0 bg-black/95 backdrop-blur-md z-10 scrollbar-none">
          <button
            onClick={() => setActiveGroup(null)}
            className={`shrink-0 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeGroup === null ? "bg-white text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}>
            Todos
          </button>
          {orderedGroups.map(g => (
            <button key={g.id}
              onClick={() => setActiveGroup(prev => prev === g.id ? null : g.id)}
              className={`shrink-0 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeGroup === g.id ? "bg-white text-black" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}>
              {g.name}
            </button>
          ))}
        </nav>
      )}

      {/* Sections */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-10 sm:space-y-12">
        {visibleGroups.map(group => {
          const groupProducts = products.filter(p => p.group_id === group.id)
          if (!groupProducts.length) return null
          return (
            <section key={group.id}>
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight whitespace-nowrap">
                  {group.name}
                </h2>
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-xs text-zinc-500 whitespace-nowrap">
                  {groupProducts.length} {groupProducts.length === 1 ? "item" : "itens"}
                </span>
              </div>
              <div className={`grid ${gridClass} gap-3 sm:gap-4`}>
                {groupProducts.map(p => (
                  <ProductCard key={p.id} product={p} onBuy={setBuyProduct} />
                ))}
              </div>
            </section>
          )
        })}

        {showUngrouped && (
          <section>
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">Outros</h2>
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-xs text-zinc-500">{ungrouped.length} {ungrouped.length === 1 ? "item" : "itens"}</span>
            </div>
            <div className={`grid ${gridClass} gap-3 sm:gap-4`}>
              {ungrouped.map(p => <ProductCard key={p.id} product={p} onBuy={setBuyProduct} />)}
            </div>
          </section>
        )}

        {!visibleGroups.length && !showUngrouped && (
          <div className="text-center py-24 text-zinc-500 text-sm">Nenhum produto disponível</div>
        )}
      </main>

      {buyProduct && (
        <CheckoutModal product={buyProduct} phone={phone} onClose={() => setBuyProduct(null)} />
      )}
    </div>
  )
}
