import { NextRequest, NextResponse } from "next/server"
import { getShopDb } from "@/lib/shop-db"
import {
  checkBuyerPassword,
  signBuyerToken,
  SHOP_COOKIE,
  normalizePhone,
  validatePhone,
} from "@/lib/shop-auth"

export async function POST(req: NextRequest) {
  const { password, phone } = await req.json()

  if (!checkBuyerPassword(password)) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 })
  }

  const phoneError = validatePhone(phone)
  if (phoneError) {
    return NextResponse.json({ error: phoneError }, { status: 400 })
  }

  const cleanPhone = normalizePhone(phone)
  const db = getShopDb()

  const existing = db.prepare("SELECT phone FROM users WHERE phone = ?").get(cleanPhone)
  if (!existing) {
    db.prepare("INSERT INTO users (phone, verified_at) VALUES (?, ?)").run(
      cleanPhone,
      new Date().toISOString()
    )
  }

  const token = await signBuyerToken(cleanPhone)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SHOP_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  })
  return res
}
