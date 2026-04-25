import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/shop-auth"
import { getShopDb } from "@/lib/shop-db"

async function guard() {
  const jar = await cookies()
  const t = jar.get(ADMIN_COOKIE)?.value
  return t ? verifyAdminToken(t) : false
}

type Params = { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: Params) {
  if (!(await guard())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const { id } = await params
  const product = getShopDb().prepare("SELECT * FROM products WHERE id = ?").get(id)
  if (!product) return NextResponse.json({ error: "Não encontrado" }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await guard())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const { id } = await params
  const { name, description, price, cover_url, group_id, active, sort_order } = await req.json()
  const db = getShopDb()
  db.prepare(
    `UPDATE products SET name=?, description=?, price=?, cover_url=?, group_id=?, active=?, sort_order=? WHERE id=?`
  ).run(name, description || "", price, cover_url || "", group_id || null, active ? 1 : 0, sort_order || 0, id)
  const updated = db.prepare("SELECT * FROM products WHERE id = ?").get(id)
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  if (!(await guard())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const { id } = await params
  getShopDb().prepare("DELETE FROM products WHERE id = ?").run(id)
  return NextResponse.json({ ok: true })
}
