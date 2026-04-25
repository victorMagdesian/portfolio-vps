import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyBuyerToken, SHOP_COOKIE } from "@/lib/shop-auth"
import { getShopDb } from "@/lib/shop-db"

const GATEWAY_URL = "http://localhost:3000"
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY || ""

export async function POST(req: NextRequest) {
  const jar = await cookies()
  const token = jar.get(SHOP_COOKIE)?.value
  const session = token ? await verifyBuyerToken(token) : null
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { productId, payerName, payerEmail } = await req.json()
  const db = getShopDb()
  const product = db
    .prepare("SELECT * FROM products WHERE id = ? AND active = 1")
    .get(productId) as { id: number; name: string; price: number } | undefined

  if (!product) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })

  const orderId = db
    .prepare(
      `INSERT INTO orders (phone, payer_name, payer_email, product_id, product_name, amount, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`
    )
    .run(session.phone, payerName || "", payerEmail || "", product.id, product.name, product.price)
    .lastInsertRowid

  db.prepare(
    "INSERT INTO order_events (order_id, type, content) VALUES (?, 'created', ?)"
  ).run(orderId, `Pedido criado por ${session.phone}`)

  // Não incluímos payer.email na preferência — preencher email fixo trava
  // o formulário do MP e bloqueia o botão quando é o email do dono da conta.
  // O comprador preenche os dados livremente no checkout do MP.
  const preferenceBody = {
    external_reference: `order-${orderId}`,
    callback_url: `https://victor.magdesian.com.br/api/710/webhook`,
    items: [{ title: product.name, quantity: 1, unit_price: product.price }],
    back_urls: {
      success: `https://victor.magdesian.com.br/710?payment=success`,
      failure: `https://victor.magdesian.com.br/710?payment=failure`,
      pending: `https://victor.magdesian.com.br/710?payment=pending`,
    },
    auto_return: "approved",
  }

  const gwRes = await fetch(`${GATEWAY_URL}/api/v1/preferences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GATEWAY_API_KEY}`,
    },
    body: JSON.stringify(preferenceBody),
  })

  if (!gwRes.ok) {
    const err = await gwRes.text()
    db.prepare("UPDATE orders SET status='error', updated_at=datetime('now') WHERE id=?").run(orderId)
    db.prepare("INSERT INTO order_events (order_id, type, content) VALUES (?, 'error', ?)").run(orderId, `Gateway error: ${err}`)
    return NextResponse.json({ error: "Erro no gateway: " + err }, { status: 502 })
  }

  const gwData = await gwRes.json()
  const checkoutUrl = gwData.checkout_url || gwData.sandbox_checkout_url
  db.prepare(
    "UPDATE orders SET gateway_preference_id=?, checkout_url=?, updated_at=datetime('now') WHERE id=?"
  ).run(gwData.preference_id, checkoutUrl, orderId)
  db.prepare("INSERT INTO order_events (order_id, type, content) VALUES (?, 'checkout_created', ?)").run(
    orderId, `Link de pagamento gerado: ${checkoutUrl}`
  )

  return NextResponse.json({ checkout_url: checkoutUrl, order_id: Number(orderId) })
}
