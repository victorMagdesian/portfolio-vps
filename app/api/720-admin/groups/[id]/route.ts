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

export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await guard())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const { id } = await params
  const { name, sort_order, active } = await req.json()
  const db = getShopDb()
  db.prepare("UPDATE groups SET name=?, sort_order=?, active=? WHERE id=?").run(
    name, sort_order || 0, active ? 1 : 0, id
  )
  return NextResponse.json(db.prepare("SELECT * FROM groups WHERE id = ?").get(id))
}

export async function DELETE(_: NextRequest, { params }: Params) {
  if (!(await guard())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const { id } = await params
  getShopDb().prepare("DELETE FROM groups WHERE id = ?").run(id)
  return NextResponse.json({ ok: true })
}
