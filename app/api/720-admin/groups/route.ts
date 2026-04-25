import { NextRequest, NextResponse } from "next/server"
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
  const groups = getShopDb().prepare("SELECT * FROM groups ORDER BY sort_order ASC, id ASC").all()
  return NextResponse.json(groups)
}

export async function POST(req: NextRequest) {
  if (!(await guard())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const { name, sort_order } = await req.json()
  if (!name) return NextResponse.json({ error: "name obrigatório" }, { status: 400 })
  const db = getShopDb()
  const result = db.prepare("INSERT INTO groups (name, sort_order) VALUES (?, ?)").run(name, sort_order || 0)
  const group = db.prepare("SELECT * FROM groups WHERE id = ?").get(result.lastInsertRowid)
  return NextResponse.json(group, { status: 201 })
}
