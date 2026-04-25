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
  const db = getShopDb()
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id)
  if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
  const events = db.prepare("SELECT * FROM order_events WHERE order_id = ? ORDER BY created_at ASC").all(id)
  const user = db.prepare("SELECT * FROM users WHERE phone = ?").get((order as { phone: string }).phone)
  return NextResponse.json({ order, events, user })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!(await guard())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  const { id } = await params
  const { status, admin_notes, note } = await req.json()
  const db = getShopDb()

  if (status) {
    const prev = db.prepare("SELECT status FROM orders WHERE id = ?").get(id) as { status: string } | undefined
    db.prepare("UPDATE orders SET status=?, updated_at=datetime('now') WHERE id=?").run(status, id)
    db.prepare("INSERT INTO order_events (order_id, type, content) VALUES (?, 'status_change', ?)").run(
      id, `Status alterado de '${prev?.status}' para '${status}' pelo admin`
    )
  }

  if (admin_notes !== undefined) {
    db.prepare("UPDATE orders SET admin_notes=?, updated_at=datetime('now') WHERE id=?").run(admin_notes, id)
  }

  if (note) {
    db.prepare("INSERT INTO order_events (order_id, type, content) VALUES (?, 'admin_note', ?)").run(id, note)
  }

  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id)
  const events = db.prepare("SELECT * FROM order_events WHERE order_id = ? ORDER BY created_at ASC").all(id)
  return NextResponse.json({ order, events })
}
