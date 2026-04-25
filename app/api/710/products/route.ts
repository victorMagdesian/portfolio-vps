import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyBuyerToken, SHOP_COOKIE } from "@/lib/shop-auth"
import { getShopDb } from "@/lib/shop-db"

export async function GET() {
  const jar = await cookies()
  const token = jar.get(SHOP_COOKIE)?.value
  const session = token ? await verifyBuyerToken(token) : null
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const db = getShopDb()
  const groups = db
    .prepare("SELECT * FROM groups WHERE active = 1 ORDER BY sort_order ASC, id ASC")
    .all()
  const products = db
    .prepare(
      `SELECT * FROM products WHERE active = 1 ORDER BY sort_order ASC, id ASC`
    )
    .all()

  const settingsRow = db.prepare("SELECT value FROM settings WHERE key = 'layout'").get() as
    | { value: string }
    | undefined
  const layout = settingsRow ? JSON.parse(settingsRow.value) : {}

  return NextResponse.json({ groups, products, layout })
}
