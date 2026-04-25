"use client"

import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import type { Product, Group } from "@/lib/shop-db"

interface Props {
  product: Product & { group_name?: string }
  group?: Group
  onBuy: (product: Product) => void
}

export function ProductCard({ product, onBuy }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all duration-200 group flex flex-col">
      {/* Cover */}
      <div className="relative aspect-square bg-zinc-800 overflow-hidden">
        {product.cover_url ? (
          <Image src={product.cover_url} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <ShoppingCart size={32} />
          </div>
        )}
        {product.group_name && (
          <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-xs text-zinc-300 px-2 py-0.5 rounded-full">
            {product.group_name}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-sm sm:text-base leading-tight line-clamp-2">{product.name}</h3>
        {product.description && (
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <span className="text-base sm:text-xl font-bold text-white">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          <button onClick={() => onBuy(product)}
            className="flex items-center gap-1 sm:gap-1.5 bg-white text-black text-xs sm:text-sm font-semibold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-zinc-200 active:scale-95 transition-all shrink-0">
            <ShoppingCart size={13} />
            <span className="hidden xs:inline">Comprar</span>
            <span className="xs:hidden">+</span>
          </button>
        </div>
      </div>
    </div>
  )
}
