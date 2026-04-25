import { NextRequest, NextResponse } from "next/server"

const GATEWAY_URL = "http://localhost:3000"
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY || ""

export async function POST(req: NextRequest) {
  const { amount } = await req.json()
  const value = parseFloat(amount)
  if (!value || value < 1 || value > 10000) {
    return NextResponse.json({ error: "Valor inválido (mín. R$ 1,00)" }, { status: 400 })
  }

  const ref = `coffee-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  const gwRes = await fetch(`${GATEWAY_URL}/api/v1/preferences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GATEWAY_API_KEY}`,
    },
    body: JSON.stringify({
      external_reference: ref,
      callback_url: `https://victor.magdesian.com.br/api/710/webhook`,
      items: [{ title: "☕ Café para o Victor", quantity: 1, unit_price: value }],
      back_urls: {
        success:  `https://victor.magdesian.com.br/?coffee=obrigado`,
        failure:  `https://victor.magdesian.com.br/`,
        pending:  `https://victor.magdesian.com.br/`,
      },
      auto_return: "approved",
    }),
  })

  if (!gwRes.ok) {
    return NextResponse.json({ error: await gwRes.text() }, { status: 502 })
  }

  const data = await gwRes.json()
  return NextResponse.json({
    checkout_url:  data.checkout_url || data.sandbox_checkout_url,
    preference_id: data.preference_id,
    ref,
  })
}

/* Poll status via gateway preferences endpoint */
export async function GET(req: NextRequest) {
  const prefId = new URL(req.url).searchParams.get("pref")
  if (!prefId) return NextResponse.json({ status: "pending" })

  const gwRes = await fetch(`${GATEWAY_URL}/api/v1/preferences/${prefId}`, {
    headers: { Authorization: `Bearer ${GATEWAY_API_KEY}` },
  })

  if (!gwRes.ok) return NextResponse.json({ status: "pending" })

  const data = await gwRes.json()
  // gateway returns transaction.status nested under the preference
  const status = data?.transaction?.status || data?.status || "pending"
  return NextResponse.json({ status })
}
