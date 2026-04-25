import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/shop-auth"
import { getShopDb } from "@/lib/shop-db"

async function guard() {
  const jar = await cookies()
  const t = jar.get(ADMIN_COOKIE)?.value
  return t ? verifyAdminToken(t) : false
}

const DEFAULT_LAYOUT = {
  columns: 3,
  groupOrder: [] as number[],
  productOrder: {} as Record<string, number[]>,
  showGroupTabs: true,
  heroTitle: "Nossa Loja",
  heroSubtitle: "",
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const row = getShopDb().prepare("SELECT value FROM settings WHERE key = 'layout'").get() as { value: string } | undefined
  return NextResponse.json(row ? JSON.parse(row.value) : DEFAULT_LAYOUT)
}

export async function PUT(req: NextRequest) {
  if (!(await guard())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const body = await req.json()
  const db = getShopDb()
  db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('layout', ?)").run(JSON.stringify(body))
  return NextResponse.json(body)
}
