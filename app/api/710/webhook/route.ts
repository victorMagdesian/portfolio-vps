import { NextRequest, NextResponse } from "next/server"
import { getShopDb } from "@/lib/shop-db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { external_reference, status, payment_id } = body
    if (!external_reference?.startsWith("order-")) return NextResponse.json({ ok: true })

    const orderId = external_reference.replace("order-", "")
    const db = getShopDb()
    db.prepare(
      "UPDATE orders SET status=?, gateway_transaction_id=?, updated_at=datetime('now') WHERE id=?"
    ).run(status, payment_id || null, orderId)
    db.prepare(
      "INSERT INTO order_events (order_id, type, content) VALUES (?, 'payment', ?)"
    ).run(orderId, `Status atualizado para '${status}' (payment_id: ${payment_id || "—"})`)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
