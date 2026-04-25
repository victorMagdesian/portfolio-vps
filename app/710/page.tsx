"use client"

import { useState, useEffect } from "react"
import { AuthGate } from "@/components/shop/AuthGate"
import { ShopContent } from "@/components/shop/ShopContent"

export default function ShopPage() {
  const [state, setState] = useState<"loading" | "gate" | "shop">("loading")
  const [phone, setPhone] = useState("")

  useEffect(() => {
    // Verify existing session server-side by calling a protected endpoint
    fetch("/api/710/products")
      .then(r => {
        if (r.ok) {
          return r.json().then(d => {
            // extract phone from a separate check
            setState("shop")
          })
        }
        setState("gate")
      })
      .catch(() => setState("gate"))
  }, [])

  // After auth, re-verify to get phone from cookie
  async function handleAuthenticated() {
    const res = await fetch("/api/710/whoami")
    if (res.ok) {
      const d = await res.json()
      setPhone(d.phone)
    }
    setState("shop")
  }

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-600 animate-pulse text-sm">…</div>
      </div>
    )
  }

  if (state === "gate") {
    return <AuthGate onAuthenticated={handleAuthenticated} />
  }

  return <ShopContent phone={phone} />
}
