import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/shop-auth"
import { getShopDb } from "@/lib/shop-db"

async function guard() {
  const jar = await cookies()
  const t = jar.get(ADMIN_COOKIE)?.value
  return t ? verifyAdminToken(t) : false
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const orders = getShopDb()
    .prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 500")
    .all()
  return NextResponse.json(orders)
}
